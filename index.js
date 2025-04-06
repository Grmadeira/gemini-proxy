export default {
  async fetch(request, env, ctx) {
    const { searchParams } = new URL(request.url);
    const userMessage = searchParams.get("pergunta") || "Olá!";

    const resposta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.AIzaSyDRXd6owlK8Wim7l1Lls-vc-5UbcZIrgmU}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await resposta.json();

    try {
      const texto = data.candidates[0].content.parts[0].text;
      return new Response(JSON.stringify({ resposta: texto }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ resposta: "Erro na resposta da API Gemini." }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  },
};

