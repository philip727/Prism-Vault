import { Component, createSignal, onCleanup, onMount } from "solid-js"
import Logo from "../../assets/Logo"

export const Loading: Component = () => {
    let id: NodeJS.Timer;
    const [dots, setDots] = createSignal(0);
    onMount(() => {
        id = setInterval(() => {
            if (dots() == 3) {
                setDots(1);
                return;
            }

            setDots(prev => ++prev);
        }, 400)
    })

    onCleanup(() => {
        clearInterval(id);
    })

    return (
        <div class="w-screen h-screen flex flex-col justify-center items-center gap-6">
            <Logo animation="breathing" />
            <h1 class="text-white text-3xl font-bold">{"Loading" + ".".repeat(dots())}</h1>
        </div>
    )
}
