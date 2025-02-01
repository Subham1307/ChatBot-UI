import { useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { messagesState, uinState } from "../recoil/atoms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Chat() {
  const [messages, setMessages] = useRecoilState(messagesState)
  const uin = useRecoilValue(uinState)
  const [input, setInput] = useState("")

  const handleSendMessage = async () => {
    if (!input.trim() || !uin) return

    const userMessage = { role: "user" as const, content: input }
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

    const botMessage = { role: "bot" as const, content: data.reply }
    setMessages((prev) => [...prev, botMessage])
  }

  return (
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
  )
}

