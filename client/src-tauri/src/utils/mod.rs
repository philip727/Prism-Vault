use std::path::PathBuf;

use serde_json::Value;
use tauri::{AppHandle, Wry, Manager};
use tauri_plugin_store::{with_store, StoreCollection};

use crate::errors;

pub fn grab_session_token(app_handle: &AppHandle) -> Result<String, errors::Error> {
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
