import { generateStaticSite } from './shared.js';

export async function onRequest(context) {
  const { request, env, params, next } = context;
  
  const slug = params.slug;
  if (!slug) {
      return next();
  }

  // Prepara o slug com arroba
  const cleanSlug = slug.startsWith('@') ? slug.toLowerCase() : '@' + slug.toLowerCase();
  
  try {
    if (!env || !env.PAINELBIO_KV) {
      return next();
    }

    const dataStr = await env.PAINELBIO_KV.get(`site:${cleanSlug}`);
    
    if (!dataStr) {
      // Se não encontrou no KV, repassa para o Cloudflare Pages ver se é um arquivo estático (como /css/style.css)
      return next();
    }

    const data = JSON.parse(dataStr);
    const html = generateStaticSite(data);
    
    return new Response(html, { 
        headers: { 'Content-Type': 'text/html;charset=UTF-8' } 
    });
  } catch (err) {
    return new Response('Erro ao carregar o site', { status: 500 });
  }
}
