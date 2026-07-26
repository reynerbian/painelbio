export function generateStaticSite(data) {
  if (!data) return '';
  const modelType = (data && data.model ? String(data.model).toLowerCase().trim() : 'classic');
  const hasCarouselImages = Boolean(data && (data.carousel1Img || data.carousel2Img || data.carousel3Img));
  const hasHighlightImages = Boolean(data && (data.highlight1Img || data.highlight2Img || data.highlight3Img));

  const isCarousel = modelType === 'carousel' || modelType === 'carrossel' || (modelType === 'classic' && hasCarouselImages);
  const isVitrine = (modelType === 'vitrine' || (modelType === 'classic' && !hasCarouselImages && hasHighlightImages)) && !isCarousel;

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
  const cleanArroba = (data.arroba || '').replace('@', '').trim();
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
  // MODELO 1: CLASSIC
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
