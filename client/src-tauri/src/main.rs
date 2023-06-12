// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api;
mod warframe;
use api::{user, collection};
use tauri_plugin_store::StoreBuilder;
use utils::get_dotenv_var;
use warframe::items;
use dotenv::dotenv;
mod errors;
mod utils;

fn main() {
    dotenv().ok();
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            StoreBuilder::new(app.handle(), get_dotenv_var("USER_FILE_LOCAL").parse()?).build();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Warframe Items 
            items::search_directly_for_item,
            items::search_query,
            items::market::get_orders,
            items::market::get_lowest_platinum_price,

            // User 
            user::register::register_user,
            user::login::login_user,
            user::login::login_with_session,

            // Collection
            collection::add::add_item,
            collection::get::get_components,
            collection::get::get_owned_items,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
