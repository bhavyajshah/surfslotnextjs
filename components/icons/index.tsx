import * as React from "react"

export const PlusIcon = (props:any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={19}
        fill="none"
        {...props}
    >
        <path stroke="#000" d="M10.5 0v19M19.987 9.863.991 9.5" />
    </svg>
)
export const UpArrow = (props:any) => (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 0L13.9282 9.75H0.0717969L7 0Z" fill="#264E8A" />
    </svg>
)
export const DownArrow = (props:any) => (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 10L0.0717964 0.25L13.9282 0.25L7 10Z" fill="#264E8A" />
    </svg>
)
export const Line = (props:any) => (
    <svg width="301" height="6" viewBox="0 0 301 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 3H301" stroke="#264E8A" stroke-width="5" />
    </svg>
)

