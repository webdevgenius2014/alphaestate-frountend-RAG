export const stats = [
    { value: "5K+", label: "Properties Analysed" },
    { value: "10+", label: "Districts Tracked" },
    { value: "90%", label: "AI Insight Accuracy" },
];

export const features = [
    {
        num: "01",
        title: "Deal Analyzer",
        description:
            "Evaluate property prices against real market transactions and instantly identify whether a deal is attractive, fairly priced, or overpriced.",
        image: "/feature-deal-analyzer.png",
    },
    {
        num: "02",
        title: "Market Analytics",
        description:
            "Track price trends, rental yields, ROI performance, and investment activity across Abu Dhabi's key districts..",
        image: "/feature-deal-analyzer.png",
    },
    {
        num: "03",
        title: "District Intelligence",
        description:
            "Explore district-level insights, transaction volumes, appreciation potential, and market demand indicators.",
        image: "/feature-deal-analyzer.png",
    },
    {
        num: "04",
        title: "AI Chat Intelligence",
        description:
            "Ask questions naturally and receive AI-powered answers backed by real transaction data and market intelligence.",
        image: "/feature-deal-analyzer.png",
    },
    {
        num: "05",
        title: "Smart Reports",
        description:
            "Generate professional PDF reports for districts, investment comparisons, and deal validations in seconds.",
        image: "/feature-deal-analyzer.png",
    },
    {
        num: "06",
        title: "Smart Alerts",
        description:
            "Stay informed with automated notifications for market movements, ROI changes, and investment opportunities.",
        image: "/feature-deal-analyzer.png",
    },
];

export const navLinks = [
    { num: "01", label: "Home", href: "#" },
    { num: "02", label: "About Alpha", href: "#about-alpha" },
    { num: "03", label: "How It Works", href: "#how-it-works" },
    { num: "04", label: "Features", href: "#features" },
    { num: "05", label: "Pricing", href: "#pricing" },
    { num: "06", label: "Contact", href: "#contact" },
];

export function ArrowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="15" viewBox="0 0 21 15" fill="none">
            <path d="M20.7071 8.07136C21.0976 7.68084 21.0976 7.04768 20.7071 6.65715L14.3431 0.29319C13.9526 -0.0973344 13.3195 -0.0973344 12.9289 0.29319C12.5384 0.683714 12.5384 1.31688 12.9289 1.7074L18.5858 7.36426L12.9289 13.0211C12.5384 13.4116 12.5384 14.0448 12.9289 14.4353C13.3195 14.8259 13.9526 14.8259 14.3431 14.4353L20.7071 8.07136ZM0 7.36426V8.36426H20V7.36426V6.36426H0V7.36426Z" fill="currentColor" />
        </svg>
    );
}

export const navItems = [
   {
      label: "About Alpha",
      widthClass: "w-[83px]",
      hiddenTopClass: "top-[49px]",
   },
   {
      label: "How It Works",
      widthClass: "w-[85px]",
      hiddenTopClass: "top-[50px]",
   },
   { label: "Features", widthClass: "w-[58px]", hiddenTopClass: "top-[50px]" },
   { label: "Pricing", widthClass: "w-[46px]", hiddenTopClass: "top-[46px]" },
   { label: "Contact", widthClass: "w-[54px]", hiddenTopClass: "top-11" },
];

export const steps = [
    {
        id: "step-gather",
        badge: "Step 01",
        title: "Enter Property Details",
        description: "Start your analysis by entering the key details of the property you're considering. Alpha Estate uses this information to understand the opportunity and prepare it for evaluation.",
        video: "/futuristic_real_estate_scene_hol…_202606171152.mp4",
    },
    {
        id: "step-analyse",
        badge: "Step 02",
        title: "Analyze Market Data",
        description: "Leverage official transaction records and district intelligence to compare prices, identify trends, and understand the property's market position.",
        video: "/futuristic_Abu_Dhabi_skyline_data_202606171200.mp4",
    },
    {
        id: "step-insights",
        badge: "Step 03",
        title: "Receive AI Insights",
        description: "Receive AI-driven recommendations, deal scores, and actionable insights to make smarter and more confident investment decisions.",
        video: "/ai_intelligence_core_illuminatin…_202606171206.mp4",
    },
];

export const logos = [
    "/abu-dhabi.svg",
    "/bayyut.svg",
    "/property-finder.svg",
    "/dx3.svg",
    "/datafinder.svg",
    "/abu-dhabi.svg",
    "/bayyut.svg",
    "/property-finder.svg",
    "/dx3.svg",
    "/datafinder.svg",
];

export const infos = [
    {
        label: "Phone",
        value: "+971 XX XXX XXXX",
    },
    {
        label: "Office",
        value: "Abu Dhabi, UAE",
    },
    {
        label: "Business Hours",
        value: "9:00 AM – 6:00 PM GST",
    },
];

