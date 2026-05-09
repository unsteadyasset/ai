import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

export const runtime = 'nodejs'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

const LLM_MODEL = 'llama-3.3-70b-versatile'

export async function POST(req: NextRequest) {
  try {
    const { reports } = await req.json()

    if (!reports || reports.length === 0) {
      return NextResponse.json({ analysis: 'No reports to analyze.' })
    }

    const summary = reports
      .map(
        (r: any, i: number) =>
          `${i + 1}. [${r.report_type}] ${r.location_text}: ${r.description} (${new Date(
            r.created_at
          ).toLocaleDateString()}, status: ${r.status})`
      )
      .join('\n')

    const prompt = `Analyze this batch of public reports submitted to Kenya Forest Service. Identify:

1. URGENT PATTERNS (clusters, hotspots, repeat reports from same area)
2. TOP 3 PRIORITY REPORTS that need immediate dispatch
3. TREND ANALYSIS (any concerning patterns in time, location, or type)
4. SUSPICIOUS REPORTS that may need verification (false alarms, duplicates)
5. RECOMMENDED ACTIONS for the dispatch team

REPORTS:
${summary}

Be tactical, concise, and use bullet points. Maximum 250 words.`

    const completion = await groq.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are the Intelligence Unit AI for Kenya Forest Service. Be precise, tactical, and operational.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 600,
    })

    const analysis =
      completion.choices[0]?.message?.content || 'Analysis unavailable.'

    return NextResponse.json({ analysis })
  } catch (err: any) {
    console.error('Analyze reports error:', err)
    return NextResponse.json(
      { analysis: 'AI analysis failed. Try again.' },
      { status: 500 }
    )
  }
}