use std::path::PathBuf;

use serde_json::Value;
use tauri::{AppHandle, Wry, Manager};
use tauri_plugin_store::{with_store, StoreCollection};

use crate::errors;

// Grabs the session token from appdata
pub fn get_session_token(app_handle: &AppHandle) -> Result<String, errors::Error> {
    let app = app_handle;
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

    Ok(key.to_string())
}

pub fn get_dotenv_var(var_name: &str) -> String {
    let is_in_producation = std::env::var("PRODUCTION").is_ok();
    let mut var_extensions = "";
    if is_in_producation {
        var_extensions = "_PRODUCTION"
    }

    let full_var_name = var_name.to_string() + var_extensions;
    let env_var = std::env::var(var_name).expect(&format!("{} must be set.", full_var_name));
    env_var
}
