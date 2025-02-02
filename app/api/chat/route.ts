import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { message, uins } = await request.json()

  // Simulate chatbot response
  // In a real-world scenario, you would integrate with your Python backend here
  const reply = `This is a simulated response for the message: "${message}" related to the policies with UINs: ${uins.join(", ")}`

  return NextResponse.json({ reply })
}

