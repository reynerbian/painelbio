// --- CONFIGURAÇÃO DA RAPIDAPI ---
window.RAPIDAPI_KEY = '045b178d42msh8ab87b110533394p1397eajsn3ac55c365582';

// Elementos do Sininho de Notificações
const btnScraperNotifications = document.getElementById('btn-scraper-notifications');
const scraperNotificationBalloon = document.getElementById('scraper-notification-balloon');
const btnCloseNotifications = document.getElementById('btn-close-notifications');
const scraperNotificationList = document.getElementById('scraper-notification-list');
const scraperBadge = document.getElementById('scraper-badge');

const leftIcon = document.querySelector('.left-icon');
        const rightIcon = document.querySelector('.right-icon');
        const leftDrawer = document.getElementById('left-drawer');
        const rightDrawer = document.getElementById('right-drawer');
        const overlay = document.getElementById('drawer-overlay');
        const closeBtns = document.querySelectorAll('.drawer-close');

        // Navegação do Rodapé (Galeria e Gerador)
        const navEditor = document.getElementById('nav-editor');
        const navGallery = document.getElementById('nav-gallery');
        const galleryOverlay = document.getElementById('gallery-overlay');

        const topBar = document.querySelector('.top-bar');

        if (navEditor && navGallery && galleryOverlay) {
            navEditor.addEventListener('click', () => {
                navEditor.classList.add('active');
                navGallery.classList.remove('active');
                galleryOverlay.classList.remove('active');
                if (topBar) topBar.style.display = 'flex';
            });

            navGallery.addEventListener('click', async () => {
                navGallery.classList.add('active');
                navEditor.classList.remove('active');
                galleryOverlay.classList.add('active');
                if (topBar) topBar.style.display = 'none';
                
                const galleryContent = galleryOverlay.querySelector('.gallery-content');
                galleryContent.innerHTML = '<div style="display: flex; justify-content: center; width: 100%;"><div class="loader" style="width: 30px; height: 30px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite;"></div></div>';
                
                try {
                    // SERVERLESS: Read from LocalStorage instead of /api/gallery
                    let savedLeads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
                    
                    // Emulate the expected API format: { sites: [ { arroba: "@foo", name: "Foo", previewBase64: "...", ... } ] }
                    // Actually, the previous backend returned { sites: [ { arroba: "...", name: "...", previewPath: "..." } ] }
                    // Since we save the whole object in LocalStorage, we can just use it directly!
                    const sites = savedLeads.map(lead => {
                        return {
                            ...lead,
                            previewPath: lead.previewBase64 || null // Use the base64 preview directly
                        };
                    });
                    
                    window.allSitesData = sites;
                    window.renderGallery(window.allSitesData);
                } catch (err) {
                    galleryContent.innerHTML = '<p style="text-align: center; color: #ff6b6b; width: 100%;">Erro ao carregar galeria.</p>';
                }
            });
        }
        
        window.filterGallery = function() {
            const searchInput = document.getElementById('gallery-search');
            if (!searchInput || !window.allSitesData) return;
            const term = searchInput.value.toLowerCase().trim();
            const filtered = window.allSitesData.filter(site => site.arroba && site.arroba.toLowerCase().includes(term));
            window.renderGallery(filtered);
        };

        window.renderGallery = function(sitesArray) {
            const galleryContent = document.getElementById('gallery-overlay').querySelector('.gallery-content');
            if (sitesArray && sitesArray.length > 0) {
                let html = '<div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 500px; margin: 0 auto; padding-bottom: 20px;">';
                sitesArray.forEach(site => {
                    const dateObj = new Date(site.createdAt);
                    const formattedDate = dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
                    
                    const presetMap = {
                        'gray': 'Básico',
                        'sunset': 'Sunset',
                        'neon-blue': 'Neon Blue',
                        'synthwave': 'Synthwave',
                        'fire': 'Fire',
                        'aurora': 'Aurora',
                        'indigo': 'Indigo',
                        'cyber-lime': 'Cyber Lime',
                        'rose-gold': 'Rose Gold',
                        'golden': 'Golden',
                        'deep-purple': 'Deep Purple',
                        'platinum': 'Platinum'
                    };
                    const themeName = presetMap[site.preset] || 'Básico';
                    
                    // Configuração do Status do Botão de Upload
                    // status: 'not_published' (Cinza), 'published' (Verde), 'modified' (Vermelho)
                    const status = site.status || 'not_published';
                    let btnStyle = '';
                    let btnTitle = '';
                    let btnBadgeText = '';

                    if (status === 'published') {
                        btnStyle = 'background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4);';
                        btnTitle = 'Status: Publicado e no ar!';
                        btnBadgeText = 'Online';
                    } else if (status === 'modified') {
                        btnStyle = 'background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4);';
                        btnTitle = 'Status: Modificado! Clique para atualizar online';
                        btnBadgeText = 'Modificado';
                    } else {
                        // not_published / cinza por padrão
                        btnStyle = 'background: rgba(140, 140, 140, 0.15); color: #a0a0a0; border: 1px solid rgba(160, 160, 160, 0.3);';
                        btnTitle = 'Status: Não publicado. Clique para publicar no ar!';
                        btnBadgeText = 'Pendente';
                    }

                    html += `
                        <div style="background: #0d1117; border: 1px solid #30363d; border-radius: 12px; padding: 12px; display: flex; gap: 12px; align-items: stretch; transition: all 0.2s;">
                            
                            <!-- Coluna da Esquerda (Imagem menor) -->
                            <div style="width: 70px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden; background: #000; border: 1px solid #222;">
                                <img src="${site.previewPath}" onerror="this.src='${site.avatar || ''}'" style="width: 100%; height: auto; object-fit: cover; display: block;" />
                            </div>
                            
                            <!-- Coluna da Direita (Textos e Botoes) -->
                            <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                                <!-- Textos em cima -->
                                <div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                        <div style="font-size: 1rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${site.arroba}</div>
                                        <span style="font-size: 0.65rem; padding: 2px 6px; border-radius: 10px; ${btnStyle}">${btnBadgeText}</span>
                                    </div>
                                    
                                    <div style="font-size: 0.75rem; color: #8b949e; margin-bottom: 2px;">
                                        <strong>Modelo:</strong> Classic / ${themeName}
                                    </div>
                                    
                                    <div style="font-size: 0.7rem; color: #6e7681;">
                                        ${formattedDate}
                                    </div>
                                </div>
                                
                                <!-- Botoes embaixo -->
                                <div style="display: flex; gap: 8px; margin-top: 12px;">
                                    <button onclick="window.previewSiteOffline('${site.arroba}')" style="flex: 1; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 8px 0; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="Ver Prévia">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </button>
                                    
                                    <button onclick="window.startUploadSite('${site.arroba}')" style="flex: 1; ${btnStyle} padding: 8px 0; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="${btnTitle}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </button>
                                    
                                    <button onclick="deleteSite('${site.arroba}')" style="flex: 1; background: rgba(255, 0, 0, 0.1); color: #ff4444; border: 1px solid rgba(255, 0, 0, 0.3); padding: 8px 0; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="Deletar">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';
                galleryContent.innerHTML = html;
            } else {
                galleryContent.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum site salvo ainda.</p>';
            }
        };

        // Função global para fazer upload do site com modal de progresso
        window.startUploadSite = async function(arroba) {
            let savedLeads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
            const site = savedLeads.find(l => l.arroba.toLowerCase() === arroba.toLowerCase());
            
            if (!site) {
                showCustomAlert('Dados do site não encontrados!', 'error');
                return;
            }

            // Remove modal antigo se existir
            const oldModal = document.getElementById('upload-progress-modal');
            if (oldModal) oldModal.remove();

            // Cria modal de progresso
            const modalHtml = `
                <div id="upload-progress-modal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;">
                    <div style="background: #161b22; border: 1px solid #30363d; border-radius: 16px; width: 100%; max-width: 380px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); text-align: center; color: #fff; font-family: 'Inter', sans-serif;">
                        <h3 style="margin: 0 0 16px 0; font-size: 1.1rem; color: #f0f6fc; font-weight: 600;">Publicando no Ar...</h3>
                        <p style="font-size: 0.85rem; color: #8b949e; margin-bottom: 20px;">${site.arroba}</p>
                        
                        <!-- Barra de Progresso -->
                        <div style="width: 100%; background: #21262d; border-radius: 10px; height: 14px; overflow: hidden; margin-bottom: 12px; border: 1px solid #30363d; position: relative;">
                            <div id="upload-bar-fill" style="width: 0%; height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981); transition: width 0.3s ease-in-out; border-radius: 10px;"></div>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #8b949e; margin-bottom: 20px;">
                            <span id="upload-status-text">Conectando ao servidor...</span>
                            <span id="upload-percentage" style="font-weight: 700; color: #10b981;">0%</span>
                        </div>

                        <div id="upload-result-actions" style="display: none; flex-direction: column; gap: 10px; margin-top: 10px;">
                            <a id="upload-live-link" href="#" target="_blank" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); text-decoration: none; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                <span>🔗 Abrir Site Online</span>
                            </a>
                            <button id="upload-close-btn" style="background: #21262d; border: 1px solid #30363d; color: #c9d1d9; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.85rem;">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            const barFill = document.getElementById('upload-bar-fill');
            const percentText = document.getElementById('upload-percentage');
            const statusText = document.getElementById('upload-status-text');
            const resultActions = document.getElementById('upload-result-actions');
            const liveLink = document.getElementById('upload-live-link');
            const closeBtn = document.getElementById('upload-close-btn');

            const setProgress = (percent, text) => {
                if (barFill) barFill.style.width = `${percent}%`;
                if (percentText) percentText.textContent = `${percent}%`;
                if (statusText) statusText.textContent = text;
            };

            // Limpa logs anteriores do sininho e inicializa notificação de upload
            if (scraperNotificationList) {
                scraperNotificationList.innerHTML = '';
            }
            if (scraperBadge) {
                scraperBadge.style.display = 'none';
                scraperBadge.className = 'notification-badge';
            }
            addScraperLog(`Iniciando publicação do site ${site.arroba}...`, 'info');

            // Simulação de Progresso
            setProgress(15, 'Preparando réplica estática...');
            addScraperLog('[Upload] Preparando réplica do site...', 'info');
            await new Promise(r => setTimeout(r, 400));

            setProgress(40, 'Conectando ao Cloudflare...');
            addScraperLog('[Upload] Conectando à API do Cloudflare Pages...', 'info');
            await new Promise(r => setTimeout(r, 400));

            try {
                setProgress(65, 'Enviando banco de dados...');
                addScraperLog('[Upload] Enviando dados para /api/publish...', 'info');
                
                const response = await fetch('/api/publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(site)
                });

                if (response.ok) {
                    const result = await response.json();
                    setProgress(100, 'Site no ar com sucesso!');
                    addScraperLog(`[Upload] Sucesso! Site no ar: ${result.url || site.arroba}`, 'success');
                    
                    if (scraperBadge) {
                        scraperBadge.style.display = 'block';
                        scraperBadge.className = 'notification-badge success';
                    }

                    // Atualiza status do site no LocalStorage
                    site.status = 'published';
                    site.publishedAt = new Date().toISOString();
                    
                    const updatedLeads = savedLeads.map(l => l.arroba.toLowerCase() === arroba.toLowerCase() ? site : l);
                    localStorage.setItem('painelbio-insta-leads', JSON.stringify(updatedLeads));
                    window.allSitesData = updatedLeads;

                    const cleanSlug = site.arroba.replace('@', '').toLowerCase();
                    const fullUrl = `${window.location.origin}/${cleanSlug}`;
                    
                    if (liveLink) liveLink.href = fullUrl;
                    if (resultActions) resultActions.style.display = 'flex';

                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => {
                            document.getElementById('upload-progress-modal').remove();
                            // Re-renderiza a galeria com o botão verde!
                            window.renderGallery(window.allSitesData);
                        });
                    }
                } else {
                    let errMsg = `HTTP ${response.status}`;
                    let errDetails = '';
                    try {
                        const errJson = await response.json();
                        errMsg = errJson.error || errMsg;
                        errDetails = errJson.details || '';
                    } catch(e) {
                        const textErr = await response.text().catch(() => '');
                        if (response.status === 404) {
                            errMsg = 'Endpoint /api/publish não encontrado (404)';
                            errDetails = 'As Cloudflare Functions não foram implantadas no seu projeto Pages.';
                        } else {
                            errDetails = textErr.substring(0, 150);
                        }
                    }

                    const fullErrString = `${errMsg}${errDetails ? ' - ' + errDetails : ''}`;
                    setProgress(100, 'Erro ao publicar');
                    statusText.style.color = '#ef4444';
                    statusText.textContent = `Erro: ${errMsg}`;
                    
                    addScraperLog(`[Upload Erro] ${fullErrString}`, 'error');
                    if (scraperBadge) {
                        scraperBadge.style.display = 'block';
                        scraperBadge.className = 'notification-badge error';
                    }

                    if (resultActions) resultActions.style.display = 'flex';
                    if (liveLink) liveLink.style.display = 'none';
                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => {
                            document.getElementById('upload-progress-modal').remove();
                        });
                    }
                }
            } catch (err) {
                addScraperLog(`[Upload Erro] Falha na requisição: ${err.message}`, 'error');
                if (scraperBadge) {
                    scraperBadge.style.display = 'block';
                    scraperBadge.className = 'notification-badge error';
                }

                setProgress(100, 'Erro de Conexão');
                statusText.style.color = '#ef4444';
                statusText.textContent = `Erro: ${err.message}`;
                
                if (resultActions) resultActions.style.display = 'flex';
                if (liveLink) liveLink.style.display = 'none';
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        document.getElementById('upload-progress-modal').remove();
                    });
                }
            }
        };
        
        // Função global para deletar site
        window.deleteSite = async function(arroba) {
            if (confirm("ATENÇÃO: Deseja realmente deletar o site " + arroba + "?\n\nAVISO: Se este site já estiver upado (online) em alguma hospedagem externa, ele NÃO será removido de lá! Essa ação deleta apenas da memória do seu navegador.")) {
                try {
                    let leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
                    leads = leads.filter(l => l.arroba.toLowerCase() !== arroba.toLowerCase());
                    localStorage.setItem('painelbio-insta-leads', JSON.stringify(leads));
                    
                    // Atualiza a galeria clicando novamente no botão
                    if (navGallery) navGallery.click();
                } catch (e) {
                    showCustomAlert('Erro ao tentar deletar o site da memória.', 'error');
                }
            }
        };

        // Função global para pré-visualizar o site offline
        window.previewSiteOffline = function(arroba) {
            let leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
            const siteData = leads.find(l => l.arroba.toLowerCase() === arroba.toLowerCase());
            
            if (siteData) {
                const htmlContent = window.generateStaticSite(siteData);
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            } else {
                showCustomAlert('Site não encontrado na memória.', 'error');
            }
        };

        window.generateStaticSite = function(data) {
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

            return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>${data.name || data.arroba || 'Bio'}</title>
    <style>
        :root {
            --theme-color-1: ${theme.c1};
            --theme-color-2: ${theme.c2};
            --theme-border: ${theme.b};
            --theme-glow: ${theme.g};
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

        .bg-glow-top { top: -50px; left: -50px; background: radial-gradient(circle, var(--theme-color-1) 0%, transparent 70%); }
        .bg-glow-bottom { bottom: -50px; right: -50px; background: radial-gradient(circle, var(--theme-color-2) 0%, transparent 70%); animation-delay: -6s; }

        @keyframes glow-wave {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); }
            50% { transform: translate(15px, -15px) scale(1.15) rotate(45deg); }
            100% { transform: translate(-10px, 15px) scale(0.9) rotate(90deg); }
        }

        /* Card Container Principal */
        .preview-card {
            width: 100%;
            max-width: 400px;
            background: rgba(18, 15, 27, 0.75);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 28px;
            padding: 24px 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 20px 45px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
            position: relative;
            z-index: 10; 
            box-sizing: border-box;
        }

        /* Avatar com contorno neon/gradient dinâmico */
        .preview-avatar-glow {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--theme-color-1, #8e8e93), var(--theme-color-2, #3a3a3c)); 
            padding: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 20px var(--theme-glow, rgba(142, 142, 147, 0.3));
            margin-bottom: 16px;
            transition: background 0.3s, box-shadow 0.3s;
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
            font-size: 1.25rem;
            font-weight: 700;
            color: #ffffff;
            text-align: center;
            line-height: 1.3;
            margin-bottom: 8px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin-top: 0;
        }

        .preview-arroba {
            font-size: 0.9rem;
            color: var(--theme-color-1, #8e8e93); 
            font-weight: 500;
            text-decoration: none;
            margin-bottom: 16px;
            transition: color 0.3s, transform 0.2s;
            cursor: pointer;
            display: inline-block;
        }

        .preview-arroba:hover,
        .preview-arroba:active {
            text-decoration: underline;
            transform: scale(1.03);
        }

        .preview-bio {
            font-size: 0.85rem;
            color: #d1d5db; 
            text-align: ${data.bioAlign || 'center'};
            line-height: 1.5;
            max-width: 95%;
            margin-bottom: 24px;
            margin-top: 0;
            white-space: pre-wrap;
        }

        .preview-links {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .preview-btn {
            width: 100%;
            height: 52px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--theme-border, rgba(255, 255, 255, 0.08));
            color: #ffffff;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-decoration: none;
            box-sizing: border-box;
        }

        .preview-btn:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }

        .preview-btn:active {
            background: rgba(255, 255, 255, 0.08);
            border-color: var(--theme-color-1, rgba(255, 255, 255, 0.25));
            transform: scale(0.98);
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
            ${data.avatar ? `
            <div class="preview-avatar-glow">
                <div class="preview-avatar-inner">
                    <img src="${data.avatar}" alt="${data.name}">
                </div>
            </div>` : ''}
            
            <h2 class="preview-name">${data.name || ''}</h2>
            <a href="#" class="preview-arroba">${data.arroba || ''}</a>
            
            ${data.bio ? `<p class="preview-bio">${data.bio}</p>` : ''}
            
            <div class="preview-links">
                ${data.btn1Title ? `<a href="${data.btn1Url}" class="preview-btn" target="_blank">${data.btn1Title}</a>` : ''}
                ${data.btn2Title ? `<a href="${data.btn2Url}" class="preview-btn" target="_blank">${data.btn2Title}</a>` : ''}
                ${data.btn3Title ? `<a href="${data.btn3Url}" class="preview-btn" target="_blank">${data.btn3Title}</a>` : ''}
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

        function openDrawer(drawer) {
            drawer.classList.add('active');
            overlay.classList.add('active');
        }

        function closeAll() {
            leftDrawer.classList.remove('active');
            rightDrawer.classList.remove('active');
            overlay.classList.remove('active');
        }

        leftIcon.addEventListener('click', () => openDrawer(leftDrawer));
        rightIcon.addEventListener('click', () => openDrawer(rightDrawer));
        overlay.addEventListener('click', closeAll);
        closeBtns.forEach(btn => btn.addEventListener('click', closeAll));

        // Presets de Degradês Premium (Cores do Tema)
        const GRADIENT_PRESETS = {
            'gray': {
                color1: '#e2e8f0',
                color2: '#475569',
                border: 'rgba(226, 232, 240, 0.28)',
                glow: 'rgba(71, 85, 105, 0.45)'
            },
            'sunset': {
                color1: '#ff0844',
                color2: '#ffb199',
                border: 'rgba(255, 8, 68, 0.35)',
                glow: 'rgba(255, 177, 153, 0.55)'
            },
            'neon-blue': {
                color1: '#00c6ff',
                color2: '#0072ff',
                border: 'rgba(0, 198, 255, 0.35)',
                glow: 'rgba(0, 114, 255, 0.55)'
            },
            'synthwave': {
                color1: '#f107a3',
                color2: '#7b2ff7',
                border: 'rgba(241, 7, 163, 0.35)',
                glow: 'rgba(123, 47, 247, 0.55)'
            },
            'fire': {
                color1: '#f857a6',
                color2: '#ff5858',
                border: 'rgba(248, 87, 166, 0.35)',
                glow: 'rgba(255, 88, 88, 0.55)'
            },
            'aurora': {
                color1: '#00ff87',
                color2: '#60e3fa',
                border: 'rgba(0, 255, 135, 0.35)',
                glow: 'rgba(96, 227, 250, 0.55)'
            },
            'indigo': {
                color1: '#4f46e5',
                color2: '#06b6d4',
                border: 'rgba(79, 70, 229, 0.35)',
                glow: 'rgba(6, 182, 212, 0.55)'
            },
            'cyber-lime': {
                color1: '#a8ff78',
                color2: '#78ffd6',
                border: 'rgba(168, 255, 120, 0.35)',
                glow: 'rgba(120, 255, 214, 0.55)'
            },
            'rose-gold': {
                color1: '#f6d365',
                color2: '#fda085',
                border: 'rgba(246, 211, 101, 0.35)',
                glow: 'rgba(253, 160, 133, 0.55)'
            },
            'golden': {
                color1: '#f5af19',
                color2: '#f12711',
                border: 'rgba(245, 175, 25, 0.35)',
                glow: 'rgba(241, 39, 17, 0.55)'
            },
            'deep-purple': {
                color1: '#8a2387',
                color2: '#e94057',
                border: 'rgba(138, 35, 135, 0.35)',
                glow: 'rgba(233, 64, 87, 0.55)'
            },
            'platinum': {
                color1: '#ffffff',
                color2: '#616161',
                border: 'rgba(255, 255, 255, 0.35)',
                glow: 'rgba(97, 97, 97, 0.45)'
            }
        };

        // Lógica do Lápis de Notificação (Seletor de Cores do Tema)
        const topActionBtn = document.querySelector('.top-action-btn');
        const colorBalloon = document.getElementById('color-balloon');

        // Restaura o preset do tema salvo anteriormente
        const savedPresetName = localStorage.getItem('selected-theme-preset') || 'gray';
        applyThemePreset(savedPresetName);

        function applyThemePreset(presetName) {
            const preset = GRADIENT_PRESETS[presetName] || GRADIENT_PRESETS['gray'];
            
            // Aplica as variáveis CSS no elemento raiz
            document.documentElement.style.setProperty('--theme-color-1', preset.color1);
            document.documentElement.style.setProperty('--theme-color-2', preset.color2);
            document.documentElement.style.setProperty('--theme-border', preset.border);
            document.documentElement.style.setProperty('--theme-glow', preset.glow);
            
            // Salva a escolha no localStorage
            localStorage.setItem('selected-theme-preset', presetName);

            // Marca a opção ativa visualmente no balão de cores
            const optionToSelect = document.querySelector(`.color-option[data-preset="${presetName}"]`);
            if (optionToSelect) {
                document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('is-selected'));
                optionToSelect.classList.add('is-selected');
            }
        }

        function toggleColorPicker() {
            if (colorBalloon) {
                const isActive = colorBalloon.classList.contains('active');
                if (isActive) {
                    closeColorPicker();
                } else {
                    openColorPicker();
                }
            }
        }

        function openColorPicker() {
            if (colorBalloon) {
                colorBalloon.classList.add('active');
            }
        }

        function closeColorPicker() {
            if (colorBalloon) {
                colorBalloon.classList.remove('active');
                colorBalloon.classList.remove('low-opacity'); // Reseta a opacidade
            }
        }

        if (topActionBtn) {
            topActionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Impede que o clique propague para o document
                toggleColorPicker();
            });
        }

        // Lógica de seleção de cores dentro do balão (Grid 2x6)
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita fechar
                const presetName = option.getAttribute('data-preset');
                applyThemePreset(presetName);
                // O balão NÃO fecha ao clicar na cor para permitir ver a troca
            });
        });

        // Alternar opacidade (fade out) ao clicar fora para visualizar o celular atrás
        document.addEventListener('click', (e) => {
            if (colorBalloon && colorBalloon.classList.contains('active')) {
                // Se o clique foi fora do balão e fora do lápis do rodapé
                if (!colorBalloon.contains(e.target) && !bottomActionBtn.contains(e.target)) {
                    colorBalloon.classList.toggle('low-opacity');
                } else {
                    // Se clicou dentro do balão ou no lápis do rodapé, garante opacidade total
                    colorBalloon.classList.remove('low-opacity');
                }
            }
        });

        // Sistema de Favoritos e Ordenação dos Modelos
        const templatesGrid = document.querySelector('.templates-grid');
        const templateCards = Array.from(document.querySelectorAll('.template-card'));

        // Carrega favoritos salvos
        let favorites = JSON.parse(localStorage.getItem('favorite-templates')) || [];

        // Inicializa o estado visual das estrelas
        templateCards.forEach(card => {
            const templateId = card.getAttribute('data-template');
            const star = card.querySelector('.template-star');
            if (favorites.includes(templateId)) {
                star.classList.add('is-favorite');
            }
        });

        // Ordena os cards iniciais
        sortTemplates();

        // Adiciona listener de clique nas estrelas
        templateCards.forEach(card => {
            const star = card.querySelector('.template-star');
            const templateId = card.getAttribute('data-template');

            star.addEventListener('click', (e) => {
                e.stopPropagation(); // Impede o clique no card de disparar ações futuras
                
                const isFav = star.classList.toggle('is-favorite');
                
                if (isFav) {
                    if (!favorites.includes(templateId)) {
                        favorites.push(templateId);
                    }
                } else {
                    favorites = favorites.filter(id => id !== templateId);
                }
                
                localStorage.setItem('favorite-templates', JSON.stringify(favorites));
                
                // Ordena os cards dinamicamente
                sortTemplates();
            });
        });

        function sortTemplates() {
            const sortedCards = templateCards.sort((a, b) => {
                const aId = a.getAttribute('data-template');
                const bId = b.getAttribute('data-template');
                const aFav = favorites.includes(aId) ? 1 : 0;
                const bFav = favorites.includes(bId) ? 1 : 0;
                return bFav - aFav; // Favoritados (1) vêm antes
            });
            sortedCards.forEach(card => templatesGrid.appendChild(card));
        }

        // Lógica de seleção do modelo e transição
        templateCards.forEach(card => {
            card.addEventListener('click', () => {
                const arrobaInput = document.getElementById('input-arroba');
                const currentArroba = arrobaInput ? arrobaInput.value.trim() : '';

                if (currentArroba && window.loadedFromGallery) {
                    if (confirm(`Atenção: O site ${currentArroba} está carregado no gerador.\n\nDeseja SALVAR as alterações antes de iniciar um novo projeto vazio?`)) {
                        const btnSave = document.getElementById('btn-save-inspector');
                        if (btnSave) btnSave.click();
                        
                        // Espera o salvamento terminar antes de limpar e carregar o novo
                        setTimeout(() => {
                            clearEditorState();
                            processTemplateSelection(card);
                        }, 800);
                        return;
                    } else {
                        if (confirm('Deseja DESCARTAR o site atual e iniciar um novo projeto VAZIO do zero?')) {
                            clearEditorState();
                            processTemplateSelection(card);
                            return;
                        } else {
                            // Cancela a ação inteira
                            return;
                        }
                    }
                } else {
                    // Backup local para não perder o que foi digitado caso seja apenas um switch de template sem carregar da galeria
                    if (currentArroba) {
                        window.tempFormBackup = {
                            avatar: document.getElementById('input-avatar')?.value || '',
                            name: document.getElementById('input-name')?.value || '',
                            arroba: currentArroba,
                            bio: document.getElementById('input-bio')?.value || '',
                            btn1Title: document.getElementById('input-btn1-title')?.value || '',
                            btn1Url: document.getElementById('input-btn1-url')?.value || '',
                            btn2Title: document.getElementById('input-btn2-title')?.value || '',
                            btn2Url: document.getElementById('input-btn2-url')?.value || '',
                            btn3Title: document.getElementById('input-btn3-title')?.value || '',
                            btn3Url: document.getElementById('input-btn3-url')?.value || '',
                            bioAlign: document.querySelector('.align-btn.active')?.getAttribute('data-align') || 'center',
                            preset: localStorage.getItem('selected-theme-preset') || 'gray'
                        };
                    } else {
                        window.tempFormBackup = null;
                    }
                    processTemplateSelection(card);
                }
            });
        });

        function clearEditorState() {
            window.loadedFromGallery = false;
            const btnLoadSite = document.getElementById('btn-load-site');
            if (btnLoadSite) btnLoadSite.classList.remove('site-loaded-active');
            
            const formInputs = document.querySelectorAll('#inspector-form input, #inspector-form textarea');
            formInputs.forEach(i => i.value = '');
            
            // Limpa a busca principal
            const searchInsta = document.getElementById('search-insta');
            if (searchInsta) searchInsta.value = '';

            // Limpa o preview
            const previewScreen = document.getElementById('phone-preview-screen');
            if (previewScreen) {
                previewScreen.innerHTML = '';
            }
        }

        function processTemplateSelection(card) {
            // Remove a seleção de todos os outros cards
            templateCards.forEach(c => c.classList.remove('is-selected'));
            
            // Adiciona seleção ao card clicado (borda fica azul)
            card.classList.add('is-selected');

            // Fecha o menu de modelos após 350ms de delay
            setTimeout(() => {
                closeAll();
                
                // Remove o loader e carrega a página de pré-visualização no celular
                loadTemplatePreview(card.getAttribute('data-template'));
            }, 350);
        }

        // Template do formulário Classic em HTML
        // CLASSIC_FORM_HTML foi movido para models/classic/inspector.html
