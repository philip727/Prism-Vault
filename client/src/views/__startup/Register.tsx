import { useNavigate } from "@solidjs/router";
import { invoke } from "@tauri-apps/api";
import { Component } from "solid-js";
import Logo from "../../assets/Logo";
import Button, { ButtonType } from "../../components/inputs/Button";
import InputField from "../../components/inputs/InputField";
import unwrapPromise from "../../scripts/utils/unwrapPromise";
import { createInWindowNotification } from "../../window/__notification/Manager";

const Register: Component = () => {
    const navigate = useNavigate();
    const clientInfo: { [key: string]: string } = {
        username: "",
        email: "",
        password: "",
        cpassword: "",
    }

    const handleChange = (e: Event & { target: HTMLInputElement, currentTarget: HTMLInputElement }) => {
        clientInfo[e.currentTarget.name] = e.currentTarget.value;
    }

    const register = async () => {
        let { err } = await unwrapPromise<string, string>(invoke("register_user", { payload: clientInfo }));

        if (err) {
            createInWindowNotification({
                text: err,
                lengthInSeconds: 5,
            })
            return;
        }

        createInWindowNotification({
            text: "Successfully registered, welcome Tenno!",
            lengthInSeconds: 5,
        })
        navigate("/login")
    }

    return (
        <div class="w-screen h-screen flex flex-col justify-center items-center gap-6">
            <Logo />
            <h1 class="text-4xl text-center text-white font-bold tracking-wider hover:tracking-widest transition-all duration-300">Register</h1>
            <form
                class="flex flex-col justify-center items-center gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    register();
                }}
            >
                <InputField name="username" type="text" placeholder="username" onChange={handleChange} />
                <InputField name="email" type="email" placeholder="email" onChange={handleChange} />
                <InputField name="password" type="password" placeholder="password" onChange={handleChange} />
                <InputField name="cpassword" type="password" placeholder="confirm password" onChange={handleChange} />
                <div class="flex flex-row w-72 items-center justify-between">
                    <Button colourType={ButtonType.STANDOUT} type="submit">
                        <p class="text-white">Register</p>
                    </Button>
                    <Button colourType={ButtonType.BACKING} onClick={() => { navigate("/login") }}>
                        <p class="text-black">Go back</p>
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Register;
