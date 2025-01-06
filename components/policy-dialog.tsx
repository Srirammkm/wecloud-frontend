import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section?: 'all' | 'policies' | 'terms' | 'privacy' | 'contact' | 'refund';
}

export function PolicyDialog({ open, onOpenChange, section = 'all' }: PolicyDialogProps) {
  const policies = (
    <>
      <h2 className="text-lg font-semibold mb-2">Policies</h2>
      <p className="mb-4">
        WeCloud Storage is committed to providing secure, reliable, and efficient cloud storage solutions. We adhere to industry-standard security practices and data protection regulations to ensure the safety and privacy of your data.
      </p>
    </>
  )

  const terms = (
    <>
      <h2 className="text-lg font-semibold mb-2">Terms and Conditions</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>WeCloud Storage is not responsible for any loss of data or account access in the event that Google deletes the associated account.</li>
        <li>Users are responsible for maintaining the confidentiality of their account credentials.</li>
        <li>WeCloud Storage reserves the right to terminate accounts that violate our terms of service or engage in illegal activities.</li>
        <li>We may update our services, policies, and terms from time to time. Users will be notified of any significant changes.</li>
      </ul>
    </>
  )

  const privacy = (
    <>
      <h2 className="text-lg font-semibold mb-2">Privacy Policy</h2>
      <p className="mb-4">
        We collect and process personal data only as necessary to provide our services. We do not sell or share your personal information with third parties except as required by law or to provide our services.
      </p>
    </>
  )

  const contact = (
    <>
      <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
      <p className="mb-4">
        For any inquiries or support, please contact us at:
        <br />Email: support@wecloudstorage.in
        <br />Phone: +91 7010561869
      </p>

      <h2 className="text-lg font-semibold mb-2">Operational Address</h2>
      <p className="mb-4">
        WeCloud Storage Pvt. Ltd.
        <br />123 Tech Park, Cyber City
        <br />Bangalore, Karnataka 560100
        <br />India
      </p>
    </>
  )

  const refund = (
    <>
      <h2 className="text-lg font-semibold mb-2">Refund and Cancellation Policy</h2>
      <ul className="list-disc pl-5 mb-4">
        <li>Customers are eligible for a full refund within 5 days from the date of purchase.</li>
        <li>To request a refund or cancellation, contact our support team at support@wecloudstorage.in.</li>
        <li>Refunds will be processed using the original payment method within 7-10 business days.</li>
        <li>After the 5-day period, no refunds will be issued as the service provides lifetime access.</li>
        <li>We reserve the right to refuse refunds in cases of suspected fraud or abuse of the refund policy.</li>
      </ul>
    </>
  )

  const content = {
    all: [policies, terms, privacy, contact, refund],
    policies: [policies],
    terms: [terms],
    privacy: [privacy],
    contact: [contact],
    refund: [refund]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Policies and Terms</DialogTitle>
          <DialogDescription>
            Please read our policies and terms carefully
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          {content[section]}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
