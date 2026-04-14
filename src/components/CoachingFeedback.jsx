import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { script, duration, takeNumber } = req.body

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    const prompt = `You are a professional presentation coach giving feedback to an entrepreneur who just recorded a pitch presentation.

Here is their script:
"${script || 'No script provided - they recorded freestyle'}"

Recording details:
- Duration: ${duration} seconds
- Take number: ${takeNumber}

Give them 3 pieces of specific, encouraging, actionable feedback based on their script and delivery context. Be warm, direct, and practical — like a coach who believes in them.

Respond ONLY with a JSON object in this exact format, no markdown, no extra text:
{
  "whatLanded": "One specific thing that works well about their script or approach (1-2 sentences)",
  "whatToTighten": "One specific thing to improve in their next take (1-2 sentences)",
  "specificTip": "One concrete, actionable tip they can apply RIGHT NOW in their next recording (1-2 sentences)"
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].text.trim()
    const clean = text.replace(/```json|```/g, '').trim()
    const feedback = JSON.parse(clean)

    return res.status(200).json({ success: true, feedback })

  } catch (error) {
    console.error('Coaching feedback error:', error)
    return res.status(500).json({
      error: 'Failed to generate feedback',
      message: error.message
    })
  }
}