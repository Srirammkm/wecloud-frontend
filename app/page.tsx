'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Cloud, Shield, Clock } from 'lucide-react'
import { PurchaseForm } from '@/components/purchase-form'
import type { StoragePlan } from '@/lib/types'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState<StoragePlan | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700">
      <header className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-white mb-4">WE CLOUD STORAGE</h1>
          <p className="text-xl text-center text-blue-200">Lifetime Cloud Storage Solutions</p>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Cloud className="w-12 h-12 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Lifetime Access</h3>
              <p className="text-blue-200 text-center">One-time payment for lifetime access to your storage space</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Shield className="w-12 h-12 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Secure Storage</h3>
              <p className="text-blue-200 text-center">Your data is encrypted and stored securely on Google Cloud</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white/10 rounded-lg backdrop-blur-sm">
              <Clock className="w-12 h-12 text-blue-300 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Minimal Maintenance</h3>
              <p className="text-blue-200 text-center">Only ₹100/year maintenance fee after 3 years</p>
            </div>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Choose Your Storage Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className="bg-white/10 border-blue-400/30 text-white backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.storage}</CardTitle>
                  <CardDescription className="text-blue-200">{plan.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-6">₹{plan.price}</div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-blue-100">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <Button 
                  className="w-full mt-4" 
                  size="lg"
                  onClick={() => setSelectedPlan(plan)}
                >
                  Select Plan
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-white mb-8">How It Works</h2>
          <ol className="list-decimal list-inside space-y-4 text-blue-100 max-w-2xl mx-auto">
            <li>Choose the plan that fits your needs.</li>
            <li>Complete the payment process securely through Razorpay.</li>
            <li>Receive your user email and password. (Make sure to save these credentials!)</li>
            <li>Download Google Photos, Drive, or Gmail and log in with your new credentials.</li>
            <li>Reset your password for added security.</li>
            <li>Start using your lifetime cloud storage!</li>
          </ol>
          <p className="text-blue-200 text-center mt-6">
            If you lose your password, please contact our support team for assistance.
          </p>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-blue-200">Contact our support team at:</p>
          <a href="mailto:support@wecloudstorage.in" className="text-blue-300 hover:text-blue-100 transition-colors">
            support@wecloudstorage.in
          </a>
        </section>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </main>

      <PurchaseForm
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onError={(errorMessage) => setError(errorMessage)}
      />
    </div>
  )
}

