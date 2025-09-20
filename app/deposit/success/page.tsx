"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function DepositSuccess() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("Verifying...")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const tx_ref = searchParams.get("tx_ref")
    if (!tx_ref) {
      setStatus("❌ Missing transaction reference.")
      setLoading(false)
      return
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/chapa/verify?tx_ref=${tx_ref}`)
        const data = await res.json()

        if (data.status === "success") {
          setStatus("✅ Payment Successful! Your balance will update shortly.")
          setLoading(false)

          // Optional: redirect back to profile after 5 seconds
          setTimeout(() => {
            window.location.href = "/profile"
          }, 5000)
        } else if (data.status === "failed") {
          setStatus("❌ Payment Failed or Pending.")
          setLoading(false)
        } else {
          setStatus("⌛ Payment verification in progress...")
          setLoading(false)
        }
      } catch (err) {
        console.error("Verification error:", err)
        setStatus("⚠️ Something went wrong while verifying payment.")
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="p-6 text-center text-lg">
      {loading ? "⏳ Verifying your payment..." : status}
    </div>
  )
}
