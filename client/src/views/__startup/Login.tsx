import { useNavigate } from "@solidjs/router"
import { invoke } from "@tauri-apps/api"
import { Component } from "solid-js"
import Logo from "../../assets/Logo"
import Button, { ButtonType } from "../../components/inputs/Button"
import InputField from "../../components/inputs/InputField"
import unwrapPromise from "../../scripts/utils/unwrapPromise"
import { createInWindowNotification } from "../../window/__notification/Manager"

const Login: Component = () => {
    const navigate = useNavigate();
    const clientInfo: { [key: string]: string } = {
        identifier: "",
        password: "",
    }

    const handleChange = (e: Event & { target: HTMLInputElement, currentTarget: HTMLInputElement }) => {
        clientInfo[e.currentTarget.name] = e.currentTarget.value;
    }

    const login = async () => {
        let { err, result } = await unwrapPromise<string, string>(invoke("login_user", { payload: clientInfo }));

        if (err) {
            createInWindowNotification({
                text: err,
                lengthInSeconds: 5,
            })
            return;
        }

        createInWindowNotification({
            text: "Welcome Tenno!",
            lengthInSeconds: 5,
        })

        navigate("/dashboard");
        console.log(result);
    }

    return (
        <div class="w-screen h-screen flex flex-col justify-center items-center gap-6">
            <Logo />
            <h1 class="text-4xl text-white text-center font-bold tracking-wider hover:tracking-widest transition-all duration-300">Login</h1>
            <form
                class="flex flex-col justify-center items-center gap-6"
                onSubmit={(e) => {
                    e.preventDefault();
                    login();
                }}
            >
                <InputField name="identifier" type="text" placeholder="username or email" onChange={handleChange} />
                <InputField name="password" type="password" placeholder="password" onChange={handleChange} />
                <div class="flex flex-row w-72 items-center justify-between">
                    <Button colourType={ButtonType.STANDOUT} type="submit">
                        <p class="text-white">Login</p>
                    </Button>
                    <Button colourType={ButtonType.BACKING} onClick={() => { navigate("/register") }}>
                        <p class="text-black">Sign up</p>
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Login;
