// --- PAINELBIO STATIC SITE GENERATOR (PUBLIC MODULE) ---
// Contém o gerador estático oficial de HTML para todos os 4 modelos (Classic, Vitrine, Carrossel, Shop)

export function generateStaticSite(data) {
  if (!data) return '';

  const modelType = (data && data.model ? String(data.model).toLowerCase().trim() : 'classic');
  const hasCarouselImages = Boolean(data && (data.carousel1Img || data.carousel2Img || data.carousel3Img));
  const hasHighlightImages = Boolean(data && (data.highlight1Img || data.highlight2Img || data.highlight3Img));
  const portraitLockHtml = `
  <!-- Bloqueio de Tela Deitada (Modo Retrato Obrigatório) -->
  <div id="pb-portrait-lock" style="position: fixed; inset: 0; background: #0c0f1d; z-index: 9999999; display: none; flex-direction: column; align-items: center; justify-content: center; color: #fff; text-align: center; padding: 20px; font-family: sans-serif;">
      <div style="font-size: 3rem; margin-bottom: 15px; animation: rotatePhone 2s ease-in-out infinite;">📱</div>
      <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 8px 0; color: #4ade80;">Por favor, rotacione o celular</h2>
      <p style="font-size: 0.85rem; color: #94a3b8; margin: 0;">Este site foi otimizado para ser visualizado em modo retrato (tela em pé).</p>
  </div>
  <style>
  @media (orientation: landscape) and (max-width: 900px) {
      #pb-portrait-lock { display: flex !important; }
  }
  @keyframes rotatePhone {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(-90deg); }
  }
  </style>
  `;

  const isShop = modelType === 'shop';
  const isEbook = modelType === 'ebook';
  const isCarousel = (modelType === 'carousel' || modelType === 'carrossel' || (modelType === 'classic' && hasCarouselImages)) && !isShop && !isEbook;
  const isVitrine = (modelType === 'vitrine' || (modelType === 'classic' && !hasCarouselImages && hasHighlightImages)) && !isCarousel && !isShop && !isEbook;

  const presetMap = {
    'gray': {
      c1: '#e2e8f0',
      c2: '#475569',
      border: 'rgba(226, 232, 240, 0.28)',
      glow: 'rgba(71, 85, 105, 0.45)',
      text: '#ffffff',
      bg: '#121214',
      cardBg: 'rgba(18, 15, 27, 0.75)'
    },
    'sunset': {
      c1: '#ff0844',
      c2: '#ffb199',
      border: 'rgba(255, 8, 68, 0.35)',
      glow: 'rgba(255, 177, 153, 0.55)',
      text: '#ffffff',
      bg: '#120508',
      cardBg: '#1c080d'
    },
    'neon-blue': {
      c1: '#00c6ff',
      c2: '#0072ff',
      border: 'rgba(0, 198, 255, 0.35)',
      glow: 'rgba(0, 114, 255, 0.55)',
      text: '#ffffff',
      bg: '#050c17',
      cardBg: '#0a1628'
    },
    'synthwave': {
      c1: '#f107a3',
      c2: '#7b2ff7',
      border: 'rgba(241, 7, 163, 0.35)',
      glow: 'rgba(123, 47, 247, 0.55)',
      text: '#ffffff',
      bg: '#130419',
      cardBg: '#1d0726'
    },
    'fire': {
      c1: '#f857a6',
      c2: '#ff5858',
      border: 'rgba(248, 87, 166, 0.35)',
      glow: 'rgba(255, 88, 88, 0.55)',
      text: '#ffffff',
      bg: '#170606',
      cardBg: '#240a0a'
    },
    'aurora': {
      c1: '#00ff87',
      c2: '#60e3fa',
      border: 'rgba(0, 255, 135, 0.35)',
      glow: 'rgba(96, 227, 250, 0.55)',
      text: '#000000',
      bg: '#041710',
      cardBg: '#09241a'
    },
    'indigo': {
      c1: '#4f46e5',
      c2: '#06b6d4',
      border: 'rgba(79, 70, 229, 0.35)',
      glow: 'rgba(6, 182, 212, 0.55)',
      text: '#ffffff',
      bg: '#060a17',
      cardBg: '#0d1326'
    },
    'cyber-lime': {
      c1: '#a8ff78',
      c2: '#78ffd6',
      border: 'rgba(168, 255, 120, 0.35)',
      glow: 'rgba(120, 255, 214, 0.55)',
      text: '#000000',
      bg: '#091409',
      cardBg: '#102110'
    },
    'rose-gold': {
      c1: '#f6d365',
      c2: '#fda085',
      border: 'rgba(246, 211, 101, 0.35)',
      glow: 'rgba(253, 160, 133, 0.55)',
      text: '#000000',
      bg: '#170e0a',
      cardBg: '#241711'
    },
    'golden': {
      c1: '#f5af19',
      c2: '#f12711',
      border: 'rgba(245, 175, 25, 0.35)',
      glow: 'rgba(241, 39, 17, 0.55)',
      text: '#000000',
      bg: '#171104',
      cardBg: '#241a07'
    },
    'deep-purple': {
      c1: '#8a2387',
      c2: '#e94057',
      border: 'rgba(138, 35, 135, 0.35)',
      glow: 'rgba(233, 64, 87, 0.55)',
      text: '#ffffff',
      bg: '#120512',
      cardBg: '#1e091e'
    },
    'platinum': {
      c1: '#ffffff',
      c2: '#616161',
      border: 'rgba(255, 255, 255, 0.35)',
      glow: 'rgba(97, 97, 97, 0.45)',
      text: '#000000',
      bg: '#111111',
      cardBg: '#1c1c1c'
    }
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
  const startsHidden = effect === 'slide' || effect === 'marquee';
  const pauseSec = parseInt(data.addonTopbannerPause || 2, 10);
  const pauseBetweenSec = parseInt(data.addonTopbannerPauseBetween || 1, 10);

  const topBannerHtml = hasTopBanner ? `
    <div id="pb-top-banner" style="position: fixed; top: 0; left: 0; width: 100%; background: ${tbBg}; color: ${tbColor}; padding: 10px 14px; font-size: 0.8rem; font-weight: 700; text-align: center; z-index: 99999; box-shadow: 0 4px 15px rgba(0,0,0,0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; overflow: hidden; transition: none; ${startsHidden ? 'transform: translateY(-100%); opacity: 0;' : 'transform: translateY(0); opacity: 1;'}">
        <span id="pb-tb-text" style="transition: none; display: inline-block;">${tbTexts[0]}</span>
    </div>
    <script>
        (function() {
            var texts = ${JSON.stringify(tbTexts)};
            var effect = ${JSON.stringify(effect)};
            var pauseMs = ${pauseSec} * 1000;
            var pauseBetweenMs = ${pauseBetweenSec} * 1000;
            var mqSpeed = ${parseInt(data.addonTopbannerMarqueeSpeed || 5, 10)};
            var mqPause = ${parseInt(data.addonTopbannerMarqueePause || 3, 10)};
            
            var idx = 0;
            var banner = document.getElementById('pb-top-banner');
            var textEl = document.getElementById('pb-tb-text');
            if (!banner || !textEl || texts.length === 0) return;

            // Configura transições e estilos específicos de cada efeito no início
            if (effect === 'slide') {
                banner.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s';
            } else if (effect === 'fade') {
                textEl.style.transition = 'opacity 0.3s ease-in-out';
            } else if (effect === 'bounce') {
                textEl.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s';
            } else if (effect === 'flip') {
                textEl.style.transition = 'transform 0.4s ease-in, opacity 0.3s';
                banner.style.perspective = '500px';
            } else if (effect === 'shutter') {
                banner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
            }

            function runCycle() {
                if (effect === 'marquee') {
                    textEl.style.whiteSpace = 'nowrap';
                    textEl.innerHTML = texts.join(' &nbsp;&nbsp;&nbsp;⭐&nbsp;&nbsp;&nbsp; ');
                    banner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                    banner.style.height = '0px';
                    banner.style.padding = '0px';
                    banner.style.overflow = 'hidden';
                    
                    setTimeout(function() {
                        banner.style.height = 'auto';
                        banner.style.padding = '8px 10px';
                        
                        var pos = 100;
                        textEl.style.transform = 'translateX(100%)';
                        var step = mqSpeed * 0.4;
                        var interval = setInterval(function() {
                            pos -= step;
                            textEl.style.transform = 'translateX(' + pos + '%)';
                            if (pos < -150) {
                                clearInterval(interval);
                                banner.style.height = '0px';
                                banner.style.padding = '0px';
                                setTimeout(runCycle, mqPause * 1000);
                            }
                        }, 20);
                    }, 500);
                    return;
                }

                if (texts.length <= 1) return;

                var isLastText = idx === texts.length - 1;
                var delay = isLastText ? pauseMs : pauseBetweenMs;

                setTimeout(function() {
                    // SAÍDA
                    if (effect === 'slide') {
                        banner.style.transform = 'translateY(-100%)';
                        banner.style.opacity = '0';
                    } else if (effect === 'fade') {
                        textEl.style.opacity = '0';
                    } else if (effect === 'bounce') {
                        textEl.style.transform = 'scale(0)';
                        textEl.style.opacity = '0';
                    } else if (effect === 'flip') {
                        textEl.style.transform = 'rotateX(90deg)';
                        textEl.style.opacity = '0';
                    } else if (effect === 'shutter') {
                        banner.style.height = '0px';
                        banner.style.padding = '0px';
                    }

                    var duration = (effect === 'slide') ? 450 : 400;

                    setTimeout(function() {
                        idx = (idx + 1) % texts.length;
                        textEl.textContent = texts[idx];

                        // ENTRADA
                        if (effect === 'slide') {
                            banner.style.transform = 'translateY(0)';
                            banner.style.opacity = '1';
                        } else if (effect === 'fade') {
                            textEl.style.opacity = '1';
                        } else if (effect === 'bounce') {
                            textEl.style.transform = 'scale(1)';
                            textEl.style.opacity = '1';
                        } else if (effect === 'flip') {
                            textEl.style.transform = 'rotateX(0deg)';
                            textEl.style.opacity = '1';
                        } else if (effect === 'shutter') {
                            banner.style.height = 'auto';
                            banner.style.padding = '8px 10px';
                        }

                        runCycle();
                    }, duration);

                }, delay);
            }

            if (effect === 'slide') {
                banner.style.transform = 'translateY(-100%)';
                banner.style.opacity = '0';
                setTimeout(function() {
                    banner.style.transform = 'translateY(0)';
                    banner.style.opacity = '1';
                    runCycle();
                }, 500);
            } else {
                runCycle();
            }
        })();
    </script>
  ` : '';

  // ADD-ON 5: BALÃO DE ATENDIMENTO "ONLINE AGORA" (WHATSAPP)
  const hasLiveChat = Boolean(data.addonLivechatActive);
  const lcAvatar = data.addonLivechatAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const lcName = data.addonLivechatName || 'Suporte Amanda';
  const lcStatusType = data.addonLivechatStatusType || 'smart';
  const lcHoursStart = data.addonLivechatHoursStart || '08:00';
  const lcHoursEnd = data.addonLivechatHoursEnd || '18:00';
  const lcStatusTextRaw = data.addonLivechatStatusText || 'Online Agora';
  const lcMessage = data.addonLivechatMessage || 'Dúvidas sobre produtos? Fale comigo no WhatsApp! 👋';
  const lcPosition = data.addonLivechatPosition || 'bottom-left';
  const lcUrl = data.addonLivechatUrl || (data.btn1Url && data.btn1Url.includes('wa.me') ? data.btn1Url : 'https://wa.me/5511999999999');
  const lcColor = data.addonLivechatColor || '#22c55e';
  const lcPretext = data.addonLivechatPretext || '';
  const lcDelay = data.addonLivechatDelay !== undefined ? Number(data.addonLivechatDelay) : 3;
  const lcMulti = Boolean(data.addonLivechatMulti);
  const lcName2 = data.addonLivechatName2 || 'Suporte Financeiro';
  const lcAvatar2 = data.addonLivechatAvatar2 || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100';
  const lcUrl2 = data.addonLivechatUrl2 || 'https://wa.me/5511999999999';
  const lcName3 = data.addonLivechatName3 || 'Vendas e Dúvidas';
  const lcAvatar3 = data.addonLivechatAvatar3 || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100';
  const lcUrl3 = data.addonLivechatUrl3 || 'https://wa.me/5511999999999';

  let liveChatHtml = '';
  if (hasLiveChat) {
      let posCss = 'bottom: 20px; left: 20px;';
      if (lcPosition === 'bottom-right') posCss = 'bottom: 20px; right: 20px;';

      let popupPosCss = 'bottom: 75px; left: 20px;';
      if (lcPosition === 'bottom-right') popupPosCss = 'bottom: 75px; right: 20px;';

      liveChatHtml = `
      <style>
          @keyframes lcPulse {
              0% { transform: scale(0.95); box-shadow: 0 0 0 0 var(--lc-pulse-glow, ${lcColor}aa); }
              70% { transform: scale(1); box-shadow: 0 0 0 8px var(--lc-pulse-glow, ${lcColor}00); }
              100% { transform: scale(0.95); box-shadow: 0 0 0 0 var(--lc-pulse-glow, ${lcColor}00); }
          }
          @keyframes lcPop {
              0% { transform: scale(0.8) translateY(20px); opacity: 0; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
          }
          .pb-agent-item:hover {
              background: rgba(255, 255, 255, 0.08) !important;
          }
      </style>
      
      <a href="${lcUrl}" rel="noopener" id="pb-static-livechat" style="position: fixed; ${posCss} z-index: 99998; display: none; align-items: center; gap: 10px; background: rgba(15, 23, 42, 0.9); color: #ffffff; padding: 8px 14px 8px 10px; border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.18); box-shadow: 0 12px 30px rgba(0,0,0,0.6), 0 0 20px ${lcColor}33; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); text-decoration: none; max-width: 310px; animation: lcPop 0.6s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">
          <div style="position: relative; width: 42px; height: 42px; flex-shrink: 0;">
              <img id="pb-lc-avatar-img" src="${lcAvatar}" alt="${lcName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid ${lcColor};">
              <span id="pb-lc-status-dot" style="position: absolute; bottom: 0; right: 0; width: 11px; height: 11px; background: ${lcColor}; border-radius: 50%; border: 2px solid #0f172a; animation: lcPulse 2s infinite;"></span>
          </div>
          <div style="display: flex; flex-direction: column; overflow: hidden;">
              <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 0.78rem; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lcName}</span>
                  <span id="pb-lc-status-text" style="font-size: 0.65rem; font-weight: 600; color: ${lcColor}; background: ${lcColor}22; padding: 1px 6px; border-radius: 10px; white-space: nowrap;">Online agora</span>
              </div>
              <span style="font-size: 0.72rem; color: rgba(255,255,255,0.85); line-height: 1.25; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lcMessage}</span>
          </div>
      </a>

      ${lcMulti ? `
      <div id="pb-static-livechat-popup" style="position: fixed; ${popupPosCss} z-index: 99999; display: none; flex-direction: column; gap: 6px; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 10px; width: 230px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); animation: lcPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
          <div style="font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 4px; margin-bottom: 2px;">Fale Conosco:</div>
          
          <a href="#" id="pb-agent-link-1" target="_blank" rel="noopener" class="pb-agent-item" style="display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 8px; text-decoration: none; transition: background 0.2s;">
              <div style="position: relative; width: 30px; height: 30px; flex-shrink: 0;">
                  <img src="${lcAvatar}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                  <span class="pb-agent-dot-1" style="position: absolute; bottom: 0; right: 0; width: 7px; height: 7px; background: ${lcColor}; border-radius: 50%; border: 1px solid #0f172a;"></span>
              </div>
              <div style="display: flex; flex-direction: column; overflow: hidden;">
                  <span style="font-size: 0.72rem; font-weight: 700; color: #fff;">${lcName}</span>
                  <span style="font-size: 0.6rem; color: #4ade80;">Suporte Geral</span>
              </div>
          </a>

          <a href="#" id="pb-agent-link-2" target="_blank" rel="noopener" class="pb-agent-item" style="display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 8px; text-decoration: none; transition: background 0.2s;">
              <div style="position: relative; width: 30px; height: 30px; flex-shrink: 0;">
                  <img src="${lcAvatar2}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                  <span class="pb-agent-dot-2" style="position: absolute; bottom: 0; right: 0; width: 7px; height: 7px; background: ${lcColor}; border-radius: 50%; border: 1px solid #0f172a;"></span>
              </div>
              <div style="display: flex; flex-direction: column; overflow: hidden;">
                  <span style="font-size: 0.72rem; font-weight: 700; color: #fff;">${lcName2}</span>
                  <span style="font-size: 0.6rem; color: #4ade80;">Online</span>
              </div>
          </a>

          <a href="#" id="pb-agent-link-3" target="_blank" rel="noopener" class="pb-agent-item" style="display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 8px; text-decoration: none; transition: background 0.2s;">
              <div style="position: relative; width: 30px; height: 30px; flex-shrink: 0;">
                  <img src="${lcAvatar3}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                  <span class="pb-agent-dot-3" style="position: absolute; bottom: 0; right: 0; width: 7px; height: 7px; background: ${lcColor}; border-radius: 50%; border: 1px solid #0f172a;"></span>
              </div>
              <div style="display: flex; flex-direction: column; overflow: hidden;">
                  <span style="font-size: 0.72rem; font-weight: 700; color: #fff;">${lcName3}</span>
                  <span style="font-size: 0.6rem; color: #4ade80;">Online</span>
              </div>
          </a>
      </div>
      ` : ''}

      <script>
      (function() {
          const type = "${lcStatusType}";
          const baseColor = "${lcColor}";
          const hoursStart = "${lcHoursStart}";
          const hoursEnd = "${lcHoursEnd}";
          const customText = "${lcStatusTextRaw}";
          const delaySecs = ${lcDelay};
          const isMulti = ${lcMulti};
          const pretext = "${lcPretext}";

          const dot = document.getElementById('pb-lc-status-dot');
          const text = document.getElementById('pb-lc-status-text');
          const img = document.getElementById('pb-lc-avatar-img');
          const link = document.getElementById('pb-static-livechat');
          
          if (!dot || !text || !link) return;
          
          let stText = 'Online agora';
          let stColor = baseColor;
          let stActive = true;
          
          if (type === 'online') {
              stText = 'Online agora';
              stColor = baseColor;
              stActive = true;
          } else if (type === 'custom') {
              stText = customText || 'Online agora';
              stColor = baseColor;
              stActive = true;
          } else {
              // Simulado Inteligente (Horário Comercial)
              try {
                  const now = new Date();
                  const curMin = now.getHours() * 60 + now.getMinutes();
                  const [sh, sm] = hoursStart.split(':').map(Number);
                  const [eh, em] = hoursEnd.split(':').map(Number);
                  const startMin = (sh !== undefined && !isNaN(sh) ? sh : 8) * 60 + (sm !== undefined && !isNaN(sm) ? sm : 0);
                  const endMin = (eh !== undefined && !isNaN(eh) ? eh : 18) * 60 + (em !== undefined && !isNaN(em) ? em : 0);
                  
                  if (curMin >= startMin && curMin <= endMin) {
                      stText = 'Online agora';
                      stColor = baseColor;
                      stActive = true;
                  } else {
                      stText = 'Fora de expediente';
                      stColor = '#94a3b8';
                      stActive = false;
                  }
              } catch (e) {
                  stText = 'Online agora';
                  stColor = baseColor;
                  stActive = true;
              }
          }
          
          // Aplica os estilos calculados
          text.textContent = stText;
          text.style.color = stColor;
          text.style.background = stColor + '22';
          
          dot.style.background = stColor;
          if (img) img.style.borderColor = stColor;
          
          if (stActive) {
              dot.style.animation = 'lcPulse 2s infinite';
              link.style.setProperty('--lc-pulse-glow', stColor + 'aa');
              link.style.boxShadow = '0 12px 30px rgba(0,0,0,0.6), 0 0 20px ' + stColor + '33';
          } else {
              dot.style.animation = 'none';
              link.style.boxShadow = '0 12px 30px rgba(0,0,0,0.6), 0 0 15px rgba(0,0,0,0.1)';
          }

          // Atualiza as bolinhas dos agentes secundários se houver multi-agentes
          if (isMulti) {
              const dot1 = document.querySelector('.pb-agent-dot-1');
              const dot2 = document.querySelector('.pb-agent-dot-2');
              const dot3 = document.querySelector('.pb-agent-dot-3');
              if (dot1) dot1.style.background = stColor;
              if (dot2) dot2.style.background = stColor;
              if (dot3) dot3.style.background = stColor;
          }

          // Função para formatar o link do WhatsApp com texto pré-definido
          function formatWa(rawUrl) {
              if (!rawUrl) return '';
              if (!pretext) return rawUrl;
              const divider = rawUrl.indexOf('?') !== -1 ? '&' : '?';
              return rawUrl + divider + 'text=' + encodeURIComponent(pretext);
          }

          // Formatação dos links
          if (isMulti) {
              const link1 = document.getElementById('pb-agent-link-1');
              const link2 = document.getElementById('pb-agent-link-2');
              const link3 = document.getElementById('pb-agent-link-3');
              if (link1) link1.href = formatWa("${lcUrl}");
              if (link2) link2.href = formatWa("${lcUrl2}");
              if (link3) link3.href = formatWa("${lcUrl3}");

              // Toggle do popup no clique do balão principal
              const popup = document.getElementById('pb-static-livechat-popup');
              link.addEventListener('click', function(e) {
                  e.preventDefault();
                  if (popup) {
                      popup.style.display = (popup.style.display === 'none' || popup.style.display === '') ? 'flex' : 'none';
                  }
              });

              // Fecha se clicar fora
              document.addEventListener('click', function(e) {
                  if (popup && popup.style.display === 'flex') {
                      if (!link.contains(e.target) && !popup.contains(e.target)) {
                          popup.style.display = 'none';
                      }
                  }
              });
          } else {
              link.href = formatWa("${lcUrl}");
          }

          // Atraso de Exibição (Delay)
          setTimeout(function() {
              link.style.display = 'flex';
          }, delaySecs * 1000);

      })();
      </script>
      `;
  }

  // ADD-ON 2: CHUVA DE EMOJI
  const hasEmojiRain = Boolean(data.addonEmojiRainActive && data.addonEmojiRainEmoji);
  const erEmoji = data.addonEmojiRainEmoji || '🌸';
  const erCount = Math.min(Math.max(parseInt(data.addonEmojiRainCount || 8, 10), 1), 20);
  const erSpeed = data.addonEmojiRainSpeed || 'normal';
  const erCoverage = Math.min(Math.max(parseInt(data.addonEmojiRainCoverage || 100, 10), 10), 100);
  const erRotate = Boolean(data.addonEmojiRainRotate);
  const erSway = Boolean(data.addonEmojiRainSway);
  const erOpacity = data.addonEmojiRainOpacity || 'normal';
  const erAsSvg = Boolean(data.addonEmojiRainAsSvg);
  const erSvgColor = data.addonEmojiRainSvgColor || '#7c3aed';
  
  const erDurMap = { slow: 6, normal: 5, fast: 3 };
  const erBase = erDurMap[erSpeed] || 3.5;
  const opacityMap = { 'ultra-suave': 0.15, suave: 0.30, normal: 0.45, destacado: 0.70, solido: 1.0 };
  const opacityVal = opacityMap[erOpacity] || 0.45;
  
  let emojiRainHtml = '';
  if (hasEmojiRain) {
      let particles = '';
      const emojiArray = Array.from(erEmoji);
      
      // Mapeamento de caminhos SVG para os 48 emojis do catálogo
      const emojiSvgPaths = {
          '🌸': '<path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4-4V2zm0 20a4 4 0 0 1-4-4v-2a4 4 0 0 1 4 4v2zm-10-10a4 4 0 0 1 4-4h2a4 4 0 0 1-4 4H2zm20 0a4 4 0 0 1-4 4h-2a4 4 0 0 1 4-4h2z"/>',
          '🌺': '<path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M12 3c-1.5 0-3 1.5-3 3.5S10.5 10 12 12c1.5-2 3-3.5 3-5.5S13.5 3 12 3zm0 18c1.5 0 3-1.5 3-3.5S13.5 14 12 12c-1.5 2-3 3.5-3 3.5s1.5 3.5 3 3.5zm-9-9c0 1.5 1.5 3 3.5 3S10 13.5 12 12c-2-1.5-3.5-3-5.5-3S3 10.5 3 12zm18 0c0-1.5-1.5-3-3.5-3S14 10.5 12 12c2 1.5 3.5 3 5.5 3s3.5-1.5 3.5-3z"/>',
          '🌻': '<circle cx="12" cy="12" r="4"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M19.07 4.93l-2.83 2.83M6.34 17.66l-2.83 2.83"/>',
          '🍀': '<path d="M12 12c1-2.5 3-4 5.5-4s4 1.5 4 4-1.5 4-4 4-4.5-1.5-5.5-4zm0 0c-1-2.5-3-4-5.5-4s-4 1.5-4 4 1.5 4 4 4 4.5-1.5 5.5-4zm0 0c1 2.5 3 4 5.5 4s4-1.5 4-4-1.5-4-4-4-4.5 1.5-5.5 4zm0 0c-1 2.5-3 4-5.5 4s-4-1.5-4-4 1.5-4 4-4 4.5 1.5 5.5 4zM12 12v9"/>',
          '❄️': '<path d="M2 12h20M12 2v20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07M8 12l-2-2M8 12l-2 2M16 12l2-2M16 12l2 2M12 8l-2-2M12 8l2-2M12 16l-2 2M12 16l2 2"/>',
          '⭐': '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
          '🌙': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
          '☀️': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
          '💸': '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4"/>',
          '💰': '<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6M12 1v22"/>',
          '💎': '<path d="M6 3h12l4 6-10 12L2 9zM2 9h20M11 3 8 9l4 12M13 3l3 6-4 12"/>',
          '🏆': '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6m12 5h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a6 6 0 0 1 6 6v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z"/>',
          '🔥': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
          '✨': '<path d="M12 2v6M12 16v6M2 12h6M16 12h6M5.93 5.93l4.24 4.24M13.83 13.83l4.24 4.24M18.07 5.93l-4.24 4.24M10.17 13.83l-4.24 4.24"/>',
          '💫': '<circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 1 0 10 10c0-2-2-3-4-3s-4 1-4 3"/>',
          '🦋': '<path d="M12 3v18M12 5C9 1 4 3 4 8c0 4 5 5 8 2M12 5c3-4 8-2 8 3 0 4-5 5-8 2M12 15c-3 3-8 2-8-3 0-3 5-3 8 1M12 15c3 3 8 2 8-3 0-3-5-3-8 1"/>',
          '🎉': '<path d="M4 22L14 12M14 12a4 4 0 1 0 4-4 4 4 0 0 0-4 4zm4-4l2-4M12 16l-4-2M16 20l1 2"/>',
          '🎈': '<path d="M12 2a7 7 0 0 0-7 7c0 4.3 3.5 8 7 8s7-3.7 7-8a7 7 0 0 0-7-7zM12 17v5"/>',
          '🎵': '<path d="M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm12-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>',
          '❤️': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
          '💕': '<path d="M12 10c1-1 2-2.5 2-4.5A3.5 3.5 0 0 0 10.5 2c-1.5 0-2 .5-3.5 2C5.5 2.5 5 2 3.5 2A3.5 3.5 0 0 0 0 5.5c0 2 1 3.5 2 4.5l5.5 5.5ZM19 17c1-1 2-2 2-3.5a2.5 2.5 0 0 0-2.5-2.5c-1 0-1.5.5-2.5 1.5S14.5 11 13.5 11A2.5 2.5 0 0 0 11 13.5c0 1.5 1 2.5 2 3.5l3.5 3.5Z"/>',
          '🌈': '<path d="M4 20A10 10 0 0 1 20 20M7 20A7 7 0 0 1 17 20M10 20A4 4 0 0 1 14 20"/>',
          '🍕': '<path d="M15 3L3 15M3 15c2 4 7 6 12 4s7-6 5-11L15 3zM9 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>',
          '🍦': '<path d="M12 2a4 4 0 0 0-4 4v3h8V6a4 4 0 0 0-4-4zm-4 7l4 12 4-12H8z"/>',
          '💀': '<path d="M12 2a8 8 0 0 0-8 8c0 2.66 1.34 4.5 3 6v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-4c1.66-1.5 3-3.34 3-6a8 8 0 0 0-8-8zm-3 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 1 1-3 0zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 1 1-3 0zm-3 5h0M10 17h4"/>',
          '👻': '<path d="M9 10h.01M15 10h.01M12 2a8 8 0 0 0-8 8v12l3-3 3 3 3-3 3 3 3-3 3 3V10a8 8 0 0 0-8-8z"/>',
          '👾': '<rect x="6" y="8" width="12" height="8" rx="2"/><path d="M8 6V8M16 6V8M10 12h4M6 10h2M16 10h2"/>',
          '👽': '<path d="M12 2a9 9 0 0 0-9 9c0 3.3 1.5 6.3 4 8v3h10v-3c2.5-1.7 4-4.7 4-8a9 9 0 0 0-9-9zM8 12.5a1.5 2.5 0 1 0 3 0 1.5 2.5 0 1 0-3 0zm5 0a1.5 2.5 0 1 0 3 0 1.5 2.5 0 1 0-3 0z"/>',
          '👑': '<path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM3 20h18v2H3z"/>',
          '⚡': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
          '🚀': '<path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M12 2C6 2 2 6 2 12c0 2.5 1 4.5 2.5 6l6-6 4 4 6-6c1.5-1.5 3.5-2.5 6-2.5 0-2.5-1-4.5-2.5-6zM9 15l-3 6M15 9l6-3M12 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>',
          '🛸': '<path d="M12 3a6 6 0 0 1 6 6H6a6 6 0 0 1 6-6zM2 14c0-2.2 4.5-4 10-4s10 1.8 10 4-4.5 4-10 4-10-1.8-10-4zm4 5l-1 3m13-3l1 3m-7-3v3"/>',
          '🌹': '<path d="M12 12c2.5-3 2.5-6.5 .5-8.5-2.5 2-4.5 4.5-4.5 7 0 .5 .5 1.5 1.5 2.5zm0 0v10M9 16c-2 0-3-1-4-2.5s.5-2 1.5-2 1.5 1.5 2.5 2.5M15 17c2 0 3-1 4-2.5s-.5-2-1.5-2-1.5 1.5-2.5 2.5"/>',
          '🌷': '<path d="M12 22V12M12 12C9 9.5 7.5 7 7.5 4.5S9 2 12 4c3-2 4.5.5 4.5 3S15 9.5 12 12zM5 16c0-2.5 2.5-4 2.5-4s1.5 1.5 1.5 2.5S7 18 5 16zM19 16c0-2.5-2.5-4-2.5-4s-1.5 1.5-1.5 2.5s2 3.5 4 1.5z"/>',
          '🍁': '<path d="M12 22V19M12 12l2-3 5 2-2-5 4-1-6-1-1-4-1 4-6 1 4 1-2 5 5-2 2 3z"/>',
          '🍂': '<path d="M12 22c-1.5-3-3.5-5-5.5-7C4.5 13 3 11 3 9.5c0-2 1.5-3.5 3-3.5s2 .5 3.5 2M12 22c1.5-3 3.5-5 5.5-7c2-2 3.5-4 3.5-5.5 0-2-1.5-3.5-3-3.5s-2 .5-3.5 2M12 22V2"/>',
          '🌱': '<path d="M12 22V12M12 12c-2.5 0-4.5-1.5-4.5-3.5S9 5 12 7c2.5-2 4.5.5 4.5 2.5S14.5 12 12 12z"/>',
          '🍿': '<path d="M6 10h12v12H6zM8 10V6M12 10V5M16 10V6M6 14h12M6 18h12"/>',
          '🍩': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>',
          '🍪': '<circle cx="12" cy="12" r="10"/><circle cx="8" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="8" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1" fill="currentColor"/><circle cx="14" cy="14" r="0.8" fill="currentColor"/><circle cx="12" cy="11" r="1" fill="currentColor"/>',
          '🐱': '<path d="M12 5c-3 0-6 2-6 6v7a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-7c0-4-3-6-6-6zM6 8L3 3l3 5zM18 8l3-5-3 5zM9 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM15 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>',
          '🐶': '<path d="M12 5c-3 0-5 2.5-5 5.5v5c0 2 1.5 3.5 3 3.5h4c1.5 0 3-1.5 3-3.5v-5C17 7.5 15 5 12 5zM4 10c0-2 2-3 2-3s1 2 1 3v4s-3 1-3-4zM20 10c0-2-2-3-2-3s-1 2-1 3v4s3 1 3-4zM9.5 9.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>',
          '🦊': '<path d="M12 18l-5-5V7l5 4 5-4v6l-5 5zM3 4l4 3-4 5zM21 4l-4 3 4 5z"/>',
          '🦁': '<circle cx="12" cy="13" r="7"/><path d="M12 6a9 9 0 0 0-9 9c0 3.3 1.5 6.3 4 8v-1M12 6a9 9 0 0 1 9 9c0 3.3-1.5 6.3-4 8v-1"/>',
          '🐼': '<circle cx="12" cy="13" r="8"/><circle cx="6" cy="6" r="3" fill="currentColor"/><circle cx="18" cy="6" r="3" fill="currentColor"/><circle cx="9.5" cy="11.5" r="1.5"/><circle cx="14.5" cy="11.5" r="1.5"/><path d="M12 15.5a1.5 1.5 0 0 1-1.5-1.5h3A1.5 1.5 0 0 1 12 15.5z"/>',
          '🔮': '<circle cx="12" cy="10" r="8"/><path d="M5 18a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4H5z"/>',
          '🧿': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor"/>',
          '🎯': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'
      };
      
      for (let i = 0; i < erCount; i++) {
          const emoji = emojiArray[i % emojiArray.length] || '🌸';
          const sz  = (1.0 + Math.random() * 1.4).toFixed(2); // De 1.0rem a 2.4rem
          const lft = (Math.random() * 90).toFixed(1);
          
          // Efeito 3D Depth of Field (Opção 1)
          const szVal = parseFloat(sz);
          let blurVal = 1.5;
          let speedMultiplier = 1.0;
          if (szVal > 1.9) {
              blurVal = 0.3; // Nítido (Frente)
              speedMultiplier = 0.75; // Rápido
          } else if (szVal < 1.4) {
              blurVal = 3.5; // Desfocado (Fundo)
              speedMultiplier = 1.35; // Lento
          }

          const dur = (erBase * speedMultiplier * (0.8 + Math.random() * 0.4)).toFixed(2);
          const dly = (i * (erBase / erCount) * 0.8).toFixed(2);
          let animName = 'pb-emojifall';
          if (erRotate) animName = Math.random() > 0.5 ? 'pb-emojifall-cw' : 'pb-emojifall-ccw';
          
          // Balanço Lateral (Opção 2)
          const swayDur = (2.0 + Math.random() * 1.5).toFixed(2);
          const swayDelay = (Math.random() * 2).toFixed(2);
          const swayAnim = erSway ? `, pb-emojisway ${swayDur}s ease-in-out ${swayDelay}s infinite alternate` : '';
          
          // Renderização do conteúdo da partícula (SVG ou caractere emoji)
          let particleContent = emoji;
          if (erAsSvg && emojiSvgPaths[emoji]) {
              particleContent = `<svg viewBox="0 0 24 24" width="100%" height="100%" style="fill:none;stroke:${erSvgColor};stroke-width:2.2px;stroke-linecap:round;stroke-linejoin:round;display:block;">${emojiSvgPaths[emoji]}</svg>`;
          }
          
          particles += `<span style="position:absolute;top:-80px;opacity:0;left:${lft}%;font-size:${sz}rem;width:1.2em;height:1.2em;display:inline-block;filter:blur(${blurVal}px);pointer-events:none;animation:${animName} ${dur}s linear ${dly}s infinite backwards${swayAnim};">${particleContent}</span>`;
      }
      emojiRainHtml = `<style>body { position: relative; } @keyframes pb-emojifall{0%{top:-80px;opacity:0}10%{opacity:${opacityVal}}90%{opacity:${opacityVal}}100%{top:100%;opacity:0}}@keyframes pb-emojifall-cw{0%{top:-80px;transform:rotate(0deg);opacity:0}10%{opacity:${opacityVal}}90%{opacity:${opacityVal}}100%{top:100%;transform:rotate(540deg);opacity:0}}@keyframes pb-emojifall-ccw{0%{top:-80px;transform:rotate(0deg);opacity:0}10%{opacity:${opacityVal}}90%{opacity:${opacityVal}}100%{top:100%;transform:rotate(-540deg);opacity:0}}@keyframes pb-emojisway{0%{margin-left:-12px}100%{margin-left:12px}}</style><div id="pb-emoji-rain" style="position:absolute;top:0;left:0;right:0;height:${erCoverage}%;overflow:hidden;pointer-events:none;z-index:0;">${particles}</div>`;
  }

  // ADD-ON 3: RODOPIO DO AVATAR
  const hasAvatarSpin = Boolean(data.addonAvatarSpinActive || data.avatarSpinConfig?.enabled);
  let avatarSpinHtml = '';
  if (hasAvatarSpin) {
    const asConfig = data.avatarSpinConfig || {};
    const asDuration = asConfig.duration || data.addonAvatarSpinDuration || 3;
    const asSpins    = asConfig.spins    || data.addonAvatarSpinSpins    || 4;
    const asAxis     = asConfig.axis     || data.addonAvatarSpinAxis     || 'Y';
    const asEasing   = asConfig.easing   || data.addonAvatarSpinEasing   || 'easeout';
    const asEntrance = asConfig.entrance || data.addonAvatarSpinEntrance || 'spin';
    const asTrigger  = asConfig.trigger  || data.addonAvatarSpinTrigger  || 'onload';
    const asRepeat   = Boolean(asConfig.repeat   ?? data.addonAvatarSpinRepeat);
    const asInterval = asConfig.interval || data.addonAvatarSpinInterval || 5;
    const asFloat    = Boolean(asConfig.float  ?? data.addonAvatarSpinFloat);
    const asPulse    = Boolean(asConfig.pulse  ?? data.addonAvatarSpinPulse);
    const asGlow     = Boolean(asConfig.glow   ?? data.addonAvatarSpinGlow);
    const asGlowColor   = asConfig.glowColor   || data.addonAvatarSpinGlowColor   || '#f59e0b';
    const asBorder      = Boolean(asConfig.border ?? data.addonAvatarSpinBorder);
    const asBorderColor = asConfig.borderColor || data.addonAvatarSpinBorderColor || '#a855f7';

    // Curva de aceleração
    let easingCss = 'cubic-bezier(0.0, 0.0, 0.2, 1)';
    if (asEasing === 'elastic') easingCss = 'cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    if (asEasing === 'spring')  easingCss = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

    // Keyframes de entrada
    let entranceKf = '';
    let entranceAnim = '';
    const totalDeg = asSpins * 360;
    if (asEntrance === 'zoomin') {
        entranceKf   = `@keyframes pb-av-zoomin { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }`;
        entranceAnim = `pb-av-zoomin ${asDuration}s ${easingCss} forwards`;
    } else if (asEntrance === 'fall') {
        entranceKf   = `@keyframes pb-av-fall { 0%{transform:translateY(-120px);opacity:0} 60%{transform:translateY(14px);opacity:1} 80%{transform:translateY(-8px)} 100%{transform:translateY(0);opacity:1} }`;
        entranceAnim = `pb-av-fall ${asDuration}s ${easingCss} forwards`;
    } else if (asEntrance === 'fadespin') {
        entranceKf   = `@keyframes pb-av-fadespin { from { transform: rotate${asAxis}(0deg); opacity: 0; } to { transform: rotate${asAxis}(${totalDeg}deg); opacity: 1; } }`;
        entranceAnim = `pb-av-fadespin ${asDuration}s ${easingCss} forwards`;
    } else {
        entranceKf   = `@keyframes pb-av-spin { from { transform: rotate${asAxis}(0deg); } to { transform: rotate${asAxis}(${totalDeg}deg); } }`;
        entranceAnim = `pb-av-spin ${asDuration}s ${easingCss} forwards`;
    }

    // Keyframes contínuos
    let contKf = '';
    let contAnims = [];
    if (asFloat) { contKf += `@keyframes pb-av-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}`; contAnims.push('pb-av-float 3.2s ease-in-out infinite'); }
    if (asPulse) { contKf += `@keyframes pb-av-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}`; contAnims.push('pb-av-pulse 1.6s ease-in-out infinite'); }
    if (asGlow)  { contKf += `@keyframes pb-av-glow{0%,100%{box-shadow:0 0 10px 4px ${asGlowColor}88}50%{box-shadow:0 0 26px 10px ${asGlowColor}cc}}`; contAnims.push('pb-av-glow 2.0s ease-in-out infinite'); }
    if (asBorder){ contKf += `@keyframes pb-av-border{0%{--pb-border-angle:0turn}100%{--pb-border-angle:1turn}}`; }

    // Borda giratória via wrapper
    const borderWrapCss = asBorder ? `
        #pb-avatar-wrap { position: relative !important; isolation: isolate !important; background: transparent !important; border-color: transparent !important; box-shadow: none !important; }
        #pb-avatar-wrap::before { content:''; position:absolute; inset:0px; border-radius:50%;
            background: conic-gradient(from var(--pb-border-angle,0turn), ${asBorderColor}, #ffffff44, ${asBorderColor});
            animation: pb-av-border 2s linear infinite; z-index:-1; }
        @property --pb-border-angle { syntax:'<angle>'; initial-value:0turn; inherits:false; }
    ` : '';

    // JS de gatilho
    const contAnimVal = contAnims.length ? contAnims.join(', ') : '';
    let triggerJs = '';
    if (asTrigger === 'onload') {
        triggerJs = `
        (function() {
            var wrap = document.getElementById('pb-avatar-wrap');
            if (!wrap) return;
            if (wrap.parentElement) { wrap.parentElement.style.perspective='600px'; wrap.parentElement.style.overflow='visible'; }
            wrap.style.borderRadius='50%';
            wrap.style.animation='none';
            void wrap.offsetHeight;
            wrap.style.animation='${entranceAnim}';
            var clearAnim = function() {
                wrap.style.animation = '';
                wrap.removeEventListener('animationend', clearAnim);
            };
            wrap.addEventListener('animationend', clearAnim);
            ${asRepeat ? `setInterval(function(){ wrap.style.animation='none'; void wrap.offsetHeight; wrap.style.animation='${entranceAnim}'; wrap.addEventListener('animationend', clearAnim); }, ${(asDuration + asInterval) * 1000});` : ''}
        })();`;
    } else if (asTrigger === 'click') {
        triggerJs = `
        (function() {
            var wrap = document.getElementById('pb-avatar-wrap');
            if (!wrap) return;
            if (wrap.parentElement) { wrap.parentElement.style.perspective='600px'; wrap.parentElement.style.overflow='visible'; }
            wrap.style.borderRadius='50%'; wrap.style.cursor='pointer';
            var clearAnim = function() {
                wrap.style.animation = '';
                wrap.removeEventListener('animationend', clearAnim);
            };
            wrap.addEventListener('click', function() { this.style.animation='none'; void this.offsetHeight; this.style.animation='${entranceAnim}'; this.addEventListener('animationend', clearAnim); });
            wrap.addEventListener('touchstart', function() { this.style.animation='none'; void this.offsetHeight; this.style.animation='${entranceAnim}'; this.addEventListener('animationend', clearAnim); }, {passive:true});
        })();`;
    } else if (asTrigger === 'hover') {
        triggerJs = `
        (function() {
            var wrap = document.getElementById('pb-avatar-wrap');
            if (!wrap) return;
            if (wrap.parentElement) { wrap.parentElement.style.perspective='600px'; wrap.parentElement.style.overflow='visible'; }
            wrap.style.borderRadius='50%'; wrap.style.cursor='pointer';
            var clearAnim = function() {
                wrap.style.animation = '';
                wrap.removeEventListener('animationend', clearAnim);
            };
            wrap.addEventListener('mouseover', function() { this.style.animation='none'; void this.offsetHeight; this.style.animation='${entranceAnim}'; this.addEventListener('animationend', clearAnim); });
        })();`;
    }

    avatarSpinHtml = `
<style>
    ${entranceKf}
    ${contKf}
    ${borderWrapCss}
    #pb-avatar-wrap { ${contAnimVal ? 'animation: ' + contAnimVal + ';' : ''} }
    #pb-avatar-wrap img { border-radius: 50%; }
</style>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        ${triggerJs}
    });
</script>`;
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

      const getYoutubeId = (url) => {
          if (!url) return null;
          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = url.match(regExp);
          return (match && match[2].length === 11) ? match[2] : null;
      };
      const ytId = getYoutubeId(apUrl);

      if (ytId) {
          audioPlayerHtml = `
      <div id="pb-static-audio-player" style="position: fixed; ${posCss} z-index: 99999; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: rgba(15, 23, 42, 0.85); color: #ffffff; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 8px 24px rgba(0,0,0,0.35); cursor: pointer; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: all 0.3s ease; user-select: none; opacity: 0.7;">
          <div class="ap-icon-circle" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
              <svg class="ap-icon-unmuted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <svg class="ap-icon-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
          </div>
          <div id="pb-youtube-player-container" style="display: none;"></div>
      </div>
      <script>
          (function() {
              var player = document.getElementById('pb-static-audio-player');
              if (!player) return;

              var playIcon = player.querySelector('.ap-icon-unmuted');
              var pauseIcon = player.querySelector('.ap-icon-muted');

              var isPlaying = false;
              var isMuted = false;

              function updateUI() {
                  if (playIcon && pauseIcon) {
                      if (isPlaying && !isMuted) {
                          playIcon.style.display = 'block';
                          pauseIcon.style.display = 'none';
                          player.style.opacity = '1';
                          player.style.boxShadow = '0 8px 24px rgba(0,0,0,0.55), 0 0 15px rgba(255,255,255,0.15)';
                      } else {
                          playIcon.style.display = 'none';
                          pauseIcon.style.display = 'block';
                          player.style.opacity = '0.7';
                          player.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35)';
                      }
                  }
              }

              var ytPlayer;
              var audioLoaded = false;
              var playRequested = false;

              var tag = document.createElement('script');
              tag.src = "https://www.youtube.com/iframe_api";
              var firstScriptTag = document.getElementsByTagName('script')[0];
              firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

              window.onYouTubeIframeAPIReady = function() {
                  ytPlayer = new YT.Player('pb-youtube-player-container', {
                      height: '0',
                      width: '0',
                      videoId: '${ytId}',
                      playerVars: {
                          'autoplay': ${apAutoplay ? 1 : 0},
                          'loop': 1,
                          'playlist': '${ytId}',
                          'controls': 0,
                          'disablekb': 1,
                          'fs': 0,
                          'modestbranding': 1,
                          'rel': 0,
                          'showinfo': 0
                      },
                      events: {
                          'onReady': function(event) {
                              audioLoaded = true;
                              if (${apAutoplay}) {
                                  ytPlayer.playVideo();
                                  playRequested = true;
                              }
                          },
                          'onStateChange': function(event) {
                              if (event.data === YT.PlayerState.PLAYING) {
                                  isPlaying = true;
                                  isMuted = ytPlayer.isMuted();
                              } else {
                                  isPlaying = false;
                              }
                              updateUI();
                          }
                      }
                  });
              };

              function setupInteractionPlay() {
                  function playOnFirstInteraction() {
                      if (!isPlaying && ytPlayer) {
                          ytPlayer.unMute();
                          ytPlayer.playVideo();
                          playRequested = true;
                      }
                      window.removeEventListener('pointerdown', playOnFirstInteraction);
                      window.removeEventListener('touchstart', playOnFirstInteraction);
                      window.removeEventListener('click', playOnFirstInteraction);
                  }
                  window.addEventListener('pointerdown', playOnFirstInteraction, { once: true });
                  window.addEventListener('touchstart', playOnFirstInteraction, { once: true });
                  window.addEventListener('click', playOnFirstInteraction, { once: true });
              }

              if (${apAutoplay}) {
                  setTimeout(function() {
                      if (!isPlaying && ytPlayer) {
                          ytPlayer.mute();
                          ytPlayer.playVideo();
                          isMuted = true;
                          isPlaying = true;
                          updateUI();
                          setupInteractionPlay();
                      }
                  }, 1200);
              }

              player.addEventListener('click', function(e) {
                  e.stopPropagation();
                  if (ytPlayer) {
                      if (!isPlaying) {
                          ytPlayer.unMute();
                          ytPlayer.playVideo();
                          playRequested = true;
                          isPlaying = true;
                          isMuted = false;
                      } else {
                          if (ytPlayer.isMuted()) {
                              ytPlayer.unMute();
                              isMuted = false;
                          } else {
                              ytPlayer.mute();
                              isMuted = true;
                          }
                      }
                      updateUI();
                  }
              });
          })();
      </script>`;
      } else {
          audioPlayerHtml = `
      <div id="pb-static-audio-player" style="position: fixed; ${posCss} z-index: 99999; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: rgba(15, 23, 42, 0.85); color: #ffffff; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.2); box-shadow: 0 8px 24px rgba(0,0,0,0.35); cursor: pointer; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: all 0.3s ease; user-select: none; opacity: 0.7;">
          <div class="ap-icon-circle" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
              <svg class="ap-icon-unmuted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <svg class="ap-icon-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
          </div>
          <audio id="pb-static-audio-el" src="${apUrl}" loop></audio>
      </div>
      <script>
          (function() {
              var player = document.getElementById('pb-static-audio-player');
              var audio = document.getElementById('pb-static-audio-el');
              if (!player || !audio) return;

              var playIcon = player.querySelector('.ap-icon-unmuted');
              var pauseIcon = player.querySelector('.ap-icon-muted');

              function updateUI() {
                  var isPlaying = !audio.paused;
                  var isMuted = audio.muted;

                  if (playIcon && pauseIcon) {
                      if (isPlaying && !isMuted) {
                          playIcon.style.display = 'block';
                          pauseIcon.style.display = 'none';
                          player.style.opacity = '1';
                          player.style.boxShadow = '0 8px 24px rgba(0,0,0,0.55), 0 0 15px rgba(255,255,255,0.15)';
                      } else {
                          playIcon.style.display = 'none';
                          pauseIcon.style.display = 'block';
                          player.style.opacity = '0.7';
                          player.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35)';
                      }
                  }
              }

              function fadeInAudio() {
                  audio.volume = 0;
                  var vol = 0;
                  var interval = setInterval(function() {
                      if (audio.paused || audio.muted) {
                          clearInterval(interval);
                          return;
                      }
                      vol += 0.05;
                      if (vol >= 1) {
                          vol = 1;
                          clearInterval(interval);
                      }
                      audio.volume = vol;
                  }, 100);
              }

              function tryAutoplay() {
                  audio.muted = false;
                  var promise = audio.play();
                  if (promise !== undefined) {
                      promise.then(function() { 
                          fadeInAudio();
                          updateUI(); 
                      }).catch(function() {
                          audio.muted = true;
                          audio.play().then(function() {
                              updateUI();
                              setupInteractionPlay();
                          }).catch(function() {
                              updateUI();
                              setupInteractionPlay();
                          });
                      });
                  }
              }

              function setupInteractionPlay() {
                  function playOnFirstInteraction() {
                      if (audio.paused) {
                          audio.muted = false;
                          audio.play().then(function() { 
                              fadeInAudio();
                              updateUI(); 
                          }).catch(function(){});
                      } else if (audio.muted) {
                          audio.muted = false;
                          fadeInAudio();
                          updateUI();
                      }
                      window.removeEventListener('pointerdown', playOnFirstInteraction);
                      window.removeEventListener('touchstart', playOnFirstInteraction);
                      window.removeEventListener('click', playOnFirstInteraction);
                  }
                  window.addEventListener('pointerdown', playOnFirstInteraction, { once: true });
                  window.addEventListener('touchstart', playOnFirstInteraction, { once: true });
                  window.addEventListener('click', playOnFirstInteraction, { once: true });
              }

              if (${apAutoplay}) {
                  tryAutoplay();
              }

              player.addEventListener('click', function(e) {
                  e.stopPropagation();
                  if (audio.paused) {
                      audio.muted = false;
                      audio.play().then(function() { 
                          fadeInAudio();
                          updateUI(); 
                      }).catch(function(){});
                  } else {
                      if (audio.muted) {
                          audio.muted = false;
                          fadeInAudio();
                      } else {
                          audio.muted = true;
                      }
                      updateUI();
                  }
              });
          })();
      </script>`;
      }
  }

  // ADD-ON 6: BOLINHAS NO BACKGROUND
  const hasBgdots = Boolean(data.addonBgdotsActive);
  const bdCount = parseInt(data.addonBgdotsCount || 50, 10);
  const bdColor = data.addonBgdotsColor || '#ffffff';
  const bdOpacity = parseFloat(data.addonBgdotsOpacity || 0.3);
  const bdStyle = data.addonBgdotsStyle || 'floating';
  const bdSpeed = data.addonBgdotsSpeed || 'normal';
  const bdGlow = Boolean(data.addonBgdotsGlow !== undefined ? data.addonBgdotsGlow : true);
  const bdTrail = Boolean(data.addonBgdotsTrail);
  const bdInteractive = Boolean(data.addonBgdotsInteractive);
  const bdClickExplode = Boolean(data.addonBgdotsClickExplode);

  let bgdotsHtml = '';
  if (hasBgdots) {
      bgdotsHtml = `
      <canvas id="pb-bgdots-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: ${ (bdInteractive || bdClickExplode) ? 'auto' : 'none' };"></canvas>
      <script>
      (function() {
          const canvas = document.getElementById('pb-bgdots-canvas');
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          
          function resize() {
              canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
              canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
          }
          resize();
          window.addEventListener('resize', resize);
          
          const particles = [];
          const count = ${bdCount};
          const color = '${bdColor}';
          const opacity = ${bdOpacity};
          const style = '${bdStyle}';
          const speedSetting = '${bdSpeed}';
          const glow = ${bdGlow};
          const trail = ${bdTrail};
          const interactive = ${bdInteractive};
          const clickExplode = ${bdClickExplode};

          function hexToRgb(hex) {
              const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
              return result ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
              } : { r: 255, g: 255, b: 255 };
          }
          const rgb = hexToRgb(color);

          let speedMult = 1;
          if (speedSetting === 'slow') speedMult = 0.4;
          if (speedSetting === 'fast') speedMult = 2.2;

          class Particle {
              constructor(x, y, isExplosion = false) {
                  this.x = x !== undefined ? x : Math.random() * canvas.width;
                  this.y = y !== undefined ? y : Math.random() * canvas.height;
                  this.baseSize = (1.5 + Math.random() * 4);
                  this.size = this.baseSize;
                  
                  this.vx = (Math.random() - 0.5) * 1.5 * speedMult;
                  this.vy = (Math.random() - 0.5) * 1.5 * speedMult;
                  
                  if (style === 'rain') {
                      this.vx = (Math.random() - 0.5) * 0.5 * speedMult;
                      this.vy = (1.5 + Math.random() * 2) * speedMult;
                  }
                  
                  if (isExplosion) {
                      const angle = Math.random() * Math.PI * 2;
                      const spd = (1 + Math.random() * 4) * speedMult;
                      this.vx = Math.cos(angle) * spd;
                      this.vy = Math.sin(angle) * spd;
                      this.life = 1.0;
                      this.decay = 0.02 + Math.random() * 0.03;
                  }

                  this.opacity = (0.2 + Math.random() * 0.8) * opacity;
                  this.pulseDir = Math.random() > 0.5 ? 1 : -1;
                  
                  this.orbitAngle = Math.random() * Math.PI * 2;
                  this.orbitRadius = 50 + Math.random() * 150;
                  this.orbitSpeed = (0.005 + Math.random() * 0.015) * speedMult;

                  this.vAngle = Math.random() * Math.PI * 2;
                  this.history = [];
              }

              update(mouse) {
                  if (this.life !== undefined) {
                      this.life -= this.decay;
                      if (this.life <= 0) return false;
                  }

                  if (trail) {
                      this.history.push({ x: this.x, y: this.y });
                      if (this.history.length > 5) this.history.shift();
                  } else {
                      this.history = [];
                  }

                  if (interactive && mouse.x !== null) {
                      const dx = this.x - mouse.x;
                      const dy = this.y - mouse.y;
                      const dist = Math.sqrt(dx * dx + dy * dy);
                      if (dist < 80) {
                          const force = (80 - dist) / 80;
                          const angle = Math.atan2(dy, dx);
                          this.x += Math.cos(angle) * force * 5;
                          this.y += Math.sin(angle) * force * 5;
                      }
                  }

                  if (style === 'orbit') {
                      const cx = canvas.width / 2;
                      const cy = canvas.height * 0.35;
                      this.orbitAngle += this.orbitSpeed;
                      this.x = cx + Math.cos(this.orbitAngle) * this.orbitRadius;
                      this.y = cy + Math.sin(this.orbitAngle) * this.orbitRadius;
                  } else if (style === 'vagalume') {
                      this.vAngle += (Math.random() - 0.5) * 0.5;
                      this.x += Math.cos(this.vAngle) * 0.8 * speedMult;
                      this.y += Math.sin(this.vAngle) * 0.8 * speedMult;
                      
                      this.size += this.pulseDir * 0.05;
                      if (this.size > this.baseSize * 1.5 || this.size < this.baseSize * 0.5) {
                          this.pulseDir *= -1;
                      }

                      if (this.x < 0 || this.x > canvas.width) this.vAngle = Math.PI - this.vAngle;
                      if (this.y < 0 || this.y > canvas.height) this.vAngle = -this.vAngle;
                  } else if (style === 'twinkle') {
                      this.opacity += this.pulseDir * 0.02;
                      if (this.opacity > opacity || this.opacity < 0.05) {
                          this.pulseDir *= -1;
                      }
                      this.x += this.vx * 0.2;
                      this.y += this.vy * 0.2;
                  } else {
                      this.x += this.vx;
                      this.y += this.vy;
                  }

                  if (style === 'rain') {
                      if (this.y > canvas.height) {
                          this.y = -10;
                          this.x = Math.random() * canvas.width;
                      }
                  } else if (style !== 'orbit') {
                      if (this.x < 0) this.x = canvas.width;
                      if (this.x > canvas.width) this.x = 0;
                      if (this.y < 0) this.y = canvas.height;
                      if (this.y > canvas.height) this.y = 0;
                  }

                  return true;
              }

              draw() {
                  const currentOpacity = this.life !== undefined ? this.opacity * this.life : this.opacity;
                  
                  if (trail && this.history.length > 0) {
                      ctx.beginPath();
                      ctx.moveTo(this.history[0].x, this.history[0].y);
                      for (let i = 1; i < this.history.length; i++) {
                          ctx.lineTo(this.history[i].x, this.history[i].y);
                      }
                      ctx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + (currentOpacity * 0.3) + ')';
                      ctx.lineWidth = this.size * 0.5;
                      ctx.stroke();
                  }

                  ctx.beginPath();
                  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                  ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + currentOpacity + ')';
                  
                  if (glow) {
                      ctx.shadowBlur = this.size * 3;
                      ctx.shadowColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',1.0)';
                  } else {
                      ctx.shadowBlur = 0;
                  }
                  
                  ctx.fill();
                  ctx.shadowBlur = 0;
              }
          }

          for (let i = 0; i < count; i++) {
              particles.push(new Particle());
          }

          const mouse = { x: null, y: null };
          
          function getMousePos(evt) {
              const rect = canvas.getBoundingClientRect();
              const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
              const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
              mouse.x = clientX - rect.left;
              mouse.y = clientY - rect.top;
          }

          if (interactive || clickExplode) {
              canvas.addEventListener('mousemove', getMousePos);
              canvas.addEventListener('touchmove', getMousePos, { passive: true });
              
              canvas.addEventListener('mouseleave', () => {
                  mouse.x = null;
                  mouse.y = null;
              });
              canvas.addEventListener('touchend', () => {
                  mouse.x = null;
                  mouse.y = null;
              }, { passive: true });
          }

          if (clickExplode) {
              canvas.addEventListener('click', (evt) => {
                  getMousePos(evt);
                  for (let i = 0; i < 15; i++) {
                      particles.push(new Particle(mouse.x, mouse.y, true));
                  }
              });
              canvas.addEventListener('touchstart', (evt) => {
                  getMousePos(evt);
                  for (let i = 0; i < 12; i++) {
                      particles.push(new Particle(mouse.x, mouse.y, true));
                  }
              }, { passive: true });
          }

          function loop() {
              ctx.clearRect(0, 0, canvas.width, canvas.height);

              if (style === 'constellation') {
                  for (let i = 0; i < particles.length; i++) {
                      for (let j = i + 1; j < particles.length; j++) {
                          const p1 = particles[i];
                          const p2 = particles[j];
                          if (p1.life !== undefined && p1.life <= 0) continue;
                          if (p2.life !== undefined && p2.life <= 0) continue;

                          const dx = p1.x - p2.x;
                          const dy = p1.y - p2.y;
                          const dist = Math.sqrt(dx * dx + dy * dy);

                          if (dist < 60) {
                              const lineOpacity = (1 - dist / 60) * opacity * 0.5;
                              ctx.beginPath();
                              ctx.moveTo(p1.x, p1.y);
                              ctx.lineTo(p2.x, p2.y);
                              ctx.strokeStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + lineOpacity + ')';
                              ctx.lineWidth = 0.5;
                              ctx.stroke();
                          }
                      }
                  }
              }

              for (let i = particles.length - 1; i >= 0; i--) {
                  const p = particles[i];
                  const alive = p.update(mouse);
                  if (!alive) {
                      particles.splice(i, 1);
                  } else {
                      p.draw();
                  }
              }

              requestAnimationFrame(loop);
          }
          
          loop();
      })();
      </script>
      `;
  }

  // ADD-ON 7: MATRIX CODE RAIN
  const hasMatrix = Boolean(data.addonMatrixActive);
  const mtxColor = data.addonMatrixColor || '#00ff00';
  const mtxSpeed = data.addonMatrixSpeed || 'normal';
  const mtxSize = parseInt(data.addonMatrixSize || 14, 10);
  const mtxChars = data.addonMatrixChars || 'matrix';
  const mtxOpacity = parseFloat(data.addonMatrixOpacity || 0.15);
  const mtxCustomChars = data.addonMatrixCustomChars || '';
  const mtxTheme = data.addonMatrixTheme || 'custom';
  const mtxDir = data.addonMatrixDir || 'down';
  const mtxGlow = Boolean(data.addonMatrixGlow);

  let matrixHtml = '';
  if (hasMatrix) {
      matrixHtml = `
      <canvas id="pb-matrix-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none;"></canvas>
      <script>
      (function() {
          const canvas = document.getElementById('pb-matrix-canvas');
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          
          const color = '${mtxColor}';
          const speedSetting = '${mtxSpeed}';
          const fontSize = ${mtxSize};
          const charType = '${mtxChars}';
          const opacity = ${mtxOpacity};
          const customChars = ${JSON.stringify(mtxCustomChars)};
          const theme = '${mtxTheme}';
          const dir = '${mtxDir}';
          const glow = ${mtxGlow};

          let columns = [];

          function resize() {
              canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
              canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

              const columnsCount = Math.floor(canvas.width / fontSize) + 1;
              columns = [];
              for (let x = 0; x < columnsCount; x++) {
                  columns.push({
                      x: x,
                      y: dir === 'up' 
                          ? (canvas.height / fontSize + Math.random() * 50) 
                          : (Math.random() * -100),
                      length: 8 + Math.floor(Math.random() * 12),
                      speed: (0.4 + Math.random() * 0.8)
                  });
              }
          }
          resize();
          window.addEventListener('resize', resize);

          function hexToRgb(hex) {
              const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
              return result ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
              } : { r: 0, g: 255, b: 0 };
          }
          const rgb = hexToRgb(color);

          let chars = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890XYZ";
          if (charType === 'binary') {
              chars = "01";
          } else if (charType === 'alphabet') {
              chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          } else if (charType === 'custom' && customChars) {
              chars = customChars;
          }
          const charArray = chars.split("");

          let speedMult = 1;
          if (speedSetting === 'slow') speedMult = 0.4;
          if (speedSetting === 'fast') speedMult = 2.2;

          function loop() {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.font = "bold " + fontSize + "px monospace";
              ctx.textAlign = 'center';

              columns.forEach(col => {
                  if (dir === 'up') {
                      col.y -= col.speed * speedMult * 0.4;
                      if (col.y + col.length < 0) {
                          col.y = canvas.height / fontSize + col.length;
                          col.length = 8 + Math.floor(Math.random() * 12);
                          col.speed = (0.4 + Math.random() * 0.8);
                      }
                  } else {
                      col.y += col.speed * speedMult * 0.4;
                      if (col.y - col.length > canvas.height / fontSize) {
                          col.y = -col.length;
                          col.length = 8 + Math.floor(Math.random() * 12);
                          col.speed = (0.4 + Math.random() * 0.8);
                      }
                  }

                  for (let i = 0; i < col.length; i++) {
                      const charY = Math.floor(dir === 'up' ? col.y + i : col.y - i);
                      if (charY < 0 || charY * fontSize > canvas.height) continue;

                      let alpha = (1 - (i / col.length)) * opacity;

                      if (theme === 'rainbow') {
                          const hue = (col.x * 20 + charY * 5) % 360;
                          if (i === 0) {
                              ctx.fillStyle = 'hsla(' + hue + ', 100%, 80%, ' + (opacity * 1.5) + ')';
                          } else {
                              ctx.fillStyle = 'hsla(' + hue + ', 100%, 60%, ' + alpha + ')';
                          }
                      } else if (theme === 'fire') {
                          const hue = Math.max(0, 60 - (i * (60 / col.length)));
                          if (i === 0) {
                              ctx.fillStyle = 'hsla(' + hue + ', 100%, 80%, ' + (opacity * 1.5) + ')';
                          } else {
                              ctx.fillStyle = 'hsla(' + hue + ', 100%, 50%, ' + alpha + ')';
                          }
                      } else {
                          if (i === 0) {
                              ctx.fillStyle = 'rgba(255, 255, 255, ' + (opacity * 1.5) + ')';
                          } else {
                              ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
                          }
                      }

                      if (glow) {
                          ctx.shadowBlur = 6;
                          if (theme === 'rainbow') {
                              ctx.shadowColor = 'hsl(' + ((col.x * 20 + charY * 5) % 360) + ', 100%, 50%)';
                          } else if (theme === 'fire') {
                              ctx.shadowColor = '#ff3300';
                          } else {
                              ctx.shadowColor = color;
                          }
                      } else {
                          ctx.shadowBlur = 0;
                      }

                      const char = charArray[Math.floor(Math.random() * charArray.length)];
                      ctx.fillText(char, col.x * fontSize + fontSize / 2, charY * fontSize);
                  }
              });

              ctx.shadowBlur = 0;
              requestAnimationFrame(loop);
          }
          
          loop();
      })();
      </script>
      `;
  }

  // ADD-ON 8: CYBERPUNK TEXT GLITCH
  const hasGlitch = Boolean(data.addonGlitchActive);
  const glitchIntensity = data.addonGlitchIntensity || 'normal';
  const glitchSpeed = data.addonGlitchSpeed || 'normal';
  const glitchName = Boolean(data.addonGlitchName !== undefined ? data.addonGlitchName : true);
  const glitchButtons = Boolean(data.addonGlitchButtons !== undefined ? data.addonGlitchButtons : true);

  let glitchHtml = '';
  if (hasGlitch) {
      let dist = 2;
      let scale = 1;
      if (glitchIntensity === 'low') { dist = 1; scale = 0.5; }
      if (glitchIntensity === 'high') { dist = 4; scale = 2; }

      glitchHtml = `
      <style>
          @keyframes pb-glitch-normal {
              0%, 80%, 100% { text-shadow: none; transform: none; }
              82% { text-shadow: ${dist}px -${dist/2}px 0 #ff0055, -${dist}px ${dist/2}px 0 #00ffaa; transform: translate(${scale}px, -${scale}px) skew(-2deg); }
              84% { text-shadow: -${dist}px ${dist}px 0 #ff0055, ${dist}px -${dist}px 0 #00ffaa; transform: translate(-${scale}px, ${scale}px) skew(1deg); }
              86% { text-shadow: ${dist/2}px -${dist}px 0 #ff0055, -${dist/2}px ${dist}px 0 #00ffaa; transform: translate(0px, 0px) skew(-1deg); }
              88%, 98% { text-shadow: none; transform: none; }
          }
          @keyframes pb-glitch-slow {
              0%, 90%, 100% { text-shadow: none; transform: none; }
              92% { text-shadow: ${dist}px -${dist/2}px 0 #ff0055, -${dist}px ${dist/2}px 0 #00ffaa; transform: translate(${scale}px, -${scale}px) skew(-1deg); }
              94% { text-shadow: -${dist}px ${dist}px 0 #ff0055, ${dist}px -${dist}px 0 #00ffaa; transform: translate(-${scale}px, ${scale}px) skew(2deg); }
              96%, 98% { text-shadow: none; transform: none; }
          }
          @keyframes pb-glitch-fast {
              0%, 100% { text-shadow: ${dist/2}px -${dist/2}px 0 #ff0055, -${dist/2}px ${dist/2}px 0 #00ffaa; transform: translate(${scale/2}px, -${scale/2}px); }
              20% { text-shadow: -${dist}px ${dist/2}px 0 #ff0055, ${dist}px -${dist/2}px 0 #00ffaa; transform: translate(-${scale}px, ${scale/2}px) skew(-1deg); }
              40% { text-shadow: ${dist/2}px -${dist}px 0 #ff0055, -${dist/2}px ${dist}px 0 #00ffaa; transform: translate(${scale/2}px, -${scale}px) skew(2deg); }
              60% { text-shadow: -${dist/2}px ${dist}px 0 #ff0055, ${dist/2}px -${dist/2}px 0 #00ffaa; transform: translate(-${scale/2}px, ${scale/2}px); }
              80% { text-shadow: ${dist}px -${dist/2}px 0 #ff0055, -${dist/2}px ${dist/2}px 0 #00ffaa; transform: translate(${scale}px, -${scale/2}px) skew(-2deg); }
          }
          
          .pb-glitch-name-target {
              animation: pb-glitch-${glitchSpeed} ${glitchSpeed === 'fast' ? '0.5s' : '4s'} infinite !important;
          }
          .pb-glitch-btn-target {
              animation: pb-glitch-${glitchSpeed} ${glitchSpeed === 'fast' ? '0.5s' : '4s'} infinite !important;
          }
      </style>
      <script>
      (function() {
          document.addEventListener('DOMContentLoaded', function() {
              const glitchName = ${glitchName};
              const glitchButtons = ${glitchButtons};
              
              if (glitchName) {
                  const names = document.querySelectorAll('#view-name, #v-view-name, #c-view-name, #s-view-name, #eb-view-name, .preview-name, .eb-name, .s-name, .v-name');
                  names.forEach(n => n.classList.add('pb-glitch-name-target'));
              }
              if (glitchButtons) {
                  const btns = document.querySelectorAll('.preview-btn, .c-btn, .v-btn, .eb-link-btn, .s-card-btn, .s-catalog-btn, .preview-link-btn, .btn, a.link-btn');
                  btns.forEach(b => b.classList.add('pb-glitch-btn-target'));
              }
          });
      })();
      </script>
      `;
  }

  // ADD-ON 9: AURORA BOREAL FLUIDA
  const hasAurora = Boolean(data.addonAuroraActive);
  const aurPalette = data.addonAuroraPalette || 'arctic';
  const aurC1 = data.addonAuroraC1 || '#00f2fe';
  const aurC2 = data.addonAuroraC2 || '#4facfe';
  const aurC3 = data.addonAuroraC3 || '#090514';
  const aurSpeed = data.addonAuroraSpeed || 'normal';
  const aurBlur = parseInt(data.addonAuroraBlur || 60, 10);
  const aurPulsate = Boolean(data.addonAuroraPulsate);

  let auroraHtml = '';
  if (hasAurora) {
      let c1 = '#00f2fe';
      let c2 = '#4facfe';
      let c3 = '#090514';

      if (aurPalette === 'arctic') {
          c1 = '#059669'; // Emerald
          c2 = '#0284c7'; // Sky Blue
          c3 = '#0f172a'; // Slate Dark
      } else if (aurPalette === 'sunset') {
          c1 = '#7c3aed'; // Purple
          c2 = '#db2777'; // Pink
          c3 = '#ea580c'; // Orange
      } else if (aurPalette === 'synthwave') {
          c1 = '#2563eb'; // Blue
          c2 = '#c084fc'; // Violet
          c3 = '#f43f5e'; // Rose
      } else if (aurPalette === 'custom') {
          c1 = aurC1;
          c2 = aurC2;
          c3 = aurC3;
      }

      let speedMult = 1;
      if (aurSpeed === 'slow') speedMult = 0.4;
      if (aurSpeed === 'fast') speedMult = 2.5;

      auroraHtml = `
      <canvas id="pb-aurora-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; filter: blur(${aurBlur}px);"></canvas>
      <script>
      (function() {
          const canvas = document.getElementById('pb-aurora-canvas');
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          
          function resize() {
              canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
              canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
          }
          resize();
          window.addEventListener('resize', resize);

          const c1 = '${c1}';
          const c2 = '${c2}';
          const c3 = '${c3}';
          const speedMult = ${speedMult};

          const blobs = [
              { x: canvas.width * 0.2, y: canvas.height * 0.2, vx: 0.5, vy: 0.3, radius: canvas.width * 0.6, color: c1 },
              { x: canvas.width * 0.8, y: canvas.height * 0.4, vx: -0.4, vy: 0.5, radius: canvas.width * 0.7, color: c2 },
              { x: canvas.width * 0.5, y: canvas.height * 0.8, vx: 0.3, vy: -0.4, radius: canvas.width * 0.8, color: c3 }
          ];

          function loop() {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = c3;
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              blobs.forEach(b => {
                  b.x += b.vx * speedMult;
                  b.y += b.vy * speedMult;

                  if (b.x - b.radius < -canvas.width * 0.3 || b.x + b.radius > canvas.width * 1.3) {
                      b.vx *= -1;
                  }
                  if (b.y - b.radius < -canvas.height * 0.3 || b.y + b.radius > canvas.height * 1.3) {
                      b.vy *= -1;
                  }

                  const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
                  grad.addColorStop(0, b.color);
                  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                  
                  ctx.fillStyle = grad;
                  ctx.beginPath();
                  ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                  ctx.fill();
              });

              if (${aurPulsate}) {
                  const dynamicBlur = ${aurBlur} + Math.sin(Date.now() / 1500) * 15;
                  canvas.style.filter = 'blur(' + dynamicBlur + 'px)';
              }

              requestAnimationFrame(loop);
          }
          
          loop();
      })();
      </script>
      `;
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
      .s-avatar-inner img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.08); }
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
${avatarSpinHtml}
</head>
<body>
  ${portraitLockHtml}
  ${topBannerHtml}
  ${audioPlayerHtml}
  ${liveChatHtml}
  <div class="s-container">
    ${emojiRainHtml}
    ${bgdotsHtml}
    ${matrixHtml}
    ${glitchHtml}
    ${auroraHtml}

    ${bgImgUrl ? `
      <div class="s-bg" style="background-image: url('${bgImgUrl}');"></div>
      <div class="s-bg-fade"></div>
    ` : ''}

    <div class="s-content">
      <div class="s-profile">
        ${data.avatar ? `
          <div class="s-avatar-wrapper" id="pb-avatar-wrap">
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
          <div class="c-avatar-wrapper" id="pb-avatar-wrap">
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
      .c-avatar-inner img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.08); }
      .c-profile-card { flex: 1; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 14px; padding: 10px 12px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
      .c-name { font-size: 0.92rem; font-weight: 700; color: #ffffff; margin: 0 0 2px 0; }
      .c-arroba { font-size: 0.76rem; color: ${theme.c1}; text-decoration: none; font-weight: 600; margin-bottom: 4px; display: inline-block; }
      .c-bio { font-size: 0.75rem; color: rgba(255,255,255,0.85); line-height: 1.35; margin: 0; white-space: pre-wrap; text-align: ${bioAlign}; }
      .c-buttons { position: absolute; bottom: 24px; left: 14px; right: 14px; display: flex; gap: 10px; z-index: 10; }
      .c-btn { flex: 1; background: rgba(15, 23, 42, 0.78); color: #ffffff; border: 1.5px solid ${theme.c1}; padding: 13px 10px; border-radius: 14px; font-weight: 700; font-size: 0.82rem; text-align: center; text-decoration: none; box-shadow: 0 8px 20px rgba(0,0,0,0.5), 0 0 12px ${theme.c1}44; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); box-sizing: border-box; display: flex; align-items: center; justify-content: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .c-footer { position: absolute; bottom: 6px; left: 0; right: 0; text-align: center; font-size: 0.65rem; color: rgba(255,255,255,0.4); z-index: 10; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
      .c-footer a { color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 700; }
  </style>
${avatarSpinHtml}
</head>
<body>
  ${portraitLockHtml}
  ${topBannerHtml}
  ${audioPlayerHtml}
  ${liveChatHtml}
  <div class="c-fullscreen-page">
      ${emojiRainHtml}
      ${bgdotsHtml}
      ${matrixHtml}
      ${glitchHtml}
      ${auroraHtml}
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
        .v-avatar-overlap-inner img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.08); }

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
${avatarSpinHtml}
</head>
<body>
    ${portraitLockHtml}
    ${topBannerHtml}
    ${audioPlayerHtml}
    ${liveChatHtml}
    <div class="v-container">
        ${emojiRainHtml}
        ${bgdotsHtml}
        ${matrixHtml}
        ${glitchHtml}
        ${auroraHtml}
        ${hasHeroPhotos ? `
        <div class="v-grid-hero">
            ${h1 ? `<div class="v-main-pic"><img src="${h1}" alt="Destaque 1"></div>` : ''}
            <div class="v-sub-row">
                ${h2 ? `<div class="v-sub-pic"><img src="${h2}" alt="Destaque 2"></div>` : ''}
                ${h3 ? `<div class="v-sub-pic"><img src="${h3}" alt="Destaque 3"></div>` : ''}
            </div>
            
            ${data.avatar ? `
            <div class="v-avatar-overlap" id="pb-avatar-wrap">
                <div class="v-avatar-overlap-inner">
                    <img src="${data.avatar}" alt="${data.name || ''}">
                </div>
            </div>` : ''}
        </div>` : data.avatar ? `
        <div style="position: relative; width: 100px; height: 100px; margin-bottom: 20px;">
            <div class="v-avatar-overlap" id="pb-avatar-wrap" style="position: relative; bottom: 0; left: 0; transform: none; margin: 0 auto;">
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
            <div class="eb-avatar-wrapper" id="pb-avatar-wrap">
                <div class="eb-avatar-inner">
                    <img src="${data.avatar}" alt="${data.name || ''}">
                </div>
            </div>` : '';

    const bioHtml = data.bio ? `<p class="eb-bio">${data.bio}</p>` : '';
    
    // Coleta os e-books cadastrados
    const ebooks = [];
    if (data.ebookCover || data.ebookTitle) {
      ebooks.push({
        cover: data.ebookCover,
        title: data.ebookTitle || 'E-book',
        desc: data.ebookDesc || '',
        btnText: data.ebookBtnText || 'Comprar E-book 🛒',
        buyUrl: data.ebookBuyUrl || '#'
      });
    }
    if (data.ebook2Cover || data.ebook2Title) {
      ebooks.push({
        cover: data.ebook2Cover,
        title: data.ebook2Title || 'E-book 2',
        desc: data.ebook2Desc || '',
        btnText: data.ebook2BtnText || 'Garantir E-book 🛒',
        buyUrl: data.ebook2BuyUrl || '#'
      });
    }
    if (data.ebook3Cover || data.ebook3Title) {
      ebooks.push({
        cover: data.ebook3Cover,
        title: data.ebook3Title || 'E-book 3',
        desc: data.ebook3Desc || '',
        btnText: data.ebook3BtnText || 'Acessar Guia 🛒',
        buyUrl: data.ebook3BuyUrl || '#'
      });
    }

    let ebookCardHtml = '';
    let storiesNavHtml = '';

    if (ebooks.length > 0) {
      // Se tiver mais de 1 e-book, gera as bolinhas dos Stories
      if (ebooks.length > 1) {
        let bubbles = '';
        ebooks.forEach((eb, idx) => {
          bubbles += `
            <div class="eb-story-bubble ${idx === 0 ? 'active' : ''}" onclick="selectEbookSlide(${idx})" style="
                width: 52px; height: 52px; border-radius: 50%; padding: 2px;
                background: ${idx === 0 ? 'linear-gradient(135deg, var(--theme-c1), var(--theme-c2))' : 'rgba(255,255,255,0.1)'};
                border: 1.5px solid ${idx === 0 ? 'transparent' : 'rgba(255,255,255,0.08)'};
                cursor: pointer; transition: all 0.3s ease;
                box-shadow: ${idx === 0 ? '0 0 12px var(--theme-c1)' : 'none'};
            ">
                <div style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #111;">
                    <img src="${eb.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100'}" style="width:100%; height:100%; object-fit:cover;">
                </div>
            </div>`;
        });
        
        storiesNavHtml = `
          <div id="eb-stories-nav" style="display: flex; justify-content: center; gap: 14px; margin-bottom: 16px; width: 100%; position: relative; z-index: 10;">
             ${bubbles}
          </div>`;
      }

      // Card inicial com o primeiro e-book
      const firstEb = ebooks[0];
      ebookCardHtml = `
            <div id="eb-card" class="eb-card">
                <!-- Badges do Infoproduto -->
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; box-sizing: border-box;">
                    <span style="background: rgba(255,255,255,0.06); color: var(--theme-c1); font-size: 0.65rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; border: 1px solid var(--theme-c1); text-transform: uppercase; letter-spacing: 0.5px;">🔥 Lançamento</span>
                    <div style="display: flex; align-items: center; gap: 2px;">
                        <span style="color: #fbbf24; font-size: 0.8rem;">★★★★★</span>
                        <span style="font-size: 0.65rem; color: #94a3b8; font-weight: 600; margin-left: 2px;">(4.9)</span>
                    </div>
                </div>

                <div class="eb-card-header">
                    <div class="book-3d-wrapper">
                        <div class="book-page-back"></div>
                        <div class="book-page-mid"></div>
                        <img id="eb-cover-img" src="${firstEb.cover}" class="eb-cover" alt="${firstEb.title}" onerror="this.src='https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'">
                    </div>
                    <div class="eb-info-container">
                        <h3 id="eb-title-txt" class="eb-title">${firstEb.title}</h3>
                        <p id="eb-desc-txt" class="eb-desc">${firstEb.desc}</p>
                        
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

                <a id="eb-buy-link" href="${firstEb.buyUrl}" target="_blank" rel="noopener" class="eb-buy-btn" onclick="trackAction('click')">
                    ${firstEb.btnText}
                </a>
            </div>`;
    }

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
            margin: 0; padding: 0; width: 100%; min-height: 100%;
            background-color: #0e0b16;
            color: #ffffff; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .eb-page {
            width: 100%; min-height: 100vh; display: flex; flex-direction: column;
            align-items: center; padding: max(32px, env(safe-area-inset-top, 32px)) 16px 40px 16px;
            box-sizing: border-box; position: relative;
            overflow-x: hidden;
            background-image: linear-gradient(to bottom, rgba(13,10,24,0.4), rgba(6,4,10,0.85));
            background-size: 100% 100%;
            justify-content: flex-start;
        }

        /* Efeito de folhas 3D do livro */
        .book-3d-wrapper {
            position: relative;
            width: 90px;
            height: 125px;
            flex-shrink: 0;
            transform-style: preserve-3d;
            perspective: 1000px;
        }
        .book-page-back {
            position: absolute;
            inset: 2px 0 2px 4px;
            background: #eaeaea;
            border-radius: 2px 5px 5px 2px;
            border: 1px solid rgba(0,0,0,0.25);
            box-shadow: -2px 2px 6px rgba(0,0,0,0.3);
            z-index: 1;
            transform: rotateY(-8deg) translateZ(-4px);
            transform-origin: left center;
        }
        .book-page-mid {
            position: absolute;
            inset: 1px 0 1px 2px;
            background: #fdfdfd;
            border-radius: 2px 5px 5px 2px;
            border: 1px solid rgba(0,0,0,0.2);
            box-shadow: -2px 2px 6px rgba(0,0,0,0.3);
            z-index: 2;
            transform: rotateY(-5deg) translateZ(-2px);
            transform-origin: left center;
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
        .eb-avatar-inner img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.08); }
        
        .eb-name { font-size: 1.25rem; font-weight: 700; margin: 0 0 4px 0; color: #ffffff; text-align: center; }
        .eb-arroba { font-size: 0.88rem; color: var(--theme-c1); text-decoration: none; margin-bottom: 8px; text-align: center; display: inline-block; font-weight: 600; }
        .eb-bio { font-size: 0.88rem; color: #94a3b8; text-align: center; line-height: 1.45; margin: 0; width: 90%; word-break: break-word; }

        @keyframes ebFloat {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
        }

        .eb-card {
            width: 100%; max-width: 420px; background: rgba(13, 10, 24, 0.75);
            border: 1.5px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px; padding: 18px;
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), 0 0 25px rgba(99,102,241,0.05); 
            position: relative; z-index: 10; box-sizing: border-box; 
            display: flex; flex-direction: column; gap: 16px;
            backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); 
            margin-bottom: 22px;
            animation: ebFloat 4s ease-in-out infinite;
            overflow: hidden;
        }

        /* Hack de borda arredondada + gradiente */
        .eb-card::before {
            content: ""; position: absolute; inset: 0; border-radius: 24px; padding: 1.5px;
            background: linear-gradient(145deg, var(--theme-c1) 40%, var(--theme-c2) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor; mask-composite: exclude;
            pointer-events: none; opacity: 0.28;
            z-index: 0;
        }

        .eb-card-header { display: flex; gap: 16px; align-items: flex-start; }

        .eb-cover {
            position: absolute; inset: 0; width: 100%; height: 100%;
            object-fit: cover; border-radius: 3px 6px 6px 3px;
            box-shadow: -4px 4px 12px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15);
            transform: rotateY(-12deg); transform-origin: left center; z-index: 3; display: block;
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
${avatarSpinHtml}
</head>
<body>
    ${portraitLockHtml}
    ${topBannerHtml}
    ${audioPlayerHtml}
    ${liveChatHtml}
    <div class="eb-page">
        ${emojiRainHtml}
        ${bgdotsHtml}
        ${matrixHtml}
        ${glitchHtml}
        ${auroraHtml}

        
        <div class="eb-header">
            ${avatarHtml}
            <h2 class="eb-name">${data.name || ''}</h2>
            <a href="${instaUrl}" target="_blank" rel="noopener" class="eb-arroba">${displayArroba}</a>
            ${bioHtml}
        </div>

        ${storiesNavHtml}
        ${ebookCardHtml}

        <div class="eb-buttons-container">
            ${btn1Html}
            ${btn2Html}
        </div>

        <div class="footer">
            CRIADO COM <a href="/" onclick="trackAction('referral')">PAINELBIO</a>
        </div>
    </div>

    <!-- Script de Navegação dos E-books (Slideshow Stories) -->
    <script>
        (function() {
            var ebooks = ${JSON.stringify(ebooks)};
            if (ebooks.length <= 1) return;

            var currentIdx = 0;
            var intervalId = null;
            var card = document.getElementById('eb-card');
            var coverImg = document.getElementById('eb-cover-img');
            var titleTxt = document.getElementById('eb-title-txt');
            var descTxt = document.getElementById('eb-desc-txt');
            var buyLink = document.getElementById('eb-buy-link');
            var bubbles = document.querySelectorAll('.eb-story-bubble');

            window.selectEbookSlide = function(index) {
                currentIdx = index;
                var activeEb = ebooks[index];
                if (!activeEb || !card) return;

                // Efeito fade-out rápido
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px) scale(0.98)';

                setTimeout(function() {
                    if (coverImg) coverImg.src = activeEb.cover;
                    if (titleTxt) titleTxt.textContent = activeEb.title;
                    if (descTxt) descTxt.textContent = activeEb.desc;
                    if (buyLink) {
                        buyLink.href = activeEb.buyUrl;
                        buyLink.textContent = activeEb.btnText;
                    }

                    // Acende o Story Bubble correto
                    bubbles.forEach(function(b, idx) {
                        if (idx === index) {
                            b.style.background = 'linear-gradient(135deg, var(--theme-c1), var(--theme-c2))';
                            b.style.borderColor = 'transparent';
                            b.style.boxShadow = '0 0 12px var(--theme-c1)';
                        } else {
                            b.style.background = 'rgba(255,255,255,0.1)';
                            b.style.borderColor = 'rgba(255,255,255,0.08)';
                            b.style.boxShadow = 'none';
                        }
                    });

                    // Fade-in de volta
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, 220);

                resetInterval();
            };

            function resetInterval() {
                if (intervalId) clearInterval(intervalId);
                intervalId = setInterval(function() {
                    var next = (currentIdx + 1) % ebooks.length;
                    selectEbookSlide(next);
                }, 5000);
            }

            // Inicializa as transições de CSS no card
            if (card) {
                card.style.transition = 'border-color 0.3s, opacity 0.25s, transform 0.25s';
            }

            resetInterval();
        })();
    </script>
</body>
</html>`;
  }

  // ==========================================
  // MODELO 1: CLASSIC (Padrão Fallback)
  // ==========================================
  const avatarHtml = data.avatar ? `
            <div class="preview-avatar-glow" id="pb-avatar-wrap">
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
            --theme-b: ${theme.border || 'rgba(255, 255, 255, 0.08)'};
            --theme-g: ${theme.glow || 'rgba(255, 255, 255, 0.15)'};
        }
        
        html, body {
            margin: 0; padding: 0; width: 100%; height: 100%;
            overflow: hidden; overscroll-behavior: none;
            background-color: #121214; color: #fff; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            position: relative;
        }
        
        .preview-bio-page {
            width: 100%; height: 100%; height: 100dvh; display: flex; flex-direction: column;
            align-items: center; justify-content: center; padding: ${hasTopBanner ? '60px' : '24px'} 16px 24px 16px;
            box-sizing: border-box; position: relative;
            overflow-x: hidden; /* Corta as luzes de neon nas laterais e evita rolagem horizontal */
            overflow-y: auto; overscroll-behavior-y: contain;
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
            margin: auto;
        }

        .preview-avatar-glow {
            width: 85px; height: 85px; border-radius: 50%;
            background: linear-gradient(135deg, var(--theme-c1), var(--theme-c2));
            padding: 3px; display: flex; align-items: center; justify-content: center;
            margin-bottom: 14px;
        }

        .preview-avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: #111111; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .preview-avatar-inner img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.08); }
        .preview-name { font-size: 1.2rem; font-weight: 700; margin: 0 0 4px 0; color: #ffffff; text-align: center; }
        .preview-arroba { font-size: 0.85rem; color: var(--theme-c1); text-decoration: none; margin-bottom: 14px; text-align: center; display: inline-block; font-weight: 600; }
        .preview-bio { font-size: 0.88rem; color: rgba(255, 255, 255, 0.8); text-align: ${bioAlign}; line-height: 1.5; margin-bottom: 24px; width: 95%; word-break: break-word; }
        .preview-links { width: 100%; display: flex; flex-direction: column; gap: 12px; }
        .preview-link-btn { background: rgba(255, 255, 255, 0.04); border: 1px solid var(--theme-b); color: #ffffff; padding: 16px 20px; border-radius: 14px; text-decoration: none; font-size: 0.95rem; font-weight: 600; display: flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box; }
        .footer { margin-top: 25px; font-size: 0.75rem; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 6px; }
        .footer a { color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 600; text-transform: uppercase; }
    </style>
${avatarSpinHtml}
</head>
<body>
    ${portraitLockHtml}
    ${topBannerHtml}
    ${audioPlayerHtml}
    ${liveChatHtml}
    
    <!-- Elementos de fundo posicionados de forma absoluta no body (fora do scroll) -->
    ${emojiRainHtml}
    ${bgdotsHtml}
    ${matrixHtml}
    ${glitchHtml}
    ${auroraHtml}
    <div class="bg-glow bg-glow-top"></div>
    <div class="bg-glow bg-glow-bottom"></div>

    <div class="preview-bio-page">
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
