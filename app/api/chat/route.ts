import { NextRequest, NextResponse } from 'next/server'
import { groq, LLM_MODEL, SYSTEM_PROMPTS } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { messages, context = 'public' } = await req.json()

    const completion = await groq.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[context as keyof typeof SYSTEM_PROMPTS] },
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 600,
    })

    const reply = completion.choices[0]?.message?.content || 'No response.'
    return NextResponse.json({ reply })
  } catch (err: any) {
    console.error('Chat error:', err)
    return NextResponse.json(
      { reply: 'Error connecting to AI. Please try again.' },
      { status: 500 }
    )
  }
}