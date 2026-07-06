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

export const FILTER_LABELS = ["District", "Property Type", "Investment Signal", "Market Type"] as const;
export type FilterLabel = typeof FILTER_LABELS[number];

export type FilterState = {
    district: string;
    propertyType: string;
    investmentSignal: string;
    marketType: string;
};

export const LABEL_TO_KEY: Record<FilterLabel, keyof FilterState> = {
    "District": "district",
    "Property Type": "propertyType",
    "Investment Signal": "investmentSignal",
    "Market Type": "marketType",
};

export const FILTER_OPTIONS: Record<FilterLabel, string[]> = {
    "District": [],
    "Property Type": [
        "Apartment",
        "Villa",
        "Townhouse / Attached Villa",
        "Plot for Villa",
        "Duplex",
        "Farm",
        "Residential Complex",
        "Office",
        "Other",
    ],
    "Investment Signal": [
        "Strong Investment Opportunity",
        "High Growth Potential",
        "Stable Returns",
        "Luxury Appreciation Zone",
        "Emerging District",
        "Monitor Closely",
    ],
    "Market Type": ["Off-Plan", "Ready", "Court-Mandated"],
};

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

// ── Privacy Policy ─────────────────────────────────────────────────────────

export const PP_TOC = [
    { num: "1",  label: "Introduction" },
    { num: "2",  label: "Who We Are" },
    { num: "3",  label: "What Personal Data We Collect" },
    { num: "4",  label: "How We Use Your Personal Data" },
    { num: "5",  label: "How We Share Your Personal Data" },
    { num: "6",  label: "Cross-Border Data Transfers" },
    { num: "7",  label: "AI Processing of Your Data" },
    { num: "8",  label: "Cookies and Tracking Technologies" },
    { num: "9",  label: "Your Rights as a Data Subject" },
    { num: "10", label: "Data Security" },
    { num: "11", label: "Data Retention" },
    { num: "12", label: "Contact Us" },
    { num: "13", label: "Changes to This Policy" },
];

export const PP_DIRECT_INFO = [
    "Account information: full name, email address, phone number, password (stored in encrypted/hashed form)",
    "Profile information: country/region, city, professional role (e.g., investor, broker), short bio (optional)",
    "Payment and billing information: processed via third-party payment processors; we do not store full card numbers",
    "Deal Analyzer and ROI Calculator inputs: property prices, rental income figures, and other financial figures you choose to enter",
    "Communications: any correspondence you send us, including support requests and feedback",
];

export const PP_AUTO_INFO = [
    "Usage data: pages viewed, features used, queries made to the AI Assistant, search history within the Platform",
    "Device and technical data: IP address, browser type, device type, operating system, approximate location (derived from IP)",
    "Cookies and similar technologies, as described in Section 8",
];

export const PP_PURPOSES: [string, string][] = [
    ["Creating and managing your account", "Performance of contract"],
    ["Providing AI Assistant responses, Deal Analyzer results, and reports", "Performance of contract"],
    ["Processing subscription payments", "Performance of contract"],
    ["Sending service notifications (e.g., security alerts, billing)", "Performance of contract / Legitimate purpose"],
    ["Sending marketing communications (where you have opted in)", "Consent"],
    ["Improving the Platform and AI Assistant performance", "Legitimate purpose"],
    ["Detecting fraud, abuse, or security incidents", "Legitimate purpose / Legal obligation"],
    ["Complying with legal or regulatory obligations", "Legal obligation"],
];

export const PP_SHARING = [
    "Service providers who process data on our behalf (e.g., cloud hosting providers, payment processors, email delivery services), under contractual data protection obligations consistent with the PDPL",
    "The AI/LLM provider used to power the AI Assistant, to the extent necessary to generate responses to your queries (see Section 7)",
    "Legal or regulatory authorities, where required by UAE law or a valid legal process",
    "A successor entity in the event of a merger, acquisition, or sale of assets, subject to equivalent privacy protections",
];

export const PP_CROSS_BORDER = [
    "A determination by the UAE Data Office that the destination country provides an adequate level of data protection; or",
    "Appropriate contractual safeguards with the receiving party; or",
    "Your explicit consent to the specific transfer, after being informed of the relevant risks, where neither of the above applies",
];

export const PP_RIGHTS = [
    "Right to access the personal data we hold about you",
    "Right to request correction of inaccurate or incomplete personal data",
    "Right to request erasure of your personal data, subject to applicable legal retention requirements",
    "Right to restrict or object to certain processing of your personal data",
    "Right to data portability, where technically feasible",
    "Right to withdraw consent at any time, where processing is based on consent (e.g., marketing communications)",
    "Right to lodge a complaint with the UAE Data Office if you believe your rights have been violated",
];

// ── Terms of Service ────────────────────────────────────────────────────────

