export async function onRequest(context) {
  const { request, env, params } = context;
  const id = params.id;

  if (!id) {
    return new Response('Imagem não informada', { status: 404 });
  }

  try {
    if (!env || !env.PAINELBIO_KV) {
      return new Response('Namespace KV do Cloudflare não configurado.', { status: 500 });
    }

    const key = `upload:${id}`;
    const { value, metadata } = await env.PAINELBIO_KV.getWithMetadata(key, 'arrayBuffer');

    if (!value) {
      return new Response('Imagem não encontrada.', { status: 404 });
    }

    const contentType = (metadata && metadata.contentType) || 'image/jpeg';

    return new Response(value, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000', // Cache por 1 ano
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response('Erro interno do servidor: ' + err.message, { status: 500 });
  }
}
