pub mod market;

use reqwest::StatusCode;
use serde_json::Value;

use crate::errors;

// Directly searches for an item from the api
#[tauri::command]
pub async fn search_directly_for_item(item: String) -> Result<Value, errors::Error> {
    let request = reqwest::get(format!("https://api.warframestat.us/items/{}", item)).await;
    if let Err(_) = request {
        return Err(errors::Error::FailedToConnectToServer);
    }

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

    let body = response.text().await.unwrap();
    let json = serde_json::from_str::<Value>(&body);

    if let Err(e) = json {
        return Err(errors::Error::ResponseError(e.to_string()));
    }

    Ok(json.unwrap())
}

// Gets every item that shares something in common with the query
#[tauri::command]
pub async fn search_query(query: String) -> Result<Value, errors::Error> {
    let request = reqwest::get(format!(
        "https://api.warframestat.us/items/search/{}/",
        query
    ))
    .await;

    if let Err(_) = request {
        return Err(errors::Error::FailedToConnectToServer);
    }

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

    let body = response.text().await.unwrap();
    let json = serde_json::from_str::<Value>(&body);

    if let Err(e) = json {
        return Err(errors::Error::ResponseError(e.to_string()));
    }

    Ok(json.unwrap())
}
