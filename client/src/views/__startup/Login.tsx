import { useNavigate } from "@solidjs/router"
import { Component } from "solid-js"
import Logo from "../../assets/Logo"
import Button, { ButtonType } from "../../components/inputs/Button"
import InputField from "../../components/inputs/InputField"

const Login: Component = () => {
    const navigate = useNavigate();
    const clientInfo: { [key: string]: string } = {
        username: "",
        password: "",
    }

    const handleChange = (e: Event & { target: HTMLInputElement, currentTarget: HTMLInputElement }) => {
        clientInfo[e.currentTarget.name] = e.currentTarget.value;
    }

    return (
        <div class="w-screen h-screen flex flex-col justify-center items-center gap-6">
            <Logo />
            <InputField name="username" type="text" placeholder="username or email" onChange={handleChange} />
            <InputField name="password" type="password" placeholder="password" onChange={handleChange} />
            <div class="flex flex-row w-72 items-center justify-between">
                <Button type={ButtonType.STANDOUT}>
                    <p class="text-white">Login</p>
                </Button>
                <Button type={ButtonType.BACKING} onClick={() => {navigate("/register")}}>
                    <p class="text-black">Sign up</p>
                </Button>
            </div>
        </div>
    )
}

export default Login;
