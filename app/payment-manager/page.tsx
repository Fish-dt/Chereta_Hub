"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, RefreshCw, AlertCircle, CreditCard, CheckCircle, XCircle } from "lucide-react"

type PaymentStats = {
  totalPayments: number
  totalAmount: number
  pendingPayments: number
  completedPayments: number
  failedPayments: number
  pendingAmount: number
  completedAmount: number
  failedAmount: number
  refundsIssued: number
  refundsPending: number
  refundsAmount: number
  pendingRefundsAmount: number
}

type Transaction = {
  _id: string
  user: string
  amount: number
  method: string
  status: string
  createdAt: string
}

export default function PaymentManagerDashboard() {
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [refunds, setRefunds] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/payment-manager", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load payment data")
        const data = await res.json()
        setStats(data.stats)
        setTransactions(data.transactions || [])
        // For now, we'll use the same transactions for refunds until we have separate refund data
        setRefunds(data.transactions?.filter((t: Transaction) => t.status === "refunded") || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Payment Manager Dashboard</h1>
      <p className="text-gray-600">Manage payment gateways, refunds, chargebacks, and financial reconciliations</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">Total Payments</p>
              <p className="text-2xl font-bold">${stats?.totalAmount?.toLocaleString() || 0}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold">${stats?.pendingAmount?.toLocaleString() || 0}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-yellow-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">Refunds Issued</p>
              <p className="text-2xl font-bold">${stats?.refundsAmount?.toLocaleString() || 0}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">${stats?.completedAmount?.toLocaleString() || 0}</p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-600" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="transactions">
        <TabsList className="grid grid-cols-3 w-full md:w-[600px]">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="reconciliations">Reconciliations</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Payments processed through all gateways</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-gray-500">Loading transactions...</p>
              ) : transactions.length === 0 ? (
                <p className="text-sm text-gray-500">No transactions available.</p>
              ) : (
                transactions.map((t) => (
                  <div key={t._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{t.user}</p>
                      <p className="text-sm text-gray-500">{t.method}</p>
                    </div>
                    <p className="font-bold">${t.amount}</p>
                    <Badge variant={t.status === "completed" ? "default" : t.status === "pending" ? "secondary" : "destructive"}>
                      {t.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refunds Tab */}
        <TabsContent value="refunds" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>Manage pending refunds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <p className="text-sm text-gray-500">Loading refunds...</p>
              ) : refunds.length === 0 ? (
                <p className="text-sm text-gray-500">No refunds available.</p>
              ) : (
                refunds.map((r) => (
                  <div key={r._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{r.user}</p>
                      <p className="text-sm text-gray-500">{r.method}</p>
                    </div>
                    <p className="font-bold">${r.amount}</p>
                    <Button size="sm" variant="outline">Process Refund</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reconciliations Tab */}
        <TabsContent value="reconciliations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reconciliations</CardTitle>
              <CardDescription>Review and reconcile daily transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-gray-500 text-center py-8">
                <p>No reconciliation pending</p>
                <p className="text-sm mt-2">Your daily reconciliation summary will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
