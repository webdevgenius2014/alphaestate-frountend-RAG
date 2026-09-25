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

type FieldKey = keyof typeof EMPTY_FORM;
type FieldErrors = Partial<Record<FieldKey, string>>;

const FIELD_ORDER: FieldKey[] = ["firstName", "lastName", "email", "phone", "message"];

const fieldId = (k: FieldKey) => `contact-${k}`;
const errorId = (k: FieldKey) => `contact-${k}-error`;

const validate = (form: typeof EMPTY_FORM): FieldErrors => {
    const errors: FieldErrors = {};
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const message = form.message.trim();

    if (!firstName) errors.firstName = "First name is required.";
    else if (!/^[A-Za-z ]+$/.test(firstName)) errors.firstName = "First name can only contain letters.";

    if (!lastName) errors.lastName = "Last name is required.";
    else if (!/^[A-Za-z ]+$/.test(lastName)) errors.lastName = "Last name can only contain letters.";

    if (!email) errors.email = "Email address is required.";
    else if (!email.includes("@")) errors.email = "Email address must contain \"@\".";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email address.";

    const phoneDigits = phone.replace(/\D/g, "").length;
    if (!phone) errors.phone = "Phone number is required.";
    else if (!/^\+?[\d-]+$/.test(phone) || phoneDigits < 10 || phoneDigits > 12)
        errors.phone = "Phone number must contain 10 to 12 digits.";

    if (!message) errors.message = "Message is required.";
    else if (message.length < 10
    ) errors.message = "Message must be at least 10 characters.";

    return errors;
};

const FieldLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <label htmlFor={htmlFor} className="text-[#FFFFFFCC] text-[16px] leading-8.25 font-medium">
        {children}
        <span aria-hidden="true" className="text-[#D28A44] ml-1">*</span>
    </label>
);

const FieldError = ({ field, message }: { field: FieldKey; message?: string }) =>
    message ? (
        <p id={errorId(field)} role="alert" className="text-[#FF7A7A] text-[13px] leading-5 px-[26px]">
            {message}
        </p>
    ) : null;

export const ContactSection = () => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);


    const update = (k: FieldKey, value: string) => {
        setForm((prev) => ({ ...prev, [k]: value }));
        if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
    };

    const setName = (k: "firstName" | "lastName") => (e: React.ChangeEvent<HTMLInputElement>) =>
        update(k, e.target.value.replace(/[^A-Za-z ]/g, "").replace(/ {2,}/g, " "));

    const setPhone = (e: React.ChangeEvent<HTMLInputElement>) =>
        update("phone", e.target.value.replace(/[^\d+-]/g, ""));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const nextErrors = validate(form);
        setErrors(nextErrors);

        const firstInvalid = FIELD_ORDER.find((k) => nextErrors[k]);
        if (firstInvalid) {
            document.getElementById(fieldId(firstInvalid))?.focus();
            return;
        }

        const payload = {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phoneNumber: form.phone.trim(),
            message: form.message.trim(),
        };

        setLoading(true);
        try {
            const res = await appService.submitContact(payload);
            if (res?.status === 200 || res?.status === 201) {
                toast.success(res?.data?.message || "Thanks! Our team will get back to you soon.");
                setForm(EMPTY_FORM);
                setErrors({});
            } else {
                toast.error(res?.data?.message || "Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const inputCls = (k: FieldKey) =>
        `w-full bg-[#D9D9D900] border min-h-[54px] rounded-[40px] px-[26px] py-2.75 text-white text-[14px] placeholder:text-[#FFFFFF4D] focus:outline-none font-light transition-colors duration-200 ${
            errors[k] ? "border-[#FF7A7A99] focus:border-[#FF7A7A]" : "border-[#FFFFFF4D] focus:border-[#D28A4466]"
        }`;

    const fieldProps = (k: FieldKey) => ({
        id: fieldId(k),
        name: k,
        required: true,
        "aria-required": true,
        "aria-invalid": !!errors[k],
        "aria-describedby": errors[k] ? errorId(k) : undefined,
    });

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
                    Let&apos;s Talk About Your Next Investment
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
                    <p className="text-[#FFFFFF99] text-[13px] leading-5 font-light">
                        Fields marked with <span className="text-[#D28A44]">*</span> are required.
                    </p>

                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 gap-4">
                        <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor={fieldId("firstName")}>First Name</FieldLabel>
                            <input
                                {...fieldProps("firstName")}
                                type="text"
                                placeholder="Enter first name"
                                value={form.firstName}
                                onChange={setName("firstName")}
                                maxLength={100}
                                autoComplete="given-name"
                                className={inputCls("firstName")}
                            />
                            <FieldError field="firstName" message={errors.firstName} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor={fieldId("lastName")}>Last Name</FieldLabel>
                            <input
                                {...fieldProps("lastName")}
                                type="text"
                                placeholder="Enter last name"
                                value={form.lastName}
                                onChange={setName("lastName")}
                                maxLength={100}
                                autoComplete="family-name"
                                className={inputCls("lastName")}
                            />
                            <FieldError field="lastName" message={errors.lastName} />
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 gap-4">
                        <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor={fieldId("email")}>Email Address</FieldLabel>
                            <input
                                {...fieldProps("email")}
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={(e) => update("email", e.target.value.replace(/\s/g, ""))}
                                maxLength={255}
                                autoComplete="email"
                                className={inputCls("email")}
                            />
                            <FieldError field="email" message={errors.email} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <FieldLabel htmlFor={fieldId("phone")}>Phone Number</FieldLabel>
                            <input
                                {...fieldProps("phone")}
                                type="tel"
                                placeholder="Enter your phone number"
                                value={form.phone}
                                onChange={setPhone}
                                inputMode="tel"
                                maxLength={12}
                                autoComplete="tel"
                                className={inputCls("phone")}
                            />
                            <FieldError field="phone" message={errors.phone} />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-2">
                        <FieldLabel htmlFor={fieldId("message")}>Message</FieldLabel>
                        <textarea
                            {...fieldProps("message")}
                            rows={5}
                            placeholder="Tell us how we can help you..."
                            value={form.message}
                            onChange={(e) => update("message", e.target.value)}
                            className={`${inputCls("message")} resize-none rounded-[21px]!`}
                        />
                        <FieldError field="message" message={errors.message} />
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
