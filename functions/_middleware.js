export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // 1. Permite arquivos estáticos do sistema (CSS, JS, Imagens, Icons, Manifest, SW, Models)
  const isAssetFile = /\.(css|js|png|jpg|jpeg|gif|svg|ico|json|html|webmanifest|txt|cjs|map)$/i.test(pathname);
  if (
    isAssetFile || 
    pathname.startsWith('/css/') || 
    pathname.startsWith('/js/') || 
    pathname.startsWith('/api/') || 
    pathname.startsWith('/models/') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname === '/sw.js'
  ) {
    return next();
  }

  // 2. Permite slugs de clientes (rotas com nome da loja como /cleyvv, /anacarolina.semijoias)
  // Se o pathname não for a raiz '/', é uma rota de bio de cliente!
  if (pathname !== '/' && pathname !== '') {
    return next();
  }

  // 3. PROTEÇÃO DA RAIZ '/' (O Aplicativo Gerador PainelBio):
  // Chave Mestra Criptográfica do Dispositivo
  const MASTER_DEVICE_KEY = "painelbio_master_device_key_849201";
  
  // A) Se o usuário acessou com a chave de autorização de dispositivo na URL (?auth_key=...):
  const authKeyParam = url.searchParams.get('auth_key');
  if (authKeyParam === MASTER_DEVICE_KEY) {
    // Executa a requisição e grava o Cookie de Dispositivo Autorizado no aparelho por 10 anos!
    const response = await next();
    const newHeaders = new Headers(response.headers);
    newHeaders.append('Set-Cookie', `pb_device_token=${MASTER_DEVICE_KEY}; Path=/; Max-Age=315360000; SameSite=Lax; Secure`);
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  }

  // B) Verifica se o Cookie de Dispositivo Autorizado já está gravado no aparelho:
  const cookieHeader = request.headers.get('Cookie') || '';
  const isAuthorizedDevice = cookieHeader.includes(`pb_device_token=${MASTER_DEVICE_KEY}`);

  if (isAuthorizedDevice) {
    // Dispositivo reconhecido! Abre o aplicativo de criação direto sem pedir nada!
    return next();
  }

  // C) DISPOSITIVO NÃO RECONHECIDO (ESTRANHO / HACKER / CURIOSO):
  // O aplicativo NEM CARREGA! Retorna erro 403 Forbidden simulando servidor restrito.
  return new Response(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>403 - Acesso Não Autorizado</title>
    <style>
        body { background: #0d1117; color: #8b949e; font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; }
        .box { background: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 30px 20px; max-width: 360px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        h1 { color: #f85149; font-size: 1.4rem; margin-bottom: 8px; font-weight: 700; }
        p { font-size: 0.85rem; line-height: 1.5; color: #8b949e; margin: 0; }
    </style>
</head>
<body>
    <div class="box">
        <h1>403 Forbidden</h1>
        <p>Acesso restrito ao servidor de gerenciamento.</p>
    </div>
</body>
</html>`, {
    status: 403,
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}
