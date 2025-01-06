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
  const existingUser = await db.collection('users').findOne({ email: convertedEmail })
  if (existingUser) {
    return { success: false, message: 'Email already registered' }
  }

  const password = generateSecurePassword();
  const orderId = `ORDER_${randomBytes(8).toString('hex')}`

  const user: User = {
    id: randomBytes(16).toString('hex'),
    email: convertedEmail,
    firstName,
    lastName,
    plan: plan.id,
    purchaseDate: new Date(),
    nextMaintenanceDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000), // 3 years from now
    credentials: {
      username: convertedEmail,
      password: password
    },
    paymentStatus: 'pending'
  }

  try {
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.price * 100, // Amount in paise
      currency: 'INR',
      receipt: orderId,
    })

    // Save user to database
    await db.collection('users').insertOne(user)

    // Save payment details
    const paymentDetails: PaymentDetails = {
      orderId,
      amount: plan.price,
      status: 'pending',
      email: convertedEmail,
      planId: plan.id,
      razorpayOrderId: order.id,
    }
    await db.collection('payments').insertOne(paymentDetails)

    return { 
      success: true,
      message: 'Order created successfully',
      orderId: order.id,
      credentials: {
        username: convertedEmail,
        password: password // Return the non-hashed password to the client
      }
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
    await db.collection('payments').updateOne(
      { razorpayOrderId: orderId },
      { 
        $set: { 
          status: 'completed',
          razorpayPaymentId,
          razorpaySignature
        } 
      }
    )

    const user = await db.collection('users').findOne({ email: payment.email })
    if (user) {
      // Create Google user
      await createGoogleUser(user.firstName, user.lastName, user.email, user.credentials.password, user.plan)

      await db.collection('users').updateOne(
        { _id: user._id },
        { $set: { paymentStatus: 'completed' } }
      )
    }

    return { success: true, status: 'completed' }
  } else {
    // Payment verification failed
    await db.collection('payments').updateOne(
      { razorpayOrderId: orderId },
      { $set: { status: 'failed' } }
    )

    await db.collection('users').updateOne(
      { email: payment.email },
      { $set: { paymentStatus: 'failed' } }
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

