import express from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import multer from 'multer';
import cors from 'cors';
import * as cheerio from 'cheerio';
import { gotScraping } from 'got-scraping';
import { getStore, saveStore, getAllStores, deleteStore } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow requests from any origin (Cloudflare Pages, etc)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

// API para fazer upload de imagens
app.post('/api/upload', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'vitrine1', maxCount: 1 },
  { name: 'vitrine2', maxCount: 1 },
  { name: 'vitrine3', maxCount: 1 }
]), (req, res) => {
  const files = req.files;
  const urls = {};
  
  if (files) {
    for (const key in files) {
      if (files[key] && files[key][0]) {
        urls[key] = `/uploads/${files[key][0].filename}`;
      }
    }
  }
  
  res.json({ success: true, urls });
});

// API para raspar dados reais de perfil do Instagram
app.get('/api/scrape-instagram', async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: 'Username é obrigatório', logs: ['Erro: Username ausente na requisição.'] });
  }

  const cleanUsername = username.replace('@', '').trim().toLowerCase();
  const logs = [];
  logs.push(`Iniciando busca do perfil @${cleanUsername}`);

  // ESTRATÉGIA 1: Instagram API Mobile (usa o sessionid do usuário via endpoint mobile)
  try {
    logs.push("Tentando Estratégia 1: API Mobile do Instagram (Autenticado)...");
    const SESSION_ID = decodeURIComponent('9048732205%3ADWKqMOVqEyhw1V%3A1%3AAYidu2pR-uqJ3YFoweR_jnyqGP-M83qbC7zc1YXwK_Q');
    const response = await gotScraping({
      url: `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(cleanUsername)}`,
      headers: {
        'Cookie': `sessionid=${SESSION_ID}`,
        'X-IG-App-ID': '936619743392459',
        'Accept': '*/*',
        'User-Agent': 'Instagram/219.0.0.12.117 (iPhone14,3; iOS 15_6; Scale/3.00) (en_US)'
      },
      followRedirect: false
    });

    logs.push(`Estratégia 1: HTTP Status da API = ${response.statusCode}`);

    if (response.statusCode === 200) {
      try {
        const json = JSON.parse(response.body);
        if (json && json.data && json.data.user) {
          const user = json.data.user;
          const name = user.full_name || cleanUsername;
          const bio = user.biography || '';
          const avatar = user.profile_pic_url_hd || user.profile_pic_url || '';

          logs.push("Estratégia 1: Sucesso! Dados do perfil extraídos completamente.");
          const proxiedAvatar = avatar ? `https://wsrv.nl/?url=${encodeURIComponent(avatar)}` : '';
          
          return res.json({
            success: true,
            source: 'instagram_authenticated',
            data: { name, bio, avatar: proxiedAvatar },
            logs
          });
        } else {
          logs.push("Estratégia 1: Retorno inválido da API (usuário não encontrado ou formato incompatível).");
        }
      } catch(parseErr) {
        logs.push(`Estratégia 1: Erro ao ler resposta da API: ${parseErr.message}`);
      }
    } else if (response.statusCode === 302 || response.statusCode === 301) {
      logs.push(`Estratégia 1: Instagram redirecionou (${response.statusCode}) - sessão pode estar expirada ou bloqueada pelo IP do servidor.`);
    } else {
      logs.push(`Estratégia 1: Falhou com status ${response.statusCode}.`);
    }
  } catch (err) {
    logs.push(`Estratégia 1: Erro na requisição: ${err.message}`);
    console.warn(`[Scraper] Instagram Autenticado falhou para ${cleanUsername}:`, err.message);
  }

  // ESTRATÉGIA 2: Picuki com TLS Fingerprint Emulation (got-scraping) - Fallback
  try {
    logs.push("Tentando Estratégia 2: Fallback Picuki (Sem login)...");
    const picukiUrl = `https://www.picuki.com/profile/${encodeURIComponent(cleanUsername)}`;
    const response = await gotScraping({
      url: picukiUrl,
      headerGeneratorOptions: {
        browsers: [{ name: 'chrome', minVersion: 120 }],
        operatingSystems: ['windows'],
        devices: ['desktop']
      }
    });

    logs.push(`Estratégia 2: HTTP Status do Picuki = ${response.statusCode}`);

    if (response.statusCode === 200) {
      const $ = cheerio.load(response.body);
      const name = $('.profile-name-bottom').text().trim() || cleanUsername;
      const avatar = $('.profile-avatar img').attr('src');
      const bio = $('.profile-description').text().trim();

      if (avatar || bio) {
        logs.push("Estratégia 2: Sucesso! Dados extraídos via Picuki.");
        const proxiedAvatar = avatar ? `https://wsrv.nl/?url=${encodeURIComponent(avatar)}` : '';
        return res.json({
          success: true,
          source: 'picuki_fallback',
          data: { name, bio, avatar: proxiedAvatar },
          logs
        });
      } else {
        logs.push("Estratégia 2: Página aberta mas sem avatar ou biografia visíveis.");
      }
    } else {
      logs.push(`Estratégia 2: Picuki retornou status ${response.statusCode}.`);
    }
  } catch (err) {
    logs.push(`Estratégia 2: Erro na requisição: ${err.message}`);
    console.warn(`[Scraper] Picuki Fallback falhou para ${cleanUsername}:`, err.message);
  }

  // ESTRATÉGIA 3: DuckDuckGo Lite (menos bloqueado por IP de datacenter) - Fallback final
  try {
    logs.push("Tentando Estratégia 3: Fallback via DuckDuckGo Lite...");
    const searchUrl = `https://lite.duckduckgo.com/lite/?q=site:instagram.com/${encodeURIComponent(cleanUsername)}`;
    const response = await gotScraping({
      url: searchUrl,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });

    logs.push(`Estratégia 3: HTTP Status do DuckDuckGo Lite = ${response.statusCode}`);

    if (response.statusCode === 200) {
      const $ = cheerio.load(response.body);
      // DDG Lite usa seletores diferentes
      let snippetText = $('.result-snippet').first().text().trim();
      if (!snippetText) {
        // Fallback para seletores do DDG HTML normal
        snippetText = $('.result__snippet').first().text().trim();
      }
      if (!snippetText) {
        // Tenta pegar o texto de qualquer snippet/resultado
        snippetText = $('td.result-snippet').first().text().trim();
      }

      if (snippetText) {
        logs.push("Estratégia 3: Snippet encontrado no DuckDuckGo Lite.");
        let bio = snippetText;
        const marker = 'Instagram: "';
        const markerIndex = snippetText.indexOf(marker);
        if (markerIndex !== -1) {
          bio = snippetText.substring(markerIndex + marker.length);
          if (bio.endsWith('"')) {
            bio = bio.substring(0, bio.length - 1);
          }
        } else if (snippetText.includes('-')) {
          bio = snippetText.split('-').slice(1).join('-').trim();
        }

        const name = cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1);
        const fallbackAvatar = 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23888888\'><path d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/></svg>';

        logs.push("Estratégia 3: Sucesso parcial! Nome e Bio obtidos.");
        return res.json({
          success: true,
          source: 'duckduckgo_fallback',
          data: { name, bio, avatar: fallbackAvatar },
          logs
        });
      } else {
        logs.push(`Estratégia 3: DuckDuckGo Lite abriu mas sem snippet visível. Body: ${response.body.substring(0, 200)}`);
      }
    } else {
      logs.push(`Estratégia 3: DuckDuckGo Lite retornou status ${response.statusCode}.`);
    }
  } catch (ddgErr) {
    logs.push(`Estratégia 3: Erro no buscador: ${ddgErr.message}`);
    console.error(`[Scraper] Fallback DuckDuckGo Lite falhou para ${cleanUsername}:`, ddgErr.message);
  }

  logs.push("Erro: Todas as estratégias de raspagem falharam!");
  return res.status(500).json({
    error: 'Falha na extração de dados reais do perfil em todas as estratégias',
    code: 'SCRAPER_PIPELINE_FAILED',
    logs
  });
});

