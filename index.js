export default {
  async fetch(request, env, ctx) {
    if (request.method === "GET") {
      return new Response("Este endpoint só aceita requisições POST com JSON.", {
        status: 405,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (request.method !== "POST") {
      return new Response("Método não permitido.", { status: 405 });
    }

    try {
      const { prompt } = await request.json();

      const resposta = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await resposta.json();
      const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "Resposta não encontrada.";

      return new Response(JSON.stringify({ resposta: texto }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ resposta: "Erro ao processar a requisição." }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }
  },
};
