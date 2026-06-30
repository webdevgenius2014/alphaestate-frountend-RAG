import React from "react";

interface ModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export default function ModalButton({ className = "", children, ...props }: ModalButtonProps) {
    return (
        <button
            className={`w-full hover:bg-[#D28A44] text-(--db-modal-btn) border border-(--db-modal-btn) text-sm font-semibold pt-4.75 pb-4.25 rounded-md hover:text-white hover:border-[#D28A44] transition-colors disabled:opacity-60 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
