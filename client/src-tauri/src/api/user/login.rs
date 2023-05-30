use reqwest::{header::CONTENT_TYPE, StatusCode};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use core::fmt;
use std::{path::PathBuf, time::Duration, error};
use tauri::{AppHandle, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginPayload {
    pub identifier: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginResponse {
    pub user: Value,
    pub session_token: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SessionLoginPayload {
    pub session_token: String,
}

#[derive(Debug, Clone)]
struct NoSessionTokenError;

impl fmt::Display for NoSessionTokenError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "No session token found")
    }
}

impl error::Error for NoSessionTokenError {}

// Makes a request with the server api to create a user, and sends a certain message back to the frontend
#[tauri::command]
pub async fn login_user(app_handle: AppHandle, payload: LoginPayload) -> Result<Value, String> {
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

    // Internal error logs
    if status == StatusCode::INTERNAL_SERVER_ERROR {
        return Err("Interal Server Error, please check your logs in $HOME/Prism Vault/error.log and contact a developer".to_string())
    }

    if status != StatusCode::OK {
        return Err(resp.text().await.unwrap());
    }

    let app = &app_handle;
    let stores = app.state::<StoreCollection<Wry>>();
    let path = PathBuf::from("data/user.data");

    let json = serde_json::from_str::<LoginResponse>(&resp.text().await.unwrap()).unwrap();

    // Session token received in response
    let try_create_key = with_store(app.clone(), stores, path, |store| {
        store.insert("session".to_string(), json!(json.session_token))?;
        store.save()
    });
    if let Err(e) = try_create_key {
        return Err(e.to_string());
    }

    Ok(json.user)
}


// Tries to login with the session token provided
#[tauri::command]
pub async fn login_with_session(app_handle: AppHandle) -> Result<(), Box<dyn error::Error>> {
    let app = &app_handle;
    let stores = app.state::<StoreCollection<Wry>>();
    let path = PathBuf::from("data/user.data");

    let mut key: Value = Default::default();

    let try_grab_key = with_store(app.clone(), stores, path, |store| {
        let try_grab = store.get("session".to_string());
        if let None = try_grab {
            return Err(tauri_plugin_store::Error::Serialize(Box::new(NoSessionTokenError)));
        }

        key = try_grab.unwrap().clone();
        Ok(())
    })?;
    
    let client = reqwest::Client::new();
    let response = client
        .post("http://127.0.0.1:8080/user/session")
        .timeout(Duration::from_secs(10))
        .header(CONTENT_TYPE, "application/json")
        .json(&payload)
        .send()
        .await;

    Ok(())
}
