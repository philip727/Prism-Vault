// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;
mod warframe;
use api::user;
use warframe::items;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            items::direct_item,
            items::search_item,
            user::register_user,
            user::login_user
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
