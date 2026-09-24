"use client";

import { useState } from "react";
import Button from "../ui/button";
import appService from "@/app/services/appService";
import { toast } from "react-hot-toast";

const EMPTY_FORM = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
};

export const ContactSection = () => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(false);

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [k]: e.target.value }));

    const setName = (k: "firstName" | "lastName") => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [k]: e.target.value.replace(/[^A-Za-z ]/g, "").replace(/ {2,}/g, " ") }));

    const setPhone = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, phone: e.target.value.replace(/[^\d+-]/g, "") }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phoneNumber: form.phone.trim(),
            message: form.message.trim(),
        };

        if (!payload.firstName || !payload.lastName || !payload.email || !payload.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!/^[A-Za-z ]+$/.test(payload.firstName) || !/^[A-Za-z ]+$/.test(payload.lastName)) {
            toast.error("First and last name can only contain letters.");
            return;
        }

        if (!payload.email.includes("@")) {
            toast.error("Email address must contain \"@\".");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (payload.phoneNumber) {
            const digitCount = payload.phoneNumber.replace(/\D/g, "").length;
            if (!/^\+?[\d-]+$/.test(payload.phoneNumber) || digitCount < 10 || digitCount > 12) {
                toast.error("Phone number must contain 10 to 12 digits.");
                return;
            }
        }

        if (payload.message.length < 10) {
            toast.error("Message must be at least 10 characters.");
            return;
        }

        setLoading(true);
        try {
            const { phoneNumber, ...rest } = payload;
            const res = await appService.submitContact(phoneNumber ? payload : rest);
            if (res?.status === 200 || res?.status === 201) {
                toast.success(res?.data?.message || "Thanks! Our team will get back to you soon.");
                setForm(EMPTY_FORM);
            } else {
                toast.error(res?.data?.message || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const inputCls =
        "w-full bg-[#D9D9D900] border border-[#FFFFFF4D] min-h-[54px] rounded-[40px] px-[26px] py-2.75 text-white text-[14px] placeholder:text-[#FFFFFF4D] focus:outline-none focus:border-[#D28A4466] font-light transition-colors duration-200";

    return (
        <div className="bg-[linear-gradient(180deg,#021126F5_0%,#010C1B_100%)] xl:-mx-7.5 relative overflow-hidden">
            <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 w-150 h-100 rounded-full bg-[#12458D18] blur-[100px]" />

            <section className="w-full max-w-345 mx-auto px-4 py-24 relative z-10">
                {/* Badge */}
                <div className="flex justify-center mb-9">
                    <div className="inline-flex items-center gap-2 border border-[#0E2445] rounded-full px-9.25 py-3 bg-[linear-gradient(90deg,rgba(5,19,39,0.2)_0%,rgba(18,69,141,0.2)_100%)]">
                        <span className="text-white text-base uppercase font-normal leading-6">Contact Us</span>
                    </div>
                </div>

                {/* Heading */}
                <h2 className="text-center text-white text-[28px] md:text-[36px] font-semibold md:leading-[110%] mb-3">
                    Let's Talk About Your Next Investment
                </h2>

                {/* Subtitle */}
                <p className="text-center text-[#FFFFFF99] text-[15px] leading-6 font-light mb-8 max-w-152.75 mx-auto">
                    Have questions about Alpha Estate or need help getting started? Our team is here to help you explore smarter investment opportunities.
                </p>

                {/* Form */}
                <form
                    noValidate
                    className="max-w-273.5 mx-auto flex flex-col bg-[#05132733] border lg:p-8.75 px-5 py-7 rounded-[30px] border-[#272727] md:space-y-7.5 space-y-4"
                    onSubmit={handleSubmit}
                >
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[#FFFFFFCC] text-[16px] leading-8.25 font-medium">First Name</label>
                            <input
                                type="text"
                                placeholder="Enter first name"
                                value={form.firstName}
                                onChange={setName("firstName")}
                                maxLength={100}
                                className={inputCls}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#FFFFFFCC] text-[16px] leading-8.25 font-medium">Last Name</label>
                            <input
                                type="text"
                                placeholder="Enter last name"
                                value={form.lastName}
                                onChange={setName("lastName")}
                                maxLength={100}
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[#FFFFFFCC] text-[16px] leading-8.25 font-medium">Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value.replace(/\s/g, "") }))}
                                maxLength={255}
                                className={inputCls}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[#FFFFFFCC] text-[16px] leading-8.25 font-medium">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={form.phone}
                                onChange={setPhone}
                                inputMode="tel"
                                maxLength={12}
                                className={inputCls}
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#FFFFFFCC] text-[16px] leading-8.25 font-medium">Message</label>
                        <textarea
                            rows={5}
                            placeholder="Tell us how we can help you..."
                            value={form.message}
                            onChange={set("message")}
                            className={`${inputCls} resize-none rounded-[21px]!`}
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center mt-3">
                        <Button type="submit" disabled={loading} variant="white" className="px-12! py-3.5! text-sm! font-semibold! uppercase! tracking-widest! rounded-full!">
                            {loading ? "Sending..." : "Send Message"}
                        </Button>
                    </div>
                </form>
            </section>
        </div>
    );
};
