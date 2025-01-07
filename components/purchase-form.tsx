'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createPurchase, verifyPayment } from '@/app/actions'
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from 'lucide-react'
import type { StoragePlan } from '@/lib/types'
import { loadScript } from '@/utils/loadScript'
import { PolicyDialog } from './policy-dialog'

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PurchaseFormProps {
  plan: StoragePlan | null
  onClose: () => void
  onError: (error: string) => void
}

export function PurchaseForm({ plan, onClose, onError }: PurchaseFormProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedPlan, setSelectedPlan] = useState(plan?.id || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [policyDialogOpen, setPolicyDialogOpen] = useState(false)
  const { toast } = useToast()

  const plans = [
    { id: "500GB", name: "Basic Storage (500GB)", price: 1000 },
    { id: "1TB", name: "Standard Storage (1TB)", price: 2000 },
    { id: "2TB", name: "Professional Storage (2TB)", price: 3000 },
    { id: "5TB", name: "Enterprise Storage (5TB)", price: 5000 },
  ]

  const selectedPlanDetails = plans.find(p => p.id === selectedPlan)

  useEffect(() => {
    loadScript('https://checkout.razorpay.com/v1/checkout.js')
      .catch((error) => {
        console.error('Failed to load Razorpay script:', error);
        onError('Failed to load payment gateway. Please try again later.');
      });
  }, [onError]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedPlanDetails) return
    if (!agreedToTerms) {
      setError("You must agree to the terms and conditions to proceed.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result: any = await createPurchase({
        id: selectedPlanDetails.id,
        name: selectedPlanDetails.name,
        storage: selectedPlanDetails.id,
        price: selectedPlanDetails.price,
        features: []
      }, email, firstName, lastName)

      if (result.success) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: selectedPlanDetails.price * 100, // Amount in paise
          currency: "INR",
          name: "WeCloud Storage",
          description: `Purchase of ${selectedPlanDetails.name}`,
          order_id: result.orderId,
          handler: async function (response: any) {
            const verificationResult = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            )
            if (verificationResult.success) {
              setCredentials(result.credentials)
              toast({
                title: "Payment successful!",
                description: "Your account has been created.",
              })
            } else {
              const errorMessage = "Payment verification failed. Please contact support."
              setError(errorMessage)
              onError(errorMessage)
            }
          },
          prefill: {
            name: `${firstName} ${lastName}`,
            email: email,
          },
          theme: {
            color: "#3B82F6",
          },
        };

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      } else {
        const errorMessage = result.message || "Purchase failed"
        setError(errorMessage)
        onError(errorMessage)
      }
    } catch (error) {
      console.error('Purchase failed:', error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setError(errorMessage)
      onError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={!!plan || !!credentials} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {credentials ? 'Account Created' : 'Complete Your Purchase'}
            </DialogTitle>
          </DialogHeader>
          {credentials ? (
            <div className="grid gap-4">
              <Alert>
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Please save these credentials securely. You will need them to access your storage.
                </AlertDescription>
              </Alert>
              <div className="grid gap-2">
                <Label>Email (Username)</Label>
                <Input value={credentials.username} readOnly />
              </div>
              <div className="grid gap-2">
                <Label>Password</Label>
                <Input value={credentials.password} readOnly />
              </div>
              <Button onClick={onClose}>Close</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="plan">Plan</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - ₹{plan.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 mb-2 p-4 bg-gray-100 rounded-md text-sm">
                <h3 className="font-semibold mb-2">Terms and Conditions Summary:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>WeCloud Storage is not responsible for data loss if Google deletes the account.</li>
                  <li>Users are responsible for maintaining account credential confidentiality.</li>
                  <li>Full refund available within 5 days of purchase.</li>
                </ul>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <span 
                    className="text-blue-500 cursor-pointer hover:underline" 
                    onClick={() => setPolicyDialogOpen(true)}
                  >
                    terms and conditions
                  </span>
                </label>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" disabled={loading || !selectedPlan || !agreedToTerms}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${selectedPlanDetails?.price || 0}`
                )}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <PolicyDialog open={policyDialogOpen} onOpenChange={setPolicyDialogOpen} section="terms" />
    </>
  )
}

