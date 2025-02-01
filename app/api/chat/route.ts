import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { message, uin } = await request.json()

  // Simulate chatbot response
  // In a real-world scenario, you would integrate with your Python backend here
  const reply = `This is a simulated response for the message: "${message}" related to the policy with UIN: ${uin}`

  return NextResponse.json({ reply })
}

