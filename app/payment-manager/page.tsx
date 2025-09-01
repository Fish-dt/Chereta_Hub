"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, RefreshCw, AlertCircle, CreditCard, CheckCircle, XCircle } from "lucide-react"

const paymentStats = {
  totalPayments: 15430,
  pendingPayments: 2300,
  refundsIssued: 560,
  chargebacks: 120,
}

const transactions = [
  { id: "1", user: "Alice", amount: 120, method: "Credit Card", status: "Completed" },
  { id: "2", user: "Bob", amount: 75, method: "PayPal", status: "Pending" },
  { id: "3", user: "Chris", amount: 300, method: "Bank Transfer", status: "Refunded" },
]

const refunds = [
  { id: "1", user: "Chris", amount: 300, method: "Bank Transfer", status: "Pending" },
  { id: "2", user: "Bob", amount: 75, method: "PayPal", status: "Pending" },
]

export default function PaymentManagerDashboard() {
  const [allTransactions, setAllTransactions] = useState(transactions)
  const [allRefunds, setAllRefunds] = useState(refunds)

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
              <p className="text-2xl font-bold">${paymentStats.totalPayments.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold">${paymentStats.pendingPayments.toLocaleString()}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-yellow-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">Refunds Issued</p>
              <p className="text-2xl font-bold">${paymentStats.refundsIssued.toLocaleString()}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">Chargebacks</p>
              <p className="text-2xl font-bold">${paymentStats.chargebacks.toLocaleString()}</p>
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
              {allTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{t.user}</p>
                    <p className="text-sm text-gray-500">{t.method}</p>
                  </div>
                  <p className="font-bold">${t.amount}</p>
                  <Badge variant={t.status === "Completed" ? "default" : t.status === "Pending" ? "secondary" : "destructive"}>
                    {t.status}
                  </Badge>
                </div>
              ))}
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
              {allRefunds.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{r.user}</p>
                    <p className="text-sm text-gray-500">{r.method}</p>
                  </div>
                  <p className="font-bold">${r.amount}</p>
                  <Button size="sm" variant="outline">Process Refund</Button>
                </div>
              ))}
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
