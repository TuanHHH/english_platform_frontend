"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { MessageCircle, X, Send, LogIn, Bot } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
// import { streamChat } from "@/lib/api/chat"
import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"
import { useUIStore } from "@/store/ui"
// import { v4 as uuidv4 } from "uuid"
import { toast } from "sonner"

export default function MessengerChat() {
  const { openWidget, setOpenWidget } = useUIStore()
  const isOpen = openWidget === "chat"

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      text: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn trả lời các câu hỏi thắc mắc. Bạn cần hỗ trợ gì?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const hasHydrated = useAuthStore((s) => s.hasHydrated)
  const isFetchingUser = useAuthStore((s) => s.isFetchingUser)
  const isAuthenticated = !!user

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus()
  }, [isOpen])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    const botMessageId = (Date.now() + 1).toString()
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, text: "", isUser: false, timestamp: new Date(), isStreaming: true },
    ])

    let accumulated = ""
    try {
      // await streamChat(inputValue, user?.userId?.toString() || uuidv4(), (chunk) => {
      //   accumulated += chunk
      //   setMessages((prev) =>
      //     prev.map((m) => (m.id === botMessageId ? { ...m, text: accumulated } : m)),
      //   )
      // })
      // setMessages((prev) => prev.map((m) => (m.id === botMessageId ? { ...m, isStreaming: false } : m)))

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMessageId ? { ...m, text: "🤖 Tính năng đang được phát triển.", isStreaming: false } : m
          )
        )
      }, 800)
    } catch (err) {
      toast.error("⚠️ Server đang bận, vui lòng thử lại sau.")
      setMessages((prev) =>
        prev.map((m) =>
          m.id === botMessageId
            ? {
              ...m,
              text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại hoặc refresh lại trang",
              isStreaming: false,
            }
            : m
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (!hasHydrated || isFetchingUser) {
    return null
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setOpenWidget(isOpen ? null : "chat")}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-50 transition-all duration-200 hover:scale-110"
            size="icon"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageCircle className="h-6 w-6 text-white" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-gray-900 text-white px-2 py-1 text-xs rounded">
          {isOpen ? "Đóng" : "AI Chat"}
        </TooltipContent>
      </Tooltip>

      {isOpen && (
        <Card
          className="
          fixed bottom-20 right-4
          w-[95%] h-[70vh]  
          sm:w-[420px] sm:h-[480px]   
          md:w-[550px] md:h-[500px]  
          lg:w-[700px] lg:h-[550px]   
          py-0.25 shadow-2xl z-[25] flex flex-col
          animate-in slide-in-from-bottom-2 duration-300
          overflow-hidden rounded-xl
        "
        >
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bot className="h-12 w-12 text-blue-600 mb-4" />
              <p className="text-gray-700 mb-4">Vui lòng đăng nhập để sử dụng Chatbot.</p>
              <Button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700">
                <LogIn className="h-4 w-4 mr-2" /> Đăng nhập
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
                <div>
                  <h3 className="font-semibold text-sm">Trợ lý AI</h3>
                  <p className="text-[11px] opacity-80 mt-1">
                    Chatbot có thể mắc lỗi, vui lòng kiểm tra thông tin. Dữ liệu của bạn sẽ không được lưu trữ khi hết phiên sử dụng.
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.isUser
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm border"
                        }`}
                    >
                      {m.isUser ? (
                        <p className="text-sm">{m.text}</p>
                      ) : (
                        <div className="text-sm prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                          {m.isStreaming && (
                            <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder="Nhập tin nhắn..."
                    disabled={isLoading}
                    className="flex-1 rounded-full border-gray-300 focus:border-blue-500"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="icon"
                    className="rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}
    </>
  )
}
