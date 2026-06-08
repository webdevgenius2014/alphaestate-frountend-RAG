"use client";

import { useState, useRef, useEffect } from "react";
import {
    AI_CHAT_CONV_GROUPS,
    AI_SEED_MESSAGES,
    AIChatBotIcon,
    AIChatPlusIcon,
    AIChatBubbleIcon,
    AIChatSendIcon,
    AIChatEditIcon,
    type AIChatMessage,
    SparkelIcon,
    AIChatAudioIcon,
    AIChatLinkIcon,
} from "@/app/(user dashboard)/constants";


function UserBubble({ msg }: { msg: AIChatMessage }) {
    return (
        <div className="flex flex-col items-end gap-1.5">
            <div className="flex gap-2 items-center">
                <span className="text-xs font-normal text-(--db-text-primary)5">You</span>
                <div className="w-5.75 h-5.75 rounded-full bg-[#D28A44] flex items-center justify-center shrink-0 text-[#D28A44]">
                    <img src="/favicon.ico" alt="" className="max-w-2.5 invert brightness-0 object-cover" />
                </div>
            </div>
            <div className="max-w-92 bg-(--db-main-bg) border border-(--db-border) rounded-md px-4 py-3">
                <p className="text-sm text-(--db-text-primary) leading-relaxed">{msg.content}</p>
            </div>
            <span className="text-(--db-text-primary) text-[9px]">12.00 PM</span>
        </div>
    );
}

