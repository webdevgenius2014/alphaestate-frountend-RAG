import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "dark";
}

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
    const base =
        variant === "primary"
            ? "bg-[#D28A44] text-white font-semibold p-[16px_24px] rounded-xl hover:bg-[#D28A449E] hover:[box-shadow:0px_2px_4px_0px_#D28A441A,0px_7px_7px_0px_#D28A4417,0px_15px_9px_0px_#D28A440D,0px_26px_10px_0px_#D28A4403,0px_41px_11px_0px_#D28A4400] disabled:opacity-60 text-base"
            : variant === "secondary"
            ? "flex items-center justify-center gap-3 bg-white text-[#1F2937] font-medium p-[16px_24px] rounded-xl hover:bg-gray-100 text-base"
            : "bg-white/5 border border-white/15 text-white font-semibold p-[16px_24px] rounded-xl hover:bg-white/10 disabled:opacity-60 text-base";

    return (
        <button className={`w-full transition-all duration-300 ${base} ${className}`} {...props}>
            {children}
        </button>
    );
}
