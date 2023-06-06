use std::{error, fmt};

use serde::{Serialize, Deserialize};

pub mod user;


#[derive(Debug, Clone, Serialize, Deserialize)]
struct InternalServerError;

impl fmt::Display for InternalServerError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Interal Server Error, please check your logs in $HOME/Prism Vault/error.log and contact a developer")
    }
}

impl error::Error for InternalServerError {}
