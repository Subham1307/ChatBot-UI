"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"

interface Message {
  role: "user" | "bot"
  content: string
}

export default function InsuranceChatbot() {
  const [file, setFile] = useState<File | null>(null)
  const [uin, setUin] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    
    const formData = new FormData()
    formData.append("file", file)

    try {
      // Adjust the URL as needed. If using a proxy, you might use '/api/upload'
      const response = await fetch("http://localhost:8000/upload-pdf/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }
      const data = await response.json()
      setUin(data.uin)
    } catch (error) {
      console.error(error)
      alert("An error occurred during file upload.")
    } finally {
      setUploading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !uin) return

    // Append user message to chat
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    const currentQuestion = input
    setInput("")
    setSending(true)

    try {
      // Adjust the URL as needed. If using a proxy, you might use '/api/chat'
      const response = await fetch("http://localhost:8000/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uin, question: currentQuestion }),
      });

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.statusText}`)
      }
      const data = await response.json()
      console.log(data.reply.content)
      const botMessage: Message = { role: "bot", content: data.reply.content }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error(error)
      alert("An error occurred during the chat request.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="file-upload">Upload Insurance Policy PDF</Label>
        <Input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? "Uploading..." : "Upload and Process"}
        </Button>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <ScrollArea className="h-[400px] w-full">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.content}
              </span>
            </div>
          ))}
        </ScrollArea>
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the insurance policy..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!uin || sending}
          />
          <Button onClick={handleSendMessage} disabled={!uin || sending}>
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  )
}
