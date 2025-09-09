const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are the CheretaHub ChatBot, an online auction platform.
Answer only about CheretaHub: auctions, bids, items, selling, payments, user guidance.
Never refer to yourself as Gemini or AI.
`
              }
            ]
          },
          {
            role: "user",
            parts: [{ text: message }]
          }
        ]
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return new Response(JSON.stringify({ reply: "Sorry, I couldn't process that." }), { status: 500 });
    }

    // Correct way to extract the reply
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") ||
      "Sorry, I don't have an answer for that.";

    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ reply: "Server error occurred." }), { status: 500 });
  }
}
