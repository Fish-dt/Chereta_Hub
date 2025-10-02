import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { getAuthOptions } from "@/lib/auth-config"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(await getAuthOptions())
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { amount } = await req.json()
    if (!amount || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const tx_ref = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const origin = new URL(req.url).origin
    const payload = {
      amount: String(amount),
      currency: "ETB",
      email: session.user.email,
      first_name: session.user.name?.split(" ")[0] || "User",
      last_name: session.user.name?.split(" ")[1] || "Unknown",
      // Use account email from session per spec
      tx_ref,
      callback_url: `${origin}/api/chapa/callback`,
      return_url: `${origin}/profile?deposit=success&tx_ref=${tx_ref}`,
      "customization[title]": "Deposit Balance",
      "customization[description]": "Add funds to your account",
      "meta[hide_receipt]": "true",
    };
    

    // Call Chapa API directly
    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    const data: any = await response.json();

    if (typeof data !== "object" || data === null || data.status !== "success" || !data.data?.checkout_url) {
      console.error("Chapa Error:", data);
      return NextResponse.json({ error: "Failed to start payment" }, { status: 500 });
    }

    // Save transaction in MongoDB
    const { connectToDatabase } = await import("@/lib/mongodb")
    const { db } = await connectToDatabase()
    await db.collection("payments").insertOne({
      userId: session.user.email,
      tx_ref,
      amount: Number(amount),
      currency: "ETB",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ checkout_url: data.data.checkout_url })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
