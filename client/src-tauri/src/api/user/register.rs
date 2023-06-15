use regex::Regex;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use reqwest::{header::CONTENT_TYPE, StatusCode};

use crate::{errors, utils::get_dotenv_var};

#[derive(Serialize, Deserialize, Debug)]
pub struct RegisterPayload {
    pub username: String,
    pub email: String,
    pub password: String,
    pub cpassword: String,
}

pub fn is_password_strong(password: &str) -> bool {
    let uppercase_re = Regex::new(r"[A-Z]+").unwrap();
    let lowercase_re = Regex::new(r"[a-z]+").unwrap();
    let number_re = Regex::new(r"\d+").unwrap();
    let special_char_re = Regex::new(r"[@#$%^&*()_+~=\-?<>{}\[\]|\\\/]+").unwrap();
    let length_check = password.len() > 8;

    return uppercase_re.is_match(password)
        && lowercase_re.is_match(password) 
        && number_re.is_match(password) 
        && special_char_re.is_match(password) 
        && length_check;
}

fn verify_register_payload(payload: &RegisterPayload) -> Result<(), String> {
    let username_regexp = Regex::new(r"^[A-Za-z0-9_-]{1,35}$").unwrap();
    let email_regexp = Regex::new(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$").unwrap();

    if payload.username.len() == 0
        || payload.email.len() == 0
        || payload.password.len() == 0
        || payload.cpassword.len() == 0
    {
        return Err("Fill in all required fields".to_string());
    }

    if !username_regexp.is_match(&payload.username) {
        return Err("Invalid username".to_string());
    }

    if !email_regexp.is_match(&payload.email) {
        return Err("Invalid email".to_string());
    }

    if payload.password != payload.cpassword {
        return Err("Passwords do not match".to_string());
    }

    if !is_password_strong(&payload.password){
        return Err("Password does not meet the criteria".to_string());
    }

    Ok(())
}

// Makes a request with the server api to create a user, and sends a certain message back to the frontend
#[tauri::command]
pub async fn register_user(payload: RegisterPayload) -> Result<String, errors::Error> {
    if let Err(e) = verify_register_payload(&payload) {
        return Err(errors::Error::ResponseError(e));
    }

    let client = reqwest::Client::new();
    let response = client
        .post(format!("{}/user/new", get_dotenv_var("SERVER_URL")))
        .timeout(Duration::from_secs(10))
        .header(CONTENT_TYPE, "application/json")
        .json(&payload)
        .send()
        .await;

    if let Err(_) = response {
        return Err(errors::Error::FailedToConnectToServer);
    };

    let resp = response.unwrap();
    let status = resp.status();

    // Internal error logs
    if status == StatusCode::INTERNAL_SERVER_ERROR {
        return Err(errors::Error::InternalServer);
    }

    if status != StatusCode::OK {
        let text = resp.text().await.unwrap();
        return Err(errors::Error::ResponseError(text));
    }

    Ok("Successfully registered".to_string())
}
