import { NextRequest, NextResponse } from 'next/server'
import { groq, LLM_MODEL, SYSTEM_PROMPTS } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { threat } = await req.json()

    const prompt = `Analyze this forest threat detection and provide a tactical briefing for Kenya Forest Service rangers:

CASE ID: ${threat.case_id}
TYPE: ${threat.type}
SEVERITY: ${threat.severity}
LOCATION: ${threat.county}, ${threat.forest_reserve}
COORDINATES: ${threat.latitude}, ${threat.longitude}
AREA AFFECTED: ${threat.area_hectares} hectares
AI CONFIDENCE: ${(threat.ai_confidence * 100).toFixed(1)}%
NDVI DEVIATION: ${threat.ndvi_deviation}
PREDICTED CAUSE: ${threat.predicted_cause}
DESCRIPTION: ${threat.description || 'N/A'}

Provide a concise tactical briefing in this exact format:

🎯 ASSESSMENT
[2-3 sentences on the threat]

⚡ URGENCY: [CRITICAL/HIGH/MEDIUM/LOW]

🚨 RECOMMENDED ACTION
• [Primary action]
• [Secondary action]
• [Backup action]

🔍 INVESTIGATION POINTS
• [What rangers should look for]
• [Key evidence to document]

⚠️ RISKS
[Any safety concerns for the dispatched team]

Keep it under 200 words. Be tactical and specific.`

    const completion = await groq.chat.completions.create({
      model: LLM_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.threat_analysis },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 500,
    })

    const summary =
      completion.choices[0]?.message?.content ||
      'Analysis unavailable. Manual assessment required.'

    return NextResponse.json({ summary })
  } catch (err: any) {
    console.error('Threat summary error:', err)
    return NextResponse.json(
      { summary: 'AI analysis temporarily unavailable.' },
      { status: 500 }
    )
  }
}