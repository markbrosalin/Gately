import { Component } from "solid-js";

interface LogoIconProps {
    type: "default" | "pressed";
}

export const LogoIcon: Component<LogoIconProps> = (props) => {
    return (
        <svg
            fill="currentColor"
            viewBox="0 0 40 40"
            class="h-full w-auto"
            xmlns="http://www.w3.org/2000/svg"
        >
            {props.type === "pressed" ? <path d={PATH_PRESSED} /> : <path d={PATH_DEFAULT} />}
        </svg>
    );
};

const PATH_PRESSED =
    "M19.998 11.9844C25.5207 11.9844 29.9997 15.8879 30 20.7842C30 25.2019 25.5209 29 19.998 29C14.4752 29 10 25.2019 10 20.7842C10.0003 15.8879 14.4754 11.9844 19.998 11.9844ZM20 14.9844C16.4102 14.9844 13.5001 17.4469 13.5 20.4844C13.5 23.5219 16.4101 25.9844 20 25.9844C23.5899 25.9844 26.5 23.5219 26.5 20.4844C26.4999 17.4469 23.5898 14.9844 20 14.9844Z";
const PATH_DEFAULT =
    "M19.998 7C25.5208 7.00003 29.9999 10.9034 30 15.7998V20.7842C30 25.2019 25.5209 29 19.998 29C14.4752 29 10 25.2019 10 20.7842V15.7998C10.0001 10.9034 14.4753 7 19.998 7ZM20 10C16.4101 10 13.5 12.4624 13.5 15.5C13.5 18.5376 16.4101 21 20 21C23.5899 21 26.5 18.5376 26.5 15.5C26.5 12.4624 23.5899 10 20 10Z";

