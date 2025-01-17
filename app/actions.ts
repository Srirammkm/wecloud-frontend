'use server'

import { redirect } from 'next/navigation'
import clientPromise from '@/lib/db'
import { StoragePlan, User, PaymentDetails } from '@/lib/types'
import { randomBytes } from 'crypto'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createGoogleUser, convertEmail } from '@/lib/googleApi'
import bcrypt from 'bcrypt'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!
})

function generateSecurePassword() {
  return randomBytes(12).toString('hex');
}

export async function createPurchase(plan: StoragePlan, email: string, firstName: string, lastName: string) {
  const client = await clientPromise
  const db = client.db("wecloud")

  const convertedEmail = convertEmail(email);

  // Check if user already exists
  const existingUser = await db.collection('users').findOne({ email: convertedEmail }, { projection: { _id: 1 } })
  if (existingUser) {
    return { success: false, message: 'Email already registered' }
  }

  const orderId = `ORDER_${randomBytes(8).toString('hex')}`

  try {
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.price * 100, // Amount in paise
      currency: 'INR',
      receipt: orderId,
    })

    // Save payment details
    const paymentDetails: PaymentDetails = {
      orderId,
      amount: plan.price,
      status: 'pending',
      email: convertedEmail,
      planId: plan.id,
      razorpayOrderId: order.id,
      firstName,
      lastName,
    }
    await db.collection('payments').insertOne(paymentDetails)

    return { 
      success: true,
      message: 'Order created successfully',
      orderId: order.id,
    }
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}

export async function verifyPayment(orderId: string, razorpayPaymentId: string, razorpaySignature: string) {
  const client = await clientPromise
  const db = client.db("wecloud")

  const payment = await db.collection('payments').findOne({ razorpayOrderId: orderId })
  if (!payment) {
    throw new Error('Payment not found')
  }

  // Verify the payment signature
  const secret = process.env.RAZORPAY_KEY_SECRET!
  const body = orderId + "|" + razorpayPaymentId
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpaySignature) {
    // Payment is successful
    const password = generateSecurePassword();

    const user: User = {
      id: randomBytes(16).toString('hex'),
      email: payment.email,
      firstName: payment.firstName,
      lastName: payment.lastName,
      plan: payment.planId,
      purchaseDate: new Date(),
      nextMaintenanceDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000), // 3 years from now
      credentials: {
        username: payment.email,
        password: password
      },
      paymentStatus: 'completed'
    }

    // Use a transaction to ensure atomicity
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await db.collection('payments').updateOne(
          { razorpayOrderId: orderId },
          { 
            $set: { 
              status: 'completed',
              razorpayPaymentId,
              razorpaySignature
            } 
          },
          { session }
        )

        await db.collection('users').insertOne(user, { session })
      });

      // Create Google user (this is outside the transaction as it's an external operation)
      await createGoogleUser(user.firstName, user.lastName, user.email, password, user.plan)

      return { 
        success: true, 
        status: 'completed',
        credentials: {
          username: user.email,
          password: password // Return the non-hashed password to the client
        }
      }
    } finally {
      await session.endSession();
    }
  } else {
    // Payment verification failed
    await db.collection('payments').updateOne(
      { razorpayOrderId: orderId },
      { $set: { status: 'failed' } }
    )

    throw new Error('Payment verification failed')
  }
}

export async function getUserInfo(email: string) {
  const client = await clientPromise
  const db = client.db("wecloud")

  const user = await db.collection("users").findOne({ email })
  if (!user) {
    throw new Error("User not found")
  }

  return { email: user.email, password: user.credentials.password }
}

