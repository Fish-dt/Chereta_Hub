import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export const runtime = "nodejs"

// Chapa sends GET with query params: trx_ref, ref_id, status
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tx_ref = searchParams.get("trx_ref") || searchParams.get("tx_ref")
    const status = searchParams.get("status")

    if (!tx_ref) {
      return NextResponse.json({ status: "failed", message: "Missing tx_ref" }, { status: 400 })
    }

    // Always verify with Chapa for authenticity
    const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}` , {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
    })
    const verifyData = await verifyRes.json()

    const { db } = await connectToDatabase()

    if (verifyData.status === "success") {
      const amount = Number(verifyData.data.amount)

      const payment = await db.collection("payments").findOne({ tx_ref })
      if (!payment) {
        // create a record if it doesn't exist (fallback)
        await db.collection("payments").insertOne({
          tx_ref,
          userId: verifyData.data.email,
          amount,
          currency: verifyData.data.currency || "ETB",
          status: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }

      const updateResult = await db.collection("payments").updateOne(
        { tx_ref, status: { $ne: "completed" } },
        { $set: { status: "completed", amount, updatedAt: new Date() } }
      )

      if (updateResult.modifiedCount > 0) {
        await db.collection("users").updateOne(
          { email: payment?.userId || verifyData.data.email },
          { $inc: { balance: amount } }
        )
      }

      return NextResponse.json({ status: "success", amount })
    }

    return NextResponse.json({ status: status || "failed" }, { status: 400 })
  } catch (error) {
    console.error("Chapa callback error", error)
    return NextResponse.json({ status: "failed" }, { status: 500 })
  }
}


