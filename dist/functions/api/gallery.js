export async function onRequestGet(context) {
  const { env } = context;
  try {
    const galleryStr = await env.PAINELBIO_KV.get('gallery_list');
    const sites = galleryStr ? JSON.parse(galleryStr) : [];
    
    return new Response(JSON.stringify({ sites }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ sites: [] }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
