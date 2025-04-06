export default {
  async fetch(request, env, ctx) {
    let userMessage = "Olá!";

    if (request.method === "POST") {
      try {
        const body = await request.json();
        userMessage = body.prompt || userMessage;
      } catch (e) {
        return new Response(JSON.stringify({ response: "Erro ao processar o corpo da requisição." }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }
    } else {
      const { searchParams } = new URL(request.url);
      userMessage = searchParams.get("pergunta") || userMessage;
    }

    try {
      const resposta = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
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
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta da IA.";

      return new Response(JSON.stringify({ response: texto }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(JSON.stringify({ response: "Erro ao processar a requisição." }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  },
};


