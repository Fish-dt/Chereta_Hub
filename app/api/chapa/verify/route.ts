import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tx_ref = searchParams.get("tx_ref")

  if (!tx_ref) {
    return NextResponse.json({ status: "failed", message: "Missing tx_ref" }, { status: 400 })
  }

  const { db } = await connectToDatabase()

  // Fetch the payment
  const payment = await db.collection("payments").findOne({ tx_ref })
  if (!payment) {
    return NextResponse.json({ status: "failed", message: "Payment not found" }, { status: 404 })
  }

  const res = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
    headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
  })
  const data = await res.json()

  if (data.status === "success") {
    const amount = data.data.amount

    // Update payment status
    await db.collection("payments").updateOne(
      { tx_ref },
      {
        $set: {
          status: "completed",
          amount,
          updatedAt: new Date(),
        },
      }
    )

    // Update user balance
    await db.collection("users").updateOne(
      { email: payment.userId },
      { $inc: { balance: amount } }
    )

    return NextResponse.json({ status: "success", amount })
  }

  return NextResponse.json({ status: "failed" }, { status: 400 })
}
