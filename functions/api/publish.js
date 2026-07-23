import { generateStaticSite } from '../shared.js';

export async function onRequest(context) {
  const { request, env } = context;
  
  // Trata requisições OPTIONS (CORS preflight)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido (Apenas POST)' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const data = await request.json();
    if (!data.arroba) {
      return new Response(JSON.stringify({ error: 'Arroba é obrigatório' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
      });
    }
    
    const slug = data.arroba.startsWith('@') ? data.arroba : '@' + data.arroba;
    const cleanSlug = slug.toLowerCase();
    
    if (!data.createdAt) {
      data.createdAt = new Date().toISOString();
    }
    
    if (!env || !env.PAINELBIO_KV) {
      return new Response(JSON.stringify({ 
        error: 'O KV Namespace (PAINELBIO_KV) não foi vinculado no painel do Cloudflare Pages.',
        details: 'Acesse Cloudflare Pages > Configurações > Funções > KV Namespace Bindings e adicione PAINELBIO_KV.'
      }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }
    
    // Salva o site completo no KV
    await env.PAINELBIO_KV.put(`site:${cleanSlug}`, JSON.stringify(data));
    
    // Atualiza a lista da galeria para ser mais rápido na leitura
    const galleryStr = await env.PAINELBIO_KV.get('gallery_list');
    let gallery = galleryStr ? JSON.parse(galleryStr) : [];
    
    // Remove se já existe para não duplicar
    gallery = gallery.filter(item => item.arroba.toLowerCase() !== cleanSlug);
    
    // Adiciona no topo
    gallery.unshift({
      arroba: data.arroba,
      name: data.name,
      avatar: data.avatar,
      preset: data.preset || 'gray',
      createdAt: data.createdAt,
      previewPath: data.avatar
    });
    
    await env.PAINELBIO_KV.put('gallery_list', JSON.stringify(gallery));
    
    const slugForDb = cleanSlug.replace('@', '');
    return new Response(JSON.stringify({ success: true, url: `/${slugForDb}` }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Erro interno ao publicar', details: err.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
}