function AIBubble({ msg }: { msg: AIChatMessage }) {
    return (
        <div className="flex flex-col gap-2 max-w-164">
            <div className="flex flex-col gap-1.5">
                <div className="flex gap-2 items-center">
                    <div className="w-5.75 h-5.75 rounded-full bg-[#D28A44] flex items-center justify-center shrink-0 text-[#D28A44]">
                        <img src="/favicon.ico" alt="" className="max-w-2.5 invert brightness-0 object-cover" />
                    </div>
                    <span className="text-xs font-normal text-(--db-text-primary)5">Alphaestate Analyst</span>
                </div>
                <div className="bg-(--db-chat-bubble-bg) border border-(--db-border) rounded-[7px] p-5 flex flex-col gap-4">
                    <p className="text-sm text-(--db-chat-text)">{msg.content}</p>

                    {msg.insights && (
                        <>
                            <div>
                                <p className="text-sm font-medium text-[#D28A44] mb-2.5 uppercase">Key Insights</p>
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="bg-(--db-chat-tile-bg) rounded-md p-[11px_15px]">
                                        <p className="text-sm text-(--db-chat-text) mb-1.5">AI Confidence</p>
                                        <p className="text-lg md:text-[21px] font-bold text-[#D28A44] leading-none">0%</p>
                                    </div>
                                    <div className="bg-(--db-chat-tile-bg) rounded-md p-[11px_15px]">
                                        <p className="text-sm text-(--db-chat-text) mb-1.5">ROI</p>
                                        <p className="text-lg md:text-[21px] font-bold text-[#D28A44] leading-none">0%</p>
                                    </div>
                                    <div className="bg-(--db-chat-tile-bg) rounded-md p-[11px_15px]">
                                        <p className="text-sm text-(--db-chat-text) mb-1.5">Market Signal</p>
                                        <p className="text-lg md:text-[21px] font-bold text-[#D28A44] leading-none">Bullish</p>
                                    </div>
                                    <div className="bg-(--db-chat-tile-bg) rounded-md p-[11px_15px]">
                                        <p className="text-sm text-(--db-chat-text) mb-1.5">Hot District</p>
                                        <p className="text-lg md:text-[21px] font-bold text-[#D28A44] leading-none">Yas Island</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <p className="text-sm font-medium text-[#D28A44] mb-2.5 uppercase">AI Recommendation</p>
                                <ul className="flex flex-col gap-1.5">
                                    {msg.recommendations?.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-(--db-chat-text)">
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <span className="text-(--db-text-primary) text-[9px]">12.00 PM</span>
        </div>
    );
}


export default function AIChatPage() {
    const [messages, setMessages] = useState<AIChatMessage[]>(AI_SEED_MESSAGES);
    const [input, setInput] = useState("");
    const [activeConv, setActiveConv] = useState("Market Analysis");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = () => {
        const text = input.trim();
        if (!text) return;
        setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user" as const, content: text }]);
        setInput("");
    };

    const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };

    return (
        <div className="flex h-full gap-3.75 overflow-hidden bg-(--db-sidebar-bg) p-5">

            <div className="w-full max-w-66 shrink-0 bg-(--db-main-bg) border border-[#D28A444D] rounded-lg flex flex-col">

                <div className="px-4 py-4 flex gap-2 items-center border-b border-white/10">
                    <img src="/favicon.ico" alt="" className="max-w-9.5" />
                    <div className="space-y-0.5 text-left">
                        <span className="text-base font-medium text-(--db-text-primary) leading-tight">AlphaAI Analyst</span>
                        <p className="text-[11px] text-(--db-text-primary) leading-tight">Live AI/ML Market Intelligence</p>
                    </div>
                </div>

                <div className="px-3 mb-5">
                    <button className="w-full flex items-center justify-center gap-2 text-[15px] font-semibold text-[#D28A44] border border-[#D28A44] bg-[#D28A441F] hover:bg-[#D28A44] hover:text-white rounded-sm px-7.75 py-2.5 transition-colors">
                        <AIChatPlusIcon />
                        New Conversation
                    </button>
                </div>
                <hr className="border-[#D28A444D]" />

                <div className="flex-1 mt-5 overflow-y-auto px-3 pb-3 flex flex-col gap-5 hide-scroll">
                    {AI_CHAT_CONV_GROUPS.map((group) => (
                        <div key={group.label}>
                            <p className="text-sm font-medium text-(--db-text-primary) uppercase mb-1.5">{group.label}</p>
                            <div className="flex flex-col gap-1.75">
                                {group.items.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setActiveConv(item)}
                                        className={`flex items-center gap-2 text-[12px] font-normal text-left w-full transition-colors ${activeConv === item
                                            ? "text-[#D28A44]"
                                            : "text-(--db-text-primary) "
                                            }`}
                                    >
                                        <span className="truncate">{item}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col flex-1 min-w-0">

                <div className="flex mb-2.5 items-center justify-between px-2.5 py-2.75 border border-[#D28A444D] bg-(--db-main-bg) rounded-lg">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 block rounded-full bg-[#5E9F62]"></span>
                        <p className="text-[15px] font-normal text-(--db-text-primary)">Abu Dhabi Real Estate AI</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-[13px] font-normal text-[#5E9F62] bg-[#5E9F6226] rounded-[5px] py-1.25 px-2.75 transition-colors">
                        2,841 Records Indexed
                    </button>
                </div>

                <div className="overflow-y-auto rounded-lg relative px-5 py-5 flex flex-col gap-5 hide-scroll chat-area-bg">
                    <div
                        className="absolute inset-0 min-h-dvh pointer-events-none chat-dot-overlay"
                        style={{
                            backgroundImage: `radial-gradient(circle, #D9D9D9 2.5px, transparent 2.5px)`,
                            backgroundSize: `20px 20px`,
                            backgroundPosition: `center`,
                        }}
                    />
                    <div className="relative z-10 flex flex-col gap-5">
                        {messages.map((msg) =>
                            msg.role === "user"
                                ? <UserBubble key={msg.id} msg={msg} />
                                : <AIBubble key={msg.id} msg={msg} />
                        )}

                        <div ref={bottomRef} />
                    </div>
                    <div className="shrink-0 relative z-10 p-2.5 bg-(--db-main-bg) rounded-lg">
                        <div className="flex items-center gap-3 text-(--db-text-primary) mb-14.5 bg-none border-none rounded-md focus-within:border-[#D28A4470] transition-colors">
                            <SparkelIcon />
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={onKey}
                                placeholder="Ask | |about districts, ROI, investment opportunities, or market trends..."
                                rows={1}
                                className="flex-1 resize-none bg-transparent text-sm text-(--db-text-primary) placeholder:text-(--db-text-muted) outline-none leading-relaxed"
                            />
                            <div className="flex gap-2 items-center">
                                <button
                                    className="w-7.25 h-7.25 rounded-sm bg-(--db-chat-icon-btn-bg) text-(--db-text-primary) flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors"
                                >
                                    <AIChatLinkIcon />
                                </button>
                                <button
                                    className="w-7.25 h-7.25 rounded-sm bg-(--db-chat-icon-btn-bg) text-(--db-text-primary) flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors"
                                >
                                    <AIChatAudioIcon />
                                </button>
                                <button
                                    className="w-7.25 h-7.25 rounded-sm bg-[#D28A44] text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-[#BF7A38] transition-colors"
                                >
                                    <AIChatSendIcon />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {[
                                { id: 1, text: "Best districts for ROI", color: "#D28A44" },
                                { id: 2, text: "Compare Yas vs Al Reem", color: "#D28A44" },
                                { id: 3, text: "Best rental yield areas", color: "#D28A44" },
                                { id: 4, text: "Under AED 2M opportunities", color: "#D28A44" },
                                { id: 5, text: "Luxury investment zones", color: "#D28A44" }
                            ].map((tag) => (
                                <span
                                    key={tag.id}
                                    className="border min-w-fit border-[#D28A4480] rounded-sm text-[10px] px-[7.5px] py-[4.5px]"
                                    style={{ color: tag.color }}
                                >
                                    {tag.text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
