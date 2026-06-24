"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "../ui/button";
import { navItems } from "@/app/constant";

export const Header = (): React.JSX.Element => {
   const [activeItem, setActiveItem] = useState<string>("");
   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 25);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
   }, []);

   return (
      <div className="relative flex justify-center items-center">
         <header className={`${scrolled ? "fixed top-0" : "absolute top-7.75"} z-50 left-1/2 -translate-x-1/2 ${scrolled ? "w-[calc(100%-60px)]" : "w-full"} max-w-329.75 h-20.75 flex bg-[#0b1f3a66] rounded-[70px] backdrop-blur-[7px] backdrop-brightness-100 [-webkit-backdrop-filter:blur(7px)_brightness(100%)] transition-all ease-linear`}>
            <div className="mt-5.5 ml-5 inline-flex relative w-319.75 h-10 items-center gap-47.75">
               {/* Logo */}
               <Link href="/" aria-label="Alpha home" className="relative block">
                  <img
                     className="relative w-46 h-9.5 aspect-[4.85]"
                     alt="Alpha"
                     src="/header-logo.svg"
                  />
               </Link>

               {/* Navigation */}
               <nav
                  aria-label="Primary navigation"
                  className="gap-11.25 flex-[0_0_auto] inline-flex relative items-center"
               >
                  {navItems.map((item) => {
                     const id = item.label.toLowerCase().replace(/\s+/g, "-");
                     const isActive = activeItem === item.label;

                     return (
                        <button
                           key={item.label}
                           type="button"
                           className="group relative overflow-hidden h-5 max-w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d28a44] rounded-sm"
                           onClick={() => {
                              setActiveItem(item.label);
                              document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                           }}
                        >
                           <div className="transition-transform duration-300 will-change-transform ease-[cubic-bezier(0.34,1.15,0.64,1)] group-hover:-translate-y-5 translate-y-0">
                              <div className="h-5 flex items-center text-white text-[13px] font-light whitespace-nowrap">
                                 {item.label}
                              </div>
                              <div className="h-5 flex items-center text-[#d28a44] text-[13px] font-light whitespace-nowrap underline">
                                 {item.label}
                              </div>
                           </div>
                        </button>
                     );
                  })}
               </nav>        
   
                {/* Action Buttons */}
               <div className="relative flex justify-end gap-2">
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
         </header >
      </div >
   );
};