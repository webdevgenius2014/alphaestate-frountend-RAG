"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import appService from "@/app/services/appService";
import { toast } from "react-hot-toast";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!password.trim() || !confirmPassword.trim()) {
            setError("Both fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!token) {
            setError("Invalid or expired reset link.");
            return;
        }

        setLoading(true);
        try {
            const res = await appService.resetPassword({ token, password });
            if (res?.status === 200 || res?.status === 201) {
                setSuccess(true);
            } else {
                toast.error(res?.data?.message || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full relative z-10 max-w-119.25 bg-linear-to-br from-[rgba(3,27,71,0.374)] to-[rgba(10,22,40,0.272)] border border-[#D28A44]/50 shadow-[inset_0px_-1px_0px_0px_#D08A4526,inset_0px_1px_0px_0px_#F4F1EA14,0px_0px_60px_0px_#D08A4526] rounded-3xl flex flex-col p-6 backdrop-blur-[2px]">

            <div className="mb-2.5 mx-auto">
                <Image src="/logo.svg" alt="Alpha" width={39} height={42} priority />
            </div>

            {success ? (
                <>
                    <h2 className="text-[26px] font-semibold text-white mb-1 text-center">Password Reset!</h2>
                    <p className="text-white font-normal text-sm mb-8 text-center">
                        Your password has been updated successfully. You can now log in with your new password.
                    </p>
                    <Button
                        type="button"
                        onClick={() => window.location.href = "/login"}
                        className="text-base! max-w-full! font-bold! py-3.75!"
                    >
                        Go to Login
                    </Button>
                </>
            ) : (
                <>
                    <h2 className="text-[26px] font-semibold text-white mb-1 text-center">Reset Password</h2>
                    <p className="text-white font-normal text-sm mb-[32.82px] text-center">
                        Enter your new password below
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="New Password"
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            placeholder="••••••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}

                        <Button type="submit" disabled={loading} className="text-base! max-w-full! font-bold! py-3.75!">
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </>
            )}

            <p className="text-center text-[13px] relative text-white mt-8">
                <span className="relative z-10">Remember your password?{" "}
                    <Link href="/login" className="text-[#D28A44] font-semibold underline">
                        Login
                    </Link>
                </span>
                <span className="w-[376.24212646484375px] h-[44.265953063964844px] rounded-[37132024px] opacity-[0.50] backdrop-blur-[22.13243293762207px] bg-[radial-gradient(70.71%_70.71%_at_50%_50%,rgba(208,138,69,0.55)_0%,rgba(0,0,0,0)_70%)] absolute left-1/2 -translate-x-1/2 -bottom-5 block max-w-50"></span>
            </p>

        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="relative min-h-screen grid grid-cols-1 xl:grid-cols-[auto_46.5%] gap-10 xl:gap-0 overflow-hidden">

            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute hidden xl:flex inset-0 w-full left-[-15%] object-contain h-full"
            >
                <source src="/13.mp4" type="video/mp4" />
            </video>

            <div className="hidden lg:flex relative z-10 flex-1 flex-col" />

            <div className="relative z-10 xl:p-[42px_98px_42px_48px] sm:p-[25px_20px] p-5 w-full flex items-center xl:justify-end justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(270deg,#0B1F3A_47.45%,rgba(11,31,58,0.771348)_62.81%,rgba(11,31,58,0)_82.14%)] z-10" />
                <Suspense fallback={null}>
                    <ResetPasswordForm />
                </Suspense>
            </div>

        </div>
    );
}
