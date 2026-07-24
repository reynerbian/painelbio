export function generateStaticSite(data) {
  const presetMap = {
    'gray': { c1: '#a3d959', c2: '#82b938', text: '#000000', bg: '#0e110d', cardBg: '#151914' },
    'sunset': { c1: '#ff0844', c2: '#ffb199', text: '#ffffff', bg: '#120508', cardBg: '#1c080d' },
    'neon-blue': { c1: '#00c6ff', c2: '#0072ff', text: '#000000', bg: '#050c17', cardBg: '#0a1628' },
    'synthwave': { c1: '#f107a3', c2: '#7b2ff7', text: '#ffffff', bg: '#130419', cardBg: '#1d0726' },
    'fire': { c1: '#ff5858', c2: '#f857a6', text: '#ffffff', bg: '#170606', cardBg: '#240a0a' },
    'aurora': { c1: '#00ff87', c2: '#60e3fa', text: '#000000', bg: '#041710', cardBg: '#09241a' },
    'indigo': { c1: '#06b6d4', c2: '#4f46e5', text: '#ffffff', bg: '#060a17', cardBg: '#0d1326' },
    'cyber-lime': { c1: '#a8ff78', c2: '#78ffd6', text: '#000000', bg: '#091409', cardBg: '#102110' },
    'rose-gold': { c1: '#fda085', c2: '#f6d365', text: '#000000', bg: '#170e0a', cardBg: '#241711' },
    'golden': { c1: '#f5af19', c2: '#f12711', text: '#000000', bg: '#171104', cardBg: '#241a07' },
    'deep-purple': { c1: '#e94057', c2: '#8a2387', text: '#ffffff', bg: '#120512', cardBg: '#1e091e' },
    'platinum': { c1: '#ffffff', c2: '#9e9e9e', text: '#000000', bg: '#111111', cardBg: '#1c1c1c' }
  };

  const isVitrine = Boolean(data && data.model === 'vitrine');
  const theme = presetMap[data.preset] || presetMap['gray'];
  const cleanArroba = (data.arroba || '').replace('@', '').trim();
  const instaUrl = cleanArroba ? `https://instagram.com/${cleanArroba}` : '#';
  const bioAlign = data.bioAlign || 'center';
  // ADD-ON: BANNER DE ANÚNCIO FLUTUANTE NO TOPO
  const tbTexts = [data.addonTopbannerText1, data.addonTopbannerText2, data.addonTopbannerText3].filter(Boolean);
  const hasTopBanner = Boolean((data.addonTopbannerActive || tbTexts.length > 0) && tbTexts.length > 0);
  const tbBg = data.addonTopbannerBg || '#0f172a';
  const tbColor = data.addonTopbannerColor || '#38bdf8';

  const isSlide = Boolean(data.addonTopbannerSlide);
  const pauseSec = parseInt(data.addonTopbannerPause || 2, 10);

  const topBannerHtml = hasTopBanner ? `
    <div id="pb-top-banner" style="position: fixed; top: 0; left: 0; width: 100%; background: ${tbBg}; color: ${tbColor}; padding: 10px 14px; font-size: 0.8rem; font-weight: 700; text-align: center; z-index: 99999; box-shadow: 0 4px 15px rgba(0,0,0,0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; overflow: hidden; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s; ${isSlide ? 'transform: translateY(-100%); opacity: 0;' : 'transform: translateY(0); opacity: 1;'}">
        <span id="pb-tb-text" style="transition: opacity 0.3s ease-in-out;">${tbTexts[0]}</span>
    </div>
    <script>
        (function() {
            var texts = ${JSON.stringify(tbTexts)};
            var isSlide = ${isSlide};
            var pauseMs = ${pauseSec} * 1000;
            var idx = 0;
            var banner = document.getElementById('pb-top-banner');
            var textEl = document.getElementById('pb-tb-text');
            if (!banner || !textEl || texts.length === 0) return;

            if (isSlide) {
                function runSlideCycle() {
                    banner.style.transform = 'translateY(0)';
                    banner.style.opacity = '1';

                    setTimeout(function() {
                        banner.style.transform = 'translateY(-100%)';
                        banner.style.opacity = '0';

                        setTimeout(function() {
                            idx = (idx + 1) % texts.length;
                            textEl.textContent = texts[idx];
                            runSlideCycle();
                        }, pauseMs);
                    }, 3500);
                }
                setTimeout(runSlideCycle, 500);
            } else {
                if (texts.length > 1) {
                    setInterval(function() {
                        textEl.style.opacity = '0';
                        setTimeout(function() {
                            idx = (idx + 1) % texts.length;
                            textEl.textContent = texts[idx];
                            textEl.style.opacity = '1';
                        }, 300);
                    }, 3500);
                }
            }
        })();
    </script>
  ` : '';

  // SE FOR O MODELO 2: VITRINE (Sem card embutido, fotos no topo soltas, avatar sobreposto, botões estilo modelo 1 com borda colorida)
  if (isVitrine) {
    const h1 = data.highlight1Img || '';
    const h2 = data.highlight2Img || '';
    const h3 = data.highlight3Img || '';
    const hasHeroPhotos = Boolean(h1 || h2 || h3);

    const btn1Html = data.btn1Title ? `<a href="${data.btn1Url || '#'}" class="v-btn" target="_blank" rel="noopener" onclick="trackAction('click')">${data.btn1Title}</a>` : '';
    const btn2Html = data.btn2Title ? `<a href="${data.btn2Url || '#'}" class="v-btn" target="_blank" rel="noopener" onclick="trackAction('click')">${data.btn2Title}</a>` : '';
    const btn3Html = data.btn3Title ? `<a href="${data.btn3Url || '#'}" class="v-btn" target="_blank" rel="noopener" onclick="trackAction('click')">${data.btn3Title}</a>` : '';
    const btn4Html = data.btn4Title ? `<a href="${data.btn4Url || '#'}" class="v-btn" target="_blank" rel="noopener" onclick="trackAction('click')">${data.btn4Title}</a>` : '';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${data.name || data.arroba || 'Vitrine'}</title>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
                for (let r of regs) r.unregister();
            });
        }
        function trackAction(type) {
            try {
                var cleanSlug = "${cleanArroba}";
                if (navigator.sendBeacon) {
                    navigator.sendBeacon('/api/track?slug=' + encodeURIComponent(cleanSlug) + '&type=' + type);
                } else {
                    fetch('/api/track?slug=' + encodeURIComponent(cleanSlug) + '&type=' + type, { method: 'POST', keepalive: true });
                }
            } catch(e){}
        }
    </script>
    <style>
        :root {
            --v-accent: ${theme.c1};
            --v-accent-2: ${theme.c2 || theme.c1};
            --v-bg: ${theme.bg};
        }
        
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
            background-color: var(--v-bg);
            color: #ffffff; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
            display: flex;
            justify-content: center;
        }

        .v-container {
            width: 100%;
            max-width: 440px;
            padding: 16px 14px 40px 14px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Grid Superior de 3 Fotos Sem Moldura */
        .v-grid-hero {
            width: 100%;
            position: relative;
            margin-bottom: 50px;
        }

        .v-main-pic {
            width: 100%;
            height: 320px;
            border-radius: 24px;
            overflow: hidden;
            background: #1a1a1a;
            margin-bottom: 10px;
        }

        .v-main-pic img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .v-sub-row {
            display: flex;
            gap: 10px;
            width: 100%;
        }

        .v-sub-pic {
            flex: 1;
            height: 155px;
            border-radius: 20px;
            overflow: hidden;
            background: #1a1a1a;
        }

        .v-sub-pic img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Avatar Sobreposto Centralizado com Borda/Anel Colorido Vibrante do Tema */
        .v-avatar-overlap {
            position: absolute;
            bottom: -42px;
            left: 50%;
            transform: translateX(-50%);
            width: 94px;
            height: 94px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--v-accent), var(--v-accent-2));
            padding: 3px;
            border: 4px solid var(--v-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            box-shadow: 0 0 22px rgba(0,0,0,0.6);
            z-index: 20;
            box-sizing: border-box;
        }

        .v-avatar-overlap-inner {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            background: #111;
        }

        .v-avatar-overlap-inner img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Conteúdo e Informações */
        .v-info {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .v-title {
            font-family: Georgia, "Times New Roman", serif;
            font-size: 1.55rem;
            font-weight: 700;
            color: #ffffff;
            margin: 0 0 6px 0;
            line-height: 1.25;
            text-align: center;
        }

        .v-arroba {
            font-size: 0.95rem;
            color: var(--v-accent);
            text-decoration: none;
            font-weight: 600;
            margin-bottom: 12px;
            display: inline-block;
        }

        .v-bio {
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.5;
            margin: 0 0 28px 0;
            text-align: ${bioAlign};
            white-space: pre-wrap;
            width: 90%;
        }

        /* Botões Estilo Modelo 1 (Transparente, Texto Branco, Borda Colorida do Tema) */
        .v-buttons {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .v-btn {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            border: 1.5px solid var(--v-accent);
            padding: 16px 20px;
            border-radius: 18px;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            box-shadow: 0 6px 18px rgba(0,0,0,0.3);
            transition: transform 0.2s, background 0.2s;
        }

        .v-btn:active {
            transform: scale(0.98);
            background: rgba(255, 255, 255, 0.12);
        }

        .v-footer {
            margin-top: 35px;
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.35);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .v-footer a {
            color: rgba(255, 255, 255, 0.55);
            text-decoration: none;
            font-weight: 700;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    ${topBannerHtml}
    <div class="v-container">
        
        <!-- Grid Superior -->
        ${hasHeroPhotos ? `
        <div class="v-grid-hero">
            ${h1 ? `<div class="v-main-pic"><img src="${h1}" alt="Destaque 1"></div>` : ''}
            <div class="v-sub-row">
                ${h2 ? `<div class="v-sub-pic"><img src="${h2}" alt="Destaque 2"></div>` : ''}
                ${h3 ? `<div class="v-sub-pic"><img src="${h3}" alt="Destaque 3"></div>` : ''}
            </div>
            
            ${data.avatar ? `
            <div class="v-avatar-overlap">
                <div class="v-avatar-overlap-inner">
                    <img src="${data.avatar}" alt="${data.name || ''}">
                </div>
            </div>` : ''}
        </div>` : data.avatar ? `
        <div style="position: relative; width: 100px; height: 100px; margin-bottom: 20px;">
            <div class="v-avatar-overlap" style="position: relative; bottom: 0; left: 0; transform: none; margin: 0 auto;">
                <div class="v-avatar-overlap-inner">
                    <img src="${data.avatar}" alt="${data.name || ''}">
                </div>
            </div>
        </div>` : ''}

        <!-- Informações da Loja -->
        <div class="v-info">
            <h1 class="v-title">${data.name || ''}</h1>
            <a href="${instaUrl}" target="_blank" rel="noopener" class="v-arroba">${data.arroba || ''}</a>
            ${data.bio ? `<p class="v-bio">${data.bio}</p>` : ''}

            <!-- Botões Estilo Modelo 1 com Borda Colorida -->
            <div class="v-buttons">
                ${btn1Html}
                ${btn2Html}
                ${btn3Html}
                ${btn4Html}
            </div>

            <div class="v-footer">
                CRIADO COM <a href="/" onclick="trackAction('referral')">PAINELBIO</a>
            </div>
        </div>

    </div>
</body>
</html>`;
  }

  // MODELO 1: CLASSIC (Card com vidro, brilhos e botões finos)
  const avatarHtml = data.avatar ? `
            <div class="preview-avatar-glow">
                <div class="preview-avatar-inner">
                    <img src="${data.avatar}" alt="${data.name || ''}">
                </div>
            </div>` : '';

  const bioHtml = data.bio ? `<p class="preview-bio">${data.bio}</p>` : '';
  const btn1Html = data.btn1Title ? `<a href="${data.btn1Url || '#'}" class="preview-link-btn" target="_blank" rel="noopener" onclick="trackAction('click')">${data.btn1Title}</a>` : '';
  const btn2Html = data.btn2Title ? `<a href="${data.btn2Url || '#'}" class="preview-link-btn" target="_blank" rel="noopener" onclick="trackAction('click')">${data.btn2Title}</a>` : '';
  const btn3Html = data.btn3Title ? `<a href="${data.btn3Url || '#'}" class="preview-link-btn" target="_blank" rel="noopener" onclick="trackAction('click')">${data.btn3Title}</a>` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${data.name || data.arroba || 'Bio'}</title>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
                for (let r of regs) r.unregister();
            });
        }
        function trackAction(type) {
            try {
                var cleanSlug = "${cleanArroba}";
                if (navigator.sendBeacon) {
                    navigator.sendBeacon('/api/track?slug=' + encodeURIComponent(cleanSlug) + '&type=' + type);
                } else {
                    fetch('/api/track?slug=' + encodeURIComponent(cleanSlug) + '&type=' + type, { method: 'POST', keepalive: true });
                }
            } catch(e){}
        }
    </script>
    <style>
        :root {
            --theme-c1: ${theme.c1};
            --theme-c2: ${theme.c2};
            --theme-b: rgba(255, 255, 255, 0.08);
            --theme-g: rgba(255, 255, 255, 0.15);
        }
        
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overscroll-behavior: none;
            background-color: #121214;
            color: #fff; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .preview-bio-page {
            width: 100%;
            min-height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
            box-sizing: border-box;
            position: relative;
        }

        .bg-glow {
            position: absolute;
            width: 280px;
            height: 280px;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.58;
            z-index: 0;
            pointer-events: none;
            mix-blend-mode: screen;
            animation: glow-wave 12s infinite ease-in-out alternate;
        }

        .bg-glow-top { top: -50px; left: -50px; background: radial-gradient(circle, var(--theme-c1) 0%, transparent 70%); }
        .bg-glow-bottom { bottom: -50px; right: -50px; background: radial-gradient(circle, var(--theme-c2) 0%, transparent 70%); animation-delay: -6s; }

        @keyframes glow-wave {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            50% { transform: translate(15px, -15px) scale(1.15) rotate(45deg); }
            100% { transform: translate(-10px, 15px) scale(0.9) rotate(90deg); }
        }

        .preview-card {
            width: 100%;
            max-width: 400px;
            background: rgba(18, 15, 27, 0.75);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--theme-b);
            border-radius: 28px;
            padding: 24px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6);
            position: relative;
            z-index: 10;
            box-sizing: border-box;
        }

        .preview-avatar-glow {
            width: 85px;
            height: 85px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--theme-c1), var(--theme-c2));
            padding: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 14px;
        }

        .preview-avatar-inner {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: #111111;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .preview-avatar-inner img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .preview-name {
            font-size: 1.2rem;
            font-weight: 700;
            margin: 0 0 4px 0;
            color: #ffffff;
            text-align: center;
        }

        .preview-arroba {
            font-size: 0.85rem;
            color: var(--theme-c1);
            text-decoration: none;
            margin-bottom: 14px;
            text-align: center;
            display: inline-block;
            font-weight: 600;
        }

        .preview-bio {
            font-size: 0.88rem;
            color: rgba(255, 255, 255, 0.8);
            text-align: ${bioAlign};
            line-height: 1.5;
            margin-bottom: 24px;
            width: 95%;
            word-break: break-word;
        }

        .preview-links {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .preview-link-btn {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--theme-b);
            color: #ffffff;
            padding: 16px 20px;
            border-radius: 14px;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            box-sizing: border-box;
        }
        
        .footer { margin-top: 25px; font-size: 0.75rem; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 6px; }
        .footer a { color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 600; text-transform: uppercase; }
    </style>
</head>
<body>
    ${topBannerHtml}
    <div class="preview-bio-page">
        <div class="bg-glow bg-glow-top"></div>
        <div class="bg-glow bg-glow-bottom"></div>
        
        <div class="preview-card">
            ${avatarHtml}
            <h2 class="preview-name">${data.name || ''}</h2>
            <a href="${instaUrl}" target="_blank" rel="noopener" class="preview-arroba">${data.arroba || ''}</a>
            ${bioHtml}
            <div class="preview-links">
                ${btn1Html}
                ${btn2Html}
                ${btn3Html}
            </div>
            <div class="footer">
                CRIADO COM <a href="/" onclick="trackAction('referral')">PAINELBIO</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}