export function SendIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
            <g clipPath="url(#clip0_1_1691)">
                <path d="M9.01865 18.1528V22.9332C9.01865 23.2672 9.23303 23.563 9.55049 23.6681C9.62985 23.6939 9.71128 23.7063 9.79167 23.7063C10.0329 23.7063 10.2658 23.5929 10.4142 23.3909L13.2105 19.5855L9.01865 18.1528Z" fill="white" />
                <path d="M24.4122 0.143359C24.1752 -0.0246455 23.8639 -0.0473209 23.6062 0.087701L0.415419 12.1984C0.141252 12.3417 -0.0205682 12.6344 0.00210725 12.9426C0.0258134 13.2518 0.230923 13.5157 0.522612 13.6157L6.96965 15.8193L20.6996 4.07961L10.0752 16.8799L20.88 20.5729C20.9604 20.5997 21.0449 20.6141 21.1294 20.6141C21.2696 20.6141 21.4088 20.576 21.5314 20.5018C21.7272 20.3822 21.8602 20.1812 21.8942 19.9555L24.7286 0.887526C24.7709 0.598929 24.6493 0.312394 24.4122 0.143359Z" fill="white" />
            </g>
            <defs>
                <clipPath id="clip0_1_1691">
                    <rect width="24.7368" height="24.7368" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

export const COLORS = [
    "18,69,141",   // brand blue
    "255,255,255", // white
    "210,138,68",  // brand amber
];
export const WEIGHTS = [0.55, 0.35, 0.10]; // blue heavy, rare amber

export const plans = [
    {
        name: "Essential",
        tagline: "Perfect for individual investors.",
        monthlyPrice: 199,
        yearlyPrice: 159,
        cta: "Get Started",
        highlight: false,
        features: [
            "AI Market Overview",
            "District Analysis Reports",
            "Basic Deal Validation",
            "Smart Alerts",
            "Limited PDF Exports",
            "30-Day Market History",
        ],
    },
    {
        name: "Professional",
        tagline: "Built for Active Investors and advisors.",
        monthlyPrice: 499,
        yearlyPrice: 399,
        cta: "Upgrade Now",
        highlight: true,
        features: [
            "Full Deal Analyzer Access",
            "AI Investment Insights",
            "Unlimited Reports",
            "AI Chat Intelligence",
            "Advanced Smart Alerts",
            "ROI & Appreciation Tracking",
            "District Comparison Reports",
            "Priority AI Processing",
        ],
    },
    {
        name: "Enterprise",
        tagline: "Designed for firms and investment teams.",
        monthlyPrice: 799,
        yearlyPrice: 639,
        cta: "Get Enterprise",
        highlight: false,
        features: [
            "Multi-User Team Access",
            "Enterprise-level Reporting",
            "API Integration",
            "Advanced Market Monitoring",
            "Custom AI Configurations",
            "Dedicated Account Manager",
            "Priority Support",
            "Unlimited Platform Access",
        ],
    },
];

export function CheckIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M9.53701 20.537C4.2764 20.537 0 16.2606 0 11C0 5.73934 4.2764 1.46289 9.53701 1.46289C11.9493 1.46289 14.2131 2.33905 15.9768 3.95576C15.3901 4.30264 14.824 4.68688 14.2795 5.10278C12.9431 4.02468 11.2815 3.4311 9.53701 3.4311C5.3679 3.4311 1.96821 6.83084 1.96821 11C1.96821 15.1691 5.3679 18.5688 9.53701 18.5688C15.338 18.5688 18.782 12.368 16.2869 7.54688C16.6651 7.19523 17.0543 6.85438 17.4538 6.52491C17.5718 6.42762 17.6907 6.33125 17.8105 6.23584C18.6452 7.67741 19.0742 9.31188 19.0742 10.9999C19.0741 16.2606 14.7977 20.537 9.53701 20.537Z" fill="#12458D" />
            <path fillRule="evenodd" clipRule="evenodd" d="M9.78756 15.9028C9.68022 15.9028 9.59075 15.8312 9.55497 15.7417C9.53711 15.706 7.99825 11.7337 5.61845 10.2306C5.15322 9.94434 4.79542 9.64014 4.93854 8.96018C5.08166 8.29814 5.52902 7.92238 6.33418 7.74343C7.76561 7.43923 9.30442 9.658 9.87704 10.5706C11.881 7.65401 15.8891 3.07331 21.7223 2.53652C22.0037 2.50353 22.1077 2.92065 21.8475 3.03753C21.7581 3.07331 13.4198 6.88463 10.038 15.7597C9.98437 15.8491 9.8949 15.9028 9.78756 15.9028Z" fill="#12458D" />
        </svg>
    );
}

