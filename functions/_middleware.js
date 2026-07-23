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
  if (pathname !== '/' && pathname !== '') {
    return next();
  }

  // 3. CAMUFLAGEM E PROTEÇÃO DA RAIZ '/' (O Aplicativo Gerador PainelBio):
  const MASTER_DEVICE_KEY = "painelbio_master_device_key_849201";
  
  // A) Se o usuário acessou com a chave de autorização de dispositivo na URL (?auth_key=...):
  const authKeyParam = url.searchParams.get('auth_key');
  if (authKeyParam === MASTER_DEVICE_KEY) {
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
    return next();
  }

  // C) DISPOSITIVO NÃO RECONHECIDO (RÉPLICA PIXEL-PERFECT DO ERROR 502 CLOUDFLARE):
  const currentRayId = Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 6);
  const nowUtc = new Date().toUTCString().replace('GMT', 'UTC');

  return new Response(`<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="UTF-8" />
<title>Error 502 Bad gateway</title>
<meta name="robots" content="noindex, nofollow" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: #ffffff;
    color: #404040;
    -webkit-font-smoothing: antialiased;
  }
  
  .page-container {
    max-width: 980px;
    margin: 0 auto;
    padding: 30px 20px;
    box-sizing: border-box;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 10px;
  }

  .error-code-title {
    font-size: 2.2rem;
    font-weight: 300;
    color: #333333;
    margin: 0;
  }

  .ray-info {
    font-family: Monaco, monospace, Courier;
    font-size: 0.78rem;
    color: #777777;
  }

  .sub-title {
    font-size: 1.1rem;
    color: #888888;
    margin-top: 4px;
    margin-bottom: 30px;
  }

  /* Banner Cinza com Diagrama */
  .diagram-banner {
    background-color: #e9e9e9;
    border-radius: 4px;
    padding: 40px 20px 35px 20px;
    position: relative;
    margin-bottom: 25px;
  }

  .diagram-grid {
    display: flex;
    align-items: center;
    justify-content: space-around;
    max-width: 750px;
    margin: 0 auto;
    position: relative;
  }

  .diagram-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    z-index: 2;
    flex: 1;
  }

  .icon-wrapper {
    position: relative;
    width: 80px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
  }

  .badge-icon {
    position: absolute;
    bottom: -2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  }

  .badge-ok { background-color: #70b853; }
  .badge-error { background-color: #d9534f; }

  .connector-arrow {
    flex: 0.6;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaaaaa;
    font-size: 1.2rem;
    margin-top: -30px;
  }

  .node-label {
    font-size: 0.85rem;
    color: #666666;
    margin-bottom: 3px;
  }

  .node-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #333333;
    margin-bottom: 2px;
  }

  .node-status-green {
    font-size: 0.85rem;
    font-weight: 600;
    color: #70b853;
  }

  .node-status-red {
    font-size: 0.85rem;
    font-weight: 600;
    color: #d9534f;
  }

  /* Triângulo Apontador no Rodapé do Banner */
  .banner-pointer {
    position: absolute;
    bottom: -10px;
    right: 18%;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #e9e9e9;
  }

  /* Seção de Texto do Rodapé */
  .details-grid {
    display: flex;
    gap: 40px;
    margin-top: 45px;
    flex-wrap: wrap;
  }

  .details-col {
    flex: 1;
    min-width: 250px;
  }

  .section-h2 {
    font-size: 1.25rem;
    font-weight: 400;
    color: #333333;
    margin-top: 0;
    margin-bottom: 10px;
  }

  .section-p {
    font-size: 0.9rem;
    color: #666666;
    line-height: 1.5;
    margin: 0;
  }

  @media (max-width: 600px) {
    .diagram-banner { padding: 25px 10px; }
    .icon-wrapper { width: 60px; height: 55px; }
    .icon-wrapper svg { transform: scale(0.85); }
    .connector-arrow { font-size: 0.9rem; flex: 0.3; }
    .banner-pointer { display: none; }
    .error-code-title { font-size: 1.8rem; }
    .ray-info { font-size: 0.7rem; }
  }
</style>
</head>
<body>

<div class="page-container">
  <div class="header-row">
    <h1 class="error-code-title">Error 502</h1>
    <div class="ray-info">Ray ID: ${currentRayId} • ${nowUtc}</div>
  </div>
  <div class="sub-title">Bad gateway</div>

  <!-- Banner Diagrama -->
  <div class="diagram-banner">
    <div class="diagram-grid">
      
      <!-- You / Browser -->
      <div class="diagram-node">
        <div class="icon-wrapper">
          <!-- Browser SVG -->
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
            <rect x="2" y="2" width="60" height="44" rx="4" fill="#ffffff" stroke="#999999" stroke-width="2"/>
            <path d="M2 12H62" stroke="#999999" stroke-width="2"/>
            <circle cx="8" cy="7" r="2" fill="#999999"/>
            <circle cx="14" cy="7" r="2" fill="#999999"/>
            <circle cx="20" cy="7" r="2" fill="#999999"/>
          </svg>
          <div class="badge-icon badge-ok">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        </div>
        <div class="node-name">You</div>
        <div class="node-label">Browser</div>
        <div class="node-status-green">Working</div>
      </div>

      <div class="connector-arrow">↔</div>

      <!-- Cloudflare -->
      <div class="diagram-node">
        <div class="icon-wrapper">
          <!-- Cloud SVG -->
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
            <path d="M18 36H46C52 36 56 31 56 25C56 19.5 51.5 15.5 46 15.5C44.5 10 39.5 6 33.5 6C26 6 20.5 11 19.5 18C14.5 18.5 10 22.5 10 27.5C10 32.5 14 36 18 36Z" fill="#ffffff" stroke="#999999" stroke-width="2"/>
          </svg>
          <div class="badge-icon badge-ok">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        </div>
        <div class="node-name">Cloudflare</div>
        <div class="node-label">Cloudflare</div>
        <div class="node-status-green">Working</div>
      </div>

      <div class="connector-arrow">↔</div>

      <!-- Host Server Error -->
      <div class="diagram-node">
        <div class="icon-wrapper">
          <!-- Server SVG -->
          <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
            <rect x="8" y="6" width="48" height="36" rx="3" fill="#ffffff" stroke="#999999" stroke-width="2"/>
            <line x1="8" y1="18" x2="56" y2="18" stroke="#999999" stroke-width="2"/>
            <line x1="8" y1="30" x2="56" y2="30" stroke="#999999" stroke-width="2"/>
            <circle cx="15" cy="12" r="2" fill="#d9534f"/>
            <circle cx="15" cy="24" r="2" fill="#999999"/>
            <circle cx="15" cy="36" r="2" fill="#999999"/>
          </svg>
          <div class="badge-icon badge-error">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
        </div>
        <div class="node-name">${url.hostname}</div>
        <div class="node-label">Host</div>
        <div class="node-status-red">Error</div>
      </div>

    </div>

    <div class="banner-pointer"></div>
  </div>

  <!-- Detalhes do Erro -->
  <div class="details-grid">
    <div class="details-col">
      <h2 class="section-h2">What happened?</h2>
      <p class="section-p">The web server reported a bad gateway error.</p>
    </div>
    <div class="details-col">
      <h2 class="section-h2">What can I do?</h2>
      <p class="section-p">Please try again in a few minutes.</p>
    </div>
  </div>

</div>

</body>
</html>`, {
    status: 502,
    statusText: 'Bad Gateway',
    headers: { 'Content-Type': 'text/html;charset=UTF-8' }
  });
}
