export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Trata CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  const slugParam = url.searchParams.get('slug');
  const typeParam = url.searchParams.get('type') || 'click'; // 'click', 'referral', 'view'
  const monthParam = url.searchParams.get('month') || new Date().toISOString().substring(0, 7); // Ex: "2026-07"

  if (!slugParam) {
    return new Response(JSON.stringify({ error: 'Slug é obrigatório' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const cleanSlug = slugParam.toLowerCase().replace('@', '');

  try {
    // GET: Retorna as estatísticas do site
    if (request.method === 'GET') {
      let stats = { views: 0, clicks: 0, referrals: 0 };
      
      if (env && env.PAINELBIO_KV) {
        const key = `stats:${cleanSlug}:${monthParam}`;
        const dataStr = await env.PAINELBIO_KV.get(key);
        if (dataStr) {
          stats = JSON.parse(dataStr);
        }
      }

      return new Response(JSON.stringify({ success: true, slug: cleanSlug, month: monthParam, stats }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // POST / BEACON: Incrementa a estatística do mês
    if (env && env.PAINELBIO_KV) {
      const key = `stats:${cleanSlug}:${monthParam}`;
      const dataStr = await env.PAINELBIO_KV.get(key);
      let stats = dataStr ? JSON.parse(dataStr) : { views: 0, clicks: 0, referrals: 0 };

      if (typeParam === 'view') {
        stats.views = (stats.views || 0) + 1;
      } else if (typeParam === 'referral') {
        stats.referrals = (stats.referrals || 0) + 1;
      } else {
        stats.clicks = (stats.clicks || 0) + 1;
      }

      await env.PAINELBIO_KV.put(key, JSON.stringify(stats));
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro ao registrar métrica', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
