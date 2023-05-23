// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod warframe;
use warframe::items;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
                        items::direct_item,
                        items::search_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
