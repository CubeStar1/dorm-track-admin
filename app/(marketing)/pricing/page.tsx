import { PricingSection } from "@/components/landing/pricing-section"

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"]

export const TIERS = [
  {
    id: "starter",
    name: "STARTER",
    price: {
      monthly: 1250,
      yearly: 15000,
    },
    description: "Perfect for small colleges and pilot launches",
    features: [
      "Up to 500 users",
      "Basic room management",
      "Complaint tracking",
      "Mess feedback system",
      "Email support",
      "Basic reports & analytics",
      "Event announcements",
      "Student directory"
    ],
    cta: "Get started",
  },
  {
    id: "standard",
    name: "STANDARD",
    price: {
      monthly: 2084,
      yearly: 25000,
    },
    description: "Great for medium sized colleges",
    features: [
      "500-1500 users",
      "Advanced room allocation",
      "Priority maintenance tracking",
      "Event management",
      "Priority support",
      "Detailed analytics",
      "Room swap requests",
      "Attendance tracking"
    ],
    cta: "Get started",
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: {
      monthly: 3334,
      yearly: 40000,
    },
    description: "Perfect for large institutions",
    features: [
      "1500-3000 users",
      "Advanced room planning",
      "Maintenance scheduling",
      "Dedicated support",
      "Inventory management",
      "Staff management",
      "Visitor management",
      "Advanced reporting"
    ],
    cta: "Get started",
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    price: {
      monthly: 5000,
      yearly: 60000,
    },
    description: "For multi-campus institutions",
    features: [
      "3000+ users (up to 8000)",
      "Multi-campus management",
      "Multiple mess management",
      "24/7 premium support",
      "Multiple wardens",
      "Cross-campus reporting",
      "Custom onboarding",
      "Dedicated support team"
    ],
    cta: "Contact Sales",
    highlighted: true,
  },
]

export default function PricingPage() {
  return (
    <div className="relative flex justify-center items-center w-full mt-20">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>
      <PricingSection
        title="Simple, Transparent Pricing"
        subtitle="Choose the perfect plan for your institution's size and needs. All prices are in INR per year."
        frequencies={PAYMENT_FREQUENCIES}
        tiers={TIERS}
      />
    </div>
  )
}
