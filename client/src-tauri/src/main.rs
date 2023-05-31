// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;
mod warframe;
use api::user;
use tauri_plugin_store::StoreBuilder;
use warframe::items;
mod errors;



fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            StoreBuilder::new(app.handle(), "data/user.data".parse()?).build();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            items::direct_item,
            items::search_item,
            user::register::register_user,
            user::login::login_user,
            user::login::login_with_session
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
