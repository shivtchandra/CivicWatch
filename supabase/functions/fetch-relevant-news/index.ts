
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!perplexityApiKey) {
    return new Response(
      JSON.stringify({ error: "PERPLEXITY_API_KEY not configured." }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { title, location, type } = await req.json();

    // Formulate a search query for Perplexity
    const query = [
      `Find latest news articles relevant to:`,
      `Title: ${title}`,
      location ? `Location: ${location}` : '',
      type ? `Report type: ${type}` : '',
      `News only. Response must be a JSON array of: [{title, url, summary, source, published_at}]`
    ].join("\n");

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${perplexityApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-large-128k-online",
        messages: [
          { role: "system", content: "Return only JSON with relevant news articles for civic safety reports. Do NOT add explanations or any text outside the JSON array." },
          { role: "user", content: query }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 768,
        return_images: false
      }),
    });

    const result = await response.json();
    // Try to find a JSON array in the response.
    let news: any[] = [];
    // Some models wrap the output as a code block
    if (typeof result.choices?.[0]?.message?.content === "string") {
      const match = result.choices[0].message.content.match(/\[.*\]/s);
      if (match) {
        news = JSON.parse(match[0]);
      }
    }

    return new Response(JSON.stringify({ news }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || err }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
