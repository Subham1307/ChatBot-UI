"use client"
import { ThemeProvider } from "next-themes"
import InsuranceChatbot from "./components/InsuranceChatbot"
import ThemeToggle from "./components/ThemeToggle"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Insurance Policy Chatbot</h1>
            <ThemeToggle />
          </div>
          <InsuranceChatbot />
        </main>
      </div>
    </ThemeProvider>
  )
}

