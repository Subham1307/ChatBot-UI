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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (file) {
      // Simulating API call to Python backend
      // Replace this with your actual API call
      const response = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({ filename: file.name }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()
      setUin(data.uin)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !uin) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulating API call to chatbot
    // Replace this with your actual API call
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input, uin }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()

    const botMessage: Message = { role: "bot", content: data.reply }
    setMessages((prev) => [...prev, botMessage])
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="file-upload">Upload Insurance Policy PDF</Label>
        <Input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={!file}>
          Upload and Process
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
            disabled={!uin}
          />
          <Button onClick={handleSendMessage} disabled={!uin}>
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

