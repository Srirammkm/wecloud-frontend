'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Cloud, Shield, Clock } from 'lucide-react'
import { PurchaseForm } from '@/components/purchase-form'
import type { StoragePlan } from '@/lib/types'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PolicyDialog } from '@/components/policy-dialog'

const plans: StoragePlan[] = [
  {
    id: "500GB",
    name: "Basic Storage",
    storage: "500GB",
    price: 1000,
    features: [
      "Lifetime access",
      "Google Cloud Storage",
      "24/7 Support",
      "Secure encryption",
      "3 years free maintenance",
    ]
  },
  {
    id: "1TB",
    name: "Standard Storage",
    storage: "1TB",
    price: 2000,
    features: [
      "Lifetime access",
      "Google Cloud Storage",
      "24/7 Support",
      "Secure encryption",
      "3 years free maintenance",
      "Priority support",
    ]
  },
  {
    id: "2TB",
    name: "Professional Storage",
    storage: "2TB",
    price: 3000,
    features: [
      "Lifetime access",
      "Google Cloud Storage",
      "24/7 Support",
      "Secure encryption",
      "3 years free maintenance",
      "Priority support",
      "Advanced sharing features",
    ]
  },
  {
    id: "5TB",
    name: "Enterprise Storage",
    storage: "5TB",
    price: 5000,
    features: [
      "Lifetime access",
      "Google Cloud Storage",
      "24/7 Support",
      "Secure encryption",
      "3 years free maintenance",
      "Priority support",
      "Advanced sharing features",
      "Custom solutions"
    ]
  }
]

function FeatureItem({ feature }: { feature: string }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="w-5 h-5 text-green-400" />
      <span className="text-slate-100">{feature}</span>
    </li>
  )
}

function PlanCard({ plan, onSelect }: { plan: StoragePlan; onSelect: (plan: StoragePlan) => void }) {
  return (
    <Card key={plan.id} className="bg-white/10 border-slate-400/30 text-white backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{plan.storage}</CardTitle>
        <CardDescription className="text-slate-200">{plan.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-6">₹{plan.price}</div>
        <Button 
          className="w-full mt-4" 
          size="lg"
          aria-label={`Buy ${plan.name} Plan`}
          onClick={() => onSelect(plan)}
        >
          Buy
        </Button>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<StoragePlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false)
  const [policySection, setPolicySection] = useState<'all' | 'policies' | 'terms' | 'privacy' | 'contact' | 'refund'>('all')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-700">
      <header className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-white mb-4">WE CLOUD STORAGE</h1>
          <p className="text-xl text-center text-slate-200">Lifetime Cloud Storage Solutions</p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[{
              Icon: Cloud,
              title: "Lifetime Access",
              description: "One-time payment for lifetime access to your storage space"
            }, {
              Icon: Shield,
              title: "Secure Storage",
              description: "Your data is encrypted and stored securely on Google Cloud"
            }, {
              Icon: Clock,
              title: "Minimal Maintenance",
              description: "Only ₹100/year maintenance fee after 3 years"
            }].map(({ Icon, title, description }, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
                <Icon className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-200 text-center">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Features</h2>
          <ul className="space-y-4 text-slate-100 max-w-2xl mx-auto">
            {[
              "✅ Lifetime access",
              "✅ Google Cloud Storage",
              "✅ 24/7 Support",
              "✅ Secure encryption",
              "✅ Advanced sharing features",
              "✅ 3 years free maintenance"
            ].map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Choose Your Storage Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onSelect={setSelectedPlan} />
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-8">How It Works</h2>
          <ol className="list-decimal list-inside space-y-4 text-slate-100 max-w-2xl mx-auto">
            {[
              "Choose the plan that fits your needs.",
              "Complete the payment process securely through Razorpay.",
              "Receive your user email and password. (Make sure to save these credentials!)",
              "Download Google Photos, Drive, or Gmail and log in with your new credentials.",
              "Reset your password for added security.",
              "Start using your lifetime cloud storage!"
            ].map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
          <p className="text-slate-200 text-center mt-6">
            If you lose your password, please contact our support team for assistance.
          </p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-slate-200">Contact our support team at:</p>
          <a 
            href="mailto:support@wecloudstorage.in" 
            className="text-slate-300 hover:text-slate-100 transition-colors"
            aria-label="Email support at support@wecloudstorage.in"
          >
            support@wecloudstorage.in
          </a>
        </section>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <section className="mt-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Policies and Information</h2>
        <div className="flex justify-center space-x-4 text-blue-300">
          {[
            { title: 'Policies', section: 'policies' },
            { title: 'Terms and Conditions', section: 'terms' },
            { title: 'Privacy Policy', section: 'privacy' },
            { title: 'Contact Information', section: 'contact' },
            { title: 'Refund Policy', section: 'refund' },
          ].map(({ title, section }) => (
            <a
              key={section}
              href="#"
              className="hover:text-blue-100 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                setPolicySection(section as any)
                setPolicyDialogOpen(true)
              }}
            >
              {title}
            </a>
          ))}
        </div>
        </section>
      </main>

      <PurchaseForm
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onError={(errorMessage) => setError(errorMessage)}
      />
      <PolicyDialog
        open={policyDialogOpen}
        onOpenChange={setPolicyDialogOpen}
        section={policySection}
      />
    </div>
  )
}
