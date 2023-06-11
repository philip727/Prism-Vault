use std::time::Duration;

use reqwest::{header::CONTENT_TYPE, StatusCode};
use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use crate::{errors, utils::grab_session_token};

#[derive(Serialize, Deserialize, Debug)]
pub struct AddItemPayload {
    pub unique_name: String,
    pub quantity: isize,
    pub item_name: String,
}

#[tauri::command]
pub async fn add_item(
    app_handle: AppHandle,
    unique_name: String,
    quantity: isize,
    item_name: String,
) -> Result<(), errors::Error> {
    if quantity < 0 {
        return Err(errors::Error::InvalidInput(
            "You have provided a quantity below 0, this is not possible".to_string(),
        ));
    }

    if quantity > 9999 {
        return Err(errors::Error::InvalidInput(
            "You have provided a quantity over 9999, if you have this much, you really don't need to worry about storing that".to_string(),
        ));
    }

    let key = grab_session_token(&app_handle)?;
    let payload = AddItemPayload {
        unique_name,
        quantity,
        item_name,
    };

    let client = reqwest::Client::new();
    let request = client
        .post("http://127.0.0.1:8080/item/add")
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

    // Internal error logs
    if status == StatusCode::INTERNAL_SERVER_ERROR {
        return Err(errors::Error::InternalServer);
    }

    if status != StatusCode::OK {
        let text = response.text().await.unwrap().into();
        return Err(errors::Error::ResponseError(text));
    }

    Ok(())
}