export const testimonials = [
    {
        rating: 4.5,
        quote: "The AI-powered reports and market analytics saved me hours of research. Everything I need is available in one place.",
        name: "Sarah Thompson",
        role: "Property Consultant",
        avatar: "/user-1.png",
    },
    {
        rating: 4.5,
        quote: "District comparisons and appreciation insights helped me identify stronger opportunities that I would have otherwise missed.",
        name: "Michael Davis",
        role: "Private Investor",
        avatar: "/user-2.png",
    },
    {
        rating: 4.5,
        quote: "Alpha Estate combines market intelligence and AI in a way that makes complex data easy to understand and act on.",
        name: "James Anderson",
        role: "Property Advisor",
        avatar: "/user.png",
    },
    {
        rating: 4.5,
        quote: "District comparisons and appreciation insights helped me identify stronger opportunities that I would have otherwise missed.",
        name: "Michael Davis",
        role: "Private Investor",
        avatar: "/user-2.png",
    },
    {
        rating: 4.5,
        quote: "The AI-powered reports and market analytics saved me hours of research. Everything I need is available in one place.",
        name: "Sarah Thompson",
        role: "Property Consultant",
        avatar: "/user-1.png",
    },
    {
        rating: 4.5,
        quote: "District comparisons and appreciation insights helped me identify stronger opportunities that I would have otherwise missed.",
        name: "Michael Davis",
        role: "Private Investor",
        avatar: "/user-2.png",
    },
];

export const PHONE_CODES = [
    { code: "+1",   label: "+1  (US/CA)" },
    { code: "+7",   label: "+7  (RU)"    },
    { code: "+20",  label: "+20 (EG)"    },
    { code: "+27",  label: "+27 (ZA)"    },
    { code: "+33",  label: "+33 (FR)"    },
    { code: "+44",  label: "+44 (UK)"    },
    { code: "+49",  label: "+49 (DE)"    },
    { code: "+61",  label: "+61 (AU)"    },
    { code: "+65",  label: "+65 (SG)"    },
    { code: "+86",  label: "+86 (CN)"    },
    { code: "+91",  label: "+91 (IN)"    },
    { code: "+92",  label: "+92 (PK)"    },
    { code: "+966", label: "+966 (SA)"   },
    { code: "+971", label: "+971 (AE)"   },
    { code: "+974", label: "+974 (QA)"   },
    { code: "+973", label: "+973 (BH)"   },
    { code: "+968", label: "+968 (OM)"   },
    { code: "+962", label: "+962 (JO)"   },
    { code: "+90",  label: "+90 (TR)"    },
    { code: "+998", label: "+998 (UZ)"   },
];


export function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5 mb-5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = rating >= star;
                const half = !filled && rating >= star - 0.5;
                return (
                    <svg key={star} width="16" height="16" viewBox="0 0 16 16" fill="none">
                        {half ? (
                            <path d="M15.2149 5.46288C15.0912 5.08204 14.7628 4.80615 14.3672 4.74836L10.3605 4.16616L8.56853 0.538184C8.2149 -0.179395 7.041 -0.179395 6.68737 0.538184L4.89539 4.16616L0.898081 4.74836C0.5026 4.80615 0.174242 5.08301 0.0514289 5.46288C-0.0723502 5.84372 0.0314707 6.2603 0.317981 6.53829L3.21576 9.35532L2.5328 13.3422C2.46568 13.7356 2.62729 14.1343 2.95034 14.3694C3.27451 14.6032 3.70364 14.6338 4.05614 14.4481L7.62755 12.5648L11.2094 14.4481C11.3626 14.5289 11.5305 14.5688 11.6973 14.5688C11.9144 14.5688 12.1316 14.5017 12.3163 14.3695C12.6396 14.1334 12.801 13.7358 12.7339 13.3424L12.0509 9.35548L14.9487 6.53844C15.2349 6.26126 15.3387 5.8426 15.2149 5.46288Z" fill="#D28A44" />
                        ) : (
                            <path d="M15.2149 5.46288C15.0912 5.08204 14.7628 4.80615 14.3672 4.74836L10.3605 4.16599L8.56853 0.538184C8.2149 -0.179395 7.041 -0.179395 6.68737 0.538184L4.89539 4.16616L0.898086 4.74852C0.502605 4.80615 0.174242 5.08317 0.0514289 5.46305C-0.0723502 5.84389 0.0314707 6.26046 0.317981 6.53845L3.21576 9.35548L2.5328 13.3424C2.46568 13.7358 2.62729 14.1345 2.95034 14.3695C3.27452 14.6036 3.70364 14.634 4.05614 14.4482L7.62755 12.5649L11.2094 14.4482C11.3626 14.529 11.5305 14.5689 11.6973 14.5689C11.9144 14.5689 12.1316 14.5018 12.3163 14.3697C12.6396 14.1335 12.801 13.736 12.7339 13.3426L12.0509 9.35564L14.9487 6.53861C15.2349 6.26239 15.3387 5.84276 15.2149 5.46288Z" fill={filled ? "#D28A44" : "#FFFFFF22"} />
                        )}
                    </svg>
                );
            })}
        </div>
    );
}