export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    // Header CORS agar blog Hugo Anda bisa mengakses API ini
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (!slug) {
      return new Response(JSON.stringify({ error: "Parameter slug wajib diisi" }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Ambil jumlah klik saat ini dari KV namespace 'pencoret_views'
    let currentViews = await env.pencoret_views.get(slug);
    let count = currentViews ? parseInt(currentViews, 10) : 0;

    // Tambah +1 jika metode request adalah POST
    if (request.method === "POST") {
      count += 1;
      await env.pencoret_views.put(slug, count.toString());
    }

    return new Response(JSON.stringify({ slug: slug, views: count }), {
      headers: corsHeaders
    });
  }
};