let CLASSIC_FORM_HTML = "";

// Função para carregar o modelo Classic dinamicamente
async function loadClassicModel() {
    try {
        const response = await fetch('/models/classic/inspector.html');
        CLASSIC_FORM_HTML = await response.text();
    } catch (e) {
        console.error("Erro ao carregar o modelo Classic:", e);
    }
}
// Carregar o modelo ao iniciar (isso pode ser mudado para quando clicar no menu)
loadClassicModel();


        function loadTemplatePreview(templateId) {
            const previewScreen = document.getElementById('phone-preview-screen');
            const inspectorContent = document.getElementById('inspector-content');
            const inspectorActions = document.getElementById('inspector-actions');
            const fakeDataToggle = document.getElementById('fake-data-toggle');
            
            if (templateId === 'classic') {
                // Altera o background do celular para o gradiente da foto
                previewScreen.style.background = 'radial-gradient(circle at center, #1b162b 0%, #050409 100%)';
                
                // Injeta a estrutura de visualização vazia no celular
                previewScreen.innerHTML = `
                    <div class="preview-bio-page">
                        <!-- Luzes de fundo dinâmicas -->
                        <div class="bg-glow bg-glow-top"></div>
                        <div class="bg-glow bg-glow-bottom"></div>

                        <div class="preview-card" id="view-card" style="display: none;">
                            <div class="preview-avatar-glow" id="view-avatar-container" style="display: none;">
                                <div class="preview-avatar-inner" id="view-avatar-inner">
                                    <!-- Imagem do avatar carregada dinamicamente -->
                                </div>
                            </div>
                            
                            <h2 class="preview-name" id="view-name"></h2>
                            <a href="#" target="_blank" class="preview-arroba" id="view-arroba"></a>
                            
                            <p class="preview-bio" id="view-bio"></p>
                            
                            <div class="preview-links" id="view-links">
                                <!-- Botões dinâmicos aparecerão aqui -->
                            </div>
                            
                            <div class="preview-footer" id="view-footer" style="display: none;">
                                <span>🔗 Criado com</span>
                                <a href="#">PainelBio</a>
                            </div>
                        </div>
                    </div>
                `;

                // Injeta o formulário do Classic no Inspector
                inspectorContent.innerHTML = CLASSIC_FORM_HTML;
                
                // Mostra as ações da IA do cabeçalho
                inspectorActions.style.display = 'flex';
                
                // Reseta o switch para desligado
                fakeDataToggle.checked = false;

                // Vincula os listeners de input do novo formulário
                bindInspectorFormEvents();

                // Habilita o lápis de cores na notificação do topo
                const topBtn = document.querySelector('.top-action-btn');
                if (topBtn) {
                    topBtn.classList.remove('disabled');
                }

                // Restaura dados do backup temporário (se houver, ao trocar template sem salvar)
                if (window.tempFormBackup && window.tempFormBackup.arroba) {
                    const backup = window.tempFormBackup;
                    const fieldsToRestore = {
                        'input-avatar': backup.avatar || '',
                        'input-name': backup.name || '',
                        'input-arroba': backup.arroba || '',
                        'input-bio': backup.bio || '',
                        'input-btn1-title': backup.btn1Title || '',
                        'input-btn1-url': backup.btn1Url || '',
                        'input-btn2-title': backup.btn2Title || '',
                        'input-btn2-url': backup.btn2Url || '',
                        'input-btn3-title': backup.btn3Title || '',
                        'input-btn3-url': backup.btn3Url || ''
                    };
                    for (const [id, val] of Object.entries(fieldsToRestore)) {
                        const el = document.getElementById(id);
                        if (el) el.value = val;
                    }
                    
                    if (backup.bioAlign) {
                        const alignBtn = document.querySelector(`.align-btn[data-align="${backup.bioAlign}"]`);
                        if (alignBtn) alignBtn.click();
                    }
                    
                    if (backup.preset) {
                        const colorOption = document.querySelector(`.color-option[data-preset="${backup.preset}"]`);
                        if (colorOption) colorOption.click();
                    }
                    
                    if (typeof updatePreviewFromForm === 'function') {
                        updatePreviewFromForm();
                    }
                    window.tempFormBackup = null; // Clear it
                } else {
                    // Restaura dados do lead já pesquisado (se houver) para não precisar pesquisar de novo
                    const currentArroba = document.getElementById('search-insta')?.value?.trim()?.toLowerCase();
                    if (currentArroba) {
                        const leads = getLeads();
                        const cleanSearch = currentArroba.startsWith('@') ? currentArroba : '@' + currentArroba;
                        const savedLead = leads.find(l => l.arroba?.toLowerCase() === cleanSearch.toLowerCase());
                        if (savedLead) {
                            const fieldsToRestore = {
                                'input-avatar': savedLead.avatar || '',
                                'input-name': savedLead.name || '',
                                'input-arroba': savedLead.arroba || '',
                                'input-bio': savedLead.bio || '',
                                'input-btn1-title': savedLead.btn1Title || '',
                                'input-btn1-url': savedLead.btn1Url || '',
                                'input-btn2-title': savedLead.btn2Title || '',
                                'input-btn2-url': savedLead.btn2Url || '',
                                'input-btn3-title': savedLead.btn3Title || '',
                                'input-btn3-url': savedLead.btn3Url || ''
                            };
                            for (const [id, val] of Object.entries(fieldsToRestore)) {
                                const el = document.getElementById(id);
                                if (el) el.value = val;
                            }
                        }
                    }
                    
                    // Aplica dados do formulário na pré-visualização
                    updatePreviewFromForm();
                }
            }
        }

        // Lógica do Switch de Dados de Exemplo no Inspector
        const fakeDataToggle = document.getElementById('fake-data-toggle');

        fakeDataToggle.addEventListener('change', () => {
            const selectedTemplate = document.querySelector('.template-card.is-selected');
            
            // Se nenhum modelo estiver selecionado ainda, escolhe o Classic automaticamente
            if (!selectedTemplate) {
                const classicCard = document.querySelector('.template-card[data-template="classic"]');
                if (classicCard) {
                    classicCard.click();
                }
            } else {
                if (fakeDataToggle.checked) {
                    // Preenche os campos do formulário com dados de teste
                    const avatarInput = document.getElementById('input-avatar');
                    const nameInput = document.getElementById('input-name');
                    const arrobaInput = document.getElementById('input-arroba');
                    const bioInput = document.getElementById('input-bio');
                    const btn1TitleInput = document.getElementById('input-btn1-title');
                    const btn1UrlInput = document.getElementById('input-btn1-url');
                    const btn2TitleInput = document.getElementById('input-btn2-title');
                    const btn2UrlInput = document.getElementById('input-btn2-url');
                    const btn3TitleInput = document.getElementById('input-btn3-title');
                    const btn3UrlInput = document.getElementById('input-btn3-url');

                    if (avatarInput) avatarInput.value = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200";
                    if (nameInput) nameInput.value = "Ana Carolina | Semijoias de Luxo";
                    if (arrobaInput) arrobaInput.value = "anacarolina.semijoias";
                    if (bioInput) bioInput.value = `Peças exclusivas banhadas a ouro 18k.\nFrete grátis para todo o Brasil. ✨\nEnviamos com amor.`;
                    if (btn1TitleInput) btn1TitleInput.value = "🛍️ Ver Catálogo no WhatsApp";
                    if (btn1UrlInput) btn1UrlInput.value = "https://wa.me/5511999999999";
                    if (btn2TitleInput) btn2TitleInput.value = "✨ Seguir no Instagram";
                    if (btn2UrlInput) btn2UrlInput.value = "https://instagram.com/anacarolina.semijoias";
                    if (btn3TitleInput) btn3TitleInput.value = "📍 Como Chegar (Localização)";
                    if (btn3UrlInput) btn3UrlInput.value = "https://maps.google.com";
                } else {
                    // Limpa todos os campos do formulário
                    const form = document.getElementById('inspector-form');
                    if (form) form.reset();
                }
            }

            // Atualiza o preview na tela do celular
            updatePreviewFromForm();
        });

        // Função para ler o formulário e atualizar a pré-visualização em tempo real
        function updatePreviewFromForm() {
            const viewCard = document.getElementById('view-card');
            const viewAvatarContainer = document.getElementById('view-avatar-container');
            const viewAvatarInner = document.getElementById('view-avatar-inner');
            const viewName = document.getElementById('view-name');
            const viewArroba = document.getElementById('view-arroba');
            const viewBio = document.getElementById('view-bio');
            const viewLinks = document.getElementById('view-links');
            const viewFooter = document.getElementById('view-footer');

            // Se o modelo classic não estiver renderizado no celular, não faz nada
            if (!viewCard) return;

            const avatarUrlInput = document.getElementById('input-avatar');
            const nameInput = document.getElementById('input-name');
            const arrobaInput = document.getElementById('input-arroba');
            const bioInput = document.getElementById('input-bio');
            
            const btn1TitleInput = document.getElementById('input-btn1-title');
            const btn1UrlInput = document.getElementById('input-btn1-url');
            const btn2TitleInput = document.getElementById('input-btn2-title');
            const btn2UrlInput = document.getElementById('input-btn2-url');
            const btn3TitleInput = document.getElementById('input-btn3-title');
            const btn3UrlInput = document.getElementById('input-btn3-url');

            const avatarUrl = avatarUrlInput ? avatarUrlInput.value.trim() : '';
            const name = nameInput ? nameInput.value.trim() : '';
            const arroba = arrobaInput ? arrobaInput.value.trim() : '';
            const bio = bioInput ? bioInput.value.trim() : '';
            
            const btn1Title = btn1TitleInput ? btn1TitleInput.value.trim() : '';
            const btn1Url = btn1UrlInput ? btn1UrlInput.value.trim() : '';
            const btn2Title = btn2TitleInput ? btn2TitleInput.value.trim() : '';
            const btn2Url = btn2UrlInput ? btn2UrlInput.value.trim() : '';
            const btn3Title = btn3TitleInput ? btn3TitleInput.value.trim() : '';
            const btn3Url = btn3UrlInput ? btn3UrlInput.value.trim() : '';

            const hasAnyContent = avatarUrl || name || arroba || bio || btn1Title || btn2Title || btn3Title;

            if (!hasAnyContent) {
                // Esconde o card e o rodapé se não tiver nada digitado
                viewCard.style.display = "none";
                viewFooter.style.display = "none";
                return;
            }

            // Mostra o card
            viewCard.style.display = "flex";

            // Avatar
            if (avatarUrl) {
                viewAvatarInner.innerHTML = `<img src="${avatarUrl}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                viewAvatarContainer.style.display = "flex";
            } else {
                viewAvatarInner.innerHTML = "";
                viewAvatarContainer.style.display = "none";
            }

            // Nome do Cliente
            if (name) {
                viewName.textContent = name;
                viewName.style.display = "block";
            } else {
                viewName.textContent = "";
                viewName.style.display = "none";
            }

            // @ do Instagram (Clicável que leva para o perfil)
            if (arroba) {
                const displayArroba = arroba.startsWith('@') ? arroba : `@${arroba}`;
                const cleanUser = arroba.startsWith('@') ? arroba.substring(1) : arroba;
                viewArroba.textContent = displayArroba;
                viewArroba.href = `https://instagram.com/${cleanUser}`;
                viewArroba.style.display = "inline-block";
            } else {
                viewArroba.textContent = "";
                viewArroba.href = "#";
                viewArroba.style.display = "none";
            }

            // Texto da Bio
            if (bio) {
                viewBio.textContent = bio;
                viewBio.style.display = "block";
                const activeAlignBtn = document.querySelector('.align-btn.active');
                viewBio.style.textAlign = activeAlignBtn ? activeAlignBtn.getAttribute('data-align') : 'center';
            } else {
                viewBio.textContent = "";
                viewBio.style.display = "none";
            }

            // Botões do Link
            let buttonsHtml = "";
            if (btn1Title) {
                buttonsHtml += `<div class="preview-btn" onclick="${btn1Url ? `window.open('${btn1Url}', '_blank')` : ''}">${btn1Title}</div>`;
            }
            if (btn2Title) {
                buttonsHtml += `<div class="preview-btn" onclick="${btn2Url ? `window.open('${btn2Url}', '_blank')` : ''}">${btn2Title}</div>`;
            }
            if (btn3Title) {
                buttonsHtml += `<div class="preview-btn" onclick="${btn3Url ? `window.open('${btn3Url}', '_blank')` : ''}">${btn3Title}</div>`;
            }
            viewLinks.innerHTML = buttonsHtml;

            // Mostra o rodapé PainelBio
            viewFooter.style.display = "flex";
        }

        // Listener de entrada em tempo real para os inputs do formulário (vinculado dinamicamente)
        function bindInspectorFormEvents() {
            const formInputs = document.querySelectorAll('#inspector-form input, #inspector-form textarea');
            formInputs.forEach(input => {
                input.addEventListener('input', updatePreviewFromForm);
            });

            // Clique no botão buscar imagem
            const btnSearchAvatar = document.getElementById('btn-search-avatar');
            if (btnSearchAvatar) {
                btnSearchAvatar.addEventListener('click', () => {
                    const url = prompt("Insira a URL da imagem de perfil:", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200");
                    if (url) {
                        const avatarInput = document.getElementById('input-avatar');
                        if (avatarInput) avatarInput.value = url;
                        updatePreviewFromForm();
                    }
                });
            }

            // Botões de alinhamento da Bio
            const alignBtns = document.querySelectorAll('.align-btn');
            alignBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    alignBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    updatePreviewFromForm();
                });
            });

            // Evento de Salvar Formulário no Servidor
            const inspectorForm = document.getElementById('inspector-form');
            if (inspectorForm) {
                inspectorForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    
                    const arrobaInput = document.getElementById('input-arroba');
                    if (!arrobaInput || !arrobaInput.value.trim()) return;

                    let cleanArroba = arrobaInput.value.trim().toLowerCase();
                    if (!cleanArroba.startsWith('@')) {
                        cleanArroba = '@' + cleanArroba;
                    }

                    // Lê todas as informações do form
                    const updatedData = {
                        arroba: cleanArroba,
                        name: document.getElementById('input-name').value.trim(),
                        avatar: document.getElementById('input-avatar').value.trim(),
                        bio: document.getElementById('input-bio').value.trim(),
                        btn1Title: document.getElementById('input-btn1-title').value.trim(),
                        btn1Url: document.getElementById('input-btn1-url').value.trim(),
                        btn2Title: document.getElementById('input-btn2-title').value.trim(),
                        btn2Url: document.getElementById('input-btn2-url').value.trim(),
                        btn3Title: document.getElementById('input-btn3-title').value.trim(),
                        btn3Url: document.getElementById('input-btn3-url').value.trim(),
                        preset: localStorage.getItem('selected-theme-preset') || 'gray',
                        bioAlign: document.querySelector('.align-btn.active') ? document.querySelector('.align-btn.active').getAttribute('data-align') : 'center'
                    };

                    const btnSave = document.getElementById('btn-save-inspector');
                    const originalText = btnSave ? btnSave.textContent : 'Salvar Site';
                    if (btnSave) {
                        btnSave.textContent = "Tirando print...";
                        btnSave.style.opacity = '0.7';
                    }

                    try {
                        // Capturar a tela do celular
                        const phoneMockup = document.querySelector('.phone-mockup');
                        let previewBase64 = null;
                        if (phoneMockup && typeof html2canvas !== 'undefined') {
                            const canvas = await html2canvas(phoneMockup, { 
                                scale: 1, 
                                useCORS: true,
                                backgroundColor: '#000000'
                            });
                            // Use JPEG instead of PNG to save HUGE amounts of space in LocalStorage (e.g. 50kb vs 1MB)
                            previewBase64 = canvas.toDataURL('image/jpeg', 0.6);
                            updatedData.previewBase64 = previewBase64;
                        }

                        if (btnSave) btnSave.textContent = "Salvando Localmente...";
                        
                        // Fix for invalid date
                        updatedData.createdAt = new Date().toISOString();

                        // SERVERLESS: Salva tudo no LocalStorage
                        let leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
                        const existingLead = leads.find(l => l.arroba.toLowerCase() === cleanArroba.toLowerCase());

                        // Preserva e atualiza o status de publicação
                        if (existingLead && (existingLead.status === 'published' || existingLead.status === 'modified')) {
                            // Já foi publicado antes, mas foi alterado agora -> vira MODIFICADO (Vermelho)!
                            updatedData.status = 'modified';
                            updatedData.publishedAt = existingLead.publishedAt;
                        } else {
                            // Nunca foi publicado -> fica NÃO PUBLICADO (Cinza)
                            updatedData.status = 'not_published';
                        }
                        
                        // Remove se já existe para atualizar
                        leads = leads.filter(l => l.arroba.toLowerCase() !== cleanArroba.toLowerCase());
                        
                        // Add at the beginning
                        leads.unshift(updatedData);
                        
                        localStorage.setItem('painelbio-insta-leads', JSON.stringify(leads));

                        if (btnSave) {
                            btnSave.textContent = "Site Salvo! ✓";
                            btnSave.classList.add('saved-success');
                            btnSave.style.opacity = '1';
                            
                            window.loadedFromGallery = true;
                            const btnLoadSite = document.getElementById('btn-load-site');
                            if (btnLoadSite) btnLoadSite.classList.add('site-loaded-active');
                            
                            setTimeout(() => {
                                btnSave.textContent = originalText;
                                btnSave.classList.remove('saved-success');
                            }, 2000);
                        }
                    } catch (err) {
                        console.error('Erro ao salvar:', err);
                        if (btnSave) {
                            btnSave.textContent = "Erro ao salvar ❌";
                            btnSave.style.opacity = '1';
                            setTimeout(() => {
                                btnSave.textContent = originalText;
                            }, 2000);
                        }
                        showCustomAlert('Houve um erro ao publicar: ' + err.message, 'error');
                    }
                });
            }
        }

        // =========================================================================
        // SISTEMA DE BUSCA DO INSTAGRAM (@) E DROPDOWN DE HISTÓRICO AUTOCOMPLETE
        // =========================================================================
        const searchInsta = document.getElementById('search-insta');
        const searchDropdown = document.getElementById('search-dropdown');

        function getLeads() {
            return JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
        }

        // Renderiza o dropdown flutuante com base nas buscas anteriores
        function renderDropdown(filterText = '') {
            const leads = getLeads();
            let items = [];

            if (!filterText.trim()) {
                // Se o input estiver vazio, exibe os 3 mais recentes do histórico
                items = leads.slice(0, 3);
            } else {
                // Se tiver digitando, filtra os correspondentes (limite de 3)
                const query = filterText.trim().toLowerCase().replace(/^@/, '');
                items = leads.filter(lead => {
                    const cleanArroba = lead.arroba.toLowerCase().replace(/^@/, '');
                    const cleanName = lead.name.toLowerCase();
                    return cleanArroba.includes(query) || cleanName.includes(query);
                }).slice(0, 3);
            }

            if (items.length === 0) {
                searchDropdown.style.display = 'none';
                return;
            }

            let dropdownHtml = items.map(item => `
                <div class="dropdown-item" data-arroba="${item.arroba}">
                    <img src="${item.avatar || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23888888\'><path d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/></svg>'}" class="dropdown-item-avatar" alt="Avatar">
                    <div class="dropdown-item-info">
                        <span class="dropdown-item-arroba">${item.arroba}</span>
                        <span class="dropdown-item-name">${item.name || 'Sem nome'}</span>
                    </div>
                </div>
            `).join('');

            // Se for exibição de histórico (input vazio), adiciona botão de limpar no final
            if (!filterText.trim() && leads.length > 0) {
                dropdownHtml += `
                    <div class="dropdown-clear-btn" id="clear-search-history">
                        Limpar Histórico
                    </div>
                `;
            }

            searchDropdown.innerHTML = dropdownHtml;
            searchDropdown.style.display = 'flex';

            // Evento para limpar o histórico
            const clearBtn = document.getElementById('clear-search-history');
            if (clearBtn) {
                clearBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evita que feche e reabra
                    localStorage.removeItem('painelbio-insta-leads');
                    searchDropdown.style.display = 'none';
                });
            }
        }

        // Lógica de Geração Inteligente baseada no Instagram @
        async function generateInstagramBio(arrobaInput) {
            let cleanArroba = arrobaInput.trim().toLowerCase();
            if (cleanArroba.startsWith('@')) {
                cleanArroba = cleanArroba.substring(1);
            }
            if (!cleanArroba) return;

            const fullArroba = '@' + cleanArroba;

            // Fecha o menu de modelos se estiver aberto
            closeAll();

            // Mostra o loader de geração na tela do celular
            const previewScreen = document.getElementById('phone-preview-screen');
            previewScreen.innerHTML = `
                <div class="preview-bio-page" style="justify-content: center; align-items: center;">
                    <div style="text-align: center; color: #ffffff; font-family:-apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; gap: 15px;">
                        <div class="loader" style="width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
                        <div style="font-size: 0.9rem; font-weight: 600; background: linear-gradient(135deg, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Buscando dados reais de ${fullArroba}...</div>
                    </div>
                </div>
            `;

            // Verifica se o interruptor de simular dados fake está ativado
            const isFakeDataEnabled = document.getElementById('fake-data-toggle')?.checked || false;

            // Configura os dados iniciais mantendo o que o usuário já preencheu no formulário (para não apagar)
            let generatedData = {
                arroba: fullArroba,
                name: document.getElementById('input-name')?.value || fullArroba, 
                avatar: document.getElementById('input-avatar')?.value || 'data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23888888\'><path d=\'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z\'/></svg>',
                bio: document.getElementById('input-bio')?.value || '',
                btn1Title: document.getElementById('input-btn1-title')?.value || '',
                btn1Url: document.getElementById('input-btn1-url')?.value || '',
                btn2Title: document.getElementById('input-btn2-title')?.value || '',
                btn2Url: document.getElementById('input-btn2-url')?.value || '',
                btn3Title: document.getElementById('input-btn3-title')?.value || '',
                btn3Url: document.getElementById('input-btn3-url')?.value || '',
                preset: localStorage.getItem('selected-theme-preset') || 'gray',
                bioAlign: document.querySelector('.align-btn.active') ? document.querySelector('.align-btn.active').getAttribute('data-align') : 'center'
            };

            let scrapedRealData = null;
            // Limpa logs anteriores do sininho ao começar nova busca
            if (scraperNotificationList) {
                scraperNotificationList.innerHTML = '';
            }
            if (scraperBadge) {
                scraperBadge.style.display = 'none';
                scraperBadge.className = 'notification-badge';
            }
            addScraperLog(`Iniciando busca do perfil @${cleanArroba}...`, 'info');

            // Busca via RapidAPI Instagram Scraper (direto do navegador, sem servidor)
            try {
                const RAPIDAPI_KEY = window.RAPIDAPI_KEY || '';
                if (!RAPIDAPI_KEY || RAPIDAPI_KEY === 'SUA_CHAVE_AQUI') {
                    addScraperLog('RapidAPI Key não configurada. Coloque sua chave no app.js.', 'error');
                    if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge error'; }
                } else {
                    addScraperLog('Conectando à RapidAPI...', 'info');
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000);

                    const response = await fetch('https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile_v3.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'x-rapidapi-key': RAPIDAPI_KEY,
                            'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com'
                        },
                        body: `username_or_url=${encodeURIComponent(cleanArroba)}`,
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        const result = await response.json();
                        if (result && result.full_name) {
                            const hdPic = result.hd_profile_pic_url_info?.url || result.profile_pic_url || '';
                            scrapedRealData = {
                                name: result.full_name || cleanArroba,
                                bio: result.biography || '',
                                avatar: hdPic ? `https://wsrv.nl/?url=${encodeURIComponent(hdPic)}` : ''
                            };
                            addScraperLog(`Sucesso! Nome: ${scrapedRealData.name}`, 'success');
                            if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge success'; }
                        } else {
                            addScraperLog('RapidAPI não encontrou dados para esse perfil.', 'warning');
                            if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge warning'; }
                        }
                    } else {
                        const errText = await response.text();
                        addScraperLog(`RapidAPI retornou erro HTTP ${response.status}: ${errText.substring(0, 100)}`, 'error');
                        if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge error'; }
                    }
                }
            } catch (err) {
                addScraperLog(`Falha na conexão: ${err.name === 'AbortError' ? 'Tempo limite excedido (10s)' : err.message}`, 'error');
                if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge error'; }
            }

            // Se não conseguiu dados, avisa o usuário
            if (!scrapedRealData && !isFakeDataEnabled) {
                if (typeof showToast === 'function') {
                    showToast('Não foi possível buscar os dados. Verifique a chave RapidAPI.', 'error');
                }
            }

            // Atualiza os dados com as informações reais extraídas
            if (scrapedRealData) {
                generatedData.bio = scrapedRealData.bio || generatedData.bio;
                generatedData.name = scrapedRealData.name || generatedData.name;
                if (scrapedRealData.avatar) {
                    generatedData.avatar = scrapedRealData.avatar;
                }
            }

            // Pós-processador inteligente de nicho e botões fakes: SÓ roda se o switch de dados fakes estiver ativado!
            if (isFakeDataEnabled) {
                const textToAnalyze = `${generatedData.name} ${generatedData.bio}`.toLowerCase();
                let niche = 'default';

                if (textToAnalyze.includes('boutique') || textToAnalyze.includes('moda') || textToAnalyze.includes('clothing') || textToAnalyze.includes('closet') || textToAnalyze.includes('store') || textToAnalyze.includes('roupas') || textToAnalyze.includes('vestido') || textToAnalyze.includes('looks') || textToAnalyze.includes('fashion')) {
                    niche = 'fashion';
                } else if (textToAnalyze.includes('joias') || textToAnalyze.includes('semijoias') || textToAnalyze.includes('prata') || textToAnalyze.includes('acessorios') || textToAnalyze.includes('bijuterias') || textToAnalyze.includes('ouro')) {
                    niche = 'jewelry';
                } else if (textToAnalyze.includes('estetica') || textToAnalyze.includes('pele') || textToAnalyze.includes('skin') || textToAnalyze.includes('makeup') || textToAnalyze.includes('beauty') || textToAnalyze.includes('beleza') || textToAnalyze.includes('hair') || textToAnalyze.includes('cabelo') || textToAnalyze.includes('cílios') || textToAnalyze.includes('unhas') || textToAnalyze.includes('saloes') || textToAnalyze.includes('salao')) {
                    niche = 'beauty';
                } else if (textToAnalyze.includes('burguer') || textToAnalyze.includes('burger') || textToAnalyze.includes('pizza') || textToAnalyze.includes('food') || textToAnalyze.includes('restaurante') || textToAnalyze.includes('doces') || textToAnalyze.includes('confeitaria') || textToAnalyze.includes('delicias') || textToAnalyze.includes('sabor') || textToAnalyze.includes('comida')) {
                    niche = 'food';
                }

                // Automatic preset selection disabled – user will pick a model later
                if (niche === 'fashion') {
                    generatedData.btn1Title = '🛍️ Fazer Pedido no WhatsApp';
                    generatedData.btn1Url = 'https://wa.me/5511999999999';
                    generatedData.btn2Title = '✨ Ver Novidades no Feed';
                    generatedData.btn2Url = `https://instagram.com/${cleanArroba}`;
                    generatedData.btn3Title = '📍 Endereço da Loja';
                    generatedData.btn3Url = 'https://maps.google.com';
                    // generatedData.preset = 'rose-gold';
                } else if (niche === 'jewelry') {
                    generatedData.btn1Title = '🛍️ Catálogo Completo (WhatsApp)';
                    generatedData.btn1Url = 'https://wa.me/5511999999999';
                    generatedData.btn2Title = '💬 Falar Conosco';
                    generatedData.btn2Url = 'https://wa.me/5511999999999';
                    generatedData.btn3Title = '✨ Seguir no Instagram';
                    generatedData.btn3Url = `https://instagram.com/${cleanArroba}`;
                    // generatedData.preset = 'golden';
                } else if (niche === 'beauty') {
                    generatedData.btn1Title = '📅 Agendar Atendimento';
                    generatedData.btn1Url = 'https://wa.me/5511999999999';
                    generatedData.btn2Title = '🛍️ Comprar Produtos';
                    generatedData.btn2Url = 'https://wa.me/5511999999999';
                    generatedData.btn3Title = '💬 Dúvidas no WhatsApp';
                    generatedData.btn3Url = 'https://wa.me/5511999999999';
                    // generatedData.preset = 'sunset';
                } else if (niche === 'food') {
                    generatedData.btn1Title = '🚀 Faça seu Pedido Online';
                    generatedData.btn1Url = 'https://wa.me/5511999999999';
                    generatedData.btn2Title = '🍔 Cardápio Completo';
                    generatedData.btn2Url = 'https://wa.me/5511999999999';
                    generatedData.btn3Title = '💬 Suporte no WhatsApp';
                    generatedData.btn3Url = 'https://wa.me/5511999999999';
                    // generatedData.preset = 'fire';
                } else {
                    generatedData.btn1Title = '💬 Falar no WhatsApp';
                    generatedData.btn1Url = 'https://wa.me/5511999999999';
                    generatedData.btn2Title = '✨ Seguir no Instagram';
                    generatedData.btn2Url = `https://instagram.com/${cleanArroba}`;
                    // generatedData.preset = 'neon-blue';
                }
            }

            // Pequeno delay de 800ms para suavizar a transição do loader para o novo site na tela
            setTimeout(() => {
                // Salva a loja gerada no banco de leads local
                let leads = getLeads();
                leads = leads.filter(l => l.arroba.toLowerCase() !== fullArroba.toLowerCase());
                leads.unshift(generatedData);
                localStorage.setItem('painelbio-insta-leads', JSON.stringify(leads));

                // Carrega a loja gerada na visualização
                loadLeadData(generatedData);
            }, 800);
        }

        // Carrega um perfil gerado/salvo no celular e no Inspector form
        function loadLeadData(data) {
            const currentTemplate = document.querySelector('.template-card.is-selected');

            if (currentTemplate) {
                // Template já selecionado: re-injeta o HTML do template (o loader substituiu)
                // loadTemplatePreview já restaura dados do localStorage e chama updatePreviewFromForm
                const templateId = currentTemplate.getAttribute('data-template');
                loadTemplatePreview(templateId);
            } else {
                // Sem template selecionado: mostra tela neutra com dados do perfil encontrado
                const previewScreen = document.getElementById('phone-preview-screen');
                if (previewScreen) {
                    const avatarUrl = data.avatar || '';
                    const displayName = data.name || '';
                    const displayArroba = data.arroba || '';
                    const displayBio = data.bio || '';
                    previewScreen.innerHTML = `
                        <div class="preview-bio-page" style="justify-content: center; align-items: center; padding: 30px 20px;">
                            <div style="text-align: center; color: #ffffff; font-family:-apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; gap: 12px;">
                                ${avatarUrl ? `<img src="${avatarUrl}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.2);" onerror="this.style.display='none'"/>` : ''}
                                <div style="font-size: 1rem; font-weight: 700; color: #fff;">${displayName}</div>
                                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.5);">${displayArroba}</div>
                                ${displayBio ? `<div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); max-width: 250px; line-height: 1.4;">${displayBio}</div>` : ''}
                                <div id="select-model-cta" style="margin-top: 20px; font-size: 0.8rem; font-weight: 600; background: linear-gradient(135deg, #00c6ff, #0072ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; cursor: pointer; padding: 8px 16px; border: 1px solid rgba(59,130,246,0.3); border-radius: 8px; transition: all 0.2s;">✨ Selecione um modelo para continuar</div>
                            </div>
                        </div>
                    `;
                    // Torna o "Selecione um modelo" clicável para abrir o menu de modelos
                    const selectModelCta = document.getElementById('select-model-cta');
                    if (selectModelCta) {
                        selectModelCta.addEventListener('click', () => {
                            openDrawer(leftDrawer);
                        });
                    }
                }
            }

            // Garante que o lápis da notificação seja ativado
            if (topActionBtn) {
                topActionBtn.classList.remove('disabled');
            }

            // Abre o Inspector somente se já tem um template carregado
            if (currentTemplate) {
                openDrawer(rightDrawer);
            }
        }

        // Listeners da Barra de Busca e Dropdown
        if (searchInsta) {
            searchInsta.addEventListener('focus', () => {
                renderDropdown(searchInsta.value);
            });

            searchInsta.addEventListener('input', () => {
                renderDropdown(searchInsta.value);
            });

            searchInsta.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = searchInsta.value.trim();
                    if (!val) return;

                    searchDropdown.style.display = 'none';

                    // Formata a query
                    let cleanQuery = val.toLowerCase();
                    if (!cleanQuery.startsWith('@')) {
                        cleanQuery = '@' + cleanQuery;
                    }

                    // Verifica se já temos salvo no histórico
                    const leads = getLeads();
                    const foundLead = leads.find(l => l.arroba.toLowerCase() === cleanQuery);
                    
                    if (foundLead) {
                        // Carrega na hora (0 delay)
                        loadLeadData(foundLead);
                    } else {
                        // Roda a geração dinâmica (IA / Scraper simulado)
                        generateInstagramBio(val);
                    }
                }
            });
        }

        // Seleciona item do dropdown ao clicar
        if (searchDropdown) {
            searchDropdown.addEventListener('click', (e) => {
                const item = e.target.closest('.dropdown-item');
                if (item) {
                    const arroba = item.getAttribute('data-arroba');
                    const leads = getLeads();
                    const foundLead = leads.find(l => l.arroba === arroba);
                    if (foundLead) {
                        searchInsta.value = foundLead.arroba;
                        loadLeadData(foundLead);
                    }
                    searchDropdown.style.display = 'none';
                }
            });
        }

        // Fecha o dropdown se clicar fora da barra de pesquisa
        document.addEventListener('click', (e) => {
            const container = document.querySelector('.search-container');
            if (container && !container.contains(e.target)) {
                searchDropdown.style.display = 'none';
            }
        });

        // Impedir que a tela do celular apague (Screen Wake Lock API)
        let wakeLock = null;

        async function requestWakeLock() {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Wake Lock ativado com sucesso! Tela travada acesa.');
                }
            } catch (err) {
                console.warn('Erro ao solicitar Wake Lock:', err.message);
            }
        }

        // Tenta ativar ao carregar o aplicativo
        requestWakeLock();

        // Reativa o Wake Lock se o usuário sair do app e voltar (mudar de aba ou desbloquear celular)
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'visible') {
                requestWakeLock();
            }
        });

        // --- Função Custom Alert Toast ---
        function showCustomAlert(message, type = 'error') {
            let container = document.getElementById('custom-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'custom-toast-container';
                container.className = 'custom-toast-container';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = `custom-toast ${type}`;
            
            let icon = 'ℹ️';
            if (type === 'error') icon = '⚠️';
            else if (type === 'success') icon = '✅';

            toast.innerHTML = `
                <div class="custom-toast-icon">${icon}</div>
                <div class="custom-toast-message">${message}</div>
            `;

            container.appendChild(toast);

            // Reflow to enable transition
            toast.offsetHeight;

            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                toast.classList.add('hide');
                setTimeout(() => {
                    toast.remove();
                }, 400); // Wait for transition
            }, 3000); // 3 seconds visible
        }

        // --- Modal de Carregar Site ---
        const btnLoadSite = document.getElementById('btn-load-site');
        const loadSiteModal = document.getElementById('load-site-modal');
        const loadSiteOverlay = document.getElementById('load-site-overlay');
        const closeLoadSiteBtn = document.getElementById('close-load-site');
        const loadSiteList = document.getElementById('load-site-list');

        function openLoadSiteModal() {
            loadSiteOverlay.classList.add('active');
            loadSiteModal.classList.add('active');
            renderLoadSiteList();
        }

        function closeLoadSiteModal() {
            loadSiteOverlay.classList.remove('active');
            loadSiteModal.classList.remove('active');
        }

        if (btnLoadSite) btnLoadSite.addEventListener('click', openLoadSiteModal);
        if (closeLoadSiteBtn) closeLoadSiteBtn.addEventListener('click', closeLoadSiteModal);
        if (loadSiteOverlay) loadSiteOverlay.addEventListener('click', closeLoadSiteModal);

        // Lógica do Sininho de Notificações
        function addScraperLog(message, type = 'info') {
            if (!scraperNotificationList) return;
            const time = new Date().toLocaleTimeString('pt-BR');
            const item = document.createElement('div');
            item.className = `notification-item ${type}`;
            item.innerHTML = `
                <div>${message}</div>
                <div class="notification-item-time">${time}</div>
            `;
            
            // Remove o placeholder se existir
            const placeholder = scraperNotificationList.querySelector('p');
            if (placeholder && placeholder.textContent.includes('Nenhuma busca')) {
                scraperNotificationList.innerHTML = '';
            }
            
            scraperNotificationList.appendChild(item);
            scraperNotificationList.scrollTop = scraperNotificationList.scrollHeight;
        }

        if (btnScraperNotifications) {
            btnScraperNotifications.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = scraperNotificationBalloon.style.display === 'block';
                scraperNotificationBalloon.style.display = isVisible ? 'none' : 'block';
                
                // Oculta o balão de cores para não sobrepor
                const colorBalloon = document.getElementById('color-balloon');
                if (colorBalloon) colorBalloon.style.display = 'none';
            });
        }
        
        if (btnCloseNotifications) {
            btnCloseNotifications.addEventListener('click', (e) => {
                e.stopPropagation();
                scraperNotificationBalloon.style.display = 'none';
            });
        }

        // Fecha se clicar fora do balão
        document.addEventListener('click', (e) => {
            if (scraperNotificationBalloon && !scraperNotificationBalloon.contains(e.target) && e.target !== btnScraperNotifications) {
                scraperNotificationBalloon.style.display = 'none';
            }
        });

        function renderLoadSiteList() {
            const leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
            if (leads.length === 0) {
                loadSiteList.innerHTML = '<p style="text-align: center; color: #888; font-size: 0.9rem; padding: 20px;">Nenhum site salvo ainda.</p>';
                return;
            }

            let html = '';
            leads.forEach(lead => {
                const date = lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('pt-BR') : 'Sem data';
                html += `
                    <div class="load-site-item" data-arroba="${lead.arroba}">
                        <img src="${lead.avatar || ''}" onerror="this.style.display='none'" class="load-site-item-avatar">
                        <div class="load-site-item-info">
                            <span class="load-site-item-arroba">${lead.arroba}</span>
                            <span class="load-site-item-date">Salvo em ${date}</span>
                        </div>
                    </div>
                `;
            });

            loadSiteList.innerHTML = html;

            document.querySelectorAll('.load-site-item').forEach(item => {
                item.addEventListener('click', () => {
                    const arroba = item.getAttribute('data-arroba');
                    const leadToLoad = leads.find(l => l.arroba === arroba);
                    if (leadToLoad) {
                        loadSiteIntoEditor(leadToLoad);
                        closeLoadSiteModal();
                    }
                });
            });
        }

        function loadSiteIntoEditor(siteData) {
            window.loadedFromGallery = true;
            const btnLoadSite = document.getElementById('btn-load-site');
            if (btnLoadSite) btnLoadSite.classList.add('site-loaded-active');
            
            const selectedTemplate = document.querySelector('.template-card.is-selected');
            if (!selectedTemplate) {
                const classicCard = document.querySelector('.template-card[data-template="classic"]');
                if (classicCard) classicCard.click();
            }

            setTimeout(() => {
                const fieldsToRestore = {
                    'input-avatar': siteData.avatar || '',
                    'input-name': siteData.name || '',
                    'input-arroba': siteData.arroba || '',
                    'input-bio': siteData.bio || '',
                    'input-btn1-title': siteData.btn1Title || '',
                    'input-btn1-url': siteData.btn1Url || '',
                    'input-btn2-title': siteData.btn2Title || '',
                    'input-btn2-url': siteData.btn2Url || '',
                    'input-btn3-title': siteData.btn3Title || '',
                    'input-btn3-url': siteData.btn3Url || ''
                };
                for (const [id, val] of Object.entries(fieldsToRestore)) {
                    const el = document.getElementById(id);
                    if (el) el.value = val;
                }

                if (siteData.preset) {
                    const colorOption = document.querySelector(`.color-option[data-preset="${siteData.preset}"]`);
                    if (colorOption) {
                        colorOption.click();
                    }
                }
                
                // Restaura o alinhamento da bio
                if (siteData.bioAlign) {
                    const alignBtn = document.querySelector(`.align-btn[data-align="${siteData.bioAlign}"]`);
                    if (alignBtn) alignBtn.click();
                } else {
                    const alignBtn = document.querySelector(`.align-btn[data-align="center"]`);
                    if (alignBtn) alignBtn.click();
                }

                if (typeof updatePreviewFromForm === 'function') {
                    updatePreviewFromForm();
                }
                
                // Simula digitação para atualizar a tela do celular
                const event = new Event('input', { bubbles: true });
                document.querySelectorAll('#inspector-form input, #inspector-form textarea').forEach(el => {
                    el.dispatchEvent(event);
                });
                
                openDrawer(rightDrawer);
                
                showCustomAlert(`Site ${siteData.arroba} carregado com sucesso!`, 'success');
            }, 450); // Mudei de sem delay (0) para 450ms para rodar DEPOIS do processTemplateSelection (350ms)
        }