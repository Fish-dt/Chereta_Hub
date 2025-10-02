"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DepositDialog({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/chapa/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount
        }),
      })

      const data = await res.json()

      if (data?.checkout_url) {
        window.location.href = data.checkout_url // redirect to Chapa checkout
      } else {
        console.error("Chapa Error:", data)
        alert("Failed to start payment. Try again.")
      }
      
    } catch (err) {
      console.error(err)
      alert("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>Deposit</Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit Money</DialogTitle>
        </DialogHeader>

        <Input
          type="number"
          placeholder="Enter amount (ETB)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {/* Phone removed per spec; only amount is required in form */}

        <DialogFooter>
          <Button onClick={handleDeposit} disabled={loading || !amount}>
            {loading ? "Processing..." : "Proceed to Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
