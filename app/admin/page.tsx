"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Gavel,
  TrendingUp,
  AlertTriangle,
  Shield,
  Crown,
  Search,
  MoreHorizontal,
  Ban,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Activity,
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useTranslation } from "@/hooks/useTranslation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: "user" | "moderator" | "admin"
  memberSince: string
  totalSales: number
  rating: number
  isVerified: boolean
  provider?: string
}

interface Auction {
  _id: string
  title: string
  category: string
  currentBid: number
  startingBid: number
  endTime: string
  status: "active" | "ended" | "cancelled" | "pending" | "pending_review"
  bidCount: number
  sellerName: string
  createdAt: string
}

interface AdminStats {
  totalUsers: number
  totalAuctions: number
  activeAuctions: number
  totalRevenue: number
  newUsersToday: number
  newAuctionsToday: number
  pendingReports: number
  successRate: number
}

export default function AdminPage() {
  const { data: session } = useSession();
  const { t, language } = useTranslation()
  const [users, setUsers] = useState<User[]>([])
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalAuctions: 0,
    activeAuctions: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    newAuctionsToday: 0,
    pendingReports: 0,
    successRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)

  useEffect(() => {
    if (session && (session.user.role === "admin" || session.user.role === "moderator")) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      await Promise.all([fetchUsers(), fetchAuctions(), fetchStats()])
    } catch (error) {
      setError("Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchAuctions = async () => {
    try {
      const response = await fetch("/api/admin/auctions")
      if (response.ok) {
        const data = await response.json()
        setAuctions(data.auctions)
      }
    } catch (error) {
      console.error("Error fetching auctions:", error)
    }
  }

  const fetchStats = async () => {
    // Mock stats for now - replace with actual API call
    setStats({
      totalUsers: 1250,
      totalAuctions: 3420,
      activeAuctions: 156,
      totalRevenue: 125000,
      newUsersToday: 23,
      newAuctionsToday: 12,
      pendingReports: 5,
      successRate: 98.5,
    })
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole as any } : u)))
      } else {
        setError("Failed to update user role")
      }
    } catch (error) {
      setError("Network error")
    }
  }

  const suspendUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: "PATCH",
      })

      if (response.ok) {
        fetchUsers() // Refresh users list
      } else {
        setError("Failed to suspend user")
      }
    } catch (error) {
      setError("Network error")
    }
  }

  const deleteAuction = async (auctionId: string) => {
    try {
      const response = await fetch(`/api/admin/auctions/${auctionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAuctions(auctions.filter((a) => a._id !== auctionId))
      } else {
        setError("Failed to delete auction")
      }
    } catch (error) {
      setError("Network error")
    }
  }

  const approveAuction = async (auctionId: string) => {
    try {
      const response = await fetch(`/api/admin/auctions/${auctionId}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })
      if (response.ok) {
        setAuctions(auctions.map((a) => a._id === auctionId ? { ...a, status: "active" } : a))
      } else {
        setError("Failed to approve auction")
      }
    } catch (error) {
      setError("Network error")
    }
  }

  const handleApproveClick = (auctionId: string) => {
    setSelectedAuctionId(auctionId)
    setShowApproveDialog(true)
  }

  const handleApproveConfirm = async () => {
    if (selectedAuctionId) {
      await approveAuction(selectedAuctionId)
      setShowApproveDialog(false)
      setSelectedAuctionId(null)
    }
  }

  const handleApproveCancel = () => {
    setShowApproveDialog(false)
    setSelectedAuctionId(null)
  }

  const filteredUsers = users.filter((user) => {
    const first = (user.firstName || "").toLowerCase()
    const last = (user.lastName || "").toLowerCase()
    const mail = (user.email || "").toLowerCase()
    const term = (searchTerm || "").toLowerCase()
    const matchesSearch = first.includes(term) || last.includes(term) || mail.includes(term)
    const matchesRole = selectedRole === "all" || (user.role || "user") === selectedRole
    return matchesSearch && matchesRole
  })

  if (!session || !(session.user as any) || ((session.user as any).role !== "admin" && (session.user as any).role !== "moderator")) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-4">You don't have permission to access the admin panel.</p>
            <Button asChild>
              <a href="/">Go Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          {((session.user as any).role === "admin") ? (
            <Crown className="h-6 w-6 text-yellow-500" />
          ) : (
            <Shield className="h-6 w-6 text-blue-500" />
          )}
          <h1 className={`text-3xl font-bold text-foreground ${language === "am" ? "font-amharic" : ""}`}>
            {((session.user as any).role === "admin") ? "Super Admin Dashboard" : "Moderator Dashboard"}
          </h1>
        </div>
        <p className={`text-muted-foreground ${language === "am" ? "font-amharic" : ""}`}>
          Comprehensive platform management and analytics
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{stats.newUsersToday} today</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Auctions</p>
                <p className="text-2xl font-bold">{stats.activeAuctions}</p>
                <p className="text-xs text-green-600">+{stats.newAuctionsToday} today</p>
              </div>
              <Gavel className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">{stats.successRate}% success rate</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Reports</p>
                <p className="text-2xl font-bold">{stats.pendingReports}</p>
                <p className="text-xs text-orange-600">Requires attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="auctions">Auctions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
                </div>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Export Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="moderator">Moderators</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="space-y-4">
                {filteredUsers.map((userData) => (
                  <div
                    key={userData._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {userData.firstName} {userData.lastName}
                          </h3>
                          {userData.isVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {userData.provider === "google" && (
                            <Badge variant="outline" className="text-xs">
                              Google
                            </Badge>
                          )}
                        </div>
                        <Badge
                          variant={
                            userData.role === "admin"
                              ? "default"
                              : userData.role === "moderator"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {userData.role === "admin" && <Crown className="h-3 w-3 mr-1" />}
                          {userData.role === "moderator" && <Shield className="h-3 w-3 mr-1" />}
                          {(((userData.role || "user")[0] || "").toUpperCase()) + (userData.role || "user").slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{userData.email}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>Member since {format(new Date(userData.memberSince || new Date()), "MMM yyyy")}</span>
                        <span>{(userData.totalSales ?? 0)} sales</span>
                        <span>{Number(userData.rating ?? 0).toFixed(1)} ⭐ rating</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {((session.user as any).role === "admin") && (
                        <Select value={userData.role} onValueChange={(value) => updateUserRole(userData._id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => suspendUser(userData._id)} className="text-orange-600">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend User
                          </DropdownMenuItem>
                          {((session.user as any).role === "admin") && (
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auctions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>All Auctions</CardTitle>
                  <CardDescription>Manage all auctions on the platform</CardDescription>
                </div>
                <Button>
                  <Gavel className="h-4 w-4 mr-2" />
                  Export Auctions
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auctions.map((auction) => (
                  <div key={auction._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{auction.title}</h3>
                        <Badge variant={auction.status === "active" ? "default" : auction.status === "pending" || auction.status === "pending_review" ? "secondary" : "outline"}>{auction.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{auction.category}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Current: ${auction.currentBid.toLocaleString()}</span>
                        <span>{auction.bidCount} bids</span>
                        <span>by {auction.sellerName}</span>
                        <span>Ends {format(new Date(auction.endTime), "MMM dd, yyyy")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(auction.status === "pending" || auction.status === "pending_review") && (
                        <Button size="sm" variant="success" onClick={() => handleApproveClick(auction._id)}>
                          Approve
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Auction
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-orange-600">
                            <Ban className="h-4 w-4 mr-2" />
                            Suspend Auction
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteAuction(auction._id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Auction
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Moderation</CardTitle>
              <CardDescription>Handle user reports and content moderation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4" />
                <p>No pending reports</p>
                <p className="text-sm mt-2">All reports have been resolved</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>Detailed insights and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="mx-auto h-12 w-12 mb-4" />
                      <p>Analytics charts coming soon</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <TrendingUp className="mx-auto h-12 w-12 mb-4" />
                      <p>Revenue analytics coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure platform-wide settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-muted-foreground">Enable maintenance mode for platform updates</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Manage system email notifications</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Payment Settings</p>
                        <p className="text-sm text-muted-foreground">Configure payment gateways and fees</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Auction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this auction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleApproveCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveConfirm}>Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
