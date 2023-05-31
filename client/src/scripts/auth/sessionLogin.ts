import { invoke } from "@tauri-apps/api";
import unwrapPromise from "../utils/unwrapPromise";

export const loginWithSession = async () => {
    let { err, result } = await unwrapPromise<string, string>(invoke("login_with_session"));
    
    if (err) {
        console.log(err);
        return;
    }


    console.log(result);
}

