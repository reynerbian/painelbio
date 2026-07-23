import { generateStaticSite } from './shared.js';

export async function onRequest(context) {
  const { request, env, params, next } = context;
  
  const slug = params.slug;
  if (!slug) {
    return next();
  }

  const pathname = new URL(request.url).pathname;

  // Se a requisição for para um arquivo estático do app (css, js, imagens, manifest, etc), ignora a rota do slug
  if (
    pathname.includes('.') || 
    pathname.startsWith('/css') || 
    pathname.startsWith('/js') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/models')
  ) {
    return next();
  }

  // Prepara o slug com e sem @
  const cleanSlug = slug.toLowerCase();
  const slugWithAt = cleanSlug.startsWith('@') ? cleanSlug : '@' + cleanSlug;
  const slugWithoutAt = cleanSlug.replace('@', '');

  try {
    if (!env || !env.PAINELBIO_KV) {
      return next();
    }

    // Tenta buscar no KV com @ e sem @
    let dataStr = await env.PAINELBIO_KV.get(`site:${slugWithAt}`);
    if (!dataStr) {
      dataStr = await env.PAINELBIO_KV.get(`site:${slugWithoutAt}`);
    }
    
    if (!dataStr) {
      // Se NÃO encontrou no KV, exibe uma página bonita de "Perfil não encontrado" em vez de abrir o App de Edição!
      return new Response(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil não encontrado | PainelBio</title>
    <style>
        body { background: #0d1117; color: #fff; font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
        .card { background: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 32px 24px; max-width: 360px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h2 { font-size: 1.2rem; margin-bottom: 8px; color: #f0f6fc; }
        p { font-size: 0.9rem; color: #8b949e; margin-bottom: 24px; line-height: 1.4; }
        a { background: #238636; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; display: inline-block; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Perfil @${slugWithoutAt} não encontrado</h2>
        <p>Este link ainda não foi publicado ou não está ativo no PainelBio.</p>
        <a href="/">Criar meu Link na Bio</a>
    </div>
</body>
</html>`, { 
        status: 404, 
        headers: { 'Content-Type': 'text/html;charset=UTF-8' } 
      });
    }

    const data = JSON.parse(dataStr);
    const html = generateStaticSite(data);
    
    return new Response(html, { 
        headers: { 
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        } 
    });
  } catch (err) {
    return new Response('Erro ao carregar o site', { status: 500 });
  }
}
