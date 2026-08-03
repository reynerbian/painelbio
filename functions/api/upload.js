export async function onRequest(context) {
  const { request, env } = context;

  // Trata requisições OPTIONS (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const formData = await request.formData();
    const urls = {};

    for (const [key, value] of formData.entries()) {
      if (value && typeof value === 'object' && typeof value.arrayBuffer === 'function') {
        const file = value;
        const ext = file.name ? file.name.substring(file.name.lastIndexOf('.')) : '.jpg';
        const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${key}-${uniqueId}${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        
        if (env && env.PAINELBIO_KV) {
          // Salva o arquivo binário no Cloudflare KV
          await env.PAINELBIO_KV.put(`upload:${filename}`, arrayBuffer, {
            metadata: { contentType: file.type || 'image/jpeg' }
          });
        }
        
        urls[key] = `/uploads/${filename}`;
      }
    }

    return new Response(JSON.stringify({ success: true, urls }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro no upload', details: err.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
