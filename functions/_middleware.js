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

  // 3. CAMUFLAGEM E PROTEÇÃO DA RAIZ '/' (O Aplicativo Gerador PainelBio):
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

  // C) DISPOSITIVO NÃO RECONHECIDO (CAMUFLAGEM TOTAL):
  // Retorna uma réplica exata e impecável da tela oficial de "Error 502 Bad Gateway" do Cloudflare!
  // Qualquer curioso ou hacker vai ter a certeza absoluta de que o servidor está quebrado ou fora do ar!
  return new Response(`<!DOCTYPE html>
<html lang="en-US">
<head>
<title>Error 502 Bad gateway</title>
<meta charset="UTF-8" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<meta name="robots" content="noindex, nofollow" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; color: #404040; -webkit-font-smoothing: antialiased; }
.container { max-width: 900px; margin: 0 auto; padding: 40px 20px; box-sizing: border-box; }
.header { font-size: 2.4rem; font-weight: 300; margin-bottom: 4px; color: #333; }
.sub-header { font-size: 1.1rem; color: #777; margin-bottom: 40px; }
.diagram { display: flex; align-items: center; justify-content: space-between; max-width: 650px; margin: 40px auto; text-align: center; }
.node { flex: 1; position: relative; }
.icon-box { width: 68px; height: 68px; margin: 0 auto 10px; border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; }
.icon-green { background-color: #5cb85c; color: white; }
.icon-red { background-color: #d9534f; color: white; }
.line-connector { flex: 0.6; height: 2px; background-color: #d8d8d8; position: relative; top: -14px; }
.node-title { font-size: 0.95rem; font-weight: 600; color: #444; }
.node-status-ok { font-size: 0.85rem; color: #5cb85c; font-weight: 600; margin-top: 4px; line-height: 1.3; }
.node-status-err { font-size: 0.85rem; color: #d9534f; font-weight: 600; margin-top: 4px; line-height: 1.3; }
.section-title { font-size: 1.25rem; font-weight: 600; margin-top: 36px; margin-bottom: 8px; color: #333; }
.section-desc { font-size: 0.95rem; color: #666; line-height: 1.5; }
.divider { height: 1px; background-color: #e0e0e0; margin: 35px 0; }
</style>
</head>
<body>
<div class="container">
    <div class="header">Error 502</div>
    <div class="sub-header">Bad gateway</div>

    <div class="diagram">
        <div class="node">
            <div class="icon-box icon-green">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="node-title">You</div>
            <div class="node-status-ok">Browser<br>Working</div>
        </div>
        <div class="line-connector"></div>
        <div class="node">
            <div class="icon-box icon-green">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="node-title">Cloudflare</div>
            <div class="node-status-ok">Cloudflare<br>Working</div>
        </div>
        <div class="line-connector"></div>
        <div class="node">
            <div class="icon-box icon-red">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </div>
            <div class="node-title">Host</div>
            <div class="node-status-err">Host<br>Error</div>
        </div>
    </div>

    <div class="divider"></div>

    <div class="section-title">What happened?</div>
    <div class="section-desc">The web server reported a bad gateway error.</div>

    <div class="section-title">What can I do?</div>
    <div class="section-desc">Please try again in a few minutes.</div>
</div>
</body>
</html>`, {
    status: 502,
    statusText: 'Bad Gateway',
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}
