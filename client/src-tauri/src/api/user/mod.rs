use std::time::Duration;

use reqwest::header::CONTENT_TYPE;
use serde::{Deserialize, Serialize};
use serde_json::{Value};

#[derive(Serialize, Deserialize, Debug)]
pub struct RegisterPayload {
    pub username: String,
    pub email: String,
    pub password: String,
    pub cpassword: String,
}

// Makes a request with the api to create a user, and sends a certain message back to the frontend
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
    }

    let json = response.unwrap().text().await.unwrap();

    Ok(json)
 }
