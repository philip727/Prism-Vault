use std::{path::PathBuf, time::Duration};

use reqwest::{header::CONTENT_TYPE, StatusCode};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::{AppHandle, Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

use crate::errors;

#[derive(Serialize, Deserialize, Debug)]
pub struct AddItemPayload {
    pub unique_name: String,
    pub quantity: isize,
}

#[tauri::command]
pub async fn add_item(app_handle: AppHandle, unique_name: String, quantity: isize) -> Result<(), errors::Error> {
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


    let app = &app_handle;
    let stores = app.state::<StoreCollection<Wry>>();
    let path = PathBuf::from("data/user.data");

    let mut key: Value = Default::default();

    let try_grab_key = with_store(app.clone(), stores, path, |store| {
        let try_grab = store.get("session".to_string());
        if let None = try_grab {
            return Err(tauri_plugin_store::Error::Serialize(Box::new(
                errors::Error::SessionToken("No session token".to_string()),
            )));
        }

        key = try_grab.unwrap().clone();
        Ok(())
    });

    if let Err(_) = try_grab_key {
        return Err(errors::Error::SessionToken(
            "<DS> Failed to grab session token from the user".to_string(),
        ));
    }

    let payload = AddItemPayload { unique_name, quantity };

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
