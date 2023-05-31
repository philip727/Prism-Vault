import { Component } from 'solid-js'
import './Logo.scss'


type Props = {
    animation?: string
}

const Logo: Component<Props> = (props) => {
    return (
        <svg id="logo-svg" class={props.animation} width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="logo-frame" clip-path="url(#clip0_0_1)">
                <rect id="top-rect" x="36" y="30.0546" width="39.6751" height="39.6751" rx="2" transform="rotate(-45 36 30.0546)" stroke="#5A5EA5" stroke-width="4" />
                <rect id="left-rect" x="2" y="64.0546" width="39.6751" height="39.6751" rx="2" transform="rotate(-45 2 64.0546)" stroke="#5A5EA5" stroke-width="4" />
                <rect id="bottom-rect" x="36" y="98.0546" width="39.6751" height="39.6751" rx="2" transform="rotate(-45 36 98.0546)" stroke="#5A5EA5" stroke-width="4" />
                <rect id="center-rect" x="36" y="64.0546" width="39.6751" height="39.6751" rx="2" transform="rotate(-45 36 64.0546)" stroke="#5A5EA5" stroke-width="4" />
                <rect id="right-rect" x="70" y="64.0546" width="39.6751" height="39.6751" rx="2" transform="rotate(-45 70 64.0546)" stroke="#5A5EA5" stroke-width="4" />
            </g>
            <defs>
                <clipPath id="clip0_0_1">
                    <rect width="128" height="128" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default Logo;
