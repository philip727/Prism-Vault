use reqwest::StatusCode;
use serde::{Deserialize, Serialize};

use crate::errors;

#[derive(Serialize, Deserialize, Debug)]
pub struct OrderResponse {
    payload: Orders,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Orders {
    orders: Vec<Order>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Order {
    quantity: usize,
    #[serde(rename(serialize = "orderType"))]
    order_type: String,
    platinum: usize,
    user: User,
    platform: String,
    id: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct User {
    status: String,
    reputation: isize,
    region: String,
    #[serde(rename(serialize = "ingameName"))]
    ingame_name: String,
}

impl Order {
    pub fn new() -> Order {
        Order {
            quantity: 0,
            order_type: "sell".to_string(),
            platinum: 99999999,
            user: User::new(),
            platform: "pc".to_string(),
            id: "hi".to_string(),
        }
    }
}

impl User {
    pub fn new() -> User {
        User {
            status: "offline".to_string(),
            reputation: 0,
            region: "en".to_string(),
            ingame_name: "phil".to_string(),
        }
    }
}

#[tauri::command]
pub async fn get_lowest_platinum_price(item_name: String) -> Result<Order, errors::Error> {
    let json_orders = get_orders(item_name).await?;
    let order_iter = json_orders.into_iter();

    let mut cheapest_order = Order::new();
    for order in order_iter {
        if order.order_type == "sell"
            && order.platinum < cheapest_order.platinum
            && order.user.status == "ingame"
        {
            cheapest_order = order;
        }
    }

    Ok(cheapest_order)
}

#[tauri::command]
pub async fn get_orders(item_name: String) -> Result<Vec<Order>, errors::Error> {
    let request = reqwest::get(format!(
        "https://api.warframe.market/v1/items/{}/orders",
        item_name
    ))
    .await;

    let response = request.unwrap();
    let status = response.status();

    // Internal error logs
    if status == StatusCode::INTERNAL_SERVER_ERROR {
        return Err(errors::Error::InternalServer);
    }

    if status != StatusCode::OK {
        let text = response.text().await.unwrap().into();
        return Err(errors::Error::ResponseError(text));
    }

    let body = response.text().await.unwrap();
    let json = serde_json::from_str::<OrderResponse>(&body);

    if let Err(e) = json {
        return Err(errors::Error::ResponseError(e.to_string()));
    }

    let json_value = json.unwrap();

    Ok(json_value.payload.orders)
}
