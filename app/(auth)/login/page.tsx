"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";
import { GoogleIcon, FacebookIcon } from "../constants";

export default function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="relative min-h-screen grid grid-cols-1 xl:grid-cols-[46.5%_auto] gap-10 xl:gap-0 overflow-hidden">

            <div className="relative z-10 xl:p-[42px_48px] sm:p-[25px_20px] p-5 w-full flex items-center justify-center">
                <div className="w-full max-w-md bg-linear-to-br from-[rgba(3,27,71,0.374)] to-[rgba(10,22,40,0.272)] border border-[#D28A44]/50 shadow-[inset_0px_-1px_0px_0px_#D08A4526,inset_0px_1px_0px_0px_#F4F1EA14,0px_0px_60px_0px_#D08A4526] rounded-3xl flex flex-col p-6">

                    <div className="mb-2.5 mx-auto">
                        <Image src="/logo.svg" alt="Alpha" width={39} height={42} priority />
                    </div>

                    <h2 className="text-[26px] font-semibold text-white mb-1 text-center">Welcome Back</h2>
                    <p className="text-white font-normal text-sm mb-[32.82px] text-center">Sign in to your Alpha Estate account</p>

                    <form onSubmit={handleLogin} className="space-y-4">

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex items-center text-xs leading-6.5 justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setKeepLoggedIn((prev) => !prev)}>
                                <span className={`w-5.25 h-5.25 rounded flex items-center justify-center border transition-colors ${keepLoggedIn ? "bg-[#D28A44] border-[#D28A44]" : "bg-[#031B47]/60 border-white/40"}`}>
                                    {keepLoggedIn && (
                                        <svg width="14" height="10" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 3.5L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </span>
                                <span className="text-white">Keep me logged in</span>
                            </label>
                            <Link href="#" className="text-[#D28A44] hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 pb-2">
                            <div className="flex-1 h-px bg-white/10" />
                            <span className="text-white text-xs leading-6.5">Instant login</span>
                            <div className="flex-1 h-px bg-white/10" />
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Signing in..." : "Login"}
                        </Button>

                        <div className="flex items-center justify-center gap-4 pt-4">
                            <button
                                type="button"
                                className="flex items-center justify-center hover:bg-white/10 transition"
                            >
                                <GoogleIcon />
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center hover:bg-white/10 transition"
                            >
                                <FacebookIcon />
                            </button>
                        </div>

                    </form>

                    <p className="text-center text-[13px] relative text-white mt-8">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-[#D28A44] font-medium hover:underline">
                            Register
                        </Link>
                        <span className="bg-[radial-gradient(70.71%_70.71%_at_50%_50%,rgba(208,138,69,0.55)_0%,rgba(0,0,0,0)_70%)] absolute left-1/2 -translate-x-1/2 -bottom-7 opacity-40 block w-full max-w-44 rounded-full h-10"></span>
                    </p>

                </div>
            </div>

            <div className="hidden lg:flex relative z-10 flex-1 flex-col">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full scale-140"
                >
                    <source src="/3.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[linear-gradient(270deg,#0B1F3A_13.57%,rgba(11,31,58,0)_24.26%,rgba(11,31,58,0)_73.18%,#0B1F3A_86.26%)] z-10" />
            </div>

        </div>
    );
}
