import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export const runtime = "nodejs"

async function verifyAndUpsert(tx_ref: string, reportedStatus?: string) {
  const secret = process.env.CHAPA_SECRET_KEY
  let verifyData: any = null

  if (secret) {
    try {
      const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}` , {
        headers: { Authorization: `Bearer ${secret}` },
      })
      if (verifyRes.ok) {
        verifyData = await verifyRes.json()
      } else {
        console.error("Chapa verify HTTP error", verifyRes.status)
      }
    } catch (e) {
      console.error("Chapa verify request failed", e)
    }
  } else {
    console.error("CHAPA_SECRET_KEY is not set")
  }

  const { db } = await connectToDatabase()

  if (verifyData?.status === "success") {
    const amount = Number(verifyData.data?.amount)

    const payment = await db.collection("payments").findOne({ tx_ref })
    if (!payment) {
      await db.collection("payments").insertOne({
        tx_ref,
        userId: verifyData.data?.email,
        amount,
        currency: verifyData.data?.currency || "ETB",
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
        { email: payment?.userId || verifyData.data?.email },
        { $inc: { balance: amount } }
      )
    }

    return { status: "success", amount }
  }

  await db.collection("payments").updateOne(
    { tx_ref },
    { $set: { status: reportedStatus || "failed", updatedAt: new Date() } },
    { upsert: true }
  )

  return { status: reportedStatus || "failed" }
}

// Chapa sends GET with query params: trx_ref, ref_id, status
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tx_ref = searchParams.get("trx_ref") || searchParams.get("tx_ref")
    const status = searchParams.get("status")

    if (!tx_ref) {
      // Always return 200 to Chapa to avoid repeated retries or visible 500 pages
      return NextResponse.json({ status: "failed", message: "Missing tx_ref" }, { status: 200 })
    }
    const result = await verifyAndUpsert(tx_ref, status || undefined)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Chapa callback error", error)
    // Never bubble errors to Chapa; respond 200 to prevent user-facing 500
    return NextResponse.json({ status: "failed" }, { status: 200 })
  }
}

// Some integrations/webhooks may use POST
export async function POST(req: Request) {
  try {
    let tx_ref: string | null = null
    let status: string | null = null

    const contentType = req.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({} as any))
      tx_ref = body?.trx_ref || body?.tx_ref || null
      status = body?.status || null
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const bodyText = await req.text()
      const params = new URLSearchParams(bodyText)
      tx_ref = params.get("trx_ref") || params.get("tx_ref")
      status = params.get("status")
    } else {
      const { searchParams } = new URL(req.url)
      tx_ref = searchParams.get("trx_ref") || searchParams.get("tx_ref")
      status = searchParams.get("status")
    }

    if (!tx_ref) {
      return NextResponse.json({ status: "failed", message: "Missing tx_ref" }, { status: 200 })
    }

    const result = await verifyAndUpsert(tx_ref, status || undefined)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Chapa callback POST error", error)
    return NextResponse.json({ status: "failed" }, { status: 200 })
  }
}


