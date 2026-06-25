import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "dark" | "navy" | "white";
}

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
    const base =
        variant === "primary"
            ? "bg-[#D28A44] text-white font-semibold p-[10px_24px] rounded-[5px] hover:bg-[#D28A449E] hover:[box-shadow:0px_2px_4px_0px_#D28A441A,0px_7px_7px_0px_#D28A4417,0px_15px_9px_0px_#D28A440D,0px_26px_10px_0px_#D28A4403,0px_41px_11px_0px_#D28A4400] disabled:opacity-60 text-sm"
            : variant === "secondary"
            ? "inline-flex items-center font-semibold uppercase border border-[#D28A44] justify-center text-[#D28A44] gap-3 bg-(--db-main-bg) text-[#1F2937] font-medium p-[9px_19px_8px_19px] rounded-md hover:bg-[#D28A44] hover:text-white text-sm"
            : variant === "navy"
            ? "inline-flex items-center font-semibold uppercase border border-[#D28A44] justify-center text-white gap-3 bg-[#D28A44] font-medium p-[9px_19px_8px_19px] rounded-md hover:bg-[#0B1F3A] hover:border-[#0B1F3A] hover:text-white text-sm disabled:opacity-60"
            : variant === "white"
            ? "bg-[#D28A44] text-white font-semibold p-[10px_24px] rounded-[5px] hover:bg-white hover:text-[#D28A44] hover:[box-shadow:0px_2px_4px_0px_#D28A441A,0px_7px_7px_0px_#D28A4417,0px_15px_9px_0px_#D28A440D,0px_26px_10px_0px_#D28A4403,0px_41px_11px_0px_#D28A4400] disabled:opacity-60 text-sm"
            : "bg-white/5 border border-white/15 text-white font-semibold p-[16px_24px] rounded-xl hover:bg-white/10 disabled:opacity-60 text-sm";

    return (
        <button className={`w-full max-w-fit transition-all duration-400 ease-linear ${base} ${className}`} {...props}>
            {children}
        </button>
    );
}
