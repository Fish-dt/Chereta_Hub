"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { format } from "date-fns"

interface Conversation {
  _id: string
  participants: string[]
  auctionId: string
  lastMessageAt: string
  otherParticipant?: {
    name: string
    avatar?: string
  }
  auction?: {
    title: string
  }
}

interface Message {
  _id: string
  senderId: string
  senderName: string
  message: string
  timestamp: string
  isRead: boolean
}

export default function MessagesPage() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages")
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation,
          message: newMessage,
        }),
      })

      if (response.ok) {
        setNewMessage("")
        fetchMessages(selectedConversation)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">You need to sign in to view messages.</p>
            <Button asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold text-foreground ${language === "am" ? "font-amharic" : ""}`}>
          {t("messages.title")}
        </h1>
        <p className={`text-muted-foreground mt-2 ${language === "am" ? "font-amharic" : ""}`}>
          Communicate with buyers and sellers
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your recent messages</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                      selectedConversation === conversation._id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation._id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={conversation.otherParticipant?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{conversation.otherParticipant?.name || "Unknown User"}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.auction?.title || "Auction"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(conversation.lastMessageAt), "MMM dd, HH:mm")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageCircle className="mx-auto h-12 w-12 mb-4" />
                  <p>{t("messages.no.conversations")}</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`mb-4 flex ${message.senderId === user.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === user.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">{format(new Date(message.timestamp), "HH:mm")}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("messages.type.message")}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button onClick={sendMessage} size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageCircle className="mx-auto h-12 w-12 mb-4" />
                <p>Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
