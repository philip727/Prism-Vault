use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("Error occured when using a sesion token")]
    SessionToken(String),
    #[error("Internal App Error, please check your logs in $HOME/Prism Vault/error.log and contact a developer")]
    InternalApp,
    #[error("Internal Server Error, please contact a developer")]
    InternalServer,
    #[error("Error occured when trying to process the return value of a request")]
    ResponseError(String),
    #[error("Failed to connect to the server when making a request")]
    FailedToConnectToServer,
    #[error("Error occured with an input provided from the user")]
    InvalidInput(String),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: serde::Serializer 
    {
        match self {
            Error::ResponseError(value)
            | Error::SessionToken(value) => serializer.serialize_str(value.as_ref()),
            | Error::InvalidInput(value) => serializer.serialize_str(value.as_ref()),
            _ => serializer.serialize_str(self.to_string().as_ref()) 
        }
    }
}
