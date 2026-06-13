import React from "react";

interface ModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export default function ModalButton({ className = "", children, ...props }: ModalButtonProps) {
    return (
        <button
            className={`w-full hover:bg-(--db-modal-btn) text-(--db-modal-btn) border border-(--db-modal-btn) text-sm font-semibold pt-4.75 pb-4.25 rounded-md tracking-widest hover:text-(--db-modal-btn-hover-text) transition-colors disabled:opacity-60 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
