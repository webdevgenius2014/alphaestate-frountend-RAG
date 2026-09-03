"use client";

import { useState, useRef, useEffect } from "react";
import {
    AI_CHAT_CONV_GROUPS,
    AI_SEED_MESSAGES,
    AIChatPlusIcon,
    AIChatSendIcon,
    type AIChatMessage,
    SparkelIcon,
    AIChatAudioIcon,
    AIChatLinkIcon,
} from "@/app/(user dashboard)/constants";
import { AnimatedNumber } from "@/app/components/dashboard/animated-number";
import Button from "@/app/components/ui/button";
import appService from "@/app/services/appService";

type EngineStatus = "checking" | "online" | "offline";

const ENGINE_STATUS_STYLES: Record<EngineStatus, { dot: string; label: string }> = {
    checking: { dot: "bg-gray-400 animate-pulse", label: "Checking..." },
    online: { dot: "bg-[#5E9F62]", label: "Abu Dhabi Real Estate AI" },
    offline: { dot: "bg-red-500", label: "AI engine offline" },
};


function UserBubble({ msg }: { msg: AIChatMessage }) {
    return (
        <div className="flex flex-col items-end gap-1.5">
            <div className="flex gap-2 items-center">
                <span className="text-xs font-normal text-(--db-text-primary)5">You</span>
                <div className="w-5.75 h-5.75 rounded-full bg-[#D28A44] flex items-center justify-center shrink-0">
                    <img src="/favicon.ico" alt="" className="max-w-2.5 invert brightness-0 object-cover" />
                </div>
            </div>
            <div className="max-w-[85%] xl:max-w-92 bg-(--db-main-bg) border border-(--db-border) rounded-md px-4 py-3">
                <p className="text-sm text-(--db-text-primary) leading-relaxed">{msg.content}</p>
            </div>
            <span className="text-(--db-text-primary) text-[9px]">12.00 PM</span>
        </div>
    );
}

type RoiForm = {
    purchasePrice: string;
    rentalIncome: string;
    district: string;
    propertyType: string;
    vacancyRate: string;
};

