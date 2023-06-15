import { Component, Match, onMount, Switch } from "solid-js"
import { modal, ModalDisplay, onModalOpen, setModal } from "../../stores/modal";
import { ItemModal } from "./__modal/ItemModal";
import { PasswordChangeModal } from "./__modal/PasswordChangeModal";

export const Modal: Component = () => {
    onMount(() => {
        onModalOpen();
    })

    return (
        <div class="absolute top-6 bg-[#0000009E] h-full w-screen z-[990]">
            <div class="absolute top-1/2 left-1/2 z-[991] w-[44rem] h-[32rem] bg-[var(--c4)] -mx-[22rem] -my-[16rem]">
                <div class="w-full h-6 bg-[var(--c3)] flex items-center">
                    <div class="w-1/3" />
                    <div class="w-1/3 flex justify-center items-center" />
                    <div class="w-1/3 flex justify-end items-center">
                        <button class="toolbar-icon px-2 h-6" onClick={() => {
                            setModal("open", false);
                        }}>
                            <p class="text-white select-none">{"->"}</p>
                        </button>
                    </div>
                </div>
                <Switch>
                    <Match when={modal.display == ModalDisplay.ITEM}>
                        <ItemModal />
                    </Match>
                    <Match when={modal.display == ModalDisplay.PASSWORDCHANGE}>
                        <PasswordChangeModal />
                    </Match>
                </Switch>
            </div>
        </div>
    )
}
