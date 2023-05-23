import { Component, Match, Switch } from "solid-js"
import Logo from "../assets/Logo";
import Button, { ButtonType } from "../components/inputs/Button";
import InputField from "../components/inputs/InputField";
import { client } from "../store";

const Home: Component = () => {
    const clientInfo: { [key: string]: string } = {
        username: "",
        email: "",
        password: "",
        cpassword: "",
    }


    const handleChange = (e: Event & { target: HTMLInputElement, currentTarget: HTMLInputElement }) => {
        clientInfo[e.currentTarget.name] = e.currentTarget.value;
        console.log(clientInfo);
    }

    return (
        <Switch>
            <Match when={!client.isAuthenticated}>
                <div class="w-screen h-screen flex flex-col justify-center items-center gap-6">
                    <Logo />
                    <InputField name="username" type="text" placeholder="username or email" onChange={handleChange} />
                    <InputField name="password" type="password" placeholder="password" onChange={handleChange} />
                    <div class="flex flex-row w-72 items-center justify-between">
                        <Button type={ButtonType.STANDOUT}>
                            <p class="text-white">Login</p>
                        </Button>
                        <Button type={ButtonType.BACKING}>
                            <p class="text-black">Sign up</p>
                        </Button>
                    </div>
                </div>
            </Match>
        </Switch>
    )
}

export default Home;
