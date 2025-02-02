"use client"
import { useState, useEffect } from "react"
// import { RecoilRoot } from "recoil"
import { ThemeProvider } from "next-themes"
import InsuranceChatbot from "./components/InsuranceChatbot"
import ThemeToggle from "./components/ThemeToggle"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    // <RecoilRoot>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Insurance Policy Chatbot</h1>
            <ThemeToggle />
          </div>
        </header>
        <main className="container mx-auto p-4">
          <InsuranceChatbot />
        </main>
      </div>
    </ThemeProvider>
    // </RecoilRoot>
  )
}