function AIBubble({ msg, activeTab, roiForm, setRoiForm, onSuggestionClick }: {
    msg: AIChatMessage;
    activeTab: "chat" | "roi";
    roiForm: RoiForm;
    setRoiForm: React.Dispatch<React.SetStateAction<RoiForm>>;
    onSuggestionClick?: (suggestion: string) => void;
}) {
    return (
        <div className="flex flex-col gap-2 max-w-full xl:max-w-164">
            <div className="flex flex-col gap-1.5">
                <div className="flex gap-2 items-center">
                    <div className="w-5.75 h-5.75 rounded-full bg-[#D28A44] flex items-center justify-center shrink-0">
                        <img src="/favicon.ico" alt="" className="max-w-2.5 invert brightness-0 object-cover" />
                    </div>
                    <span className="text-xs font-normal text-(--db-text-primary)5">Alphaestate Analyst</span>
                </div>
                <div className={`bg-(--db-chat-bubble-bg) rounded-[7px] p-4 xl:p-5 flex flex-col gap-4 ${msg.isError ? "border border-red-500/40" : ""}`}>
                    <p className={`text-sm ${msg.isError ? "text-red-400" : "text-(--db-chat-text)"}`}>{msg.content}</p>

                    {!!msg.suggestions?.length && (
                        <div className="flex gap-2 flex-wrap">
                            {msg.suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => onSuggestionClick?.(s)}
                                    className="border border-[#D28A4480] text-[#D28A44] hover:bg-[#D28A44] hover:text-white rounded-sm text-[11px] px-2.5 py-1.5 transition-colors text-left"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === "roi" ? (
                        <div className="bg-(--db-chat-tile-bg) rounded-md p-[11px_15px]">
                            <p className="text-base font-medium text-[#D28A44] mb-2.5">ROI Investment Calculator</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2.75">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-(--db-chat-text)">Property Purchase Price</label>
                                    <input
                                        type="text"
                                        placeholder="Enter property purchase price"
                                        value={roiForm.purchasePrice}
                                        onChange={(e) => setRoiForm(f => ({ ...f, purchasePrice: e.target.value }))}
                                        className="w-full bg-(--db-chat-bubble-bg) border border-[#D28A4452] rounded-md px-3 py-2.5 text-[11px] text-(--db-text-primary) placeholder:text-(--db-text-muted) outline-none focus:border-[#D28A4470] transition-colors"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-(--db-chat-text)">Expected Annual Rental Income</label>
                                    <input
                                        type="text"
                                        placeholder="Enter yearly rental income"
                                        value={roiForm.rentalIncome}
                                        onChange={(e) => setRoiForm(f => ({ ...f, rentalIncome: e.target.value }))}
                                        className="w-full bg-(--db-chat-bubble-bg) border border-[#D28A4452] rounded-md px-3 py-2.5 text-[11px] text-(--db-text-primary) placeholder:text-(--db-text-muted) outline-none focus:border-[#D28A4470] transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2.75">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-(--db-chat-text)">District</label>
                                    <select
                                        value={roiForm.district}
                                        onChange={(e) => setRoiForm(f => ({ ...f, district: e.target.value }))}
                                        className="w-full bg-(--db-chat-bubble-bg) border border-[#D28A4452] rounded-md px-3 py-2.5 text-[11px] text-(--db-text-primary) outline-none focus:border-[#D28A4470] transition-colors"
                                    >
                                        <option value="">Select a district</option>
                                        <option>Yas Island</option>
                                        <option>Al Reem Island</option>
                                        <option>Saadiyat Island</option>
                                        <option>Al Maryah Island</option>
                                        <option>Khalidiyah</option>
                                        <option>Al Raha Beach</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-(--db-chat-text)">Property Type</label>
                                    <select
                                        value={roiForm.propertyType}
                                        onChange={(e) => setRoiForm(f => ({ ...f, propertyType: e.target.value }))}
                                        className="w-full bg-(--db-chat-bubble-bg) border border-[#D28A4452] rounded-md px-3 py-2.5 text-[11px] text-(--db-text-primary) outline-none focus:border-[#D28A4470] transition-colors"
                                    >
                                        <option>Apartment</option>
                                        <option>Villa</option>
                                        <option>Townhouse</option>
                                        <option>Penthouse</option>
                                        <option>Studio</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 mb-2.75">
                                <label className="text-sm font-medium text-(--db-chat-text)">Vacancy Rate (%)</label>
                                <input
                                    type="text"
                                    placeholder="Enter Vacancy Rate"
                                    value={roiForm.vacancyRate}
                                    onChange={(e) => setRoiForm(f => ({ ...f, vacancyRate: e.target.value }))}
                                    className="w-full bg-(--db-chat-bubble-bg) border border-[#D28A4452] rounded-md px-3 py-2.5 text-[11px] text-(--db-text-primary) placeholder:text-(--db-text-muted) outline-none focus:border-[#D28A4470] transition-colors"
                                />
                                <p className="text-[7px] p-[7px_6px] rounded-md bg-[#D28A4438] text-(--db-text-primary) flex items-center gap-1.5">
                                    <img src="/about.svg" alt="" />
                                    Vacancy rate is the estimated percentage of time the property will be unoccupied per year. Abu Dhabi market average: 10%. Leave blank to use default.
                                </p>
                            </div>
                            <Button variant="primary" className="uppercase">
                                Calculate ROI
                            </Button>
                        </div>
                    ) : msg.insights && (
                        <>
                            <div>
                                <p className="text-sm font-medium text-[#D28A44] mb-2.5 uppercase">Key Insights</p>
                                <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                                    <div className="bg-(--db-chat-tile-bg) rounded-md p-[11px_15px]">
                                        <p className="text-sm text-(--db-chat-text) mb-1.5">AI Confidence</p>
                                        <AnimatedNumber value="91%" className="text-lg xl:text-[21px] font-bold text-[#D28A44] leading-none" />
                                    </div>
                                    <div className="bg-(--db-chat-tile-bg) rounded-md p-[11px_15px]">
                                        <p className="text-sm text-(--db-chat-text) mb-1.5">ROI</p>
                                        <AnimatedNumber value="8.1%" className="text-lg xl:text-[21px] font-bold text-[#D28A44] leading-none" />
                                    </div>
                                    <div className="bg-(--db-chat-tile-bg) rounded-md p-[11px_15px]">
                                        <p className="text-sm text-(--db-chat-text) mb-1.5">Market Signal</p>
                                        <p className="text-lg xl:text-[21px] font-bold text-[#D28A44] leading-none">Bullish</p>
                                    </div>
                                    <div className="bg-(--db-chat-tile-bg) rounded-md p-[11px_15px]">
                                        <p className="text-sm text-(--db-chat-text) mb-1.5">Hot District</p>
                                        <p className="text-lg xl:text-[21px] font-bold text-[#D28A44] leading-none">Yas Island</p>
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


function ConvSidebar({ activeConv, setActiveConv, setActiveTab, onClose }: {
    activeConv: string;
    setActiveConv: (v: string) => void;
    setActiveTab: (v: "chat" | "roi") => void;
    onClose?: () => void;
}) {
    return (
        <>
            <div className="px-4 py-4 flex gap-2 items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex gap-2 items-center min-w-0">
                    <img src="/favicon.ico" alt="" className="max-w-9.5 shrink-0" />
                    <div className="space-y-0.5 text-left min-w-0">
                        <span className="text-base font-medium text-(--db-text-primary) leading-tight block truncate">AlphaAI Analyst</span>
                        <p className="text-[11px] text-(--db-text-primary) leading-tight">Live AI/ML Market Intelligence</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full border border-white/10 text-white/40 hover:text-white hover:border-white/20 transition-colors"
                        aria-label="Close"
                    >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="px-3 pt-3 mb-5 shrink-0">
                <button className="w-full flex items-center justify-center gap-2 text-[15px] font-semibold text-[#D28A44] border border-[#D28A44] bg-[#D28A441F] hover:bg-[#D28A44] hover:text-white rounded-sm px-7.75 py-2.5 transition-colors">
                    <AIChatPlusIcon />
                    New Conversation
                </button>
            </div>
            <hr className="border-[#D28A444D] shrink-0" />

            <div className="flex-1 mt-5 overflow-y-auto px-3 pb-3 flex flex-col gap-5 hide-scroll">
                {AI_CHAT_CONV_GROUPS.map((group) => (
                    <div key={group.label}>
                        <p className="text-sm font-medium text-(--db-text-primary) uppercase mb-1.5">{group.label}</p>
                        <div className="flex flex-col gap-1.75">
                            {group.items.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        setActiveConv(item);
                                        setActiveTab(item === "ROI Calculator" ? "roi" : "chat");
                                        onClose?.();
                                    }}
                                    className={`flex items-center gap-2 text-[12px] font-normal text-left w-full transition-colors ${
                                        activeConv === item
                                            ? "text-[#D28A44]"
                                            : "text-(--db-text-primary) hover:text-[#D28A44]"
                                    }`}
                                >
                                    <span className="truncate">{item}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}


const CHAT_PHRASE = "Ask | about districts, ROI, investment opportunities, or market trends....";

export default function AIChatPage() {
    const [messages, setMessages] = useState<AIChatMessage[]>(AI_SEED_MESSAGES);
    const [input, setInput] = useState("");
    const [activeConv, setActiveConv] = useState("Market Analysis");
    const [chatPlaceholder, setChatPlaceholder] = useState("");
    const [activeTab, setActiveTab] = useState<"chat" | "roi">("chat");
    const [roiForm, setRoiForm] = useState<RoiForm>({ purchasePrice: "", rentalIncome: "", district: "", propertyType: "Apartment", vacancyRate: "" });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [engineStatus, setEngineStatus] = useState<EngineStatus>("checking");
    const [sending, setSending] = useState(false);
    const [sessionId] = useState(() => crypto.randomUUID());
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        let cancelled = false;

        const checkHealth = () => {
            appService.getChatEngineHealth().then((res) => {
                if (cancelled) return;
                setEngineStatus(res?.status === 200 && res?.data?.status === "ok" ? "online" : "offline");
            });
        };

        checkHealth();
        const interval = setInterval(checkHealth, 30_000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        let charIdx = 0;
        let deleting = false;
        let timeout: ReturnType<typeof setTimeout>;
        const tick = () => {
            if (!deleting) {
                charIdx++;
                setChatPlaceholder(CHAT_PHRASE.slice(0, charIdx));
                if (charIdx === CHAT_PHRASE.length) {
                    deleting = true;
                    timeout = setTimeout(tick, 2000);
                    return;
                }
            } else {
                charIdx--;
                setChatPlaceholder(CHAT_PHRASE.slice(0, charIdx));
                if (charIdx === 0) {
                    deleting = false;
                    timeout = setTimeout(tick, 300);
                    return;
                }
            }
            timeout = setTimeout(tick, deleting ? 25 : 55);
        };
        timeout = setTimeout(tick, 400);
        return () => clearTimeout(timeout);
    }, []);

    const send = async (text?: string) => {
        const query = (text ?? input).trim();
        if (!query || sending) return;

        setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user" as const, content: query }]);
        setInput("");
        setSending(true);

        const res = await appService.sendChatQuery(query, sessionId);

        setMessages((prev) => [
            ...prev,
            res?.status === 200
                ? {
                    id: `${Date.now()}-a`,
                    role: "assistant" as const,
                    content: res.data.answer,
                    suggestions: res.data.suggestions,
                }
                : {
                    id: `${Date.now()}-a`,
                    role: "assistant" as const,
                    content: res?.data?.error || res?.data?.answer || "Something went wrong. Please try again.",
                    isError: true,
                },
        ]);
        setSending(false);
    };

    const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    };

    return (
        <div className="flex h-full gap-3.75 overflow-hidden bg-(--db-sidebar-bg) p-5">

            {/* Desktop sidebar — visible at xl (1280px+) */}
            <div className="hidden xl:flex w-full max-w-66 shrink-0 bg-(--db-main-bg) border border-[#D28A444D] rounded-lg flex-col">
                <ConvSidebar activeConv={activeConv} setActiveConv={setActiveConv} setActiveTab={setActiveTab} />
            </div>

            {/* Mobile / tablet sidebar drawer — below xl */}
            <div
                className="xl:hidden fixed inset-0 z-50 overflow-hidden"
                style={{ pointerEvents: sidebarOpen ? "auto" : "none" }}
            >
                <div
                    className="absolute inset-0 bg-black/60"
                    style={{
                        opacity: sidebarOpen ? 1 : 0,
                        transition: "opacity 300ms ease",
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                    }}
                    onClick={() => setSidebarOpen(false)}
                />
                <aside
                    className="absolute top-0 left-0 h-full w-[min(280px,84vw)] flex flex-col bg-(--db-main-bg) border-r border-[#D28A444D]"
                    style={{
                        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                        transition: "transform 380ms cubic-bezier(0.32,0.72,0,1)",
                    }}
                >
                    <ConvSidebar
                        activeConv={activeConv}
                        setActiveConv={setActiveConv}
                        setActiveTab={setActiveTab}
                        onClose={() => setSidebarOpen(false)}
                    />
                </aside>
            </div>

            {/* Main chat area */}
            <div className="flex flex-col flex-1 min-w-0">

                <div className="flex mb-2.5 items-center justify-between gap-2 px-2.5 py-2.75 border border-[#D28A444D] bg-(--db-main-bg) rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                        {/* Conversations toggle — below xl only */}
                        <button
                            className="xl:hidden w-7 h-7 shrink-0 flex items-center justify-center rounded-md border border-[#D28A4440] text-[#D28A44]"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open conversations"
                        >
                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                                <path d="M1 1h12M1 5h12M1 9h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                        </button>
                        <span className={`w-2.5 h-2.5 block rounded-full shrink-0 ${ENGINE_STATUS_STYLES[engineStatus].dot}`} />
                        <p className="text-[13px] xl:text-[15px] font-normal text-(--db-text-primary) truncate">{ENGINE_STATUS_STYLES[engineStatus].label}</p>
                    </div>
                    <button className="shrink-0 flex items-center gap-1.5 text-[11px] xl:text-[13px] font-normal text-[#5E9F62] bg-[#5E9F6226] rounded-[5px] py-1.25 px-2.75 whitespace-nowrap transition-colors">
                        2,841 Records Indexed
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto rounded-lg relative px-3 xl:px-5 py-5 flex flex-col gap-5 hide-scroll chat-area-bg">
                    <div
                        className="absolute inset-0 min-h-dvh pointer-events-none chat-dot-overlay"
                        style={{
                            backgroundImage: "radial-gradient(circle, #D9D9D9 2.5px, transparent 2.5px)",
                            backgroundSize: "20px 20px",
                            backgroundPosition: "center",
                        }}
                    />
                    <div className="relative z-10 flex flex-col gap-5">
                        {messages.map((msg) =>
                            msg.role === "user"
                                ? <UserBubble key={msg.id} msg={msg} />
                                : <AIBubble key={msg.id} msg={msg} activeTab={activeTab} roiForm={roiForm} setRoiForm={setRoiForm} onSuggestionClick={(s) => send(s)} />
                        )}
                        {sending && (
                            <div className="flex items-center gap-2">
                                <div className="w-5.75 h-5.75 rounded-full bg-[#D28A44] flex items-center justify-center shrink-0">
                                    <img src="/favicon.ico" alt="" className="max-w-2.5 invert brightness-0 object-cover" />
                                </div>
                                <span className="text-sm text-(--db-text-muted) animate-pulse">Thinking...</span>
                            </div>
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
                                placeholder={chatPlaceholder}
                                rows={1}
                                disabled={sending}
                                className="flex-1 resize-none bg-transparent text-sm text-(--db-text-primary) placeholder:text-(--db-text-muted) outline-none leading-relaxed disabled:opacity-60"
                            />
                            <div className="flex gap-2 items-center">
                                <button className="w-7.25 h-7.25 rounded-sm bg-(--db-chat-icon-btn-bg) text-(--db-text-primary) flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors">
                                    <AIChatLinkIcon />
                                </button>
                                <button className="w-7.25 h-7.25 rounded-sm bg-(--db-chat-icon-btn-bg) text-(--db-text-primary) flex items-center justify-center shrink-0 disabled:opacity-40 transition-colors">
                                    <AIChatAudioIcon />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => send()}
                                    disabled={sending || !input.trim()}
                                    className="w-7.25 h-7.25 rounded-sm bg-[#D28A44] text-white flex items-center justify-center shrink-0 disabled:opacity-40 hover:bg-[#BF7A38] transition-colors"
                                >
                                    <AIChatSendIcon />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto">
                            {[
                                { id: 1, text: "Best districts for ROI" },
                                { id: 2, text: "Compare Yas vs Al Reem" },
                                { id: 3, text: "Best rental yield areas" },
                                { id: 4, text: "Under AED 2M opportunities" },
                                { id: 5, text: "Luxury investment zones" },
                            ].map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    disabled={sending}
                                    onClick={() => send(tag.text)}
                                    className="border min-w-fit border-[#D28A4480] text-[#D28A44] hover:bg-[#D28A44] hover:text-white rounded-sm text-[10px] px-[7.5px] py-[4.5px] cursor-pointer disabled:opacity-40"
                                >
                                    {tag.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