export const TOS_TOC = [
    { num: "1",  label: "Introduction and Acceptance" },
    { num: "2",  label: "Description of Service" },
    { num: "3",  label: "Eligibility and Account Registration" },
    { num: "4",  label: "Subscription Plans and Payment" },
    { num: "5",  label: "Acceptable Use" },
    { num: "6",  label: "Disclaimers Regarding Data and AI Output" },
    { num: "7",  label: "Limitation of Liability" },
    { num: "8",  label: "Intellectual Property" },
    { num: "9",  label: "Reports and Exported Content" },
    { num: "10", label: "Termination" },
    { num: "11", label: "Governing Law and Dispute Resolution" },
    { num: "12", label: "Changes to These Terms" },
    { num: "13", label: "Contact" },
];

export const TOS_PLATFORM_FEATURES = [
    "Analysis of historical and, where available, live property transaction data sourced from the Abu Dhabi Real Estate Centre (ADREC)",
    "An AI-powered conversational interface (\"AI Assistant\") for querying market data in Arabic and English",
    "Financial calculation tools, including return-on-investment (ROI), rental yield, and price comparison estimates",
    "A Deal Analyzer tool comparing user-submitted property details against historical transaction data",
    "Market intelligence reports, alerts, and related analytical features",
];

export const TOS_SUBSCRIPTION_ITEMS = [
    "Access to certain features of the Platform requires a paid subscription. Subscription tiers, pricing, and included features are described on the Platform and may be updated from time to time.",
    "Subscriptions renew automatically at the end of each billing cycle (monthly or annually, as selected) unless cancelled prior to renewal.",
    "All fees are stated in AED and are exclusive of applicable VAT unless stated otherwise.",
    "Except as required by law or expressly stated in our refund policy, subscription fees are non-refundable.",
    "We reserve the right to change subscription pricing with reasonable prior notice to existing subscribers.",
    "Payments are processed through third-party payment processors. We do not store full payment card details on our servers.",
];

export const TOS_ACCEPTABLE_USE = [
    "Use the Platform for any unlawful purpose or in violation of any applicable UAE federal or local law",
    "Attempt to scrape, copy, reverse-engineer, or systematically extract data from the Platform for resale or competing commercial use",
    "Use automated means (bots, scrapers) to access the Platform without our prior written consent",
    "Misrepresent your identity or impersonate any person or entity",
    "Share your account credentials with third parties or allow access to the Platform by individuals not party to your subscription",
    "Use the AI Assistant or any Platform output as the sole basis for a real estate transaction without independent verification",
    "Interfere with or disrupt the integrity or performance of the Platform",
];

export const TOS_DISCLAIMERS: { bold: string; text: string }[] = [
    {
        bold: "Data Source.",
        text: "Historical transaction data displayed on the Platform is derived from records made available by or sourced in connection with the Abu Dhabi Real Estate Centre (ADREC). We process this data (including cleansing, filtering, and normalization) before presenting it. While we take reasonable steps to maintain accuracy, we do not guarantee that all figures precisely match official ADREC records at all times, and figures may be subject to revision.",
    },
    {
        bold: "No Investment, Financial, or Legal Advice.",
        text: "All content on the Platform — including AI Assistant responses, ROI and yield calculations, Deal Analyzer scores, market signals, and reports — is provided for general informational purposes only. Nothing on the Platform constitutes investment advice, financial advice, legal advice, or a recommendation to buy, sell, or hold any property or enter into any transaction.",
    },
    {
        bold: "AI-Generated Content.",
        text: "The AI Assistant uses automated systems, including large language models, to generate responses based on the Platform's underlying dataset. While we implement safeguards to reduce inaccurate or fabricated outputs, AI-generated content may contain errors, omissions, or outdated information. You should independently verify any information before relying on it for financial or legal decisions.",
    },
    {
        bold: "User-Provided Inputs.",
        text: "Where calculations (such as ROI or rental yield) rely on figures you provide (e.g., purchase price, expected rent, service charges), the accuracy of the output depends entirely on the accuracy of your inputs. Where you do not provide inputs, the Platform may use general market estimates, which are approximate and may not reflect your specific property or transaction.",
    },
    {
        bold: "No Brokerage Relationship.",
        text: "Use of the Platform does not create a brokerage, agency, fiduciary, or advisory relationship between you and Estate Alpha.",
    },
];

export const TOC = [
    { num: "1",  label: "Introduction and Acceptance" },
    { num: "2",  label: "Description of Service" },
    { num: "3",  label: "Eligibility and Account Registration" },
    { num: "4",  label: "Subscription Plans and Payment" },
    { num: "5",  label: "Acceptable Use" },
    { num: "6",  label: "Disclaimers Regarding Data and AI Output" },
    { num: "7",  label: "Limitation of Liability" },
    { num: "8",  label: "Intellectual Property" },
    { num: "9",  label: "Reports and Exported Content" },
    { num: "10", label: "Termination" },
    { num: "11", label: "Governing Law and Dispute Resolution" },
    { num: "12", label: "Changes to These Terms" },
    { num: "13", label: "Contact" },
];