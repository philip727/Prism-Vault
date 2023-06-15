use std::time::Duration;

use reqwest::{header::CONTENT_TYPE, StatusCode};
use serde::{Deserialize, Serialize};

use crate::{
    api::user::register::is_password_strong,
    errors,
    utils::{get_dotenv_var, get_session_token},
};

#[derive(Serialize, Deserialize, Debug)]
struct UpdatePasswordPayload {
    new_password: String,
    #[serde(rename(serialize = "confirm_new_password"))]
    confirm_password: String,
    previous_password: String,
}

fn verify_payload(previous_password: &str, confirm_password: &str, new_password: &str) -> bool {
    previous_password.len() > 0 && confirm_password.len() > 0 && new_password.len() > 0
}

#[tauri::command]
pub async fn update_password(
    app_handle: tauri::AppHandle,
    new_password: String,
    confirm_password: String,
    previous_password: String,
) -> Result<String, errors::Error> {
    // Grabs the session token from appdata
    let key = get_session_token(&app_handle)?;
    let client = reqwest::Client::new();

    if !verify_payload(&previous_password, &confirm_password, &new_password) {
        return Err(errors::Error::InvalidInput(
            "Fill in all required fields".into(),
        ));
    }

    if !is_password_strong(&new_password) {
        return Err(errors::Error::InvalidInput(
            "Password does not meet the criteria".into(),
        ));
    }

    let payload = UpdatePasswordPayload {
        new_password,
        confirm_password,
        previous_password,
    };

    let request = client
        .post(format!(
            "{}/account/change-password",
            get_dotenv_var("SERVER_URL")
        ))
        .timeout(Duration::from_secs(10))
        .header(CONTENT_TYPE, "application/json")
        .header("Session-Token", key.to_string())
        .json(&payload)
        .send()
        .await;

    if let Err(_) = request {
        return Err(errors::Error::FailedToConnectToServer);
    };

    let response = request.unwrap();
    let status = response.status();
    let text = response.text().await.unwrap().into();

    println!("{:?}", text);

    // Internal error logs
    if status == StatusCode::INTERNAL_SERVER_ERROR {
        return Err(errors::Error::InternalServer);
    }

    if status != StatusCode::OK {
        return Err(errors::Error::ResponseError(text));
    }

    Ok("Updated password".into())
}
