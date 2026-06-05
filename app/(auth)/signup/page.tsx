"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/app/components/ui/button";
import Input from "@/app/components/ui/input";

export default function SignUpPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="relative min-h-screen grid grid-cols-1 xl:grid-cols-[46.5%_auto] gap-10 xl:gap-0 overflow-hidden">

            <div className="relative z-12 xl:p-[42px_48px_42px_98px] sm:p-[25px_20px] p-5 w-full flex items-center xl:justify-start justify-center">
                <div className="w-full max-w-119.25 relative z-10 bg-[linear-gradient(135deg,rgba(3,27,71,0.374)_0%,rgba(10,22,40,0.272)_100%)] border border-[#D28A44]/50 shadow-[inset_0px_-1px_0px_0px_#D08A4526,inset_0px_1px_0px_0px_#F4F1EA14,0px_0px_60px_0px_#D08A4526] rounded-3xl flex flex-col p-6">

                    <div className="mb-2.5 mx-auto">
                        <Image src="/logo.svg" alt="Alpha" width={39} height={42} priority />
                    </div>

                    <h2 className="text-[26px] font-semibold text-white mb-1 text-center">Join Alpha Estate</h2>
                    <p className="text-white font-normal text-sm mb-[32.82px] text-center">Sign up to search, compare, and save the best properties</p>

                    <form onSubmit={handleSignup} className="space-y-4">

                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="space-y-2.5">
                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <div className="flex pb-2.5 items-center text-xs leading-6.5 justify-between">
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
                            </div>
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating account..." : "Sign up"}
                        </Button>

                    </form>

                    <p className="text-center text-[13px] relative text-white mt-10.5">
                        <span className="relative z-10"> Don&apos;t have an account?{" "}
                            <Link href="/login" className="text-[#D28A44] font-semibold hover:underline">
                                Login
                            </Link></span>
                        <span className="w-[376.24212646484375px] h-[44.265953063964844px] rounded-[37132024px] opacity-[0.50] backdrop-blur-[22.13243293762207px] bg-[radial-gradient(70.71%_70.71%_at_50%_50%,rgba(208,138,69,0.55)_0%,rgba(0,0,0,0)_70%)] absolute left-1/2 -translate-x-1/2 -bottom-5 block max-w-50"></span>
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
