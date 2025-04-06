export default {
  async fetch(request, env, ctx) {
    try {
      const reqBody = await request.json();
      const userMessage = reqBody.prompt || "Olá!";

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
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "Não entendi sua pergunta.";

      return new Response(JSON.stringify({ response: texto }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ response: "Erro ao processar a requisição." }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  },
};

