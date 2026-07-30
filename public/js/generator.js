// --- PAINELBIO STATIC SITE GENERATOR (PUBLIC MODULE) ---
// Contém o gerador estático oficial de HTML para todos os 4 modelos (Classic, Vitrine, Carrossel, Shop)

export function generateStaticSite(data) {
  if (!data) return '';

  const modelType = (data && data.model ? String(data.model).toLowerCase().trim() : 'classic');
  const hasCarouselImages = Boolean(data && (data.carousel1Img || data.carousel2Img || data.carousel3Img));
  const hasHighlightImages = Boolean(data && (data.highlight1Img || data.highlight2Img || data.highlight3Img));

  const isShop = modelType === 'shop';
  const isEbook = modelType === 'ebook';
  const isCarousel = (modelType === 'carousel' || modelType === 'carrossel' || (modelType === 'classic' && hasCarouselImages)) && !isShop && !isEbook;
  const isVitrine = (modelType === 'vitrine' || (modelType === 'classic' && !hasCarouselImages && hasHighlightImages)) && !isCarousel && !isShop && !isEbook;

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

  const theme = presetMap[data.preset] || presetMap['gray'];
  const cleanArroba = (data.arroba || '').replace(/^@+/, '').trim();
  const displayArroba = cleanArroba ? `@${cleanArroba}` : '';
  const instaUrl = cleanArroba ? `https://instagram.com/${cleanArroba}` : '#';
  const bioAlign = data.bioAlign || 'center';

  // ADD-ON 1: BANNER DE ANÚNCIO FLUTUANTE NO TOPO
  const tbTexts = [data.addonTopbannerText1, data.addonTopbannerText2, data.addonTopbannerText3].filter(Boolean);
  const hasTopBanner = Boolean((data.addonTopbannerActive || tbTexts.length > 0) && tbTexts.length > 0);
  const tbBg = data.addonTopbannerBg || '#0f172a';
  const tbColor = data.addonTopbannerColor || '#38bdf8';
  const effect = data.addonTopbannerEffect || 'fade';
  const isSlide = effect === 'slide' || effect === 'marquee';
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

  // ADD-ON 5: BALÃO DE ATENDIMENTO "ONLINE AGORA" (WHATSAPP)
  const hasLiveChat = Boolean(data.addonLivechatActive);
  const lcAvatar = data.addonLivechatAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const lcName = data.addonLivechatName || 'Suporte Amanda';
  const lcStatusText = data.addonLivechatStatusText || 'Online Agora';
  const lcMessage = data.addonLivechatMessage || 'Dúvidas sobre produtos? Fale comigo no WhatsApp! 👋';
  const lcPosition = data.addonLivechatPosition || 'bottom-left';
  const lcUrl = data.addonLivechatUrl || (data.btn1Url && data.btn1Url.includes('wa.me') ? data.btn1Url : 'https://wa.me/5511999999999');
  const lcColor = data.addonLivechatColor || '#22c55e';

  let liveChatHtml = '';
  if (hasLiveChat) {
      let posCss = 'bottom: 20px; left: 20px;';
      if (lcPosition === 'bottom-right') posCss = 'bottom: 20px; right: 20px;';

      liveChatHtml = `
      <style>
          @keyframes lcPulse {
              0% { transform: scale(0.95); box-shadow: 0 0 0 0 ${lcColor}aa; }
              70% { transform: scale(1); box-shadow: 0 0 0 8px ${lcColor}00; }
              100% { transform: scale(0.95); box-shadow: 0 0 0 0 ${lcColor}00; }
          }
          @keyframes lcPop {
              0% { transform: scale(0.8) translateY(20px); opacity: 0; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
          }
      </style>
      <a href="${lcUrl}" target="_blank" rel="noopener" id="pb-static-livechat" style="position: fixed; ${posCss} z-index: 99998; display: flex; align-items: center; gap: 10px; background: rgba(15, 23, 42, 0.9); color: #ffffff; padding: 8px 14px 8px 10px; border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.18); box-shadow: 0 12px 30px rgba(0,0,0,0.6), 0 0 20px ${lcColor}33; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); text-decoration: none; max-width: 310px; animation: lcPop 0.6s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">
          <div style="position: relative; width: 42px; height: 42px; flex-shrink: 0;">
              <img src="${lcAvatar}" alt="${lcName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid ${lcColor};">
              <span style="position: absolute; bottom: 0; right: 0; width: 11px; height: 11px; background: ${lcColor}; border-radius: 50%; border: 2px solid #0f172a; animation: lcPulse 2s infinite;"></span>
          </div>
          <div style="display: flex; flex-direction: column; overflow: hidden;">
              <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 0.78rem; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lcName}</span>
                  <span style="font-size: 0.65rem; font-weight: 600; color: ${lcColor}; background: ${lcColor}22; padding: 1px 6px; border-radius: 10px; white-space: nowrap;">${lcStatusText}</span>
              </div>
              <span style="font-size: 0.72rem; color: rgba(255,255,255,0.85); line-height: 1.25; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lcMessage}</span>
          </div>
      </a>
      `;
  }

  // ADD-ON 2: CHUVA DE EMOJI
  const hasEmojiRain = Boolean(data.addonEmojiRainActive && data.addonEmojiRainEmoji);
  const erEmoji = data.addonEmojiRainEmoji || '🌸';
  const erCount = Math.min(Math.max(parseInt(data.addonEmojiRainCount || 8, 10), 1), 20);
  const erSpeed = data.addonEmojiRainSpeed || 'normal';
  const erCoverage = Math.min(Math.max(parseInt(data.addonEmojiRainCoverage || 80, 10), 10), 100);
  const erRotate = Boolean(data.addonEmojiRainRotate);
  const erDurMap = { slow: 6, normal: 5, fast: 3 };
  const erBase = erDurMap[erSpeed] || 3.5;
  let emojiRainHtml = '';
  if (hasEmojiRain) {
      let particles = '';
      const emojiArray = Array.from(erEmoji);
      for (let i = 0; i < erCount; i++) {
          const emoji = emojiArray[i % emojiArray.length] || '🌸';
          const sz  = (1.2 + Math.random() * 1.5).toFixed(2);
          const lft = (Math.random() * 90).toFixed(1);
          const dur = (erBase * (0.7 + Math.random() * 0.7)).toFixed(2);
          const dly = -(Math.random() * erBase * 2).toFixed(2);
          let animName = 'pb-emojifall';
          if (erRotate) animName = Math.random() > 0.5 ? 'pb-emojifall-cw' : 'pb-emojifall-ccw';
          particles += `<span style="position:absolute;top:0;left:${lft}%;font-size:${sz}rem;filter:blur(2px);pointer-events:none;animation:${animName} ${dur}s linear ${dly}s infinite;">${emoji}</span>`;
      }
      emojiRainHtml = `<style>body { position: relative; } @keyframes pb-emojifall{0%{top:-80px;opacity:0}10%{opacity:.38}90%{opacity:.38}100%{top:100%;opacity:0}}@keyframes pb-emojifall-cw{0%{top:-80px;transform:rotate(0deg);opacity:0}10%{opacity:.38}90%{opacity:.38}100%{top:100%;transform:rotate(540deg);opacity:0}}@keyframes pb-emojifall-ccw{0%{top:-80px;transform:rotate(0deg);opacity:0}10%{opacity:.38}90%{opacity:.38}100%{top:100%;transform:rotate(-540deg);opacity:0}}</style><div id="pb-emoji-rain" style="position:absolute;top:0;left:0;right:0;height:${erCoverage}%;overflow:hidden;pointer-events:none;z-index:0;">${particles}</div>`;
  }

  // ADD-ON 4: PLAYER DE ÁUDIO FLUTUANTE
  const hasAudioPlayer = Boolean(data.addonAudioPlayerActive);
  const apUrl = data.addonAudioPlayerUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';
  const apLabel = data.addonAudioPlayerLabel || 'Música da Loja';
  const apPosition = data.addonAudioPlayerPosition || 'bottom-right';
  const apColor = data.addonAudioPlayerColor || '#ec4899';
  const apWaveColor = data.addonAudioPlayerWaveColor || '#ffffff';
  const apAutoplay = Boolean(data.addonAudioPlayerAutoplay);

  let audioPlayerHtml = '';
  if (hasAudioPlayer) {
      let posCss = 'bottom: 20px; right: 20px;';
      if (apPosition === 'bottom-left') posCss = 'bottom: 20px; left: 20px;';
      if (apPosition === 'top-right') posCss = 'top: 20px; right: 20px;';

      audioPlayerHtml = `
      <style>
          @keyframes apWave { 0% { height: 25%; } 100% { height: 100%; } }
      </style>
      <div id="pb-static-audio-player" style="position: fixed; ${posCss} z-index: 99999; display: flex; align-items: center; gap: 9px; background: linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.92)); color: #ffffff; padding: 7px 16px 7px 8px; border-radius: 40px; font-size: 0.8rem; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border: 1px solid rgba(255, 255, 255, 0.18); border-top: 1px solid rgba(255, 255, 255, 0.35); box-shadow: 0 10px 30px rgba(0,0,0,0.55), 0 0 18px ${apColor}44; cursor: pointer; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); user-select: none; opacity: 0.92;">
          <div class="ap-icon-circle" style="width: 28px; height: 28px; border-radius: 50%; background: ${apColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 12px ${apColor}bb; transition: transform 0.2s;">
              <svg class="ap-icon-play" width="11" height="11" viewBox="0 0 24 24" fill="#ffffff" style="margin-left: 2px;">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <svg class="ap-icon-pause" width="11" height="11" viewBox="0 0 24 24" fill="#ffffff" style="display: none;">
                  <rect x="5" y="3" width="4" height="18" rx="1"></rect>
                  <rect x="15" y="3" width="4" height="18" rx="1"></rect>
              </svg>
          </div>
          <div class="ap-wave-bars" style="display: flex; align-items: flex-end; gap: 2.5px; height: 12px;">
              <span class="ap-wbar" style="width: 2.5px; height: 100%; background: ${apWaveColor}; border-radius: 2px; animation: apWave 0.75s ease-in-out infinite alternate; opacity: 0.9;"></span>
              <span class="ap-wbar" style="width: 2.5px; height: 60%; background: ${apWaveColor}; border-radius: 2px; animation: apWave 0.75s ease-in-out infinite 0.18s alternate; opacity: 0.9;"></span>
              <span class="ap-wbar" style="width: 2.5px; height: 85%; background: ${apWaveColor}; border-radius: 2px; animation: apWave 0.75s ease-in-out infinite 0.36s alternate; opacity: 0.9;"></span>
              <span class="ap-wbar" style="width: 2.5px; height: 45%; background: ${apWaveColor}; border-radius: 2px; animation: apWave 0.75s ease-in-out infinite 0.54s alternate; opacity: 0.9;"></span>
          </div>
          <span style="letter-spacing: 0.3px; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${apLabel}</span>
          <audio id="pb-static-audio-el" src="${apUrl}" loop ${apAutoplay ? 'autoplay' : ''}></audio>
      </div>
      <script>
          (function() {
              var player = document.getElementById('pb-static-audio-player');
              var audio = document.getElementById('pb-static-audio-el');
              if (!player || !audio) return;

              var playIcon = player.querySelector('.ap-icon-play');
              var pauseIcon = player.querySelector('.ap-icon-pause');
              var wbars = player.querySelectorAll('.ap-wbar');

              function updateUI(playing) {
                  if (playing) {
                      if (playIcon) playIcon.style.display = 'none';
                      if (pauseIcon) pauseIcon.style.display = 'block';
                      player.style.opacity = '1';
                      player.style.boxShadow = '0 10px 30px rgba(0,0,0,0.65), 0 0 22px ${apColor}77';
                      wbars.forEach(function(bar, idx) { bar.style.animation = 'apWave 0.75s ease-in-out infinite ' + (idx * 0.18) + 's alternate'; });
                  } else {
                      if (playIcon) playIcon.style.display = 'block';
                      if (pauseIcon) pauseIcon.style.display = 'none';
                      player.style.opacity = '0.85';
                      player.style.boxShadow = '0 6px 20px rgba(0,0,0,0.45), 0 0 12px ${apColor}33';
                      wbars.forEach(function(bar) { bar.style.animation = 'none'; });
                  }
              }

              function tryAutoplay() {
                  var promise = audio.play();
                  if (promise !== undefined) {
                      promise.then(function() { updateUI(true); }).catch(function() {
                          updateUI(false);
                          function playOnFirstInteraction() {
                              if (audio.paused) { audio.play().then(function() { updateUI(true); }).catch(function(){}); }
                              window.removeEventListener('pointerdown', playOnFirstInteraction);
                              window.removeEventListener('touchstart', playOnFirstInteraction);
                              window.removeEventListener('click', playOnFirstInteraction);
                          }
                          window.addEventListener('pointerdown', playOnFirstInteraction, { once: true });
                          window.addEventListener('touchstart', playOnFirstInteraction, { once: true });
                          window.addEventListener('click', playOnFirstInteraction, { once: true });
                      });
                  }
              }
              tryAutoplay();

              player.addEventListener('click', function(e) {
                  e.stopPropagation();
                  if (audio.paused) {
                      audio.play().then(function() { updateUI(true); }).catch(function(){});
                  } else {
                      audio.pause();
                      updateUI(false);
                  }
              });
          })();
      </script>`;
  }

  // ==========================================
  // MODELO 4: SHOP (Catálogo de Produtos em Carrossel)
  // ==========================================
  if (isShop) {
      const p1Img = data.shopP1Img || '';
      const p1Title = data.shopP1Title || '';
      const p1Price = data.shopP1Price || '';
      const p1Url = data.shopP1Url || '#';

      const p2Img = data.shopP2Img || '';
      const p2Title = data.shopP2Title || '';
      const p2Price = data.shopP2Price || '';
      const p2Url = data.shopP2Url || '#';

      const p3Img = data.shopP3Img || '';
      const p3Title = data.shopP3Title || '';
      const p3Price = data.shopP3Price || '';
      const p3Url = data.shopP3Url || '#';

      const catalogUrl = data.shopCatalogUrl || '';
      const bgImgUrl = p1Img || p2Img || p3Img || '';

      const p1CardHtml = (p1Img || p1Title || p1Price) ? `
          <div class="s-card">
              <div class="s-card-img-wrap">
                  <img src="${p1Img || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'}" alt="${p1Title}">
                  <div class="s-card-img-overlay"></div>
              </div>
              <div class="s-card-body">
                  <div class="s-card-title">${p1Title}</div>
                  <div class="s-card-price">${p1Price}</div>
                  <a href="${p1Url}" target="_blank" rel="noopener" class="s-card-btn" onclick="trackAction('click')">Eu quero este 🛍️</a>
              </div>
          </div>
      ` : '';

      const p2CardHtml = (p2Img || p2Title || p2Price) ? `
          <div class="s-card">
              <div class="s-card-img-wrap">
                  <img src="${p2Img || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}" alt="${p2Title}">
                  <div class="s-card-img-overlay"></div>
              </div>
              <div class="s-card-body">
                  <div class="s-card-title">${p2Title}</div>
                  <div class="s-card-price">${p2Price}</div>
                  <a href="${p2Url}" target="_blank" rel="noopener" class="s-card-btn" onclick="trackAction('click')">Eu quero este 🛍️</a>
              </div>
          </div>
      ` : '';

      const p3CardHtml = (p3Img || p3Title || p3Price) ? `
          <div class="s-card">
              <div class="s-card-img-wrap">
                  <img src="${p3Img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}" alt="${p3Title}">
                  <div class="s-card-img-overlay"></div>
              </div>
              <div class="s-card-body">
                  <div class="s-card-title">${p3Title}</div>
                  <div class="s-card-price">${p3Price}</div>
                  <a href="${p3Url}" target="_blank" rel="noopener" class="s-card-btn" onclick="trackAction('click')">Eu quero este 🛍️</a>
              </div>
          </div>
      ` : '';

      const catalogBtnHtml = catalogUrl ? `
          <div class="s-catalog-wrap">
              <a href="${catalogUrl}" target="_blank" rel="noopener" class="s-catalog-btn" onclick="trackAction('click')">Ver todo o catálogo →</a>
          </div>
      ` : '';

      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${data.name || data.arroba || 'Shop'}</title>
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
          --theme-color-1: ${theme.c1};
          --theme-color-2: ${theme.c2 || theme.c1};
      }
      * { box-sizing: border-box; }
      html, body {
          margin: 0; padding: 0; width: 100%; min-height: 100%;
          background: #0f172a; color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex; justify-content: center;
      }
      .s-container {
          position: relative; width: 100%; max-width: 440px; min-height: 100vh;
          padding: 24px 0 30px 0; box-sizing: border-box;
          display: flex; flex-direction: column; align-items: center;
          background: #0f172a; color: #fff; overflow: hidden;
      }
      .s-bg {
          position: absolute; top: 0; left: 0; width: 100%; height: 55%;
          background-size: cover; background-position: center;
          filter: blur(22px) brightness(0.45); transform: scale(1.1);
          z-index: 0;
      }
      .s-bg-fade {
          position: absolute; top: 0; left: 0; width: 100%; height: 60%;
          background: linear-gradient(to bottom, rgba(15,23,42,0) 0%, #0f172a 100%);
          z-index: 1; pointer-events: none;
      }
      .s-content {
          position: relative; z-index: 2; width: 100%;
          display: flex; flex-direction: column; align-items: center;
      }
      .s-profile {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; margin-bottom: 20px; padding: 0 16px;
      }
      .s-avatar-wrapper {
          width: 80px; height: 80px; border-radius: 50%; overflow: hidden;
          border: 3px solid var(--theme-color-1); margin-bottom: 12px;
          box-shadow: 0 0 20px ${theme.c1}44;
      }
      .s-avatar-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; }
      .s-avatar-inner img { width: 100%; height: 100%; object-fit: cover; }
      .s-name { font-size: 1.25rem; font-weight: 700; margin: 0 0 4px 0; color: #fff; }
      .s-arroba { font-size: 0.85rem; color: var(--theme-color-1); text-decoration: none; font-weight: 600; margin-bottom: 8px; display: inline-block; }
      .s-bio { font-size: 0.85rem; color: #cbd5e1; line-height: 1.4; margin: 0; white-space: pre-wrap; width: 100%; text-align: ${bioAlign}; }
      .s-section-title { font-size: 0.8rem; font-weight: 700; color: var(--theme-color-1); margin-bottom: 10px; padding: 0 16px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.85; width: 100%; }
      .s-carousel {
          display: flex; gap: 12px; overflow-x: auto; width: 100%;
          padding: 0 16px 16px 16px; scroll-snap-type: x mandatory;
          scrollbar-width: none; -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
      }
      .s-carousel::-webkit-scrollbar { display: none; }
      .s-card {
          flex: 0 0 82%; background: rgba(30,41,59,0.85); border-radius: 18px;
          overflow: hidden; scroll-snap-align: center;
          border: 1px solid ${theme.c1}33; backdrop-filter: blur(8px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      }
      .s-card-img-wrap { width: 100%; height: 200px; background: #0f172a; position: relative; overflow: hidden; }
      .s-card-img-wrap img { width: 100%; height: 100%; object-fit: cover; }
      .s-card-img-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(to top, rgba(15,23,42,0.9), transparent); }
      .s-card-body { padding: 14px; }
      .s-card-title { font-size: 1rem; font-weight: 600; margin-bottom: 4px; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .s-card-price { font-size: 1.2rem; font-weight: 700; color: var(--theme-color-1); margin-bottom: 12px; }
      .s-card-btn { display: block; width: 100%; padding: 10px 0; background: var(--theme-color-1); color: #0f172a; text-align: center; border-radius: 10px; font-weight: 800; text-decoration: none; font-size: 0.9rem; box-sizing: border-box; }
      .s-catalog-wrap { width: 100%; padding: 0 16px; box-sizing: border-box; margin-bottom: 16px; }
      .s-catalog-btn { display: block; width: 100%; padding: 14px 0; background: transparent; border: 2px solid var(--theme-color-1); color: var(--theme-color-1); text-align: center; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 0.95rem; box-sizing: border-box; }
      .s-footer { margin-top: 8px; font-size: 0.65rem; color: rgba(255,255,255,0.3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: center; }
      .s-footer a { color: rgba(255,255,255,0.5); text-decoration: none; }
      @keyframes shopFogPulse {
          0%, 100% { opacity: 0.10; transform: scaleX(1); }
          50%      { opacity: 0.22; transform: scaleX(1.07); }
      }
      @keyframes shopSparkRise {
          0%   { transform: translateY(0px) scale(1); opacity: 0; }
          8%   { opacity: 1; }
          88%  { opacity: 0.6; }
          100% { transform: translateY(-270px) scale(0.4); opacity: 0; }
      }
  </style>
</head>
<body>
  ${topBannerHtml}
  ${audioPlayerHtml}
  ${liveChatHtml}
  <div class="s-container">
    ${emojiRainHtml}

    ${bgImgUrl ? `
      <div class="s-bg" style="background-image: url('${bgImgUrl}');"></div>
      <div class="s-bg-fade"></div>
    ` : ''}

    <div class="s-content">
      <div class="s-profile">
        ${data.avatar ? `
          <div class="s-avatar-wrapper">
            <div class="s-avatar-inner">
              <img src="${data.avatar}" alt="${data.name || ''}">
            </div>
          </div>
        ` : ''}
        ${data.name ? `<h1 class="s-name">${data.name}</h1>` : ''}
        ${displayArroba ? `<a href="${instaUrl}" target="_blank" rel="noopener" class="s-arroba">${displayArroba}</a>` : ''}
        ${data.bio ? `<p class="s-bio">${data.bio}</p>` : ''}
      </div>

      <div style="width: 100%; margin-bottom: 20px;">
        <div class="s-section-title">✦ Mais Vendidos</div>
        <div class="s-carousel" id="s-carousel-el">
          ${p1CardHtml}
          ${p2CardHtml}
          ${p3CardHtml}
        </div>
      </div>

      ${catalogBtnHtml}

      <div class="s-footer">
        CRIADO COM <a href="/" onclick="trackAction('referral')">PAINELBIO</a>
      </div>
    </div>

    <!-- Névoa + Partículas -->
    <div id="s-particles-root" style="position: absolute; bottom: 0; left: 0; right: 0; height: 100%; pointer-events: none; z-index: 1; overflow: hidden;">
      <div style="position: absolute; bottom: -30px; left: -15%; width: 130%; height: 110px; border-radius: 50%; background: radial-gradient(ellipse at center, ${theme.c1} 0%, transparent 70%); opacity: 0.14; filter: blur(20px); animation: shopFogPulse 4s ease-in-out infinite;"></div>
      <div style="position: absolute; bottom: -10px; left: 15%; width: 70%; height: 65px; border-radius: 50%; background: radial-gradient(ellipse at center, ${theme.c1} 0%, transparent 70%); opacity: 0.10; filter: blur(28px); animation: shopFogPulse 5.5s ease-in-out infinite 2s;"></div>
    </div>
  </div>

  <script>
    (function() {
      var carousel = document.getElementById('s-carousel-el');
      if (carousel) {
        var isScrolling = false;
        carousel.addEventListener('wheel', function(e) {
          if (e.deltaY !== 0) {
            var cards = carousel.querySelectorAll('.s-card');
            if (cards.length > 0) {
              var step = cards[0].offsetWidth + 12;
              var canScrollRight = carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 10;
              var canScrollLeft = carousel.scrollLeft > 10;
              if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
                e.preventDefault();
                if (!isScrolling) {
                  isScrolling = true;
                  carousel.scrollBy({
                    left: (e.deltaY > 0 ? 1 : -1) * step,
                    behavior: 'smooth'
                  });
                  setTimeout(function() { isScrolling = false; }, 320);
                }
              }
            }
          }
        }, { passive: false });
      }
    })();
  </script>
</body>
</html>`;
  }

  // ==========================================
  // MODELO 3: CARROSSEL STORIES (3 Fotos Fullscreen)
  // ==========================================
  if (isCarousel) {
      const c1Img = data.carousel1Img || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000';
      const c2Img = data.carousel2Img || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000';
      const c3Img = data.carousel3Img || 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1000';

      const avatarHtml = data.avatar ? `
          <div class="c-avatar-wrapper">
              <div class="c-avatar-inner">
                  <img src="${data.avatar}" alt="${data.name || ''}">
              </div>
          </div>
      ` : '';

      const btn1Html = data.btn1Title ? `<a href="${data.btn1Url || '#'}" target="_blank" rel="noopener" class="c-btn" onclick="trackAction('click')">${data.btn1Title}</a>` : '';
      const btn2Html = data.btn2Title ? `<a href="${data.btn2Url || '#'}" target="_blank" rel="noopener" class="c-btn" onclick="trackAction('click')">${data.btn2Title}</a>` : '';

      const profileCardHtml = (data.name || data.arroba || data.bio) ? `
          <div class="c-profile-card">
              ${data.name ? `<h1 class="c-name">${data.name}</h1>` : ''}
              ${data.arroba ? `<a href="${instaUrl}" target="_blank" rel="noopener" class="c-arroba">${displayArroba}</a>` : ''}
              ${data.bio ? `<p class="c-bio">${data.bio}</p>` : ''}
          </div>
      ` : '';

      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${data.name || data.arroba || 'PainelBio'}</title>
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
      * { box-sizing: border-box; }
      html, body {
          margin: 0; padding: 0; width: 100%; height: 100%;
          overflow: hidden; background: #08080a; color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex; justify-content: center; align-items: center;
      }
      .c-fullscreen-page { position: relative; width: 100%; max-width: 440px; height: 100vh; margin: 0 auto; overflow: hidden; background: #000000; box-shadow: 0 0 60px rgba(0,0,0,0.9); }
      .c-slider { position: absolute; inset: 0; z-index: 1; }
      .c-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 0.8s ease-in-out; }
      .c-slide.active { opacity: 1; }
      .c-slide img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .c-overlay { position: absolute; inset: 0; z-index: 2; pointer-events: none; background: linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 35%, rgba(0,0,0,0.85) 100%); }
      .c-stories-progress { position: absolute; top: 12px; left: 12px; right: 12px; display: flex; gap: 4px; z-index: 10; }
      .c-prog-bar { flex: 1; height: 3px; background: rgba(255,255,255,0.35); border-radius: 2px; overflow: hidden; }
      .c-prog-fill { width: 0%; height: 100%; background: ${theme.c1}; transition: width 0.3s; }
      .c-header { position: absolute; top: 26px; left: 14px; right: 14px; display: flex; align-items: flex-start; gap: 10px; z-index: 10; }
      .c-avatar-wrapper { width: 48px; height: 48px; border-radius: 50%; padding: 2.5px; background: linear-gradient(135deg, ${theme.c1}, #ec4899); flex-shrink: 0; box-shadow: 0 4px 14px rgba(0,0,0,0.4); }
      .c-avatar-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #000; }
      .c-avatar-inner img { width: 100%; height: 100%; object-fit: cover; }
      .c-profile-card { flex: 1; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 14px; padding: 10px 12px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
      .c-name { font-size: 0.92rem; font-weight: 700; color: #ffffff; margin: 0 0 2px 0; }
      .c-arroba { font-size: 0.76rem; color: ${theme.c1}; text-decoration: none; font-weight: 600; margin-bottom: 4px; display: inline-block; }
      .c-bio { font-size: 0.75rem; color: rgba(255,255,255,0.85); line-height: 1.35; margin: 0; white-space: pre-wrap; text-align: ${bioAlign}; }
      .c-buttons { position: absolute; bottom: 24px; left: 14px; right: 14px; display: flex; gap: 10px; z-index: 10; }
      .c-btn { flex: 1; background: rgba(15, 23, 42, 0.78); color: #ffffff; border: 1.5px solid ${theme.c1}; padding: 13px 10px; border-radius: 14px; font-weight: 700; font-size: 0.82rem; text-align: center; text-decoration: none; box-shadow: 0 8px 20px rgba(0,0,0,0.5), 0 0 12px ${theme.c1}44; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-sizing: border-box; display: flex; align-items: center; justify-content: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .c-footer { position: absolute; bottom: 6px; left: 0; right: 0; text-align: center; font-size: 0.65rem; color: rgba(255,255,255,0.4); z-index: 10; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
      .c-footer a { color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>
  ${topBannerHtml}
  ${audioPlayerHtml}
  ${liveChatHtml}
  <div class="c-fullscreen-page">
      ${emojiRainHtml}
      <div class="c-slider">
          <div class="c-slide active" id="c-s-0"><img src="${c1Img}"></div>
          <div class="c-slide" id="c-s-1"><img src="${c2Img}"></div>
          <div class="c-slide" id="c-s-2"><img src="${c3Img}"></div>
      </div>
      <div class="c-overlay"></div>
      <div class="c-stories-progress">
          <div class="c-prog-bar"><div class="c-prog-fill" id="c-p-0" style="width: 100%;"></div></div>
          <div class="c-prog-bar"><div class="c-prog-fill" id="c-p-1"></div></div>
          <div class="c-prog-bar"><div class="c-prog-fill" id="c-p-2"></div></div>
      </div>
      <div class="c-header">
          ${avatarHtml}
          ${profileCardHtml}
      </div>
      <div class="c-buttons">
          ${btn1Html}
          ${btn2Html}
      </div>
      <div class="c-footer">
          CRIADO COM <a href="/" onclick="trackAction('referral')">PAINELBIO</a>
      </div>
  </div>
  <script>
      let currentSlide = 0;
      const totalSlides = 3;
      let isPaused = false;
      function updateCarousel(idx) {
          for (let i = 0; i < totalSlides; i++) {
              const s = document.getElementById('c-s-' + i);
              const p = document.getElementById('c-p-' + i);
              if (s) s.classList.toggle('active', i === idx);
              if (p) p.style.width = (i <= idx) ? '100%' : '0%';
          }
      }
      setInterval(() => {
          if (!isPaused) {
              currentSlide = (currentSlide + 1) % totalSlides;
              updateCarousel(currentSlide);
          }
      }, 4000);
      const pauseCarousel = () => { isPaused = true; };
      const resumeCarousel = () => { isPaused = false; };
      document.addEventListener('mousedown', pauseCarousel);
      document.addEventListener('mouseup', resumeCarousel);
      document.addEventListener('touchstart', pauseCarousel, { passive: true });
      document.addEventListener('touchend', resumeCarousel);
      document.addEventListener('touchcancel', resumeCarousel);
      let startX = 0;
      document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      document.addEventListener('touchend', e => {
          let endX = e.changedTouches[0].clientX;
          if (startX - endX > 40) {
              currentSlide = (currentSlide + 1) % totalSlides;
              updateCarousel(currentSlide);
          } else if (endX - startX > 40) {
              currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
              updateCarousel(currentSlide);
          }
      }, false);
  </script>
</body>
</html>`;
  }

  // ==========================================
  // MODELO 2: VITRINE
  // ==========================================
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

        .v-main-pic img { width: 100%; height: 100%; object-fit: cover; }
        .v-sub-row { display: flex; gap: 10px; width: 100%; }
        .v-sub-pic { flex: 1; height: 155px; border-radius: 20px; overflow: hidden; background: #1a1a1a; }
        .v-sub-pic img { width: 100%; height: 100%; object-fit: cover; }

        .v-avatar-overlap {
            position: absolute; bottom: -42px; left: 50%; transform: translateX(-50%);
            width: 94px; height: 94px; border-radius: 50%;
            background: linear-gradient(135deg, var(--v-accent), var(--v-accent-2));
            padding: 3px; border: 4px solid var(--v-bg);
            display: flex; align-items: center; justify-content: center;
            overflow: hidden; box-shadow: 0 0 22px rgba(0,0,0,0.6);
            z-index: 20; box-sizing: border-box;
        }

        .v-avatar-overlap-inner { width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #111; }
        .v-avatar-overlap-inner img { width: 100%; height: 100%; object-fit: cover; }

        .v-info { width: 100%; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .v-title { font-family: Georgia, "Times New Roman", serif; font-size: 1.55rem; font-weight: 700; color: #ffffff; margin: 0 0 6px 0; line-height: 1.25; text-align: center; }
        .v-arroba { font-size: 0.95rem; color: var(--v-accent); text-decoration: none; font-weight: 600; margin-bottom: 12px; display: inline-block; }
        .v-bio { font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); line-height: 1.5; margin: 0 0 28px 0; text-align: ${bioAlign}; white-space: pre-wrap; width: 90%; }
        .v-buttons { width: 100%; display: flex; flex-direction: column; gap: 14px; }
        .v-btn { width: 100%; background: rgba(255, 255, 255, 0.05); color: #ffffff; border: 1.5px solid var(--v-accent); padding: 16px 20px; border-radius: 18px; text-decoration: none; font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; display: flex; align-items: center; justify-content: center; box-sizing: border-box; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); box-shadow: 0 6px 18px rgba(0,0,0,0.3); transition: transform 0.2s, background 0.2s; }
        .v-btn:active { transform: scale(0.98); background: rgba(255, 255, 255, 0.12); }
        .v-footer { margin-top: 35px; font-size: 0.75rem; color: rgba(255, 255, 255, 0.35); display: flex; align-items: center; gap: 6px; }
        .v-footer a { color: rgba(255, 255, 255, 0.55); text-decoration: none; font-weight: 700; text-transform: uppercase; }
    </style>
</head>
<body>
    ${topBannerHtml}
    ${audioPlayerHtml}
    ${liveChatHtml}
    <div class="v-container">
        ${emojiRainHtml}
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

        <div class="v-info">
            <h1 class="v-title">${data.name || ''}</h1>
            <a href="${instaUrl}" target="_blank" rel="noopener" class="v-arroba">${displayArroba}</a>
            ${data.bio ? `<p class="v-bio">${data.bio}</p>` : ''}

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

  // ==========================================
  // MODELO 5: E-BOOK (Infoproduto com Card Flutuante e Capa 3D)
  // ==========================================
  if (isEbook) {
    const avatarHtml = data.avatar ? `
            <div class="eb-avatar-wrapper">
                <div class="eb-avatar-inner">
                    <img src="${data.avatar}" alt="${data.name || ''}">
                </div>
            </div>` : '';

    const bioHtml = data.bio ? `<p class="eb-bio">${data.bio}</p>` : '';
    
    // Card do Ebook
    const ebCover = data.ebookCover || '';
    const ebTitle = data.ebookTitle || 'E-book';
    const ebDesc = data.ebookDesc || '';
    const ebBtnText = data.ebookBtnText || 'Comprar E-book 🛒';
    const ebBuyUrl = data.ebookBuyUrl || '#';

    const hasEbookData = Boolean(ebCover || ebTitle);
    const ebookCardHtml = hasEbookData ? `
            <div class="eb-card">
                <!-- Badges do Infoproduto -->
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; box-sizing: border-box;">
                    <span style="background: rgba(255,255,255,0.06); color: var(--theme-c1); font-size: 0.65rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--theme-c1); text-transform: uppercase; letter-spacing: 0.5px;">🔥 Lançamento</span>
                    <div style="display: flex; align-items: center; gap: 2px;">
                        <span style="color: #fbbf24; font-size: 0.8rem;">★★★★★</span>
                        <span style="font-size: 0.65rem; color: #94a3b8; font-weight: 600; margin-left: 2px;">(4.9)</span>
                    </div>
                </div>

                <div class="eb-card-header">
                    <div class="eb-cover-container">
                        <img src="${ebCover}" class="eb-cover" alt="${ebTitle}" onerror="this.src='https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'">
                    </div>
                    <div class="eb-info-container">
                        <h3 class="eb-title">${ebTitle}</h3>
                        <p class="eb-desc">${ebDesc}</p>
                        
                        <!-- Pequena Lista de Benefícios (Checklist) -->
                        <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 6px;">
                            <span style="font-size: 0.68rem; color: #34d399; font-weight: 600;">✓ Acesso Vitalício Imediato</span>
                            <span style="font-size: 0.68rem; color: #34d399; font-weight: 600;">✓ Material Complementar Incluso</span>
                        </div>
                    </div>
                </div>

                <!-- Barra de Preço e Desconto (De/Por) -->
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.25); padding: 10px 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.04); box-sizing: border-box; width: 100%;">
                    <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-decoration: line-through;">De R$ 97,00</span>
                    <div style="display: flex; flex-direction: column; align-items: flex-end;">
                        <span style="font-size: 0.65rem; color: #34d399; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Super Oferta</span>
                        <span style="font-size: 0.95rem; color: #fff; font-weight: 800;">Por apenas R$ 29,90</span>
                    </div>
                </div>

                <a href="${ebBuyUrl}" target="_blank" rel="noopener" class="eb-buy-btn" onclick="trackAction('click')">
                    ${ebBtnText}
                </a>
            </div>` : '';

    // Links adicionais
    const btn1Html = data.btn1Title ? `<a href="${data.btn1Url || '#'}" class="eb-link-btn" target="_blank" rel="noopener" onclick="trackAction('click')">${data.btn1Title}</a>` : '';
    const btn2Html = data.btn2Title ? `<a href="${data.btn2Url || '#'}" class="eb-link-btn" target="_blank" rel="noopener" onclick="trackAction('click')">${data.btn2Title}</a>` : '';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${data.name || data.arroba || 'E-book'}</title>
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
        }
        
        html, body {
            margin: 0; padding: 0; width: 100%; height: 100%;
            background-color: #06040a;
            color: #ffffff; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex; align-items: center; justify-content: center;
        }

        .eb-page {
            width: 100%; min-height: 100%; display: flex; flex-direction: column;
            align-items: center; padding: 28px 16px;
            box-sizing: border-box; position: relative;
            overflow-x: hidden;
        }

        /* Luzes de Fundo */
        .eb-glow-bg {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.28;
            pointer-events: none;
            z-index: 0;
        }
        .eb-glow-top { top: -80px; left: -80px; background: radial-gradient(circle, var(--theme-c1) 0%, transparent 70%); }
        .eb-glow-bottom { bottom: -80px; right: -80px; background: radial-gradient(circle, var(--theme-c2) 0%, transparent 70%); }

        .eb-header {
            position: relative; z-index: 10;
            display: flex; flex-direction: column; align-items: center;
            text-align: center; margin-bottom: 24px; width: 100%; max-width: 420px;
        }

        .eb-avatar-wrapper {
            width: 76px; height: 76px; border-radius: 50%;
            background: linear-gradient(135deg, var(--theme-c1), var(--theme-c2));
            padding: 3px; display: flex; align-items: center; justify-content: center;
            margin-bottom: 12px; box-shadow: 0 0 20px rgba(99,102,241,0.25);
        }

        .eb-avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: #000; overflow: hidden; }
        .eb-avatar-inner img { width: 100%; height: 100%; object-fit: cover; }
        
        .eb-name { font-size: 1.25rem; font-weight: 700; margin: 0 0 4px 0; color: #ffffff; text-align: center; }
        .eb-arroba { font-size: 0.88rem; color: var(--theme-c1); text-decoration: none; margin-bottom: 8px; text-align: center; display: inline-block; font-weight: 600; }
        .eb-bio { font-size: 0.88rem; color: #94a3b8; text-align: center; line-height: 1.45; margin: 0; width: 90%; word-break: break-word; }

        @keyframes ebFloat {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
        }

        .eb-card {
            width: 100%; max-width: 420px; background: rgba(13, 10, 24, 0.7);
            border: 1.5px solid rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.06);
            border-image: linear-gradient(to bottom right, rgba(255,255,255,0.12), rgba(255,255,255,0.01)) 1;
            border-radius: 24px; padding: 18px;
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99,102,241,0.08); 
            position: relative; z-index: 10; box-sizing: border-box; 
            display: flex; flex-direction: column; gap: 16px;
            backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); 
            margin-bottom: 22px;
            animation: ebFloat 4s ease-in-out infinite;
        }

        /* Hack de borda arredondada + gradiente */
        .eb-card::before {
            content: ""; position: absolute; inset: 0; border-radius: 24px; padding: 1.5px;
            background: linear-gradient(145deg, var(--theme-c1) 40%, var(--theme-c2) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor; mask-composite: exclude;
            pointer-events: none; opacity: 0.28;
        }

        .eb-card-header { display: flex; gap: 16px; align-items: flex-start; }

        .eb-cover-container {
            width: 95px; height: 130px; flex-shrink: 0; perspective: 1000px;
        }

        .eb-cover {
            width: 100%; height: 100%; object-fit: cover; border-radius: 8px;
            box-shadow: -6px 6px 16px rgba(0,0,0,0.75); border: 1px solid rgba(255,255,255,0.12);
            transform: rotateY(-14deg) rotateX(4deg); display: block;
        }

        .eb-info-container { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .eb-title { font-size: 1.05rem; font-weight: 800; color: #fff; margin: 0; line-height: 1.35; }
        .eb-desc { font-size: 0.78rem; color: #94a3b8; line-height: 1.4; margin: 0; }

        .eb-buy-btn {
            width: 100%; height: 48px; background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 12px; color: #fff; text-decoration: none; font-weight: 700;
            font-size: 0.95rem; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 16px rgba(16,185,129,0.35); transition: transform 0.2s, filter 0.2s;
            text-align: center; border: 1px solid rgba(255,255,255,0.08); cursor: pointer;
            text-shadow: 0 1px 2px rgba(0,0,0,0.25);
        }

        .eb-buy-btn:hover { filter: brightness(1.08); }
        .eb-buy-btn:active { transform: scale(0.97); }

        .eb-buttons-container { position: relative; z-index: 10; width: 100%; max-width: 420px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        
        .eb-link-btn {
            background: rgba(255, 255, 255, 0.03); 
            border: 1.5px solid rgba(255, 255, 255, 0.05);
            color: #ffffff; padding: 15px 20px; border-radius: 14px; text-decoration: none;
            font-size: 0.9rem; font-weight: 600; display: flex; align-items: center;
            justify-content: center; width: 100%; box-sizing: border-box;
            transition: all 0.25s ease;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
            position: relative;
        }

        /* Borda de gradiente do tema no link */
        .eb-link-btn::before {
            content: ""; position: absolute; inset: 0; border-radius: 14px; padding: 1.5px;
            background: linear-gradient(135deg, var(--theme-c1), var(--theme-c2));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor; mask-composite: exclude;
            pointer-events: none; opacity: 0.15; transition: opacity 0.25s;
        }

        .eb-link-btn:hover {
            background: rgba(255, 255, 255, 0.06);
            box-shadow: 0 0 16px rgba(255,255,255,0.05);
            transform: translateY(-1px);
        }
        .eb-link-btn:hover::before {
            opacity: 0.55;
        }
        .eb-link-btn:active { transform: scale(0.98); }

        .footer { position: relative; z-index: 10; margin-top: auto; font-size: 0.72rem; color: rgba(255,255,255,0.3); display: flex; align-items: center; gap: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .footer a { color: rgba(255,255,255,0.5); text-decoration: none; font-weight: 700; }
    </style>
</head>
<body>
    ${topBannerHtml}
    ${audioPlayerHtml}
    ${liveChatHtml}
    <div class="eb-page">
        ${emojiRainHtml}
        
        <div class="eb-glow-bg eb-glow-top"></div>
        <div class="eb-glow-bg eb-glow-bottom"></div>
        
        <div class="eb-header">
            ${avatarHtml}
            <h2 class="eb-name">${data.name || ''}</h2>
            <a href="${instaUrl}" target="_blank" rel="noopener" class="eb-arroba">${displayArroba}</a>
            ${bioHtml}
        </div>

        ${ebookCardHtml}

        <div class="eb-buttons-container">
            ${btn1Html}
            ${btn2Html}
        </div>

        <div class="footer">
            CRIADO COM <a href="/" onclick="trackAction('referral')">PAINELBIO</a>
        </div>
    </div>
</body>
</html>`;
  }

  // ==========================================
  // MODELO 1: CLASSIC (Padrão Fallback)
  // ==========================================
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
            margin: 0; padding: 0; width: 100%; height: 100%;
            overflow-x: hidden; overscroll-behavior: none;
            background-color: #121214; color: #fff; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex; align-items: center; justify-content: center;
        }

        .preview-bio-page {
            width: 100%; min-height: 100%; display: flex; flex-direction: column;
            align-items: center; justify-content: center; padding: 24px 16px;
            box-sizing: border-box; position: relative;
        }

        .bg-glow {
            position: absolute; width: 280px; height: 280px; border-radius: 50%;
            filter: blur(60px); opacity: 0.58; z-index: 0; pointer-events: none;
            mix-blend-mode: screen; animation: glow-wave 12s infinite ease-in-out alternate;
        }

        .bg-glow-top { top: -50px; left: -50px; background: radial-gradient(circle, var(--theme-c1) 0%, transparent 70%); }
        .bg-glow-bottom { bottom: -50px; right: -50px; background: radial-gradient(circle, var(--theme-c2) 0%, transparent 70%); animation-delay: -6s; }

        @keyframes glow-wave {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            50% { transform: translate(15px, -15px) scale(1.15) rotate(45deg); }
            100% { transform: translate(-10px, 15px) scale(0.9) rotate(90deg); }
        }

        .preview-card {
            width: 100%; max-width: 400px; background: rgba(18, 15, 27, 0.75);
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
            border: 1px solid var(--theme-b); border-radius: 28px; padding: 24px 20px;
            display: flex; flex-direction: column; align-items: center;
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6); position: relative;
            z-index: 10; box-sizing: border-box;
        }

        .preview-avatar-glow {
            width: 85px; height: 85px; border-radius: 50%;
            background: linear-gradient(135deg, var(--theme-c1), var(--theme-c2));
            padding: 3px; display: flex; align-items: center; justify-content: center;
            margin-bottom: 14px;
        }

        .preview-avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: #111111; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .preview-avatar-inner img { width: 100%; height: 100%; object-fit: cover; }
        .preview-name { font-size: 1.2rem; font-weight: 700; margin: 0 0 4px 0; color: #ffffff; text-align: center; }
        .preview-arroba { font-size: 0.85rem; color: var(--theme-c1); text-decoration: none; margin-bottom: 14px; text-align: center; display: inline-block; font-weight: 600; }
        .preview-bio { font-size: 0.88rem; color: rgba(255, 255, 255, 0.8); text-align: ${bioAlign}; line-height: 1.5; margin-bottom: 24px; width: 95%; word-break: break-word; }
        .preview-links { width: 100%; display: flex; flex-direction: column; gap: 12px; }
        .preview-link-btn { background: rgba(255, 255, 255, 0.04); border: 1px solid var(--theme-b); color: #ffffff; padding: 16px 20px; border-radius: 14px; text-decoration: none; font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; }
        .footer { margin-top: 25px; font-size: 0.75rem; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 6px; }
        .footer a { color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 600; text-transform: uppercase; }
    </style>
</head>
<body>
    ${topBannerHtml}
    ${audioPlayerHtml}
    ${liveChatHtml}
    <div class="preview-bio-page">
        ${emojiRainHtml}
        <div class="bg-glow bg-glow-top"></div>
        <div class="bg-glow bg-glow-bottom"></div>
        
        <div class="preview-card">
            ${avatarHtml}
            <h2 class="preview-name">${data.name || ''}</h2>
            <a href="${instaUrl}" target="_blank" rel="noopener" class="preview-arroba">${displayArroba}</a>
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

if (typeof window !== 'undefined') {
    window.generateStaticSite = generateStaticSite;
}
