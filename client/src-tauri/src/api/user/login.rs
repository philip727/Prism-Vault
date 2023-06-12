use core::fmt;
use reqwest::{header::CONTENT_TYPE, StatusCode};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{error, path::PathBuf, time::Duration};
use tauri::{AppHandle, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

use crate::{errors, utils::{get_session_token, get_dotenv_var}};

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

#[derive(Debug, Clone, Serialize, Deserialize)]
struct NoSessionTokenError;

impl fmt::Display for NoSessionTokenError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "No session token found")
    }
}

impl error::Error for NoSessionTokenError {}

// Makes a request with the server api to create a user, and sends a certain message back to the frontend
#[tauri::command]
pub async fn login_user(app_handle: AppHandle, payload: LoginPayload) -> Result<Value, errors::Error> {
    let client = reqwest::Client::new();
    let request = client
        .post(format!("{}/user/session", get_dotenv_var("SERVER_URL")))
        .timeout(Duration::from_secs(10))
        .header(CONTENT_TYPE, "application/json")
        .json(&payload)
        .send()
        .await;

    if let Err(_) = request {
        return Err(errors::Error::FailedToConnectToServer);
    };

    let response = request.unwrap();

    let status = response.status();

    // Internal error logs
    if status == StatusCode::INTERNAL_SERVER_ERROR {
        return Err(errors::Error::InternalServer);
    }

    if status != StatusCode::OK {
        let text = response.text().await.unwrap().into();
        return Err(errors::Error::ResponseError(text));
    }

    let app = &app_handle;
    let stores = app.state::<StoreCollection<Wry>>();
    let path = PathBuf::from("data/user.data");

    let json = serde_json::from_str::<LoginResponse>(&response.text().await.unwrap()).unwrap();

    // Session token received in response
    let try_create_key = with_store(app.clone(), stores, path, |store| {
        store.insert("session".to_string(), json!(json.session_token))?;
        store.save()
    });

    if let Err(_) = try_create_key {
        return Err(errors::Error::SessionToken(
            "Failed to store the session token received from login, but details were correct"
                .to_string(),
        ));
    }

    Ok(json.user)
}

// Tries to login with the session token provided
#[tauri::command]
pub async fn login_with_session(app_handle: AppHandle) -> Result<Value, errors::Error> {
    let key = get_session_token(&app_handle)?;
    let client = reqwest::Client::new();
    let request = client
        .post(format!("{}/user/verify", get_dotenv_var("SERVER_URL")))
        .timeout(Duration::from_secs(10))
        .header(CONTENT_TYPE, "application/json")
        .header("Session-Token", key)
        .send()
        .await;

    if let Err(_) = request {
        return Err(errors::Error::FailedToConnectToServer);
    };

    let response = request.unwrap();

    let status = response.status();

    // Internal error logs
    if status == StatusCode::INTERNAL_SERVER_ERROR {
        return Err(errors::Error::InternalServer);
    }

    if status != StatusCode::OK {
        let text = response.text().await.unwrap().into();
        return Err(errors::Error::ResponseError(text));
    }

    let json = serde_json::from_str::<Value>(&response.text().await.unwrap()).unwrap();

    Ok(json)
}
