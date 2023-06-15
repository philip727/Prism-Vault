use std::path::PathBuf;

use serde_json::json;
use tauri::{AppHandle, Wry, Manager};
use tauri_plugin_store::{StoreCollection, with_store};

use crate::{errors, utils::get_dotenv_var};

#[tauri::command]
pub fn logout_user(app_handle: AppHandle) -> Result<(), errors::Error> {
    let app = &app_handle;
    let stores = app.state::<StoreCollection<Wry>>();
    let path = PathBuf::from(get_dotenv_var("USER_FILE_LOCAL"));

    // Session token received in response
    let try_delete_key = with_store(app.clone(), stores, path, |store| {
        store.insert("session".to_string(), json!(""))?;
        store.save()
    });

    if let Err(_) = try_delete_key {
        return Err(errors::Error::SessionToken(
            "Failed to delete session token when logging out"
                .to_string(),
        ));
    }

    Ok(())
}
