import React from 'react'
import { Header } from './components/homeComponents/Header'
import { HeroSection } from './components/homeComponents/HeroSection'
import { LogoTicker } from './components/homeComponents/LogoTicker'
import { AboutSection } from './components/homeComponents/AboutSection'
import { HowItWorksSection } from './components/homeComponents/HowItWorksSection'
import { FeaturesSection } from './components/homeComponents/FeaturesSection'
import { TestimonialsSection } from './components/homeComponents/TestimonialsSection'
import { PricingSection } from './components/homeComponents/PricingSection'
import { ContactSection } from './components/homeComponents/ContactSection'
import { NewsletterSection } from './components/homeComponents/NewsletterSection'
import { Footer } from './components/homeComponents/Footer'
import { SmoothScroll } from './components/homeComponents/SmoothScroll'

const page = () => {
    return (
        <SmoothScroll>
            <div className='bg-[#010C1B] xl:p-7.5 pt-4 pb-0 relative'>
                <Header />
                <div id="home" className='px-4 xl:px-0'><HeroSection /></div>
                <LogoTicker />
                <div id="about-alpha"><AboutSection /></div>
                <div id="how-it-works"><HowItWorksSection /></div>
                <div id="features"><FeaturesSection /></div>
                <TestimonialsSection />
                <div className='relative'>
                    <video
                        src="/particales-bg.mp4"
                        className="w-full h-full object-cover absolute inset-0"
                        autoPlay
                        loop
                        muted
                        playsInline />
                    <div className="bg-linear-to-b from-[#010C1B] to-[#011735E5] absolute inset-0 w-full h-full" />
                    <div id="pricing"><PricingSection /></div>
                    <div id="contact"><ContactSection /></div>
                </div>
                <NewsletterSection />
                <Footer />
            </div>
        </SmoothScroll>
    )
}

export default page
