use std::{time::Duration, path::PathBuf};
use reqwest::{header::CONTENT_TYPE, StatusCode};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tauri::{Wry, AppHandle, Manager};
use tauri_plugin_store::{StoreCollection, with_store};

#[derive(Serialize, Deserialize, Debug)]
pub struct RegisterPayload {
    pub username: String,
    pub email: String,
    pub password: String,
    pub cpassword: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginPayload {
    pub identifier: String,
    pub password: String,
}

// Makes a request with the server api to create a user, and sends a certain message back to the frontend
#[tauri::command]
pub async fn register_user(payload: RegisterPayload) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client
        .post("http://127.0.0.1:8080/user/new")
        .timeout(Duration::from_secs(10))
        .header(CONTENT_TYPE, "application/json")
        .json(&payload)
        .send()
        .await;

    if let Err(e) = response {
        return Err(e.to_string());
    };

    let resp = response.unwrap();

    let status = resp.status();
    if status != StatusCode::OK {
        return Err(resp.text().await.unwrap())
    }

    Ok("Successfully registered".to_string())
 }

// Makes a request with the server api to create a user, and sends a certain message back to the frontend
#[tauri::command]
pub async fn login_user(app_handle: AppHandle, payload: LoginPayload) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client
        .post("http://127.0.0.1:8080/user/session")
        .timeout(Duration::from_secs(10))
        .header(CONTENT_TYPE, "application/json")
        .json(&payload)
        .send()
        .await;

    if let Err(e) = response {
        return Err(e.to_string());
    };

    let resp = response.unwrap();

    let status = resp.status();
    if status != StatusCode::OK {
        return Err(resp.text().await.unwrap())
    }

    let app = &app_handle;
    let stores = app.state::<StoreCollection<Wry>>();
    let path = PathBuf::from("data/user.bin");

    let try_create_key = with_store(app.clone(), stores, path, |store| { 
        store.insert("session".to_string(), json!("b") );
        store.save()
    });
    if let Err(e) = try_create_key {
        return Err(e.to_string());
    }

    Ok("Successful login".to_string())
 }
