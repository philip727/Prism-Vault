import { Component } from "solid-js"
import './Loading.scss'


type Props = {
    width: string,
    height: string,
}

export const Loading: Component<Props> = (props) => {
    return (
        <svg width={props.width} height={props.height} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g class="loading-circle">
                <path class="circle-outside" fill-rule="evenodd" clip-rule="evenodd" d="M106.989 65C106.996 64.6676 107 64.3342 107 64C107 40.2518 87.7482 21 64 21C40.2518 21 21 40.2518 21 64C21 64.3342 21.0038 64.6676 21.0114 65H14.0098C14.0033 64.6674 14 64.3341 14 64C14 36.3858 36.3858 14 64 14C91.6142 14 114 36.3858 114 64C114 64.3341 113.997 64.6675 113.99 65H106.989Z" fill="#5CB3F1" />
                <path class="circle-inside" fill-rule="evenodd" clip-rule="evenodd" d="M31 64C31 64 31 64 31 64C31 82.2254 45.7746 97 64 97C82.2254 97 97 82.2254 97 64H90C90 78.3594 78.3594 90 64 90C49.6406 90 38 78.3594 38 64C38 64 38 64 38 64H31Z" fill="#5CB3F1" />
            </g>
        </svg>
    )
}
