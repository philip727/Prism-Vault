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
    order_type: String,
    platinum: usize,
}

#[tauri::command]
pub async fn get_order(item_name: String) -> Result<Order, errors::Error> {
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
    let order_iter = json_value.payload.orders.iter();

    let mut cheapest_order = Order {
       quantity: 0,
       order_type: "sell".to_string(),
       platinum: 99999999,
    };

    for order in order_iter {
        if order.order_type == "sell" && order.platinum < cheapest_order.platinum {
            cheapest_order = order.clone();
        }
    }

    Ok(cheapest_order)
}
