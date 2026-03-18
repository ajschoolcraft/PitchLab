import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Get user answers from request body
    const { answers } = req.body

    // Validate we have answers
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ 
        error: 'Missing or invalid answers',
        message: 'Request body must include an "answers" object' 
      })
    }

    // Initialize Claude API
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    // Build the prompt from user's 11 answers
    const prompt = buildPrompt(answers)

    console.log('Calling Claude API...')

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    // Extract the generated script
    const generatedScript = message.content[0].text

    console.log('Script generated successfully')

    // Return the script
    return res.status(200).json({
      success: true,
      script: generatedScript,
      model: 'claude-sonnet-4-6',
      usage: message.usage
    })

  } catch (error) {
    console.error('Error generating script:', error)
    return res.status(500).json({ 
      error: 'Failed to generate script',
      message: error.message 
    })
  }
}

// Helper function to build the Claude prompt from 11 answers
function buildPrompt(answers) {
  return `You are a presentation coach creating a 30-SECOND pitch script (MAXIMUM 90 words).

The entrepreneur has answered deep questions about their business. Use their authentic story to create a compelling, concise pitch.

Their answers:
1. Core belief that drives their work: ${answers.q1 || 'Not provided'}
2. Origin of that belief: ${answers.q2 || 'Not provided'}
3. Standards they hold (even when inconvenient): ${answers.q3 || 'Not provided'}
4. Where they're not honoring that standard: ${answers.q4 || 'Not provided'}
5. Unique experiences that shaped their understanding: ${answers.q5 || 'Not provided'}
6. Why solving this matters more than it appears: ${answers.q6 || 'Not provided'}
7. What happens if it remains unsolved: ${answers.q7 || 'Not provided'}
8. What specifically changes for their client: ${answers.q8 || 'Not provided'}
9. Evidence that supports this: ${answers.q9 || 'Not provided'}
10. What they're over-explaining instead of simplifying: ${answers.q10 || 'Not provided'}
11. Where their messaging understates how they operate: ${answers.q11 || 'Not provided'}

Create a powerful 30-second pitch (75-90 words MAXIMUM) following this structure:

[0:00-0:05] Hook - Lead with their most compelling belief or origin story
[0:05-0:15] Problem + Why It Matters - Draw from their unique perspective and what's at stake
[0:15-0:25] Solution + Proof - What specifically changes for clients, with evidence
[0:25-0:30] Call to Action - One clear, specific next step

CRITICAL Requirements:
- MAXIMUM 90 words total (this must fit in 30 seconds when spoken)
- Extract only the MOST compelling parts of their story
- Short, punchy sentences (6-10 words each)
- Conversational, authentic tone (like talking to a friend)
- Remove any over-explanations - keep it simple and clear
- Include word count and estimated speaking time at the end

Format:
[0:00-0:05] Hook: [opening line]

[0:05-0:15] Problem: [why this matters]

[0:15-0:25] Solution: [what changes]

[0:25-0:30] CTA: [specific action]

Word count: X words
Speaking time: ~30 seconds`
}