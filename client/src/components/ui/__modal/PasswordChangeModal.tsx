import { invoke } from "@tauri-apps/api"
import { Component } from "solid-js"
import unwrapPromise from "../../../scripts/utils/unwrapPromise"
import { setModal } from "../../../stores/modal"
import { createInWindowNotification } from "../../../window/__notification/Manager"
import Button, { ButtonType } from "../../inputs/Button"
import InputField from "../../inputs/InputField"

export const PasswordChangeModal: Component = () => {
    const payload: { [key: string]: string } = {
        currentPassword: "",
        newPassword: "",
        cNewPassword: "",
    }

    const updatePassword = async () => {
        const { err } = await unwrapPromise<string, string>(invoke("update_password", {
            newPassword: payload.newPassword,
            confirmPassword: payload.cNewPassword,
            previousPassword: payload.currentPassword,
        }));

        if (err) {
            createInWindowNotification({
                text: err,
                lengthInSeconds: 5
            })
            return;
        }
        createInWindowNotification({
            text: "Succesfully updated your password",
            lengthInSeconds: 5
        });
        setModal("open", false);
    }

    const handleChange = (e: KeyboardEvent & { currentTarget: HTMLInputElement; target: Element; }) => {
        payload[e.currentTarget.name] = e.currentTarget.value;
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            updatePassword();
        }}
            class="h-full flex flex-col items-center justify-center gap-6"
        >
            <h1 class="text-4xl text-white text-center font-bold tracking-wider">Change password</h1>
            <InputField
                name="currentPassword"
                type="password"
                placeholder="current password"
                onKeyUp={handleChange}
            />
            <InputField
                name="newPassword"
                type="password"
                placeholder="new password"
                onKeyUp={handleChange}
                prompt={{
                    text: [
                        "Must contain at least one uppercase character",
                        "Must contain at least one lowercase character",
                        "Must contain at least one number",
                        "Must contain at least one of the lowing special characters: @#$%^&*()_+~=\-?<>{}\[\]|\\\/"
                    ],
                    enabled: true
                }}
            />
            <InputField
                name="cNewPassword"
                type="password"
                placeholder="confirm new password"
                onKeyUp={handleChange}
            />
            <Button type="submit" colourType={ButtonType.STANDOUT}>
                <p class="text-white">Confirm</p>
            </Button>
        </form>
    )
}
