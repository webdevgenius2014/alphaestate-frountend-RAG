"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "../ui/button";
import { navItems } from "@/app/constant";

export const Header = (): React.JSX.Element => {
   const [activeItem, setActiveItem] = useState<string>("");
   const [scrolled, setScrolled] = useState(false);
   const [menuOpen, setMenuOpen] = useState(false);

   useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 25);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
   }, []);

   useEffect(() => {
      const onResize = () => { if (window.innerWidth >= 1280) setMenuOpen(false); };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
   }, []);

   return (
      <div className="relative flex justify-center items-center">
         <header className={`${scrolled ? "fixed top-0" : "absolute xl:top-7.75 top-3"} z-50 left-1/2 -translate-x-1/2 ${scrolled ? "xl:w-[calc(100%-60px)] w-[calc(100%-50px)]" : "w-[calc(100%-50px)] xl:w-full"} max-w-329.75 md:h-20.75 h-15 flex bg-[#0b1f3a66] rounded-[70px] backdrop-blur-[7px] backdrop-brightness-100 [-webkit-backdrop-filter:blur(7px)_brightness(100%)] transition-all ease-linear`}>

            <div className="hidden xl:inline-flex mt-5.5 ml-5 relative w-319.75 h-10 items-center gap-47.75">
               <Link href="/" aria-label="Alpha home" className="relative block">
                  <img className="relative w-46 h-9.5 aspect-[4.85]" alt="Alpha" src="/header-logo.svg" />
               </Link>
               <nav aria-label="Primary navigation" className="gap-11.25 flex-[0_0_auto] inline-flex relative items-center">
                  {navItems.map((item) => {
                     const id = item.label.toLowerCase().replace(/\s+/g, "-");
                     return (
                        <button
                           key={item.label}
                           type="button"
                           className="group relative overflow-hidden h-5 max-w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d28a44] rounded-sm"
                           onClick={() => { setActiveItem(item.label); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                        >
                           <div className="transition-transform duration-300 will-change-transform ease-[cubic-bezier(0.34,1.15,0.64,1)] group-hover:-translate-y-5 translate-y-0">
                              <div className="h-5 flex items-center text-white text-[13px] font-light whitespace-nowrap">{item.label}</div>
                              <div className="h-5 flex items-center text-[#d28a44] text-[13px] font-light whitespace-nowrap underline">{item.label}</div>
                           </div>
                        </button>
                     );
                  })}
               </nav>
               <div className="relative flex justify-end w-full max-w-fit gap-2 ml-auto">
                  <Link href="/login">
                     <button
                        type="button"
                        className="h-10 px-3.75 py-2.25 text-white text-sm font-medium rounded-[64px] border border-solid border-[#ffffff66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent hover:bg-[#D28A44] hover:border-[#D28A44] hover:text-white ease-linear transition-colors duration-200"
                        aria-label="Login"
                     >
                        LOGIN
                     </button>
                  </Link>
                  <Link href="/signup">
                     <Button variant="white" className="w-full! max-w-29.75! uppercase py-2.25! text-sm! px-3! rounded-full!">Get Started</Button>
                  </Link>
               </div>
            </div>

            <div className="xl:hidden flex items-center justify-between w-full px-6">
               <Link href="/" aria-label="Alpha home">
                  <img className="w-36 h-8" alt="Alpha" src="/header-logo.svg" />
               </Link>

             
               <button
                  type="button"
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="relative w-10 h-10 flex items-center justify-center focus-visible:outline-none"
               >
                  <span
                     className="absolute inset-0 rounded-full border border-[#D28A44]"
                     style={{
                        opacity: menuOpen ? 0.45 : 0,
                        transform: menuOpen ? "scale(1)" : "scale(0.55)",
                        transition: "opacity 500ms ease, transform 500ms ease",
                     }}
                  />
                  <span
                     className="absolute block w-5.5 h-[1.5px] bg-white rounded-full origin-center"
                     style={{
                        transition: "transform 400ms cubic-bezier(0.34,1.15,0.64,1)",
                        transform: menuOpen ? "translateY(0px) rotate(45deg)" : "translateY(-5px) rotate(0deg)",
                     }}
                  />
                  <span
                     className="absolute block w-5.5 h-[1.5px] bg-white rounded-full"
                     style={{
                        transition: "opacity 220ms ease, transform 220ms ease",
                        opacity: menuOpen ? 0 : 1,
                        transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
                     }}
                  />
                  <span
                     className="absolute block w-5.5 h-[1.5px] bg-white rounded-full origin-center"
                     style={{
                        transition: "transform 400ms cubic-bezier(0.34,1.15,0.64,1)",
                        transform: menuOpen ? "translateY(0px) rotate(-45deg)" : "translateY(5px) rotate(0deg)",
                     }}
                  />
               </button>
            </div>
         </header>

         <div
            className="xl:hidden fixed inset-0 z-60 flex flex-col"
            style={{
               background: "linear-gradient(155deg,#0D1D34 0%,#070D1A 60%,#060C16 100%)",
               opacity: menuOpen ? 1 : 0,
               pointerEvents: menuOpen ? "auto" : "none",
               transition: "opacity 400ms ease",
            }}
         >
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#D28A44] blur-[130px] opacity-[0.07] pointer-events-none" />
            <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-[#3671C9] blur-[120px] opacity-[0.09] pointer-events-none" />

            <div
               className="flex items-center justify-between h-15 px-11 shrink-0"
               style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(12px)" : "translateY(-12px)",
                  transition: `opacity 380ms ease ${menuOpen ? "60ms" : "0ms"}, transform 380ms cubic-bezier(0.34,1.1,0.64,1) ${menuOpen ? "60ms" : "0ms"}`,
               }}
            >
               <Link href="/" onClick={() => setMenuOpen(false)}>
                  <img className="w-36 h-8 opacity-90" alt="Alpha" src="/header-logo.svg" />
               </Link>
               <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-white/15 text-white/40 hover:text-white hover:border-[#D28A4450] hover:bg-[#D28A440D] transition-all duration-200"
               >
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none">
                     <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
               </button>
            </div>
            <div
               className="h-px relative top-5 mx-6 shrink-0"
               style={{ background: "linear-gradient(90deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04) 60%,transparent)" }}
            />

            <nav className="flex flex-col justify-center flex-1 px-8 gap-1 overflow-y-auto">
               {navItems.map((item, i) => (
                  <div
                     key={item.label}
                     style={{
                        opacity: menuOpen ? 1 : 0,
                        transform: menuOpen ? "translateY(0)" : "translateY(32px)",
                        transition: `opacity 500ms ease ${menuOpen ? 100 + i * 70 : 0}ms, transform 500ms cubic-bezier(0.34,1.05,0.64,1) ${menuOpen ? 100 + i * 70 : 0}ms`,
                     }}
                  >
                     <button
                        type="button"
                        onClick={() => {
                           setActiveItem(item.label);
                           setMenuOpen(false);
                           const id = item.label.toLowerCase().replace(/\s+/g, "-");
                           setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 420);
                        }}
                        className="group flex items-center justify-between w-full py-4 border-b border-white/6"
                     >
                        <div className="flex items-baseline gap-4">
                           <span className="text-[15px] tabular-nums font-medium" style={{ color: activeItem === item.label ? "#D28A44" : "rgba(255,255,255,0.20)" }}>
                              {String(i + 1).padStart(2, "0")}
                           </span>
                           <span
                              className="text-[25px] font-light tracking-[-0.01em] leading-none transition-colors duration-200"
                              style={{ color: activeItem === item.label ? "#D28A44" : "rgba(255,255,255,0.85)" }}
                           >
                              {item.label}
                           </span>
                        </div>
                        <svg
                           width="16" height="16" viewBox="0 0 13 13" fill="none"
                           className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                           style={{ opacity: activeItem === item.label ? 0.7 : 0.22, color: activeItem === item.label ? "#D28A44" : "white" }}
                        >
                           <path d="M4.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </button>
                  </div>
               ))}
            </nav>

            <div
               className="flex flex-col gap-3 px-6 pt-5 pb-10 shrink-0"
               style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 450ms ease ${menuOpen ? 120 + navItems.length * 70 : 0}ms, transform 450ms cubic-bezier(0.34,1.1,0.64,1) ${menuOpen ? 120 + navItems.length * 70 : 0}ms`,
               }}
            >
               <Link href="/login" className="block" onClick={() => setMenuOpen(false)}>
                  <button type="button" className="w-full h-14 text-white text-[13px] font-medium rounded-full border border-white/20 hover:bg-[#D28A44] hover:border-[#D28A44] transition-all duration-200">
                     LOGIN
                  </button>
               </Link>
               <Link href="/signup" className="block" onClick={() => setMenuOpen(false)}>
                  <Button variant="white" className="w-full! max-w-full! uppercase py-4! text-[13px]! rounded-full!">Get Started</Button>
               </Link>
            </div>
         </div>
      </div>
   );
};
