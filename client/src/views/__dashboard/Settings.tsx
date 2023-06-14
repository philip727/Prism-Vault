import { Motion } from "@motionone/solid"
import { Component } from "solid-js"
import { client } from "../../stores/client"
import { ModalDisplay, setModal, updateOnModalOpen } from "../../stores/modal"
import './Settings.scss'

export const Settings: Component = () => {


    return (
        <Motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            class="flex flex-col items-center justify-start w-full px-5"
        >
            <h1 class="ml-1 text-white text-2xl font-semibold text-center mb-4">{client.user.username}'s settings</h1>
            <div class="flex flex-row gap-4">
                <div class="flex flex-col gap-4" >
                    <article class="bg-[var(--c5)] flex flex-col w-96 area pb-1 h-fit">
                        <div class="w-full h-8 bg-[var(--c2)] flex flex-col justify-start items-center mb-1">
                            <h1 class="text-white text-2xl font-semibold text-left w-full ml-3">Contact Info</h1>
                        </div>
                        <p class="text-white font-light text-left">Username: <span class="text-[var(--g1)] font-semibold">{client.user.username}</span></p>
                        <p class="text-white font-light text-left">Email address: <span class="text-[var(--g1)] font-semibold">{client.user.email}</span></p>
                        <p class="text-white font-light text-left">Status: <span class="text-[var(--g1)] font-semibold">Unverified</span></p>
                    </article>
                </div>
                <div class="flex flex-col gap-4">
                    <article class="bg-[var(--c5)] flex flex-col w-96 area pb-1">
                        <div class="w-full h-8 bg-[var(--c2)] flex flex-col justify-start items-center mb-1">
                            <h1 class="text-white text-2xl font-semibold text-left w-full ml-3">Account Security</h1>
                        </div>
                        <p
                            class="text-white font-light text-left"
                            onClick={() => {
                                updateOnModalOpen(() => {
                                    console.log("hi")
                                })
                                setModal("display", ModalDisplay.PASSWORDCHANGE);
                                setModal("open", true);
                            }}
                        >Change password</p>
                    </article>
                </div>
            </div>
        </Motion.article >
    )
}
