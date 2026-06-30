"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import appService from "@/app/services/appService";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await appService.forgotPassword({ email });
            if (res?.status === 200 || res?.status === 201) {
                setSent(true);
            } else {
                toast.error(res?.data?.message || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

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

                <div className="w-full relative z-10 max-w-119.25 bg-linear-to-br from-[rgba(3,27,71,0.374)] to-[rgba(10,22,40,0.272)] border border-[#D28A44]/50 shadow-[inset_0px_-1px_0px_0px_#D08A4526,inset_0px_1px_0px_0px_#F4F1EA14,0px_0px_60px_0px_#D08A4526] rounded-3xl flex flex-col p-6 backdrop-blur-[2px]">

                    <div className="mb-2.5 mx-auto">
                        <Image src="/logo.svg" alt="Alpha" width={39} height={42} priority />
                    </div>

                    {sent ? (
                        <>
                            <h2 className="text-[26px] font-semibold text-white mb-1 text-center">Check Your Email</h2>
                            <p className="text-white font-normal text-sm mb-[32.82px] text-center">
                                We sent a password reset link to <span className="text-[#D28A44]">{email}</span>
                            </p>

                            <p className="text-white/60 text-xs text-center mb-6">
                                Didn&apos;t receive it? Check your spam folder or try again.
                            </p>

                            <Button type="button" onClick={() => setSent(false)} className="text-base! max-w-full! font-bold! py-3.75!">
                                Try Again
                            </Button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-[26px] font-semibold text-white mb-1 text-center">Forgot Password</h2>
                            <p className="text-white font-normal text-sm mb-[32.82px] text-center">
                                Enter your email and we&apos;ll send you a reset link
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Button type="submit" disabled={loading} className="text-base! max-w-full! font-bold! py-3.75!">
                                    {loading ? "Sending..." : "Send Reset Link"}
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
            </div>

        </div>
    );
}
