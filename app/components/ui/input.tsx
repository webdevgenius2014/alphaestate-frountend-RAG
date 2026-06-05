"use client";

import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "@/app/(auth)/constants";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    rightElement?: React.ReactNode;
}

export default function Input({ label, rightElement, className = "", type, ...props }: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    const toggleButton = (
        <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="cursor-pointer"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
        >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
    );

    const resolvedRightElement = isPassword ? toggleButton : rightElement;

    return (
        <div>
            {label && (
                <label className="block text-base font-normal text-white mb-2.5">{label}</label>
            )}
            <div className="relative">
                <input
                    type={resolvedType}
                    className={`w-full h-14 bg-[#031B4773] border border-white/40 text-white placeholder-[#8C8C8C] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#D28A44]/50 focus:ring-1 focus:ring-[#D28A44]/20 transition ${resolvedRightElement ? "pr-11" : ""} ${className}`}
                    {...props}
                />
                {resolvedRightElement && (
                    <div className="absolute right-4 top-5">
                        {resolvedRightElement}
                    </div>
                )}
            </div>
        </div>
    );
}
