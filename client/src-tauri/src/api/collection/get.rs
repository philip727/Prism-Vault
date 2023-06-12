use std::{path::PathBuf, time::Duration};

use reqwest::{header::CONTENT_TYPE, StatusCode};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::AppHandle;

use crate::{errors, utils::get_session_token, warframe::items::search_directly_for_item};

#[derive(Serialize, Deserialize, Debug)]
struct GetItemPayload {
    pub unique_names: Vec<String>,
}

#[tauri::command]
pub async fn get_components(
    app_handle: AppHandle,
    components: Vec<String>,
) -> Result<Value, errors::Error> {
    let key = get_session_token(&app_handle)?;

    let payload = GetItemPayload {
        unique_names: components,
    };

    let client = reqwest::Client::new();
    let request = client
        .post("http://127.0.0.1:8080/item/get")
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

    let json = serde_json::from_str::<Value>(&response.text().await.unwrap()).unwrap();

    println!("{:?}", json);

    Ok(json)
}

#[tauri::command]
pub async fn get_owned_items(app_handle: AppHandle) -> Result<Vec<Value>, errors::Error> {
    let key = get_session_token(&app_handle)?;
    let client = reqwest::Client::new();
    let request = client
        .get("http://127.0.0.1:8080/item/get-inventory")
        .timeout(Duration::from_secs(10))
        .header(CONTENT_TYPE, "application/json")
        .header("Session-Token", key.to_string())
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

    let body = &response.text().await.unwrap();

    let item_names = serde_json::from_str::<Vec<String>>(body).unwrap();
    let mut items: Vec<Value> = Vec::new();
    for names in item_names.iter() {
        let item_search = search_directly_for_item(names.to_string()).await?;
        items.push(item_search);
    }

    Ok(items)
}
