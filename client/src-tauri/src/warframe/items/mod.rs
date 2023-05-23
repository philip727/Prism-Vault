use serde_json::Value;

// Directly searches for an item from the api
#[tauri::command]
pub async fn direct_item(item: String)  -> Result<Value, String> {
    let response = reqwest::get(format!("https://api.warframestat.us/items/{}", item)).await;
    if let Err(e) = response {
        return Err(e.to_string());
    }

    let body = response.unwrap().text().await;
    if let Err(e) = body {
        return Err(e.to_string());
    }

    let json = serde_json::from_str::<Value>(&body.unwrap());

    if let Err(e) = json {
        return Err(e.to_string())
    }

    Ok(json.unwrap())
}

// Gets every item that shares something in common with the query
#[tauri::command]
pub async fn search_item(query: String)  -> Result<Value, String> {
    let response = reqwest::get(format!("https://api.warframestat.us/items/search/{}/", query)).await;
    if let Err(e) = response {
        return Err(e.to_string());
    }

    let body = response.unwrap().text().await;
    if let Err(e) = body {
        return Err(e.to_string());
    }

    let json = serde_json::from_str::<Value>(&body.unwrap());

    if let Err(e) = json {
        return Err(e.to_string())
    }

    Ok(json.unwrap())
}