import https from 'https';
import http from 'http';

// Helper function to download image
async function downloadImage(url, dest) {
  if (!url || !url.startsWith('http')) return;
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(dest, () => reject(new Error('Server responded with ' + response.statusCode)));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

// Helper to generate static HTML
function generateStaticSite(data) {
  if (!data) return '';
  const isVitrine = Boolean(data.model === 'vitrine');
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
  const instaUrl = cleanArroba ? `https://instagram.com/${cleanArroba}` : '#';
  const bioAlign = data.bioAlign || 'center';
  const tbTexts = [data.addonTopbannerText1, data.addonTopbannerText2, data.addonTopbannerText3].filter(Boolean);
  const hasTopBanner = Boolean((data.addonTopbannerActive || tbTexts.length > 0) && tbTexts.length > 0);
  const tbBg = data.addonTopbannerBg || '#0f172a';
  const tbColor = data.addonTopbannerColor || '#38bdf8';

  const effect = data.addonTopbannerEffect || 'fade';
  const pauseSec = parseInt(data.addonTopbannerPause || 2, 10); const pauseBetweenSec = parseInt(data.addonTopbannerPauseBetween || 1, 10);
  const mqSpeed = parseInt(data.addonTopbannerMarqueeSpeed || 5, 10);
  const mqPause = parseInt(data.addonTopbannerMarqueePause || 3, 10);

  const topBannerHtml = hasTopBanner ? `
    <div id="pb-top-banner" style="position: fixed; top: 0; left: 0; width: 100%; background: ${tbBg}; color: ${tbColor}; padding: 10px 14px; font-size: 0.8rem; font-weight: 700; text-align: center; z-index: 99999; box-shadow: 0 4px 15px rgba(0,0,0,0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; overflow: hidden; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s; transform: none; opacity: 1;">
        <span id="pb-tb-text" style="display: inline-block;">${tbTexts[0]}</span>
    </div>
    <script>
        (function() {
            var texts = ${JSON.stringify(tbTexts)};
            var effect = '${effect}';
            var pauseMs = ${pauseSec} * 1000; var pauseBetweenMs = ${pauseBetweenSec} * 1000;
            var mqSpeed = ${mqSpeed};
            var mqPauseMs = ${mqPause} * 1000;
            var idx = 0;
            var banner = document.getElementById('pb-top-banner');
            var textEl = document.getElementById('pb-tb-text');
            if (!banner || !textEl || texts.length === 0) return;

            function runEffectCycle() {
                if (effect === 'slide') {
                    banner.style.transform = 'translateY(-100%)';
                    banner.style.opacity = '0';
                    setTimeout(function() {
                        banner.style.transform = 'translateY(0)';
                        banner.style.opacity = '1';
                        setTimeout(function() {
                            banner.style.transform = 'translateY(-100%)';
                            banner.style.opacity = '0';
                            setTimeout(function() {
                                idx = (idx + 1) % texts.length;
                                textEl.textContent = texts[idx];
                                runEffectCycle();
                            }, pauseMs);
                        }, pauseBetweenMs);
                    }, 100);
                } else if (effect === 'fade') {
                    textEl.style.transition = 'opacity 0.3s';
                    if (texts.length > 1) {
                        setTimeout(function() {
                            textEl.style.opacity = '0';
                            setTimeout(function() {
                                idx = (idx + 1) % texts.length;
                                textEl.textContent = texts[idx];
                                textEl.style.opacity = '1';
                                runEffectCycle();
                            }, 300);
                        }, pauseBetweenMs);
                    }
                } else if (effect === 'marquee') {
                    textEl.style.whiteSpace = 'nowrap';
                    textEl.innerHTML = texts.join(' &nbsp;&nbsp;&nbsp;⭐&nbsp;&nbsp;&nbsp; ');
                    
                    banner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                    banner.style.height = '0px';
                    banner.style.padding = '0px';
                    banner.style.overflow = 'hidden';
                    
                    setTimeout(function() {
                        banner.style.height = 'auto';
                        banner.style.padding = '10px 14px';
                        
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
                                setTimeout(function() {
                                    runEffectCycle();
                                }, mqPauseMs);
                            }
                        }, 20);
                    }, 500);
                } else if (effect === 'bounce') {
                    banner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                    textEl.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s';
                    banner.style.height = '0px';
                    banner.style.padding = '0px';
                    
                    setTimeout(function() {
                        banner.style.height = 'auto';
                        banner.style.padding = '10px 14px';
                        textEl.style.transform = 'scale(1)';
                        
                        var currentIdx = 0;
                        function playNext() {
                            if (currentIdx >= texts.length - 1) {
                                setTimeout(function() {
                                    banner.style.height = '0px';
                                    banner.style.padding = '0px';
                                    setTimeout(function() { runEffectCycle(); }, pauseMs);
                                }, pauseBetweenMs);
                                return;
                            }
                            setTimeout(function() {
                                textEl.style.transform = 'scale(0)';
                                setTimeout(function() {
                                    currentIdx++;
                                    idx = currentIdx;
                                    textEl.textContent = texts[idx];
                                    textEl.style.transform = 'scale(1)';
                                    playNext();
                                }, 500);
                            }, pauseBetweenMs);
                        }
                        playNext();
                    }, 100);
                } else if (effect === 'flip') {
                    banner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                    textEl.style.transition = 'transform 0.4s ease-in, opacity 0.3s';
                    banner.style.height = '0px';
                    banner.style.padding = '0px';
                    
                    setTimeout(function() {
                        banner.style.height = 'auto';
                        banner.style.padding = '10px 14px';
                        textEl.style.transform = 'rotateX(0deg)';
                        
                        var currentIdx = 0;
                        function playNext() {
                            if (currentIdx >= texts.length - 1) {
                                setTimeout(function() {
                                    banner.style.height = '0px';
                                    banner.style.padding = '0px';
                                    setTimeout(function() { runEffectCycle(); }, pauseMs);
                                }, pauseBetweenMs);
                                return;
                            }
                            setTimeout(function() {
                                textEl.style.transform = 'rotateX(90deg)';
                                setTimeout(function() {
                                    currentIdx++;
                                    idx = currentIdx;
                                    textEl.textContent = texts[idx];
                                    textEl.style.transform = 'rotateX(0deg)';
                                    playNext();
                                }, 400);
                            }, pauseBetweenMs);
                        }
                        playNext();
                    }, 100);
                } else if (effect === 'shutter') {
                    banner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                    banner.style.height = '0px';
                    banner.style.padding = '0px';
                    
                    setTimeout(function() {
                        banner.style.height = 'auto';
                        banner.style.padding = '10px 14px';
                        
                        var currentIdx = 0;
                        function playNext() {
                            if (currentIdx >= texts.length - 1) {
                                setTimeout(function() {
                                    banner.style.height = '0px';
                                    banner.style.padding = '0px';
                                    setTimeout(function() { runEffectCycle(); }, pauseMs);
                                }, pauseBetweenMs);
                                return;
                            }
                            setTimeout(function() {
                                banner.style.height = '0px';
                                banner.style.padding = '0px';
                                setTimeout(function() {
                                    currentIdx++;
                                    idx = currentIdx;
                                    textEl.textContent = texts[idx];
                                    banner.style.height = 'auto';
                                    banner.style.padding = '10px 14px';
                                    playNext();
                                }, 400);
                            }, pauseBetweenMs);
                        }
                        playNext();
                    }, 100);
                }
            }
            runEffectCycle();
        })();
    </script>
  ` : '';

  // =========================================================================
  // ADD-ON 2: CHUVA DE EMOJI
  // =========================================================================
  const hasEmojiRain = Boolean(data.addonEmojiRainActive && data.addonEmojiRainEmoji);
  const erEmoji = data.addonEmojiRainEmoji || '🌸';
  const erCount = Math.min(Math.max(parseInt(data.addonEmojiRainCount || 8, 10), 1), 20);
  const erSpeed = data.addonEmojiRainSpeed || 'normal';
  const erCoverage = Math.min(Math.max(parseInt(data.addonEmojiRainCoverage || 80, 10), 10), 100);
  const erRotate = Boolean(data.addonEmojiRainRotate);
  const erDurationMap = { slow: 6, normal: 5, fast: 3 };
  const erBaseDuration = erDurationMap[erSpeed] || 3.5;

  let emojiRainHtml = '';
  if (hasEmojiRain) {
    let particles = '';
    for (let i = 0; i < erCount; i++) {
      const size = (1.2 + Math.random() * 1.5).toFixed(2);
      const left = (Math.random() * 90).toFixed(1);
      const dur  = (erBaseDuration * (0.7 + Math.random() * 0.7)).toFixed(2);
      const delay = -(Math.random() * erBaseDuration * 2).toFixed(2);
      let animName = 'pb-emojifall';
      if (erRotate) animName = Math.random() > 0.5 ? 'pb-emojifall-cw' : 'pb-emojifall-ccw';
      particles += `<span style="position:absolute;top:0;left:${left}%;font-size:${size}rem;filter:blur(2px);pointer-events:none;animation:${animName} ${dur}s linear ${delay}s infinite;">${erEmoji}</span>`;
    }
    emojiRainHtml = `
    <style>
      @keyframes pb-emojifall    { 0%{transform:translateY(-80px);opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{transform:translateY(110vh);opacity:0} }
      @keyframes pb-emojifall-cw { 0%{transform:translateY(-80px) rotate(0deg);opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{transform:translateY(110vh) rotate(540deg);opacity:0} }
      @keyframes pb-emojifall-ccw{ 0%{transform:translateY(-80px) rotate(0deg);opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{transform:translateY(110vh) rotate(-540deg);opacity:0} }
    </style>
    <div id="pb-emoji-rain" style="position:fixed;top:0;left:0;right:0;height:${erCoverage}%;overflow:hidden;pointer-events:none;z-index:0;">${particles}</div>`;
  }

  if (isVitrine) {
    const h1 = data.highlight1Img || '';
    const h2 = data.highlight2Img || '';
    const h3 = data.highlight3Img || '';
    const hasHeroPhotos = Boolean(h1 || h2 || h3);

    const btn1Html = data.btn1Title ? `<a href="${data.btn1Url || '#'}" class="v-btn" target="_blank" rel="noopener">${data.btn1Title}</a>` : '';
    const btn2Html = data.btn2Title ? `<a href="${data.btn2Url || '#'}" class="v-btn" target="_blank" rel="noopener">${data.btn2Title}</a>` : '';
    const btn3Html = data.btn3Title ? `<a href="${data.btn3Url || '#'}" class="v-btn" target="_blank" rel="noopener">${data.btn3Title}</a>` : '';
    const btn4Html = data.btn4Title ? `<a href="${data.btn4Url || '#'}" class="v-btn" target="_blank" rel="noopener">${data.btn4Title}</a>` : '';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${data.name || data.arroba || 'Vitrine'}</title>
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
            position: relative;
            z-index: 2;
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
    ${emojiRainHtml}
    <div class="v-container">
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
            <a href="${instaUrl}" target="_blank" rel="noopener" class="v-arroba">${data.arroba || ''}</a>
            ${data.bio ? `<p class="v-bio">${data.bio}</p>` : ''}

            <div class="v-buttons">
                ${btn1Html}
                ${btn2Html}
                ${btn3Html}
                ${btn4Html}
            </div>

            <div class="v-footer">
                CRIADO COM <a href="/">PAINELBIO</a>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  // MODELO 1: CLASSIC
  const avatarHtml = data.avatar ? `
            <div class="preview-avatar-glow">
                <div class="preview-avatar-inner">
                    <img src="${data.avatar}" alt="${data.name || ''}">
                </div>
            </div>` : '';

  const bioHtml = data.bio ? `<p class="preview-bio">${data.bio}</p>` : '';
  const btn1Html = data.btn1Title ? `<a href="${data.btn1Url || '#'}" class="preview-link-btn" target="_blank" rel="noopener">${data.btn1Title}</a>` : '';
  const btn2Html = data.btn2Title ? `<a href="${data.btn2Url || '#'}" class="preview-link-btn" target="_blank" rel="noopener">${data.btn2Title}</a>` : '';
  const btn3Html = data.btn3Title ? `<a href="${data.btn3Url || '#'}" class="preview-link-btn" target="_blank" rel="noopener">${data.btn3Title}</a>` : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${data.name || data.arroba || 'Bio'}</title>
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
    ${emojiRainHtml}
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
                CRIADO COM <a href="/">PAINELBIO</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// API para publicar (Salvar) um site
app.post('/api/publish', async (req, res) => {
  try {
    const data = req.body;
    if (!data.arroba) return res.status(400).json({ error: 'Arroba é obrigatório' });
    
    const slug = data.arroba.startsWith('@') ? data.arroba : '@' + data.arroba;
    const cleanSlug = slug.toLowerCase();
    
    // Pasta onde os sites ficarão armazenados
    const sitesBaseDir = path.join(process.cwd(), 'data', 'sites');
    const siteDir = path.join(sitesBaseDir, cleanSlug);
    
    // Cria diretórios se não existirem
    if (!fs.existsSync(sitesBaseDir)) {
      fs.mkdirSync(sitesBaseDir, { recursive: true });
    }
    if (!fs.existsSync(siteDir)) {
      fs.mkdirSync(siteDir, { recursive: true });
    }
    
    // Adiciona data de criação se não existir
    if (!data.createdAt) {
      data.createdAt = new Date().toISOString();
    }

    // Salva _dados.json
    fs.writeFileSync(path.join(siteDir, '_dados.json'), JSON.stringify(data, null, 2), 'utf8');
    
    // Gera index.html
    const htmlContent = generateStaticSite(data);
    fs.writeFileSync(path.join(siteDir, 'index.html'), htmlContent, 'utf8');
    
    // Baixa/salva a imagem de preview/logo se existir
    if (data.avatar && data.avatar.startsWith('http')) {
      try {
        await downloadImage(data.avatar, path.join(siteDir, 'url_logo.jpg'));
      } catch (err) {
        console.error('Erro ao baixar avatar:', err);
      }
    }
    
    // Salva o screenshot do celular (preview.png)
    if (data.previewBase64) {
      const base64Data = data.previewBase64.replace(/^data:image\/png;base64,/, "");
      fs.writeFileSync(path.join(siteDir, 'preview.png'), base64Data, 'base64');
      delete data.previewBase64; // Não precisa salvar a base64 no banco antigo
    } else if (fs.existsSync(path.join(siteDir, 'url_logo.jpg'))) {
      // Fallback: copia a logo se não houver print
      fs.copyFileSync(path.join(siteDir, 'url_logo.jpg'), path.join(siteDir, 'preview.png'));
    }
    
    // Salva no banco antigo por compatibilidade por enquanto
    const slugForDb = cleanSlug.replace('@', '');
    saveStore(slugForDb, data);
    
    res.json({ success: true, url: `/${slugForDb}` });
  } catch (err) {
    console.error('Erro no publish:', err);
    res.status(500).json({ error: 'Erro ao publicar site' });
  }
});

// API para listar sites para a Galeria
app.get('/api/gallery', (req, res) => {
  const sitesBaseDir = path.join(process.cwd(), 'data', 'sites');
  if (!fs.existsSync(sitesBaseDir)) {
    return res.json({ sites: [] });
  }
  
  const folders = fs.readdirSync(sitesBaseDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
    
  const sites = [];
  for (const folder of folders) {
    const dadosPath = path.join(sitesBaseDir, folder, '_dados.json');
    if (fs.existsSync(dadosPath)) {
      try {
        const dados = JSON.parse(fs.readFileSync(dadosPath, 'utf8'));
        sites.push({
          arroba: dados.arroba,
          name: dados.name,
          avatar: dados.avatar,
          preset: dados.preset || 'gray',
          createdAt: dados.createdAt || new Date().toISOString(),
          // Vamos servir o preview via uma rota especial estática depois
          previewPath: `/api/sites/${folder}/preview.png`
        });
      } catch (e) {
        console.error('Erro ao ler _dados.json de', folder);
      }
    }
  }
  
  // Ordenar sites por data de criação (mais novos primeiro)
  sites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({ sites });
});

// API para deletar um site
app.delete('/api/sites/:arroba', (req, res) => {
  const arroba = req.params.arroba;
  if (!arroba) return res.status(400).json({ error: 'Arroba não informado' });
  
  const cleanSlug = arroba.startsWith('@') ? arroba.toLowerCase() : '@' + arroba.toLowerCase();
  const sitesBaseDir = path.join(process.cwd(), 'data', 'sites');
  const siteDir = path.join(sitesBaseDir, cleanSlug);
  
  try {
    if (fs.existsSync(siteDir)) {
      fs.rmSync(siteDir, { recursive: true, force: true });
    }
    
    // Deleta do db.js
    const slugForDb = cleanSlug.replace('@', '');
    deleteStore(slugForDb);
    
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao deletar site:', err);
    res.status(500).json({ error: 'Erro ao deletar o site' });
  }
});

// Rota estática para servir os arquivos do site dentro de /api/sites/ (para carregar imagens na galeria)
app.use('/api/sites', express.static(path.join(process.cwd(), 'data', 'sites')));

// API para pegar todas as lojas (legado)
app.get('/api/stores', (req, res) => {
  res.json(getAllStores());
});

// Rota dinâmica para exibir a bio de cada loja
app.get('/:slug', (req, res) => {
  const slug = req.params.slug;
  
  if (slug === 'favicon.ico' || slug === 'admin') {
    return res.status(404).end();
  }
  
  const folderSlug = '@' + slug.toLowerCase();
  const siteIndex = path.join(process.cwd(), 'data', 'sites', folderSlug, 'index.html');
  
  // Se o site estático gerado existir, nós o entregamos diretamente!
  if (fs.existsSync(siteIndex)) {
    return res.sendFile(siteIndex);
  }
  
  // Fallback: se não existir o estático, tenta ler do bd legado
  const store = getStore(slug);
  if (!store) {
    return res.redirect('/');
  }
  
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${store.name || 'Bio'}</title>
        <style>
            body { background-color: #000; color: #fff; font-family: sans-serif; text-align: center; padding: 50px; }
        </style>
    </head>
    <body>
        <h1>${store.name || 'Sem nome'}</h1>
        <p>${store.bio || ''}</p>
    </body>
    </html>
  `);
});

// Função para obter o IP local da máquina na rede Wi-Fi
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push(iface.address);
      }
    }
  }
  return addresses;
}

// Global error handler para garantir que sempre retorne JSON
app.use((err, req, res, next) => {
  console.error('Erro Express Global:', err);
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, error: 'O arquivo (imagem Base64) enviado é muito grande.' });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, error: 'Erro de formatação no JSON enviado.' });
  }
  res.status(500).json({ success: false, error: err.message || 'Erro interno no servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================`);
  console.log(`PainelBio está rodando de forma local!`);
  console.log(`\nAcesse no seu computador:`);
  console.log(`> http://localhost:${PORT}`);
  
  const ips = getLocalIPs();
  if (ips.length > 0) {
    console.log(`\nAcesse no seu CELULAR (conectado no mesmo Wi-Fi):`);
    ips.forEach(ip => {
      console.log(`> http://${ip}:${PORT}`);
    });
  } else {
    console.log(`\nNão foi possível detectar IPs locais na rede local. Verifique se está conectado ao Wi-Fi.`);
  }
  console.log(`==================================================\n`);
});
