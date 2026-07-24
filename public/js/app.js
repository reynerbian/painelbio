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
                        <div style="background: #0d1117; border: 1px solid #30363d; border-radius: 12px; padding: 12px; display: flex; gap: 12px; align-items: stretch; transition: all 0.2s; min-width: 0; box-sizing: border-box; overflow: hidden;">
                            
                            <!-- Coluna da Esquerda (Imagem menor) -->
                            <div style="width: 70px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden; background: #000; border: 1px solid #222;">
                                <img src="${site.previewPath}" onerror="this.src='${site.avatar || ''}'" style="width: 100%; height: auto; object-fit: cover; display: block;" />
                            </div>
                            
                            <!-- Coluna da Direita (Textos e Botoes) -->
                            <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between;">
                                <!-- Textos em cima -->
                                <div>
                                    <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 4px; min-width: 0;">
                                        
                                        <!-- Arroba com truncamento ellipsis seguro -->
                                        <div style="font-size: 0.95rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0;">
                                            ${site.arroba}
                                        </div>
                                        
                                        <!-- Status Badge + Ícone SVG (i) no topo à direita -->
                                        <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                                            <button onclick="window.openSiteInfoModal('${site.arroba}')" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.35); width: 22px; height: 22px; border-radius: 50%; padding: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="Ficha do Cliente & Relatório (i)">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                            </button>
                                            
                                            <span style="font-size: 0.65rem; padding: 2px 6px; border-radius: 10px; ${btnStyle}">${btnBadgeText}</span>
                                        </div>

                                    </div>
                                    
                                    <div style="font-size: 0.75rem; color: #8b949e; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                        <strong>Modelo:</strong> ${site.model === 'vitrine' ? 'Vitrine' : 'Classic'} / ${themeName}
                                    </div>
                                    
                                    <div style="font-size: 0.7rem; color: #6e7681;">
                                        ${formattedDate}
                                    </div>
                                </div>
                                
                                <!-- Botoes embaixo -->
                                <div style="display: flex; gap: 6px; margin-top: 12px; width: 100%; box-sizing: border-box;">
                                    <button onclick="window.previewSiteOffline('${site.arroba}')" style="flex: 1; min-width: 0; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 8px 0; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="Ver Prévia">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    </button>
                                    
                                    <button onclick="window.startUploadSite('${site.arroba}')" style="flex: 1; min-width: 0; ${btnStyle} padding: 8px 0; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="${btnTitle}">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </button>

                                    ${(status === 'published' || status === 'modified') ? `
                                    <button onclick="window.copySiteUrl('${site.arroba}', this)" style="flex: 1; min-width: 0; background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.35); padding: 8px 0; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="Copiar URL para o Cliente">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                    </button>
                                    ` : ''}
                                    
                                    <button onclick="deleteSite('${site.arroba}')" style="flex: 1; min-width: 0; background: rgba(255, 0, 0, 0.1); color: #ff4444; border: 1px solid rgba(255, 0, 0, 0.3); padding: 8px 0; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="Deletar">
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

        // Função global para copiar URL do site postado para a área de transferência
        window.copySiteUrl = function(arroba, btnEl) {
            const cleanSlug = arroba.replace('@', '').toLowerCase();
            const fullUrl = `${window.location.origin}/${cleanSlug}`;
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(fullUrl).then(() => {
                    if (typeof showCustomAlert === 'function') {
                        showCustomAlert(`URL copiada: ${fullUrl}`, 'success');
                    }
                    if (btnEl) {
                        const originalHtml = btnEl.innerHTML;
                        btnEl.innerHTML = '<span style="font-size: 0.7rem; font-weight: 700;">✓ Copiado</span>';
                        setTimeout(() => {
                            btnEl.innerHTML = originalHtml;
                        }, 1800);
                    }
                }).catch(() => {
                    prompt("Copie a URL do cliente abaixo:", fullUrl);
                });
            } else {
                prompt("Copie a URL do cliente abaixo:", fullUrl);
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
        
        // Função global para deletar site da memória local e do Cloudflare KV
        window.deleteSite = async function(arroba) {
            if (confirm(`ATENÇÃO: Deseja realmente deletar o site ${arroba}?\n\nEsta ação irá apagar o projeto da sua galeria e RETIRÁ-LO DO AR no Cloudflare automaticamente.`)) {
                try {
                    // Tenta remover do Cloudflare KV remoto
                    try {
                        const response = await fetch(`/api/publish?arroba=${encodeURIComponent(arroba)}`, {
                            method: 'DELETE'
                        });
                        if (response.ok) {
                            addScraperLog(`[Exclusão] Site ${arroba} removido do Cloudflare KV e retirado do ar!`, 'info');
                        }
                    } catch (netErr) {
                        console.warn('Não foi possível conectar ao Cloudflare para deletar remoto:', netErr);
                    }

                    // Remove do LocalStorage local
                    let leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
                    leads = leads.filter(l => l.arroba.toLowerCase() !== arroba.toLowerCase());
                    localStorage.setItem('painelbio-insta-leads', JSON.stringify(leads));
                    window.allSitesData = leads;

                    showCustomAlert(`Site ${arroba} deletado com sucesso!`, 'success');
                    
                    // Re-renderiza a galeria
                    if (navGallery) navGallery.click();
                } catch (e) {
                    showCustomAlert('Erro ao tentar deletar o site.', 'error');
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

        // =========================================================================
        // MODAL (i) - FICHA COMPLETA DO CLIENTE, RELATÓRIO MENSAL E CRM DE PAGAMENTO
        // =========================================================================
        window.openSiteInfoModal = async function(arroba) {
            let leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
            const site = leads.find(l => l.arroba.toLowerCase() === arroba.toLowerCase());

            if (!site) {
                showCustomAlert('Dados do site não encontrados!', 'error');
                return;
            }

            // Remove modal antigo se existir
            const oldModal = document.getElementById('site-info-modal');
            if (oldModal) oldModal.remove();

            const cleanSlug = site.arroba.replace('@', '').toLowerCase();
            const currentMonthKey = new Date().toISOString().substring(0, 7);
            const createdDateFormatted = site.createdAt ? new Date(site.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recente';

            const modalHtml = `
                <div id="site-info-modal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px; box-sizing: border-box; overflow-y: auto;">
                    <div style="background: #161b22; border: 1px solid #30363d; border-radius: 20px; width: 100%; max-width: 420px; max-height: 90vh; overflow-y: auto; padding: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); color: #fff; font-family: -apple-system, sans-serif; position: relative;">
                        
                        <!-- Header do Modal -->
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #30363d; padding-bottom: 12px; margin-bottom: 16px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 42px; height: 42px; border-radius: 50%; overflow: hidden; background: #000; border: 1px solid #30363d; flex-shrink: 0;">
                                    <img src="${site.avatar || ''}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
                                </div>
                                <div>
                                    <h3 style="margin: 0; font-size: 1.05rem; color: #f0f6fc; font-weight: 700;">${site.name || site.arroba}</h3>
                                    <span style="font-size: 0.8rem; color: #3b82f6; font-weight: 600;">${site.arroba}</span>
                                </div>
                            </div>
                            <button id="close-info-modal-btn" style="background: rgba(255,255,255,0.08); border: none; color: #c9d1d9; width: 32px; height: 32px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">&times;</button>
                        </div>

                        <!-- Botões Rápidos de Contato com o Cliente -->
                        <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                            <a href="https://instagram.com/${cleanSlug}" target="_blank" style="flex: 1; background: rgba(225, 48, 108, 0.15); color: #e1306c; border: 1px solid rgba(225, 48, 108, 0.35); text-decoration: none; padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                📸 Instagram
                            </a>
                            <a id="info-whatsapp-direct-btn" href="#" target="_blank" style="flex: 1; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.35); text-decoration: none; padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
                                💬 WhatsApp
                            </a>
                        </div>

                        <!-- Seção 1: Analytics & Desempenho -->
                        <div style="background: #0d1117; border: 1px solid #21262d; border-radius: 12px; padding: 14px; margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <span style="font-size: 0.85rem; font-weight: 700; color: #f0f6fc; display: flex; align-items: center; gap: 6px;">
                                    📊 Desempenho do Site
                                </span>
                                <select id="info-month-select" style="background: #161b22; color: #58a6ff; border: 1px solid #30363d; border-radius: 6px; padding: 4px 8px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
                                    <option value="${currentMonthKey}">Este Mês (${currentMonthKey})</option>
                                    <option value="2026-06">Junho/2026</option>
                                    <option value="2026-05">Maio/2026</option>
                                </select>
                            </div>

                            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; text-align: center;">
                                <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #21262d;">
                                    <div style="font-size: 0.7rem; color: #8b949e; margin-bottom: 4px;">👁️ Visitas</div>
                                    <div id="stat-views-val" style="font-size: 1.1rem; font-weight: 700; color: #3b82f6;">--</div>
                                </div>
                                <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #21262d;">
                                    <div style="font-size: 0.7rem; color: #8b949e; margin-bottom: 4px;">🖱️ Cliques</div>
                                    <div id="stat-clicks-val" style="font-size: 1.1rem; font-weight: 700; color: #10b981;">--</div>
                                </div>
                                <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #21262d;">
                                    <div style="font-size: 0.7rem; color: #8b949e; margin-bottom: 4px;">🚀 Indicações</div>
                                    <div id="stat-ref-val" style="font-size: 1.1rem; font-weight: 700; color: #a855f7;">--</div>
                                </div>
                            </div>
                        </div>

                        <!-- Seção 2: Dados de Contato Direto do Cliente -->
                        <div style="background: #0d1117; border: 1px solid #21262d; border-radius: 12px; padding: 14px; margin-bottom: 16px;">
                            <div style="font-size: 0.85rem; font-weight: 700; color: #f0f6fc; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
                                <span>👤 Contato do Cliente / Responsável</span>
                                <span id="info-contact-saved-badge" style="font-size: 0.7rem; color: #10b981; font-weight: 600; opacity: 0; transition: opacity 0.3s;">✓ Salvo</span>
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 8px;">
                                <div>
                                    <label style="font-size: 0.7rem; color: #8b949e; display: block; margin-bottom: 3px;">Nome do Responsável / Dono:</label>
                                    <input type="text" id="info-owner-name" value="${site.ownerName || ''}" placeholder="Ex: Ana Carolina" style="width: 100%; background: #161b22; color: #fff; border: 1px solid #30363d; border-radius: 6px; padding: 6px 10px; font-size: 0.8rem; box-sizing: border-box;" />
                                </div>
                                <div>
                                    <label style="font-size: 0.7rem; color: #8b949e; display: block; margin-bottom: 3px;">WhatsApp Direto (com DDD):</label>
                                    <input type="text" id="info-owner-phone" value="${site.ownerPhone || ''}" placeholder="Ex: 11999998888" style="width: 100%; background: #161b22; color: #fff; border: 1px solid #30363d; border-radius: 6px; padding: 6px 10px; font-size: 0.8rem; box-sizing: border-box;" />
                                </div>
                            </div>
                        </div>

                        <!-- Seção 3: Ficha Técnica -->
                        <div style="background: #0d1117; border: 1px solid #21262d; border-radius: 12px; padding: 12px; margin-bottom: 16px; font-size: 0.75rem; color: #8b949e; display: flex; flex-direction: column; gap: 4px;">
                            <div><strong>Criado em:</strong> ${createdDateFormatted}</div>
                            <div><strong>Modelo Atual:</strong> ${site.model === 'vitrine' ? 'Vitrine' : 'Classic'} (${site.preset || 'gray'})</div>
                            <div><strong>Status da Hospedagem:</strong> ${site.status === 'published' ? '🟢 Online no Cloudflare' : site.status === 'modified' ? '🔴 Modificado (Requer Upload)' : '🔘 Pendente de Upload'}</div>
                        </div>

                        <!-- Ações Rápidas -->
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div style="display: flex; gap: 8px;">
                                <button id="info-btn-edit" style="flex: 1; background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.35); padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; cursor: pointer;">
                                    ✏️ Editar no Inspector
                                </button>
                                <button id="info-btn-qrcode" style="flex: 1; background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.35); padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; cursor: pointer;">
                                    🔲 Ver QR Code
                                </button>
                            </div>

                            <button id="info-btn-send-report" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); text-decoration: none; padding: 12px; border-radius: 10px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer;">
                                📲 Enviar Relatório no WhatsApp do Cliente
                            </button>
                        </div>

                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHtml);

            // Gerenciamento dos dados de contato do cliente (Nome do Responsável e WhatsApp Direto)
            const whatsappBtn = document.getElementById('info-whatsapp-direct-btn');
            const ownerNameInput = document.getElementById('info-owner-name');
            const ownerPhoneInput = document.getElementById('info-owner-phone');

            // Auto-detecta WhatsApp dos botões se não houver um salvo manualmente
            let activePhone = site.ownerPhone || '';
            if (!activePhone) {
                let foundBtnPhone = '';
                if (site.btn1Url && site.btn1Url.includes('wa.me')) foundBtnPhone = site.btn1Url.replace(/[^0-9]/g, '');
                else if (site.btn2Url && site.btn2Url.includes('wa.me')) foundBtnPhone = site.btn2Url.replace(/[^0-9]/g, '');
                else if (site.btn3Url && site.btn3Url.includes('wa.me')) foundBtnPhone = site.btn3Url.replace(/[^0-9]/g, '');
                
                if (foundBtnPhone) {
                    activePhone = foundBtnPhone;
                    if (ownerPhoneInput) ownerPhoneInput.value = activePhone;
                }
            }

            const refreshWhatsappLink = () => {
                const currentPhone = ownerPhoneInput ? ownerPhoneInput.value.replace(/[^0-9]/g, '') : activePhone;
                if (whatsappBtn) {
                    if (currentPhone) {
                        whatsappBtn.href = `https://wa.me/${currentPhone}`;
                        whatsappBtn.style.opacity = '1';
                        whatsappBtn.title = `Chamar ${ownerNameInput?.value || 'Lojista'} no WhatsApp`;
                    } else {
                        whatsappBtn.href = '#';
                        whatsappBtn.style.opacity = '0.5';
                        whatsappBtn.title = 'Preencha o WhatsApp no campo abaixo';
                    }
                }
            };
            refreshWhatsappLink();

            // Salva nome e telefone no LocalStorage ao digitar
            const saveContactInfo = () => {
                let allLeads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
                const itemIdx = allLeads.findIndex(l => l.arroba.toLowerCase() === site.arroba.toLowerCase());
                if (itemIdx !== -1) {
                    allLeads[itemIdx].ownerName = ownerNameInput ? ownerNameInput.value.trim() : '';
                    allLeads[itemIdx].ownerPhone = ownerPhoneInput ? ownerPhoneInput.value.replace(/[^0-9]/g, '') : '';
                    localStorage.setItem('painelbio-insta-leads', JSON.stringify(allLeads));
                    window.allSitesData = allLeads;

                    refreshWhatsappLink();

                    const badge = document.getElementById('info-contact-saved-badge');
                    if (badge) {
                        badge.style.opacity = '1';
                        setTimeout(() => { badge.style.opacity = '0'; }, 1500);
                    }
                }
            };

            if (ownerNameInput) ownerNameInput.addEventListener('input', saveContactInfo);
            if (ownerPhoneInput) ownerPhoneInput.addEventListener('input', saveContactInfo);

            // Função para carregar estatísticas do mês selecionado
            const loadStats = async (month) => {
                const viewsEl = document.getElementById('stat-views-val');
                const clicksEl = document.getElementById('stat-clicks-val');
                const refEl = document.getElementById('stat-ref-val');

                if (viewsEl) viewsEl.textContent = '...';
                if (clicksEl) clicksEl.textContent = '...';
                if (refEl) refEl.textContent = '...';

                try {
                    const res = await fetch(`/api/track?slug=${encodeURIComponent(cleanSlug)}&month=${month}`);
                    if (res.ok) {
                        const json = await res.json();
                        if (json.stats) {
                            if (viewsEl) viewsEl.textContent = json.stats.views || 0;
                            if (clicksEl) clicksEl.textContent = json.stats.clicks || 0;
                            if (refEl) refEl.textContent = json.stats.referrals || 0;
                            return;
                        }
                    }
                } catch(e) {}
                
                if (viewsEl) viewsEl.textContent = '0';
                if (clicksEl) clicksEl.textContent = '0';
                if (refEl) refEl.textContent = '0';
            };

            // Carrega mês atual inicialmente
            loadStats(currentMonthKey);

            // Listener de troca de mês no select
            const monthSelect = document.getElementById('info-month-select');
            if (monthSelect) {
                monthSelect.addEventListener('change', (e) => {
                    loadStats(e.target.value);
                });
            }



            // Botão Fechar Modal
            const closeBtn = document.getElementById('close-info-modal-btn');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    document.getElementById('site-info-modal').remove();
                });
            }

            // Botão Editar no Inspector
            const btnEdit = document.getElementById('info-btn-edit');
            if (btnEdit) {
                btnEdit.addEventListener('click', () => {
                    document.getElementById('site-info-modal').remove();
                    // Carrega no editor
                    if (typeof loadLeadData === 'function') {
                        loadLeadData(site);
                    }
                    if (typeof openDrawer === 'function') {
                        openDrawer(document.getElementById('right-drawer'));
                    }
                });
            }

            // Botão Ver QR Code
            const btnQr = document.getElementById('info-btn-qrcode');
            if (btnQr) {
                btnQr.addEventListener('click', () => {
                    const fullSiteUrl = `${window.location.origin}/${cleanSlug}`;
                    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(fullSiteUrl)}`;
                    
                    const qrModalHtml = `
                        <div id="qr-sub-modal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;">
                            <div style="background: #161b22; border: 1px solid #30363d; border-radius: 16px; width: 100%; max-width: 320px; padding: 24px; text-align: center; color: #fff;">
                                <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: #fff;">QR Code da Bio</h3>
                                <p style="font-size: 0.8rem; color: #8b949e; margin-bottom: 16px;">${site.arroba}</p>
                                
                                <div style="background: #fff; padding: 12px; border-radius: 12px; display: inline-block; margin-bottom: 16px;">
                                    <img src="${qrApiUrl}" style="width: 200px; height: 200px; display: block;" alt="QR Code" />
                                </div>
                                
                                <div style="display: flex; gap: 8px;">
                                    <a href="${qrApiUrl}" target="_blank" download="qrcode-${cleanSlug}.png" style="flex: 1; background: #238636; color: #fff; text-decoration: none; padding: 10px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; display: inline-block;">
                                        Baixar QR Code
                                    </a>
                                    <button onclick="document.getElementById('qr-sub-modal').remove()" style="background: #21262d; border: 1px solid #30363d; color: #c9d1d9; padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 0.8rem; cursor: pointer;">
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    document.body.insertAdjacentHTML('beforeend', qrModalHtml);
                });
            }

            // Botão Enviar Relatório no WhatsApp
            const btnSendReport = document.getElementById('info-btn-send-report');
            if (btnSendReport) {
                btnSendReport.addEventListener('click', () => {
                    const views = document.getElementById('stat-views-val')?.textContent || '0';
                    const clicks = document.getElementById('stat-clicks-val')?.textContent || '0';
                    const selectedMonthText = monthSelect.options[monthSelect.selectedIndex].text;

                    const reportMsg = `Olá ${site.name || site.arroba}! 👋\n\nSegue o resumo de acessos do seu *PainelBio* em *${selectedMonthText}*:\n\n👁️ *${views}* visitas na sua Bio\n💬 *${clicks}* contatos iniciados!\n\nSeu Link em destaque no ar: ${window.location.origin}/${cleanSlug}`;

                    const targetPhone = foundPhone ? foundPhone.replace(/[^0-9]/g, '') : '';
                    const waUrl = targetPhone ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(reportMsg)}` : `https://wa.me/?text=${encodeURIComponent(reportMsg)}`;
                    
                    window.open(waUrl, '_blank');
                });
            }
        };

        window.generateStaticSite = function(data) {
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
                for (let i = 0; i < erCount; i++) {
                    const sz  = (1.2 + Math.random() * 1.5).toFixed(2);
                    const lft = (Math.random() * 90).toFixed(1);
                    const dur = (erBase * (0.7 + Math.random() * 0.7)).toFixed(2);
                    const dly = -(Math.random() * erBase * 2).toFixed(2);
                    let animName = 'pb-emojifall';
                    if (erRotate) animName = Math.random() > 0.5 ? 'pb-emojifall-cw' : 'pb-emojifall-ccw';
                    particles += `<span style="position:absolute;top:0;left:${lft}%;font-size:${sz}rem;filter:blur(2px);pointer-events:none;animation:${animName} ${dur}s linear ${dly}s infinite;">${erEmoji}</span>`;
                }
                emojiRainHtml = `<style>@keyframes pb-emojifall{0%{transform:translateY(-80px);opacity:0}10%{opacity:.38}90%{opacity:.38}100%{transform:translateY(110vh);opacity:0}}@keyframes pb-emojifall-cw{0%{transform:translateY(-80px) rotate(0deg);opacity:0}10%{opacity:.38}90%{opacity:.38}100%{transform:translateY(110vh) rotate(540deg);opacity:0}}@keyframes pb-emojifall-ccw{0%{transform:translateY(-80px) rotate(0deg);opacity:0}10%{opacity:.38}90%{opacity:.38}100%{transform:translateY(110vh) rotate(-540deg);opacity:0}}</style><div id="pb-emoji-rain" style="position:fixed;top:0;left:0;right:0;height:${erCoverage}%;overflow:hidden;pointer-events:none;z-index:0;">${particles}</div>`;
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

            // Atualiza a pré-visualização do celular em tempo real para refletir a nova cor imediatamente
            if (typeof updatePreviewFromForm === 'function') {
                updatePreviewFromForm();
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
                           } else {
                            // Cancela a ação inteira
                            return;
                        }
                    }
                } else {
                    // Backup local para não perder o que foi digitado (APENAS se o switch de dados fakes estiver DESATIVADO)
                    const fakeToggle = document.getElementById('fake-data-toggle');
                    const isFakeOn = fakeToggle && fakeToggle.checked;

                    if (currentArroba && !isFakeOn) {
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
                            btn4Title: document.getElementById('input-btn4-title')?.value || '',
                            btn4Url: document.getElementById('input-btn4-url')?.value || '',
                            highlight1Img: document.getElementById('input-highlight1-img')?.value || '',
                            highlight1Title: document.getElementById('input-highlight1-title')?.value || '',
                            highlight2Img: document.getElementById('input-highlight2-img')?.value || '',
                            highlight2Title: document.getElementById('input-highlight2-title')?.value || '',
                            highlight3Img: document.getElementById('input-highlight3-img')?.value || '',
                            highlight3Title: document.getElementById('input-highlight3-title')?.value || '',
                            addonTopbannerActive: document.getElementById('card-addon-topbanner')?.style.display !== 'none',
                            addonTopbannerText1: document.getElementById('input-addon-tb-text1')?.value || '',
                            addonTopbannerText2: document.getElementById('input-addon-tb-text2')?.value || '',
                            addonTopbannerText3: document.getElementById('input-addon-tb-text3')?.value || '',
                            addonTopbannerBg: document.getElementById('input-addon-tb-bg')?.value || '#0f172a',
                            addonTopbannerColor: document.getElementById('input-addon-tb-color')?.value || '#38bdf8',
                            addonTopbannerEffect: document.getElementById('select-addon-tb-effect')?.value || 'fade',
                            addonTopbannerPause: parseInt(document.getElementById('input-addon-tb-pause')?.value || '2', 10),
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

            // Fecha o menu de modelos e abre o Inspector após 350ms de delay
            setTimeout(() => {
                closeAll();
                
                const templateId = card.getAttribute('data-template');
                loadTemplatePreview(templateId);

                // Abre a gaveta do Inspector automaticamente para o usuário ver os campos!
                if (typeof openDrawer === 'function' && rightDrawer) {
                    openDrawer(rightDrawer);
                }
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

        // Preenche campos do formulário com dados fakes do modelo ativo
        function populateFakeDataForModel(activeModel) {
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
            const btn4TitleInput = document.getElementById('input-btn4-title');
            const btn4UrlInput = document.getElementById('input-btn4-url');

            const h1ImgInput = document.getElementById('input-highlight1-img');
            const h1TitleInput = document.getElementById('input-highlight1-title');
            const h2ImgInput = document.getElementById('input-highlight2-img');
            const h2TitleInput = document.getElementById('input-highlight2-title');
            const h3ImgInput = document.getElementById('input-highlight3-img');
            const h3TitleInput = document.getElementById('input-highlight3-title');

            if (activeModel === 'vitrine') {
                if (h1ImgInput) h1ImgInput.value = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";
                if (h1TitleInput) h1TitleInput.value = "🔥 Coleção de Verão 2026";
                if (h2ImgInput) h2ImgInput.value = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
                if (h2TitleInput) h2TitleInput.value = "✨ Novidades";
                if (h3ImgInput) h3ImgInput.value = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500";
                if (h3TitleInput) h3TitleInput.value = "💥 Mais Vendido";
                
                if (avatarInput) avatarInput.value = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";
                if (nameInput) nameInput.value = "Boutique Elegance | Moda Feminina";
                if (arrobaInput) arrobaInput.value = "boutique.elegance";
                if (bioInput) bioInput.value = `Moda feminina premium & peças exclusivas.\nEnviamos para todo o Brasil com Frete Grátis! 🛍️`;
                
                if (btn1TitleInput) btn1TitleInput.value = "💬 Atendimento no WhatsApp";
                if (btn1UrlInput) btn1UrlInput.value = "https://wa.me/5511999999999";
                if (btn2TitleInput) btn2TitleInput.value = "🛍️ Ver Coleção Completa";
                if (btn2UrlInput) btn2UrlInput.value = "https://instagram.com/boutique.elegance";
                if (btn3TitleInput) btn3TitleInput.value = "📍 Endereço da Loja Física";
                if (btn3UrlInput) btn3UrlInput.value = "https://maps.google.com";
                if (btn4TitleInput) btn4TitleInput.value = "💳 Pagamento via PIX";
                if (btn4UrlInput) btn4UrlInput.value = "https://wa.me/5511999999999";
            } else {
                // MODELO 1: CLASSIC
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
            }
        }

        async function loadTemplatePreview(templateId, dataToFill = null) {
            const previewScreen = document.getElementById('phone-preview-screen');
            const inspectorContent = document.getElementById('inspector-content');
            const inspectorActions = document.getElementById('inspector-actions');
            const fakeDataToggle = document.getElementById('fake-data-toggle');
            
            const activeModel = templateId || 'classic';
            window.currentActiveModel = activeModel;

            // Garante que o card do modelo ativo esteja marcado com a borda azul no menu de modelos
            document.querySelectorAll('.template-card').forEach(card => {
                if (card.getAttribute('data-template') === activeModel) {
                    card.classList.add('is-selected');
                } else {
                    card.classList.remove('is-selected');
                }
            });

            if (activeModel === 'vitrine') {
                // Fundo limpo fosco sem luzes borradas
                previewScreen.style.background = '#0e110d';
                
                previewScreen.innerHTML = `
                    <div class="v-live-page" style="width: 100%; min-height: 100%; padding: 14px 12px 30px 12px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center;">
                        
                        <!-- Grid Superior de Fotos Soltas com Avatar Sobreposto -->
                        <div id="v-view-hero-grid" style="width: 100%; position: relative; margin-bottom: 45px; display: none;">
                            <div style="width: 100%; height: 260px; border-radius: 22px; overflow: hidden; background: #1a1a1a; margin-bottom: 8px;">
                                <img id="v-view-h1" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'" />
                            </div>
                            <div style="display: flex; gap: 8px; width: 100%;">
                                <div style="flex: 1; height: 130px; border-radius: 18px; overflow: hidden; background: #1a1a1a;">
                                    <img id="v-view-h2" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400'" />
                                </div>
                                <div style="flex: 1; height: 130px; border-radius: 18px; overflow: hidden; background: #1a1a1a;">
                                    <img id="v-view-h3" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400'" />
                                </div>
                            </div>
                            
                            <!-- Avatar Sobreposto na Junção -->
                            <div id="v-view-avatar-wrapper" style="position: absolute; bottom: -38px; left: 50%; transform: translateX(-50%); width: 84px; height: 84px; border-radius: 50%; background: #fdf6df; border: 4px solid #0e110d; display: none; align-items: center; justify-content: center; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.5); z-index: 10;">
                                <div id="v-view-avatar-inner" style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden;"></div>
                            </div>
                        </div>

                        <!-- Informações da Loja -->
                        <div id="v-view-info" style="width: 100%; display: none; flex-direction: column; align-items: center; text-align: center;">
                            <h1 id="v-view-name" style="font-family: Georgia, serif; font-size: 1.45rem; font-weight: 700; color: #ffffff; margin: 0 0 6px 0; text-align: center;"></h1>
                            <a id="v-view-arroba" href="#" target="_blank" style="font-size: 0.9rem; color: var(--theme-color-1, #a3d959); text-decoration: none; font-weight: 600; margin-bottom: 12px; display: inline-block;"></a>
                            <p id="v-view-bio" style="font-size: 0.85rem; color: rgba(255,255,255,0.7); line-height: 1.5; margin: 0 0 24px 0; text-align: center; white-space: pre-wrap; width: 90%;"></p>

                            <!-- Botões Maciços -->
                            <div id="v-view-buttons" style="width: 100%; display: flex; flex-direction: column; gap: 12px;"></div>

                            <div id="v-view-footer" style="margin-top: 30px; font-size: 0.72rem; color: rgba(255,255,255,0.35); display: flex; align-items: center; gap: 6px;">
                                CRIADO COM <a href="#" style="color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 700;">PAINELBIO</a>
                            </div>
                        </div>

                    </div>
                `;
            } else {
                // Modelo Classic (Com vidro, luzes de fundo e card)
                previewScreen.style.background = 'radial-gradient(circle at 50% 10%, #1e293b 0%, #0f172a 70%)';
                
                previewScreen.innerHTML = `
                    <div class="preview-bio-page">
                        <div class="bg-glow bg-glow-top"></div>
                        <div class="bg-glow bg-glow-bottom"></div>
                        
                        <div class="preview-card" id="view-card" style="display: none;">
                            <div class="preview-avatar-glow" id="view-avatar-container">
                                <div class="preview-avatar-inner" id="view-avatar-inner"></div>
                            </div>
                            
                            <h2 class="preview-name" id="view-name"></h2>
                            <a href="#" target="_blank" class="preview-arroba" id="view-arroba"></a>
                            
                            <p class="preview-bio" id="view-bio"></p>
                            
                            <div class="preview-links" id="view-links"></div>
                            
                            <div class="preview-footer" id="view-footer" style="display: none;">
                                <span>🔗 Criado com</span>
                                <a href="#">PainelBio</a>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Injeta o formulário do modelo dinamicamente no Inspector (/models/<activeModel>/inspector.html)
            try {
                const res = await fetch(`/models/${activeModel}/inspector.html`);
                if (res.ok) {
                    inspectorContent.innerHTML = await res.text();
                } else {
                    const fallbackRes = await fetch('/models/classic/inspector.html');
                    inspectorContent.innerHTML = await fallbackRes.text();
                }
            } catch (e) {
                console.error("Erro ao carregar modelo:", e);
            }
            
            inspectorActions.style.display = 'flex';

            bindInspectorFormEvents();

            const topBtn = document.querySelector('.top-action-btn');
            if (topBtn) topBtn.classList.remove('disabled');

            // Restaura dados se fornecido ou se houver backup / fake data
            const payload = dataToFill || window.tempFormBackup;
            if (payload && (payload.arroba || payload.name)) {
                const backup = payload;
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
                    'input-btn3-url': backup.btn3Url || '',
                    'input-btn4-title': backup.btn4Title || '',
                    'input-btn4-url': backup.btn4Url || '',
                    'input-highlight1-img': backup.highlight1Img || '',
                    'input-highlight1-title': backup.highlight1Title || '',
                    'input-highlight2-img': backup.highlight2Img || '',
                    'input-highlight2-title': backup.highlight2Title || '',
                    'input-highlight3-img': backup.highlight3Img || '',
                    'input-highlight3-title': backup.highlight3Title || '',
                    'input-addon-tb-text1': backup.addonTopbannerText1 || '',
                    'input-addon-tb-text2': backup.addonTopbannerText2 || '',
                    'input-addon-tb-text3': backup.addonTopbannerText3 || '',
                    'input-addon-tb-bg': backup.addonTopbannerBg || '#0f172a',
                    'input-addon-tb-color': backup.addonTopbannerColor || '#38bdf8',
                    'input-addon-tb-pause': backup.addonTopbannerPause || 2,
                    'input-addon-er-emoji': backup.addonEmojiRainEmoji || '',
                    'input-addon-er-count': backup.addonEmojiRainCount || 8,
                    'input-addon-er-coverage': backup.addonEmojiRainCoverage || 80
                };
                for (const [id, val] of Object.entries(fieldsToRestore)) {
                    const el = document.getElementById(id);
                    if (el) el.value = val;
                }

                const effectSelect = document.getElementById('select-addon-tb-effect');
                if (effectSelect) {
                    effectSelect.value = backup.addonTopbannerEffect || 'fade';
                    const containerPause = document.getElementById('container-addon-tb-pause');
                    if (containerPause) containerPause.style.display = (effectSelect.value === 'slide') ? 'block' : 'none';
                }

                if (backup.addonTopbannerActive) {
                    const cardTb = document.getElementById('card-addon-topbanner');
                    if (cardTb) cardTb.style.display = 'block';
                }

                if (backup.addonEmojiRainActive) {
                    const cardEr = document.getElementById('card-addon-emojirain');
                    if (cardEr) cardEr.style.display = 'block';
                }

                const erSpeedEl = document.getElementById('select-addon-er-speed');
                if (erSpeedEl && backup.addonEmojiRainSpeed) {
                    erSpeedEl.value = backup.addonEmojiRainSpeed;
                }
                const erRotateEl = document.getElementById('input-addon-er-rotate');
                if (erRotateEl && backup.addonEmojiRainRotate !== undefined) {
                    erRotateEl.checked = Boolean(backup.addonEmojiRainRotate);
                }
                const erCoverLabelEl = document.getElementById('label-addon-er-coverage');
                const erCoverInputEl = document.getElementById('input-addon-er-coverage');
                if (erCoverLabelEl && erCoverInputEl) {
                    erCoverLabelEl.textContent = (backup.addonEmojiRainCoverage || 80) + '%';
                    erCoverInputEl.value = backup.addonEmojiRainCoverage || 80;
                }
                
                if (backup.bioAlign) {
                    const alignBtn = document.querySelector(`.align-btn[data-align="${backup.bioAlign}"]`);
                    if (alignBtn) alignBtn.click();
                }
                if (backup.preset) {
                    const colorOption = document.querySelector(`.color-option[data-preset="${backup.preset}"]`);
                    if (colorOption) colorOption.click();
                }
                updatePreviewFromForm();
                window.tempFormBackup = null;
            } else if (fakeDataToggle && fakeDataToggle.checked) {
                populateFakeDataForModel(activeModel);
                updatePreviewFromForm();
            } else {
                updatePreviewFromForm();
            }
        }

        // Lógica do Switch de Dados de Exemplo no Inspector
        const fakeDataToggle = document.getElementById('fake-data-toggle');
        if (fakeDataToggle) {
            fakeDataToggle.addEventListener('change', () => {
                const activeModel = window.currentActiveModel || 'classic';
                
                if (fakeDataToggle.checked) {
                    populateFakeDataForModel(activeModel);
                } else {
                    const form = document.getElementById('inspector-form');
                    if (form) form.reset();
                }
                updatePreviewFromForm();
            });
        }

        // Função para ler o formulário e atualizar a pré-visualização em tempo real
        function updatePreviewFromForm() {
            const activeModel = window.currentActiveModel || 'classic';

            // =========================================================================
            // ADD-ON 1: ANÚNCIO FLUTUANTE DE TOPO (Funciona em TODOS os modelos)
            // =========================================================================
            const cardTopbanner = document.getElementById('card-addon-topbanner');
            const isTopbannerActive = cardTopbanner && cardTopbanner.style.display !== 'none';
            const phoneScreen = document.getElementById('phone-preview-screen');
            let phoneTopBanner = document.getElementById('phone-live-top-banner');

            if (isTopbannerActive) {
                const tbText1 = document.getElementById('input-addon-tb-text1')?.value.trim() || '';
                const tbText2 = document.getElementById('input-addon-tb-text2')?.value.trim() || '';
                const tbText3 = document.getElementById('input-addon-tb-text3')?.value.trim() || '';
                const tbBg = document.getElementById('input-addon-tb-bg')?.value || '#0f172a';
                const tbColor = document.getElementById('input-addon-tb-color')?.value || '#38bdf8';
                const effect = document.getElementById('select-addon-tb-effect')?.value || 'fade';
                const pauseSec = parseInt(document.getElementById('input-addon-tb-pause')?.value || '2', 10);

                const texts = [tbText1, tbText2, tbText3].filter(Boolean);

                if (phoneScreen && texts.length > 0) {
                    if (!phoneTopBanner) {
                        phoneTopBanner = document.createElement('div');
                        phoneTopBanner.id = 'phone-live-top-banner';
                        phoneScreen.prepend(phoneTopBanner);
                    }
                    
                    phoneTopBanner.style.cssText = `position: absolute; top: 46px; left: 0; width: 100%; padding: 8px 10px; font-size: 0.72rem; font-weight: 700; text-align: center; z-index: 999; box-shadow: 0 4px 12px rgba(0,0,0,0.5); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,0.1); box-sizing: border-box; background: ${tbBg}; color: ${tbColor}; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;`;
                    phoneTopBanner.style.display = 'flex';

                    const currentConfigKey = `${texts.join('|')}_${effect}_${pauseSec}_${tbBg}_${tbColor}`;
                    if (window.phoneTbConfigKey !== currentConfigKey) {
                        window.phoneTbConfigKey = currentConfigKey;
                        if (window.phoneTbTimer1) clearTimeout(window.phoneTbTimer1);
                        if (window.phoneTbTimer2) clearTimeout(window.phoneTbTimer2);
                        if (window.phoneTbInterval) clearInterval(window.phoneTbInterval);

                        window.phoneTbTexts = texts;
                        window.phoneTbIdx = 0;
                        phoneTopBanner.innerHTML = `<span id="phone-tb-live-text" style="transition: opacity 0.3s;">${texts[0]}</span>`;

                        phoneTopBanner.style.transform = 'none';
                        phoneTopBanner.style.opacity = '1';
                        
                        function runLiveEffectCycle() {
                            const txtEl = document.getElementById('phone-tb-live-text');
                            if (!txtEl) return;
                            
                            if (effect === 'slide') {
                                phoneTopBanner.style.transform = 'translateY(-100%)';
                                phoneTopBanner.style.opacity = '0';
                                setTimeout(() => {
                                    phoneTopBanner.style.transform = 'translateY(0)';
                                    phoneTopBanner.style.opacity = '1';
                                    window.phoneTbTimer1 = setTimeout(() => {
                                        phoneTopBanner.style.transform = 'translateY(-100%)';
                                        phoneTopBanner.style.opacity = '0';
                                        window.phoneTbTimer2 = setTimeout(() => {
                                            window.phoneTbIdx = (window.phoneTbIdx + 1) % window.phoneTbTexts.length;
                                            txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                            runLiveEffectCycle();
                                        }, pauseSec * 1000);
                                    }, 3500);
                                }, 100);
                            } else if (effect === 'fade') {
                                txtEl.style.transition = 'opacity 0.3s';
                                if (texts.length > 1) {
                                    window.phoneTbInterval = setTimeout(() => {
                                        txtEl.style.opacity = '0';
                                        setTimeout(() => {
                                            window.phoneTbIdx = (window.phoneTbIdx + 1) % window.phoneTbTexts.length;
                                            txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                            txtEl.style.opacity = '1';
                                            runLiveEffectCycle();
                                        }, 300);
                                    }, 3500);
                                }
                            } else if (effect === 'marquee') {
                                txtEl.style.whiteSpace = 'nowrap';
                                txtEl.innerHTML = window.phoneTbTexts.join(' &nbsp;&nbsp;&nbsp;⭐&nbsp;&nbsp;&nbsp; ');
                                let pos = 100;
                                window.phoneTbInterval = setInterval(() => {
                                    pos -= 1;
                                    if (pos < -150) pos = 100;
                                    txtEl.style.transform = 'translateX(' + pos + '%)';
                                }, 30);
                            } else if (effect === 'bounce') {
                                txtEl.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s';
                                if (texts.length > 1) {
                                    window.phoneTbInterval = setTimeout(() => {
                                        txtEl.style.transform = 'scale(0)';
                                        setTimeout(() => {
                                            window.phoneTbIdx = (window.phoneTbIdx + 1) % window.phoneTbTexts.length;
                                            txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                            txtEl.style.transform = 'scale(1)';
                                            runLiveEffectCycle();
                                        }, 500);
                                    }, 3500);
                                }
                            } else if (effect === 'flip') {
                                txtEl.style.transition = 'transform 0.4s ease-in, opacity 0.3s';
                                if (texts.length > 1) {
                                    window.phoneTbInterval = setTimeout(() => {
                                        txtEl.style.transform = 'rotateX(90deg)';
                                        setTimeout(() => {
                                            window.phoneTbIdx = (window.phoneTbIdx + 1) % window.phoneTbTexts.length;
                                            txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                            txtEl.style.transform = 'rotateX(0deg)';
                                            runLiveEffectCycle();
                                        }, 400);
                                    }, 3500);
                                }
                            } else if (effect === 'shutter') {
                                phoneTopBanner.style.transition = 'height 0.4s ease-in-out';
                                if (texts.length > 1) {
                                    window.phoneTbInterval = setTimeout(() => {
                                        phoneTopBanner.style.height = '0px';
                                        phoneTopBanner.style.padding = '0px';
                                        setTimeout(() => {
                                            window.phoneTbIdx = (window.phoneTbIdx + 1) % window.phoneTbTexts.length;
                                            txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                            phoneTopBanner.style.height = 'auto';
                                            phoneTopBanner.style.padding = '8px 10px';
                                            runLiveEffectCycle();
                                        }, 400);
                                    }, 3500);
                                }
                            }
                        }
                        
                        runLiveEffectCycle();
                    }
                } else if (phoneTopBanner) {
                    phoneTopBanner.style.display = 'none';
                    if (window.phoneTbTimer1) clearTimeout(window.phoneTbTimer1);
                    if (window.phoneTbTimer2) clearTimeout(window.phoneTbTimer2);
                    if (window.phoneTbInterval) clearInterval(window.phoneTbInterval);
                }
            } else if (phoneTopBanner) {
                phoneTopBanner.style.display = 'none';
                if (window.phoneTbTimer1) clearTimeout(window.phoneTbTimer1);
                if (window.phoneTbTimer2) clearTimeout(window.phoneTbTimer2);
                if (window.phoneTbInterval) clearInterval(window.phoneTbInterval);
            }

            // =========================================================================
            // ADD-ON 2: CHUVA DE EMOJI (Funciona em TODOS os modelos)
            // =========================================================================
            const cardEmojiRain = document.getElementById('card-addon-emojirain');
            const isEmojiRainActive = cardEmojiRain && cardEmojiRain.style.display !== 'none';
            let phoneEmojiRain = document.getElementById('phone-live-emoji-rain');

            if (isEmojiRainActive) {
                const erEmoji = document.getElementById('input-addon-er-emoji')?.value.trim() || '🌸';
                const erCount = parseInt(document.getElementById('input-addon-er-count')?.value || '8', 10);
                const erSpeed = document.getElementById('select-addon-er-speed')?.value || 'normal';
                const erCoverage = parseInt(document.getElementById('input-addon-er-coverage')?.value || '80', 10);
                const erRotate = document.getElementById('input-addon-er-rotate')?.checked || false;
                const durationMap = { slow: 6, normal: 5, fast: 3 };
                const baseDuration = durationMap[erSpeed] || 3.5;

                const configKey = `${erEmoji}_${erCount}_${erSpeed}_${erCoverage}_${erRotate}`;
                if (window.phoneErConfigKey !== configKey) {
                    window.phoneErConfigKey = configKey;

                    if (!phoneEmojiRain) {
                        phoneEmojiRain = document.createElement('div');
                        phoneEmojiRain.id = 'phone-live-emoji-rain';
                        if (phoneScreen) phoneScreen.prepend(phoneEmojiRain);
                    } else {
                        phoneEmojiRain.innerHTML = '';
                        phoneEmojiRain.style.display = '';
                    }
                    // z-index: 0 = atrás de todo conteúdo posicionado (cards, texto, botões)
                    phoneEmojiRain.style.cssText = `position: absolute; top: 0; left: 0; right: 0; height: ${erCoverage}%; overflow: hidden; pointer-events: none; z-index: 0;`;

                    const styleId = 'phone-emoji-rain-style';
                    let styleEl = document.getElementById(styleId);
                    if (!styleEl) {
                        styleEl = document.createElement('style');
                        styleEl.id = styleId;
                        document.head.appendChild(styleEl);
                    }
                    // Distância em px = altura do phone screen + margem → garante que o emoji percorre todo o container
                    const phoneScreenH = (phoneScreen ? phoneScreen.offsetHeight : 700) + 80;
                    styleEl.textContent = `
                        @keyframes pb-emojifall    { 0%{transform:translateY(-60px);opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{transform:translateY(${phoneScreenH}px);opacity:0} }
                        @keyframes pb-emojifall-cw { 0%{transform:translateY(-60px) rotate(0deg);opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{transform:translateY(${phoneScreenH}px) rotate(540deg);opacity:0} }
                        @keyframes pb-emojifall-ccw{ 0%{transform:translateY(-60px) rotate(0deg);opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{transform:translateY(${phoneScreenH}px) rotate(-540deg);opacity:0} }
                    `;

                    const count = Math.min(Math.max(erCount, 1), 20);
                    for (let i = 0; i < count; i++) {
                        const span = document.createElement('span');
                        const size = (1.2 + Math.random() * 1.2).toFixed(2);
                        const left = (Math.random() * 90).toFixed(1);
                        const duration = (baseDuration * (0.7 + Math.random() * 0.7)).toFixed(2);
                        const delay = -(Math.random() * baseDuration * 2).toFixed(2);
                        let animName = 'pb-emojifall';
                        if (erRotate) {
                            animName = Math.random() > 0.5 ? 'pb-emojifall-cw' : 'pb-emojifall-ccw';
                        }
                        span.textContent = erEmoji;
                        span.style.cssText = `position: absolute; top: 0; left: ${left}%; font-size: ${size}rem; filter: blur(2px); pointer-events: none; animation: ${animName} ${duration}s linear ${delay}s infinite;`;
                        phoneEmojiRain.appendChild(span);
                    }
                }
            } else if (phoneEmojiRain) {
                phoneEmojiRain.style.display = 'none';
                window.phoneErConfigKey = null;
            }

            // =========================================================================
            // MODELO 2: VITRINE (Sem card interno, fotos no topo soltas, avatar sobreposto)
            // =========================================================================
            if (activeModel === 'vitrine') {
                const heroGrid = document.getElementById('v-view-hero-grid');
                const infoSection = document.getElementById('v-view-info');
                const img1 = document.getElementById('v-view-h1');
                const img2 = document.getElementById('v-view-h2');
                const img3 = document.getElementById('v-view-h3');
                const avatarWrapper = document.getElementById('v-view-avatar-wrapper');
                const avatarInner = document.getElementById('v-view-avatar-inner');
                const viewName = document.getElementById('v-view-name');
                const viewArroba = document.getElementById('v-view-arroba');
                const viewBio = document.getElementById('v-view-bio');
                const viewButtons = document.getElementById('v-view-buttons');

                if (!heroGrid || !infoSection) return;

                const avatarUrl = document.getElementById('input-avatar')?.value.trim() || '';
                const name = document.getElementById('input-name')?.value.trim() || '';
                const arroba = document.getElementById('input-arroba')?.value.trim() || '';
                const bio = document.getElementById('input-bio')?.value.trim() || '';
                
                const btn1Title = document.getElementById('input-btn1-title')?.value.trim() || '';
                const btn1Url = document.getElementById('input-btn1-url')?.value.trim() || '';
                const btn2Title = document.getElementById('input-btn2-title')?.value.trim() || '';
                const btn2Url = document.getElementById('input-btn2-url')?.value.trim() || '';
                const btn3Title = document.getElementById('input-btn3-title')?.value.trim() || '';
                const btn3Url = document.getElementById('input-btn3-url')?.value.trim() || '';
                const btn4Title = document.getElementById('input-btn4-title')?.value.trim() || '';
                const btn4Url = document.getElementById('input-btn4-url')?.value.trim() || '';

                const h1Img = document.getElementById('input-highlight1-img')?.value.trim() || '';
                const h2Img = document.getElementById('input-highlight2-img')?.value.trim() || '';
                const h3Img = document.getElementById('input-highlight3-img')?.value.trim() || '';

                // Ajusta margem do topo se o banner estiver ativo
                if (isTopbannerActive) {
                    heroGrid.style.marginTop = '36px';
                } else {
                    heroGrid.style.marginTop = '0px';
                }

                // Mostra o Grid de Fotos APENAS se houver ao menos 1 URL preenchida
                const hasAnyPhoto = Boolean(h1Img || h2Img || h3Img);

                if (hasAnyPhoto) {
                    heroGrid.style.display = 'block';
                    if (img1) {
                        img1.src = h1Img || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%231a1a1a"/>';
                        img1.style.display = h1Img ? 'block' : 'none';
                    }
                    if (img2) {
                        img2.src = h2Img || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%231a1a1a"/>';
                        img2.style.display = h2Img ? 'block' : 'none';
                    }
                    if (img3) {
                        img3.src = h3Img || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%231a1a1a"/>';
                        img3.style.display = h3Img ? 'block' : 'none';
                    }
                } else {
                    heroGrid.style.display = 'none';
                }

                // Avatar Sobreposto com Borda/Anel Colorido Vibrante do Tema
                const activePreset = localStorage.getItem('selected-theme-preset') || 'gray';
                const presetThemeMap = {
                    'gray': '#a3d959',
                    'sunset': '#ff0844',
                    'neon-blue': '#00c6ff',
                    'synthwave': '#f107a3',
                    'fire': '#ff5858',
                    'aurora': '#00ff87',
                    'indigo': '#06b6d4',
                    'cyber-lime': '#a8ff78',
                    'rose-gold': '#fda085',
                    'golden': '#f5af19',
                    'deep-purple': '#e94057',
                    'platinum': '#e2e8f0'
                };
                const themeBorderColor = presetThemeMap[activePreset] || '#a3d959';

                if (avatarUrl) {
                    if (avatarWrapper) {
                        avatarWrapper.style.background = themeBorderColor;
                        avatarWrapper.style.padding = '3px';
                        avatarWrapper.style.border = '4px solid #0e110d';
                        avatarWrapper.style.boxShadow = `0 0 20px ${themeBorderColor}66`;
                    }
                    if (avatarInner) avatarInner.innerHTML = `<img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
                    if (avatarWrapper) avatarWrapper.style.display = 'flex';
                } else {
                    if (avatarInner) avatarInner.innerHTML = '';
                    if (avatarWrapper) avatarWrapper.style.display = 'none';
                }

                // Informações da Loja
                infoSection.style.display = 'flex';
                if (viewName) viewName.textContent = name || '';
                
                if (viewArroba) {
                    if (arroba) {
                        const displayArroba = arroba.startsWith('@') ? arroba : `@${arroba}`;
                        const cleanUser = arroba.startsWith('@') ? arroba.substring(1) : arroba;
                        viewArroba.textContent = displayArroba;
                        viewArroba.href = `https://instagram.com/${cleanUser}`;
                        viewArroba.style.color = themeBorderColor;
                        viewArroba.style.display = 'inline-block';
                    } else {
                        viewArroba.style.display = 'none';
                    }
                }

                if (viewBio) {
                    viewBio.textContent = bio || '';
                    viewBio.style.display = bio ? 'block' : 'none';
                    const activeAlignBtn = document.querySelector('.align-btn.active');
                    viewBio.style.textAlign = activeAlignBtn ? activeAlignBtn.getAttribute('data-align') : 'center';
                }

                // Botões Estilo Modelo 1 (Fundo Transparente, Texto Branco, Borda Colorida do Tema)
                let btnsHtml = '';
                const createVBtn = (title, url) => `
                    <div style="width: 100%; background: rgba(255, 255, 255, 0.05); color: #ffffff; border: 1.5px solid ${themeBorderColor}; padding: 15px 18px; border-radius: 16px; font-weight: 700; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.4px; text-align: center; box-shadow: 0 4px 14px rgba(0,0,0,0.3); backdrop-filter: blur(8px); cursor: pointer;" onclick="${url ? `window.open('${url}', '_blank')` : ''}">
                        ${title}
                    </div>
                `;

                if (btn1Title) btnsHtml += createVBtn(btn1Title, btn1Url);
                if (btn2Title) btnsHtml += createVBtn(btn2Title, btn2Url);
                if (btn3Title) btnsHtml += createVBtn(btn3Title, btn3Url);
                if (btn4Title) btnsHtml += createVBtn(btn4Title, btn4Url);

                if (viewButtons) viewButtons.innerHTML = btnsHtml;
                return;
            }

            // =========================================================================
            // MODELO 1: CLASSIC (Card com vidro, luzes de fundo e botões finos)
            // =========================================================================
            const viewCard = document.getElementById('view-card');
            const viewAvatarContainer = document.getElementById('view-avatar-container');
            const viewAvatarInner = document.getElementById('view-avatar-inner');
            const viewName = document.getElementById('view-name');
            const viewArroba = document.getElementById('view-arroba');
            const viewBio = document.getElementById('view-bio');
            const viewLinks = document.getElementById('view-links');
            const viewFooter = document.getElementById('view-footer');

            if (!viewCard) return;

            // Ajusta margem do card se o banner estiver ativo
            if (isTopbannerActive) {
                viewCard.style.marginTop = '36px';
            } else {
                viewCard.style.marginTop = '0px';
            }

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
                viewCard.style.display = "none";
                viewFooter.style.display = "none";
                return;
            }

            viewCard.style.display = "flex";

            if (avatarUrl) {
                viewAvatarInner.innerHTML = `<img src="${avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;">`;
                viewAvatarContainer.style.display = "flex";
            } else {
                viewAvatarInner.innerHTML = "";
                viewAvatarContainer.style.display = "none";
            }

            if (name) {
                viewName.textContent = name;
                viewName.style.display = "block";
            } else {
                viewName.textContent = "";
                viewName.style.display = "none";
            }

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

            if (bio) {
                viewBio.textContent = bio;
                viewBio.style.display = "block";
                const activeAlignBtn = document.querySelector('.align-btn.active');
                viewBio.style.textAlign = activeAlignBtn ? activeAlignBtn.getAttribute('data-align') : 'center';
            } else {
                viewBio.textContent = "";
                viewBio.style.display = "none";
            }

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

            viewFooter.style.display = "flex";
        }

        // Listener de entrada em tempo real para os inputs do formulário (vinculado dinamicamente)
        function bindInspectorFormEvents() {
            const formInputs = document.querySelectorAll('#inspector-form input, #inspector-form textarea, #inspector-form select');
            formInputs.forEach(input => {
                input.addEventListener('input', updatePreviewFromForm);
                input.addEventListener('change', updatePreviewFromForm);
            });

            // Checkbox de Animação de Slide/Pausa do Banner de Topo
            const tbSlideInput = document.getElementById('input-addon-tb-slide');
            const tbPauseContainer = document.getElementById('container-addon-tb-pause');
            if (tbSlideInput && tbPauseContainer) {
                tbPauseContainer.style.display = tbSlideInput.checked ? 'block' : 'none';
                tbSlideInput.addEventListener('change', () => {
                    tbPauseContainer.style.display = tbSlideInput.checked ? 'block' : 'none';
                    updatePreviewFromForm();
                });
            }

            // Troca de Abas no Inspector: [ 📝 Conteúdo ] vs [ 🧩 Add ons ]
            const tabBtns = document.querySelectorAll('.inspector-tab-btn');
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetTab = btn.getAttribute('data-tab');
                    tabBtns.forEach(b => {
                        b.classList.remove('active');
                        b.style.background = 'transparent';
                        b.style.color = '#94a3b8';
                    });
                    btn.classList.add('active');
                    btn.style.background = '#3b82f6';
                    btn.style.color = '#ffffff';

                    const panelContent = document.getElementById('panel-content');
                    const panelAddons = document.getElementById('panel-addons');
                    if (targetTab === 'content') {
                        if (panelContent) panelContent.style.display = 'block';
                        if (panelAddons) panelAddons.style.display = 'none';
                    } else {
                        if (panelContent) panelContent.style.display = 'none';
                        if (panelAddons) panelAddons.style.display = 'block';
                    }
                });
            });

            // Lógica de Habilitar / Remover Add-ons
            const btnEnableTopbanner = document.getElementById('btn-enable-topbanner-addon');
            const cardTopbanner = document.getElementById('card-addon-topbanner');
            const btnRemoveTopbanner = document.getElementById('btn-remove-topbanner-addon');

            if (btnEnableTopbanner && cardTopbanner) {
                btnEnableTopbanner.addEventListener('click', () => {
                    cardTopbanner.style.display = 'block';
                    const text1 = document.getElementById('input-addon-tb-text1');
                    if (text1 && !text1.value) text1.value = "🔥 Frete Grátis em compras acima de R$ 199";
                    const text2 = document.getElementById('input-addon-tb-text2');
                    if (text2 && !text2.value) text2.value = "💳 Em até 10x sem juros no cartão";
                    const text3 = document.getElementById('input-addon-tb-text3');
                    if (text3 && !text3.value) text3.value = "🛍️ Cupom 10% OFF: BEMVINDO10";
                    
                    // Alterna automaticamente para a aba Conteúdo para o usuário visualizar o card habilitado
                    const contentTabBtn = document.querySelector('.inspector-tab-btn[data-tab="content"]');
                    if (contentTabBtn) contentTabBtn.click();

                    updatePreviewFromForm();

                    // Rola até o card
                    setTimeout(() => {
                        cardTopbanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                });
            }

            if (btnRemoveTopbanner && cardTopbanner) {
                btnRemoveTopbanner.addEventListener('click', () => {
                    cardTopbanner.style.display = 'none';
                    const text1 = document.getElementById('input-addon-tb-text1');
                    if (text1) text1.value = "";
                    const text2 = document.getElementById('input-addon-tb-text2');
                    if (text2) text2.value = "";
                    const text3 = document.getElementById('input-addon-tb-text3');
                    if (text3) text3.value = "";
                    updatePreviewFromForm();
                });
            }

            // Lógica de Habilitar / Remover Add-on 2: Chuva de Emoji
            const btnEnableEmojiRain = document.getElementById('btn-enable-emojirain-addon');
            const cardEmojiRainInspector = document.getElementById('card-addon-emojirain');
            const btnRemoveEmojiRain = document.getElementById('btn-remove-emojirain-addon');

            if (btnEnableEmojiRain && cardEmojiRainInspector) {
                btnEnableEmojiRain.addEventListener('click', () => {
                    cardEmojiRainInspector.style.display = 'block';
                    const emojiInput = document.getElementById('input-addon-er-emoji');
                    if (emojiInput && !emojiInput.value) emojiInput.value = '🌸';

                    // Muda para aba Conteúdo para o usuário ver o card
                    const contentTabBtn = document.querySelector('.inspector-tab-btn[data-tab="content"]');
                    if (contentTabBtn) contentTabBtn.click();

                    updatePreviewFromForm();

                    setTimeout(() => {
                        cardEmojiRainInspector.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                });
            }

            if (btnRemoveEmojiRain && cardEmojiRainInspector) {
                btnRemoveEmojiRain.addEventListener('click', () => {
                    cardEmojiRainInspector.style.display = 'none';
                    const emojiInput = document.getElementById('input-addon-er-emoji');
                    if (emojiInput) emojiInput.value = '';
                    updatePreviewFromForm();
                });
            }

            // Emoji catalog: clique nos botões para preencher o campo
            const emojiCatalogBtns = document.querySelectorAll('.emoji-pick-btn');
            emojiCatalogBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const emojiInput = document.getElementById('input-addon-er-emoji');
                    if (emojiInput) {
                        emojiInput.value = btn.getAttribute('data-emoji');
                        window.phoneErConfigKey = null; // força rebuild
                        updatePreviewFromForm();
                    }
                });
            });

            // Coverage slider: atualiza label ao vivo
            const coverageInput = document.getElementById('input-addon-er-coverage');
            const coverageLabel = document.getElementById('label-addon-er-coverage');
            if (coverageInput && coverageLabel) {
                coverageInput.addEventListener('input', () => {
                    coverageLabel.textContent = coverageInput.value + '%';
                    window.phoneErConfigKey = null; // força rebuild
                    updatePreviewFromForm();
                });
            }

            // Rotate checkbox: rebuild ao mudar
            const erRotateInput = document.getElementById('input-addon-er-rotate');
            if (erRotateInput) {
                erRotateInput.addEventListener('change', () => {
                    window.phoneErConfigKey = null;
                    updatePreviewFromForm();
                });
            }

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

                    // Lê todas as informações do form com o modelo ativo correto
                    const selectedCard = document.querySelector('.template-card.is-selected');
                    const activeModel = (selectedCard && selectedCard.getAttribute('data-template')) || window.currentActiveModel || 'classic';

                    const updatedData = {
                        model: activeModel,
                        arroba: cleanArroba,
                        name: document.getElementById('input-name')?.value.trim() || '',
                        avatar: document.getElementById('input-avatar')?.value.trim() || '',
                        bio: document.getElementById('input-bio')?.value.trim() || '',
                        highlight1Img: document.getElementById('input-highlight1-img')?.value.trim() || '',
                        highlight1Title: document.getElementById('input-highlight1-title')?.value.trim() || '',
                        highlight2Img: document.getElementById('input-highlight2-img')?.value.trim() || '',
                        highlight2Title: document.getElementById('input-highlight2-title')?.value.trim() || '',
                        highlight3Img: document.getElementById('input-highlight3-img')?.value.trim() || '',
                        highlight3Title: document.getElementById('input-highlight3-title')?.value.trim() || '',
                        btn1Title: document.getElementById('input-btn1-title')?.value.trim() || '',
                        btn1Url: document.getElementById('input-btn1-url')?.value.trim() || '',
                        btn2Title: document.getElementById('input-btn2-title')?.value.trim() || '',
                        btn2Url: document.getElementById('input-btn2-url')?.value.trim() || '',
                        btn3Title: document.getElementById('input-btn3-title')?.value.trim() || '',
                        btn3Url: document.getElementById('input-btn3-url')?.value.trim() || '',
                        btn4Title: document.getElementById('input-btn4-title')?.value.trim() || '',
                        btn4Url: document.getElementById('input-btn4-url')?.value.trim() || '',
                        addonTopbannerActive: document.getElementById('card-addon-topbanner')?.style.display !== 'none',
                        addonTopbannerText1: document.getElementById('input-addon-tb-text1')?.value.trim() || '',
                        addonTopbannerText2: document.getElementById('input-addon-tb-text2')?.value.trim() || '',
                        addonTopbannerText3: document.getElementById('input-addon-tb-text3')?.value.trim() || '',
                        addonTopbannerBg: document.getElementById('input-addon-tb-bg')?.value || '#0f172a',
                        addonTopbannerColor: document.getElementById('input-addon-tb-color')?.value || '#38bdf8',
                        addonTopbannerEffect: document.getElementById('select-addon-tb-effect')?.value || 'fade',
                        addonTopbannerPause: parseInt(document.getElementById('input-addon-tb-pause')?.value || '2', 10),
                        addonEmojiRainActive: document.getElementById('card-addon-emojirain')?.style.display !== 'none',
                        addonEmojiRainEmoji: document.getElementById('input-addon-er-emoji')?.value.trim() || '',
                        addonEmojiRainCount: parseInt(document.getElementById('input-addon-er-count')?.value || '8', 10),
                        addonEmojiRainSpeed: document.getElementById('select-addon-er-speed')?.value || 'normal',
                        addonEmojiRainCoverage: parseInt(document.getElementById('input-addon-er-coverage')?.value || '80', 10),
                        addonEmojiRainRotate: document.getElementById('input-addon-er-rotate')?.checked || false,
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

        function getSearchHistory() {
            return JSON.parse(localStorage.getItem('painelbio-search-history')) || [];
        }

        function saveSearchHistory(searchItem) {
            if (!searchItem || !searchItem.arroba) return;
            let history = getSearchHistory();
            history = history.filter(h => h.arroba.toLowerCase() !== searchItem.arroba.toLowerCase());
            history.unshift({
                arroba: searchItem.arroba,
                name: searchItem.name || searchItem.arroba,
                avatar: searchItem.avatar || ''
            });
            history = history.slice(0, 5); // Guarda apenas as 5 buscas mais recentes
            localStorage.setItem('painelbio-search-history', JSON.stringify(history));
        }

        // Renderiza o dropdown flutuante com base no HISTÓRICO DE BUSCAS
        function renderDropdown(filterText = '') {
            const history = getSearchHistory();
            let items = [];

            if (!filterText.trim()) {
                // Se o input estiver vazio, exibe o histórico de buscas
                items = history;
            } else {
                // Se tiver digitando, filtra no histórico (limite de 3)
                const query = filterText.trim().toLowerCase().replace(/^@/, '');
                items = history.filter(item => {
                    const cleanArroba = (item.arroba || '').toLowerCase().replace(/^@/, '');
                    const cleanName = (item.name || '').toLowerCase();
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
                        <span class="dropdown-item-name">${item.name || 'Pesquisado recentemente'}</span>
                    </div>
                </div>
            `).join('');

            // Se for exibição de histórico (input vazio), adiciona botão de limpar no final
            if (!filterText.trim() && history.length > 0) {
                dropdownHtml += `
                    <div class="dropdown-clear-btn" id="clear-search-history">
                        Limpar Histórico de Pesquisa
                    </div>
                `;
            }

            searchDropdown.innerHTML = dropdownHtml;
            searchDropdown.style.display = 'flex';

            // Evento para limpar o histórico de buscas (NÃO MEXE NA GALERIA DE SITES!)
            const clearBtn = document.getElementById('clear-search-history');
            if (clearBtn) {
                clearBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evita que feche e reabra
                    localStorage.removeItem('painelbio-search-history');
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

            // Se não conseguiu dados reais mas o switch de dados fakes estiver ativado, gera dados fakes completos
            if (!scrapedRealData && isFakeDataEnabled) {
                const capitalized = cleanArroba.charAt(0).toUpperCase() + cleanArroba.slice(1);
                scrapedRealData = {
                    name: `Loja ${capitalized}`,
                    bio: `Peças exclusivas & novidades toda semana. ✨\nEnviamos para todo o Brasil. 🛍️\nAtendimento rápido no WhatsApp!`,
                    avatar: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200'
                };
                addScraperLog(`Simulação ativada! Gerados dados de teste para @${cleanArroba}`, 'info');
            }

            // Se não conseguiu dados e nem os fakes foram ativados, avisa o usuário
            if (!scrapedRealData && !isFakeDataEnabled) {
                if (typeof showToast === 'function') {
                    showToast('Não foi possível buscar os dados. Verifique a chave RapidAPI ou ative Dados Fake.', 'error');
                }
            }

            // Atualiza os dados com as informações extraídas ou fakes
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
                // Salva apenas no HISTÓRICO DE BUSCAS da barra superior
                saveSearchHistory({
                    arroba: generatedData.arroba,
                    name: generatedData.name,
                    avatar: generatedData.avatar
                });

                // Carrega a loja gerada na visualização do editor
                loadLeadData(generatedData);
            }, 800);
        }

        // Carrega um perfil gerado/salvo no celular e no Inspector form
        function loadLeadData(data) {
            const currentTemplate = document.querySelector('.template-card.is-selected');

            if (currentTemplate) {
                const templateId = currentTemplate.getAttribute('data-template');
                loadTemplatePreview(templateId, data);
            } else {
                const classicCard = document.querySelector('.template-card[data-template="classic"]');
                if (classicCard) classicCard.classList.add('is-selected');
                loadTemplatePreview('classic', data);
            }

            const topActionBtn = document.querySelector('.top-action-btn');
            if (topActionBtn) {
                topActionBtn.classList.remove('disabled');
            }

            if (typeof openDrawer === 'function' && rightDrawer) {
                openDrawer(rightDrawer);
            }
        }

        function getLeads() {
            return JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
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

                    // Verifica se já temos este site salvo na galeria local
                    const leads = getLeads();
                    const foundLead = leads.find(l => l.arroba.toLowerCase() === cleanQuery);
                    
                    if (foundLead) {
                        // Carrega os dados do site salvo
                        loadLeadData(foundLead);
                    } else {
                        // Busca dados reais do Instagram via RapidAPI
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
                    if (arroba) {
                        searchInsta.value = arroba;
                        const leads = getLeads();
                        const foundLead = leads.find(l => l.arroba.toLowerCase() === arroba.toLowerCase());
                        if (foundLead) {
                            loadLeadData(foundLead);
                        } else {
                            generateInstagramBio(arroba);
                        }
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
            if (!siteData) return;
            window.loadedFromGallery = true;
            const btnLoadSite = document.getElementById('btn-load-site');
            if (btnLoadSite) btnLoadSite.classList.add('site-loaded-active');
            
            const targetModel = siteData.model || 'classic';

            // Carrega a pré-visualização do modelo correto e injeta todos os dados do site
            loadTemplatePreview(targetModel, siteData);

            if (typeof openDrawer === 'function' && rightDrawer) {
                openDrawer(rightDrawer);
            }
            showCustomAlert(`Site ${siteData.arroba} carregado com sucesso!`, 'success');
        }