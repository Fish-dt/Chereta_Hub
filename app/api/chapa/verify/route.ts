import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tx_ref = searchParams.get("tx_ref")

  const res = await fetch(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
    headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
  })
  const data = await res.json()

  if (data.status === "success") {
    // TODO: Update user balance in DB here
    return NextResponse.json({ status: "success", amount: data.data.amount })
  }

  return NextResponse.json({ status: "failed" }, { status: 400 })
}
