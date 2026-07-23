export function generateStaticSite(data) {
  const presetMap = {
    'gray': { c1: '#e2e8f0', c2: '#475569', b: 'rgba(226, 232, 240, 0.28)', g: 'rgba(71, 85, 105, 0.45)' },
    'sunset': { c1: '#ff0844', c2: '#ffb199', b: 'rgba(255, 8, 68, 0.35)', g: 'rgba(255, 177, 153, 0.55)' },
    'neon-blue': { c1: '#00c6ff', c2: '#0072ff', b: 'rgba(0, 198, 255, 0.35)', g: 'rgba(0, 114, 255, 0.55)' },
    'synthwave': { c1: '#f107a3', c2: '#7b2ff7', b: 'rgba(241, 7, 163, 0.35)', g: 'rgba(123, 47, 247, 0.55)' },
    'fire': { c1: '#f857a6', c2: '#ff5858', b: 'rgba(248, 87, 166, 0.35)', g: 'rgba(255, 88, 88, 0.55)' },
    'aurora': { c1: '#00ff87', c2: '#60e3fa', b: 'rgba(0, 255, 135, 0.35)', g: 'rgba(96, 227, 250, 0.55)' },
    'indigo': { c1: '#4f46e5', c2: '#06b6d4', b: 'rgba(79, 70, 229, 0.35)', g: 'rgba(6, 182, 212, 0.55)' },
    'cyber-lime': { c1: '#a8ff78', c2: '#78ffd6', b: 'rgba(168, 255, 120, 0.35)', g: 'rgba(120, 255, 214, 0.55)' },
    'rose-gold': { c1: '#f6d365', c2: '#fda085', b: 'rgba(246, 211, 101, 0.35)', g: 'rgba(253, 160, 133, 0.55)' },
    'golden': { c1: '#f5af19', c2: '#f12711', b: 'rgba(245, 175, 25, 0.35)', g: 'rgba(241, 39, 17, 0.55)' },
    'deep-purple': { c1: '#8a2387', c2: '#e94057', b: 'rgba(138, 35, 135, 0.35)', g: 'rgba(233, 64, 87, 0.55)' },
    'platinum': { c1: '#ffffff', c2: '#616161', b: 'rgba(255, 255, 255, 0.35)', g: 'rgba(255, 255, 255, 0.55)' }
  };
  const theme = presetMap[data.preset] || presetMap['gray'];

  const avatarHtml = data.avatar ? `
            <div class="preview-avatar-glow">
                <div class="preview-avatar-inner">
                    <img src="${data.avatar}" alt="${data.name || ''}">
                </div>
            </div>` : '';

  const bioHtml = data.bio ? `<p class="preview-bio">${data.bio}</p>` : '';
  
  const btn1Html = data.btn1Title ? `<a href="${data.btn1Url || '#'}" class="preview-link-btn" target="_blank">${data.btn1Title}</a>` : '';
  const btn2Html = data.btn2Title ? `<a href="${data.btn2Url || '#'}" class="preview-link-btn" target="_blank">${data.btn2Title}</a>` : '';
  const btn3Html = data.btn3Title ? `<a href="${data.btn3Url || '#'}" class="preview-link-btn" target="_blank">${data.btn3Title}</a>` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${data.name || data.arroba || 'Bio'}</title>
    <script>
        // Desativa o ServiceWorker do App PWA nesta página para abrir direto como um site estático limpo
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
                for (let r of regs) r.unregister();
            });
        }
    </script>
    <style>
        :root {
            --theme-c1: ${theme.c1};
            --theme-c2: ${theme.c2};
            --theme-b: ${theme.b};
            --theme-g: ${theme.g};
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
            width: 250px;
            height: 250px;
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
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 28px;
            padding: 24px 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
            position: relative;
            z-index: 10;
            box-sizing: border-box;
        }

        .preview-avatar-glow {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--theme-c1), var(--theme-c2));
            padding: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px var(--theme-g);
            margin-bottom: 16px;
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
            font-size: 1.15rem;
            font-weight: 700;
            margin: 0 0 2px 0;
            color: #ffffff;
            text-align: center;
        }

        .preview-arroba {
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.5);
            text-decoration: none;
            margin-bottom: 12px;
            text-align: center;
            display: block;
        }

        .preview-bio {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.75);
            text-align: center;
            line-height: 1.5;
            margin-bottom: 24px;
            width: 90%;
        }

        .preview-links {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .preview-link-btn {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
            padding: 16px 20px;
            border-radius: 12px;
            text-decoration: none;
            font-size: 0.95rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            width: 100%;
            box-sizing: border-box;
        }

        .preview-link-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }
        
        .footer { margin-top: 25px; font-size: 0.75rem; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 6px; }
        .footer a { color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .footer svg { width: 14px; height: 14px; opacity: 0.7; }
    </style>
</head>
<body>
    <div class="preview-bio-page">
        <div class="bg-glow bg-glow-top"></div>
        <div class="bg-glow bg-glow-bottom"></div>
        
        <div class="preview-card">
            ${avatarHtml}
            
            <h2 class="preview-name">${data.name || ''}</h2>
            <a href="#" class="preview-arroba">${data.arroba || ''}</a>
            
            ${bioHtml}
            
            <div class="preview-links">
                ${btn1Html}
                ${btn2Html}
                ${btn3Html}
            </div>
            
            <div class="footer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                CRIADO COM <a href="/">PAINELBIO</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}
