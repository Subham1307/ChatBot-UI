"use client"

import { useState } from "react"
// import { useRecoilValue } from "recoil"
// import { policyFilesState } from "../recoil/atoms"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import FileUpload from "./FileUpload"
import PolicySidebar from "./PolicySidebar"
import parse from 'html-react-parser';


interface Message {
  role: "user" | "bot"
  content: string
}

export default function InsuranceChatbot() {
  // const policyFiles = useRecoilValue(policyFilesState)
  const [policyFiles, setPolicyFiles] = useState([]) // Temporary state for demo
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [botMessage, setBotMessage] = useState("")

  const handleSendMessage = async () => {
    if (!input.trim() || policyFiles.length === 0) return

    const selectedUins = policyFiles.filter((file) => file.selected).map((file) => file.uin)
    if (selectedUins.length === 0) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Set loading state to true and clear previous bot message
    setIsLoading(true)
    setBotMessage("")

    try {
      const response = await fetch("http://localhost:8000/query/", {
        method: "POST",
        body: JSON.stringify({ query: input, uins: selectedUins }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      console.log("bot response : ", data.final_answer)

      // Simulate typing effect
      const words = data.final_answer.split(" ")
      let typedMessage = ""
      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50)) // Adjust speed here
        typedMessage += words[i] + " "
        setBotMessage(typedMessage)
      }

      setMessages((prev) => [...prev, { role: "bot", content: typedMessage.trim() }])
    } catch (error) {
      console.error("Error fetching chat response:", error)
      const errorMessage: Message = { role: "bot", content: "There was an error processing your request." }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex">
      <PolicySidebar policyFiles={policyFiles} setPolicyFiles={setPolicyFiles} />
      <div className="flex-1 space-y-8 p-4">
        <FileUpload setPolicyFiles={setPolicyFiles} />
        <div className="border rounded-lg p-4 space-y-4">
          <ScrollArea className="h-[400px] w-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
              >
                <span
                  style={{ whiteSpace: "pre-wrap" }}
                  className={`inline-block p-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {parse(message.content)}
                </span>
              </div>
            ))}
            {isLoading && (
              <div className="mb-4 text-left">
                <span
                  style={{ whiteSpace: "pre-wrap" }}
                  className="inline-block p-2 rounded-lg bg-secondary text-secondary-foreground"
                >
                  {parse(botMessage)}
                </span>
              </div>
            )}
          </ScrollArea>
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the insurance policies..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={policyFiles.length === 0 || isLoading}
            />
            <Button onClick={handleSendMessage} disabled={policyFiles.length === 0 || isLoading}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
