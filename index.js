export default {
  async fetch(request, env, ctx) {
    // Cabeçalhos CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Requisição OPTIONS (pré-vôo do CORS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (request.method === "GET") {
      return new Response("Este endpoint só aceita requisições POST com JSON.", {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "text/plain" },
      });
    }

    if (request.method !== "POST") {
      return new Response("Método não permitido.", {
        status: 405,
        headers: corsHeaders,
      });
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
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ resposta: "Erro ao processar a requisição." }), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
        status: 500,
      });
    }
  },
};

