const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return new Response(JSON.stringify({ reply: "Error from Gemini" }), { status: 500 });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";

    return new Response(JSON.stringify({ reply }), { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ reply: "Server error" }), { status: 500 });
  }
}
