import { invoke } from "@tauri-apps/api";
import { updateClient, UserDetails } from "../../store";
import { createInWindowNotification } from "../../window/__notification/Manager";
import unwrapPromise from "../utils/unwrapPromise";

// Logs in the user using a session token
export const loginWithSession = () => {
    return new Promise(async (resolve, reject) => {
        let { err, result } = await unwrapPromise<UserDetails, string>(invoke("login_with_session"));

        if (err) {
            reject(err);
            createInWindowNotification({
                text: err,
                lengthInSeconds: 5,
            });
            return;
        }

        if (!result) {
            createInWindowNotification({
                text: "User details were not returned on login, try logging in again.",
                lengthInSeconds: 5,
            })
            return;
        }

        updateClient(result);
        resolve(result);
    })
}

