// --- CONFIGURAÇÃO DA RAPIDAPI ---


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

                    const isRecentlySaved = window.recentlySavedArroba && site.arroba && site.arroba.toLowerCase() === window.recentlySavedArroba.toLowerCase();
                    const highlightClass = isRecentlySaved ? 'card-blink-highlight' : '';

                    html += `
                        <div class="${highlightClass}" style="background: #0d1117; border: 1px solid #30363d; border-radius: 12px; padding: 12px; display: flex; gap: 12px; align-items: stretch; transition: all 0.2s; min-width: 0; box-sizing: border-box; overflow: hidden;">
                            
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
                                        <strong>Modelo:</strong> ${site.model === 'shop' ? 'Shop' : (site.model === 'carousel' ? 'Carrossel' : (site.model === 'vitrine' ? 'Vitrine' : 'Classic'))} / ${themeName}
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

            // Garante que o modelo do site seja mantido se já existir, ou atribuído ao modelo ativo se novo
            if (!site.model) {
                site.model = window.currentActiveModel || 'classic';
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

        // Função global para carregar o site salvo de volta ao gerador/editor
        window.previewSiteOffline = function(arroba) {
            let leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
            const siteData = leads.find(l => l.arroba.toLowerCase() === arroba.toLowerCase());
            
            if (!siteData) {
                showCustomAlert('Site não encontrado na memória.', 'error');
                return;
            }

            // 1. Carrega os dados do site no editor e na tela do celular
            loadSiteIntoEditor(siteData);

            // 2. Fecha a galeria e alterna a barra inferior para o Gerador
            const navEditor = document.getElementById('nav-editor');
            const navGallery = document.getElementById('nav-gallery');
            const galleryOverlay = document.getElementById('gallery-overlay');
            const topBar = document.querySelector('.top-bar');

            if (navEditor && navGallery && galleryOverlay) {
                navEditor.classList.add('active');
                navGallery.classList.remove('active');
                galleryOverlay.classList.remove('active');
                if (topBar) topBar.style.display = 'flex';
            }

            // 3. Abre a gaveta do Inspector para edição imediata
            if (typeof openDrawer === 'function' && rightDrawer) {
                openDrawer(rightDrawer);
            }

            showCustomAlert(`Site ${siteData.arroba} carregado no Gerador!`, 'success');
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
                            <div><strong>Modelo Atual:</strong> ${site.model === 'shop' ? 'Shop' : (site.model === 'carousel' ? 'Carrossel' : (site.model === 'vitrine' ? 'Vitrine' : 'Classic'))} (${site.preset || 'gray'})</div>
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
        // generateStaticSite é fornecido centralizadamente via js/generator.js
        if (typeof window.generateStaticSite === 'undefined' && typeof generateStaticSite !== 'undefined') {
            window.generateStaticSite = generateStaticSite;
        }

        

        

        leftIcon.addEventListener('click', () => openDrawer(leftDrawer));
        rightIcon.addEventListener('click', () => openDrawer(rightDrawer));
        overlay.addEventListener('click', closeAll);
        closeBtns.forEach(btn => btn.addEventListener('click', closeAll));

        // Abas da Gaveta da Esquerda (Modelos vs Sites)
        const leftTabBtns = document.querySelectorAll('.left-tab-btn');
        const leftPanels = document.querySelectorAll('.left-panel');
        leftTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                leftTabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'transparent';
                    b.style.color = '#94a3b8';
                });
                leftPanels.forEach(p => {
                    p.classList.remove('active');
                    p.style.display = 'none';
                });
                
                btn.classList.add('active');
                btn.style.background = '#3b82f6';
                btn.style.color = '#fff';
                
                const targetId = 'left-panel-' + btn.getAttribute('data-tab');
                const targetPanel = document.getElementById(targetId);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    targetPanel.style.display = 'block';
                }
            });
        });

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
                            highlight1Img: document.getElementById('input-highlight1-img') ? document.getElementById('input-highlight1-img').value : (window.tempFormBackup?.highlight1Img || ''),
                            highlight1Title: document.getElementById('input-highlight1-title') ? document.getElementById('input-highlight1-title').value : (window.tempFormBackup?.highlight1Title || ''),
                            highlight2Img: document.getElementById('input-highlight2-img') ? document.getElementById('input-highlight2-img').value : (window.tempFormBackup?.highlight2Img || ''),
                            highlight2Title: document.getElementById('input-highlight2-title') ? document.getElementById('input-highlight2-title').value : (window.tempFormBackup?.highlight2Title || ''),
                            highlight3Img: document.getElementById('input-highlight3-img') ? document.getElementById('input-highlight3-img').value : (window.tempFormBackup?.highlight3Img || ''),
                            highlight3Title: document.getElementById('input-highlight3-title') ? document.getElementById('input-highlight3-title').value : (window.tempFormBackup?.highlight3Title || ''),
                            addonTopbannerActive: document.getElementById('card-addon-topbanner')?.style.display !== 'none',
                            addonTopbannerText1: document.getElementById('input-addon-tb-text1')?.value || '',
                            addonTopbannerText2: document.getElementById('input-addon-tb-text2')?.value || '',
                            addonTopbannerText3: document.getElementById('input-addon-tb-text3')?.value || '',
                            addonTopbannerBg: document.getElementById('input-addon-tb-bg')?.value || '#0f172a',
                            addonTopbannerColor: document.getElementById('input-addon-tb-color')?.value || '#38bdf8',
                            addonTopbannerEffect: document.getElementById('select-addon-tb-effect')?.value || 'fade',
                            addonTopbannerMarqueeSpeed: document.getElementById('input-addon-tb-marquee-speed')?.value || '5',
                            addonTopbannerMarqueePause: document.getElementById('input-addon-tb-marquee-pause')?.value || '3',
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

        

        

        // Template do formulário Classic em HTML
        // CLASSIC_FORM_HTML foi movido para models/classic/inspector.html
let CLASSIC_FORM_HTML = "";

// Função para carregar o modelo Classic dinamicamente

// Carregar o modelo ao iniciar (isso pode ser mudado para quando clicar no menu)
loadClassicModel();

        // Preenche campos do formulário com dados fakes do modelo ativo
        

        

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

        // Atualiza a aparencia e status dos botoes no Catalogo de Add-ons (Cinza inativo vs Azul ativo)
        

        // Função para ler o formulário e atualizar a pré-visualização em tempo real
        

        // Listener de entrada em tempo real para os inputs do formulário (vinculado dinamicamente)
        function bindInspectorFormEvents() {
            const formInputs = document.querySelectorAll('#inspector-form input, #inspector-form textarea, #inspector-form select');
            formInputs.forEach(input => {
                input.addEventListener('input', updatePreviewFromForm);
                input.addEventListener('change', updatePreviewFromForm);
            });

            // Interruptor de Dados Fake
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

            // Animação de Slide/Marquee do Banner de Topo
            const effectSelect = document.getElementById('select-addon-tb-effect');
            const containerPause = document.getElementById('container-addon-tb-pause');
            const containerMarquee = document.getElementById('container-addon-tb-marquee-settings');
            if (effectSelect) {
                function updateAddonFields() {
                    if (containerPause) containerPause.style.display = (['slide', 'bounce', 'flip', 'shutter'].includes(effectSelect.value)) ? 'block' : 'none';
                    if (containerMarquee) containerMarquee.style.display = (effectSelect.value === 'marquee') ? 'block' : 'none';
                }
                updateAddonFields();
                effectSelect.addEventListener('change', () => {
                    updateAddonFields();
                    // trigger preview update too since it's an effect change!
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

            // ==========================================
            // ADD-ON 3: RODOPIO DO AVATAR
            // ==========================================
            const btnEnableAvatarSpin = document.getElementById('btn-enable-avatarspin-addon');
            const cardAvatarSpin = document.getElementById('card-addon-avatarspin');
            const btnRemoveAvatarSpin = document.getElementById('btn-remove-avatarspin-addon');

            if (btnEnableAvatarSpin && cardAvatarSpin) {
                btnEnableAvatarSpin.addEventListener('click', () => {
                    cardAvatarSpin.style.display = 'block';
                    const contentTabBtn = document.querySelector('.inspector-tab-btn[data-tab="content"]');
                    if (contentTabBtn) contentTabBtn.click();
                    updatePreviewFromForm();
                    setTimeout(() => {
                        cardAvatarSpin.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                });
            }

            if (btnRemoveAvatarSpin && cardAvatarSpin) {
                btnRemoveAvatarSpin.addEventListener('click', () => {
                    cardAvatarSpin.style.display = 'none';
                    // Remove animação do avatar no preview
                    const liveAvatar = document.getElementById('view-avatar-container') || document.getElementById('v-view-avatar-wrapper');
                    if (liveAvatar) liveAvatar.style.animation = '';
                    updatePreviewFromForm();
                });
            }

            // Checkbox de repetição do giro
            const asRepeatChk = document.getElementById('input-addon-as-repeat');
            const asIntervalCont = document.getElementById('container-addon-as-interval');
            if (asRepeatChk && asIntervalCont) {
                asRepeatChk.addEventListener('change', () => {
                    asIntervalCont.style.display = asRepeatChk.checked ? 'block' : 'none';
                    updatePreviewFromForm();
                });
            }

            // Botão testar animação agora
            const btnPreviewSpin = document.getElementById('btn-preview-avatarspin');
            if (btnPreviewSpin) {
                btnPreviewSpin.addEventListener('click', () => {
                    triggerAvatarSpinPreview();
                });
            }

            // ==========================================
            // ADD-ON 4: PLAYER DE ÁUDIO FLUTUANTE
            // ==========================================
            const btnEnableAudioPlayer = document.getElementById('btn-enable-audioplayer-addon');
            const cardAudioPlayerInspector = document.getElementById('card-addon-audioplayer');
            const btnRemoveAudioPlayer = document.getElementById('btn-remove-audioplayer-addon');

            if (btnEnableAudioPlayer && cardAudioPlayerInspector) {
                btnEnableAudioPlayer.addEventListener('click', () => {
                    cardAudioPlayerInspector.style.display = 'block';
                    const urlInput = document.getElementById('input-addon-ap-url');
                    if (urlInput && !urlInput.value) {
                        urlInput.value = 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3';
                    }

                    const contentTabBtn = document.querySelector('.inspector-tab-btn[data-tab="content"]');
                    if (contentTabBtn) contentTabBtn.click();

                    updatePreviewFromForm();

                    setTimeout(() => {
                        cardAudioPlayerInspector.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                });
            }

            if (btnRemoveAudioPlayer && cardAudioPlayerInspector) {
                btnRemoveAudioPlayer.addEventListener('click', () => {
                    cardAudioPlayerInspector.style.display = 'none';
                    const urlInput = document.getElementById('input-addon-ap-url');
                    if (urlInput) urlInput.value = '';
                    updatePreviewFromForm();
                });
            }

            // ==========================================
            // ADD-ON 5: BALÃO DE ATENDIMENTO "ONLINE AGORA"
            // ==========================================
            const btnEnableLivechat = document.getElementById('btn-enable-livechat-addon');
            const cardLivechatInspector = document.getElementById('card-addon-livechat');
            const btnRemoveLivechat = document.getElementById('btn-remove-livechat-addon');

            if (btnEnableLivechat && cardLivechatInspector) {
                btnEnableLivechat.addEventListener('click', () => {
                    cardLivechatInspector.style.display = 'block';
                    
                    const contentTabBtn = document.querySelector('.inspector-tab-btn[data-tab="content"]');
                    if (contentTabBtn) contentTabBtn.click();
                    
                    updatePreviewFromForm();
                    
                    setTimeout(() => {
                        cardLivechatInspector.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                });
            }

            if (btnRemoveLivechat && cardLivechatInspector) {
                btnRemoveLivechat.addEventListener('click', () => {
                    cardLivechatInspector.style.display = 'none';
                    updatePreviewFromForm();
                });
            }

            // Botões rápidos de faixas de exemplo
            document.querySelectorAll('.ap-demo-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const demoUrl = btn.getAttribute('data-url');
                    const urlInput = document.getElementById('input-addon-ap-url');
                    if (urlInput && demoUrl) {
                        urlInput.value = demoUrl;
                        updatePreviewFromForm();
                    }
                });
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

                    // Lê todas as informações do form com o modelo ativo correto
                    const selectedCard = document.querySelector('.template-card.is-selected');
                    const activeModel = window.currentActiveModel || (selectedCard && selectedCard.getAttribute('data-template')) || 'classic';

                    const updatedData = {
                        model: activeModel,
                        arroba: cleanArroba,
                        name: document.getElementById('input-name')?.value.trim() || '',
                        avatar: document.getElementById('input-avatar')?.value.trim() || '',
                        bio: document.getElementById('input-bio')?.value.trim() || '',
                        carousel1Img: document.getElementById('input-carousel1-img') ? document.getElementById('input-carousel1-img').value.trim() : (window.tempFormBackup?.carousel1Img || ''),
                        carousel2Img: document.getElementById('input-carousel2-img') ? document.getElementById('input-carousel2-img').value.trim() : (window.tempFormBackup?.carousel2Img || ''),
                        carousel3Img: document.getElementById('input-carousel3-img') ? document.getElementById('input-carousel3-img').value.trim() : (window.tempFormBackup?.carousel3Img || ''),
                        highlight1Img: document.getElementById('input-highlight1-img') ? document.getElementById('input-highlight1-img').value.trim() : (window.tempFormBackup?.highlight1Img || ''),
                        highlight1Title: document.getElementById('input-highlight1-title') ? document.getElementById('input-highlight1-title').value.trim() : (window.tempFormBackup?.highlight1Title || ''),
                        highlight2Img: document.getElementById('input-highlight2-img') ? document.getElementById('input-highlight2-img').value.trim() : (window.tempFormBackup?.highlight2Img || ''),
                        highlight2Title: document.getElementById('input-highlight2-title') ? document.getElementById('input-highlight2-title').value.trim() : (window.tempFormBackup?.highlight2Title || ''),
                        highlight3Img: document.getElementById('input-highlight3-img') ? document.getElementById('input-highlight3-img').value.trim() : (window.tempFormBackup?.highlight3Img || ''),
                        
                          highlight3Title: document.getElementById('input-highlight3-title') ? document.getElementById('input-highlight3-title').value.trim() : (window.tempFormBackup?.highlight3Title || ''),
                          shopP1Img: document.getElementById('input-shop-p1-img') ? document.getElementById('input-shop-p1-img').value.trim() : (window.tempFormBackup?.shopP1Img || ''),
                          shopP1Title: document.getElementById('input-shop-p1-title') ? document.getElementById('input-shop-p1-title').value.trim() : (window.tempFormBackup?.shopP1Title || ''),
                          shopP1Price: document.getElementById('input-shop-p1-price') ? document.getElementById('input-shop-p1-price').value.trim() : (window.tempFormBackup?.shopP1Price || ''),
                          shopP1Url: document.getElementById('input-shop-p1-url') ? document.getElementById('input-shop-p1-url').value.trim() : (window.tempFormBackup?.shopP1Url || ''),
                          shopP2Img: document.getElementById('input-shop-p2-img') ? document.getElementById('input-shop-p2-img').value.trim() : (window.tempFormBackup?.shopP2Img || ''),
                          shopP2Title: document.getElementById('input-shop-p2-title') ? document.getElementById('input-shop-p2-title').value.trim() : (window.tempFormBackup?.shopP2Title || ''),
                          shopP2Price: document.getElementById('input-shop-p2-price') ? document.getElementById('input-shop-p2-price').value.trim() : (window.tempFormBackup?.shopP2Price || ''),
                          shopP2Url: document.getElementById('input-shop-p2-url') ? document.getElementById('input-shop-p2-url').value.trim() : (window.tempFormBackup?.shopP2Url || ''),
                          shopP3Img: document.getElementById('input-shop-p3-img') ? document.getElementById('input-shop-p3-img').value.trim() : (window.tempFormBackup?.shopP3Img || ''),
                          shopP3Title: document.getElementById('input-shop-p3-title') ? document.getElementById('input-shop-p3-title').value.trim() : (window.tempFormBackup?.shopP3Title || ''),
                          shopP3Price: document.getElementById('input-shop-p3-price') ? document.getElementById('input-shop-p3-price').value.trim() : (window.tempFormBackup?.shopP3Price || ''),
                          shopP3Url: document.getElementById('input-shop-p3-url') ? document.getElementById('input-shop-p3-url').value.trim() : (window.tempFormBackup?.shopP3Url || ''),
                          shopCatalogUrl: document.getElementById('input-shop-catalog-url') ? document.getElementById('input-shop-catalog-url').value.trim() : (window.tempFormBackup?.shopCatalogUrl || ''),
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
                        addonAvatarSpinActive: document.getElementById('card-addon-avatarspin')?.style.display !== 'none',
                        addonAvatarSpinDuration: parseFloat(document.getElementById('input-addon-as-duration')?.value || '3'),
                        addonAvatarSpinSpins: parseInt(document.getElementById('input-addon-as-spins')?.value || '4', 10),
                        addonAvatarSpinRepeat: document.getElementById('input-addon-as-repeat')?.checked || false,
                        addonAvatarSpinInterval: parseInt(document.getElementById('input-addon-as-interval')?.value || '5', 10),
                        addonAudioPlayerActive: document.getElementById('card-addon-audioplayer')?.style.display !== 'none',
                        addonAudioPlayerUrl: document.getElementById('input-addon-ap-url')?.value.trim() || '',
                        addonAudioPlayerLabel: document.getElementById('input-addon-ap-label')?.value.trim() || 'Música da Loja',
                        addonAudioPlayerPosition: document.getElementById('select-addon-ap-position')?.value || 'bottom-right',
                        addonAudioPlayerColor: document.getElementById('input-addon-ap-color')?.value || '#ec4899',
                        addonAudioPlayerWaveColor: document.getElementById('input-addon-ap-wave-color')?.value || '#ffffff',
                        addonAudioPlayerAutoplay: document.getElementById('input-addon-ap-autoplay')?.checked || false,
                        addonLivechatActive: document.getElementById('card-addon-livechat')?.style.display !== 'none',
                        addonLivechatAvatar: document.getElementById('input-addon-lc-avatar')?.value.trim() || '',
                        addonLivechatName: document.getElementById('input-addon-lc-name')?.value.trim() || 'Suporte Amanda',
                        addonLivechatStatusText: document.getElementById('input-addon-lc-status')?.value.trim() || 'Online Agora',
                        addonLivechatMessage: document.getElementById('input-addon-lc-message')?.value.trim() || 'Dúvidas sobre produtos? Fale comigo no WhatsApp! 👋',
                        addonLivechatUrl: document.getElementById('input-addon-lc-url')?.value.trim() || 'https://wa.me/5511999999999',
                        addonLivechatPosition: document.getElementById('select-addon-lc-position')?.value || 'bottom-left',
                        addonLivechatColor: document.getElementById('input-addon-lc-color')?.value || '#22c55e',
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

                        window.recentlySavedArroba = cleanArroba;

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
                            }, 3500);
                        }

                        // Fechar o inspector e alternar diretamente para a Galeria
                        setTimeout(() => {
                            const rightDrawer = document.getElementById('right-drawer');
                            const leftDrawer = document.getElementById('left-drawer');
                            const drawerOverlay = document.getElementById('drawer-overlay');

                            if (rightDrawer) rightDrawer.classList.remove('active');
                            if (leftDrawer) leftDrawer.classList.remove('active');
                            if (drawerOverlay) drawerOverlay.classList.remove('active');

                            const navGallery = document.getElementById('nav-gallery');
                            if (navGallery) {
                                navGallery.click();
                            }
                        }, 300);

                        // Limpa a indicação do card piscante após a animação
                        setTimeout(() => {
                            window.recentlySavedArroba = null;
                        }, 6000);

                    } catch (err) {
                        console.error('Erro ao salvar:', err);
                        if (btnSave) {
                            btnSave.textContent = "Erro ao salvar ❌";
                            btnSave.style.opacity = '1';
                            setTimeout(() => {
                                btnSave.textContent = originalText;
                            }, 3500);
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
        

        // Carrega um perfil gerado/salvo no celular e no Inspector form
        

        

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

        

        // Tenta ativar ao carregar o aplicativo
        requestWakeLock();

        // Reativa o Wake Lock se o usuário sair do app e voltar (mudar de aba ou desbloquear celular)
        document.addEventListener('visibilitychange', async () => {
            if (document.visibilityState === 'visible') {
                requestWakeLock();
            }
        });

        // --- Função Custom Alert Toast ---
        

        // --- Modal de Carregar Site ---
        const btnLoadSite = document.getElementById('btn-load-site');
        const loadSiteModal = document.getElementById('load-site-modal');
        const loadSiteOverlay = document.getElementById('load-site-overlay');
        const closeLoadSiteBtn = document.getElementById('close-load-site');
        const loadSiteList = document.getElementById('load-site-list');

        

        

        if (btnLoadSite) btnLoadSite.addEventListener('click', openLoadSiteModal);
        if (closeLoadSiteBtn) closeLoadSiteBtn.addEventListener('click', closeLoadSiteModal);
        if (loadSiteOverlay) loadSiteOverlay.addEventListener('click', closeLoadSiteModal);

        // Lógica do Sininho de Notificações
        

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

        

        

// ==========================================
// ADD-ON 3: RODOPIO DO AVATAR — FUNÇÕES CENTRAIS
// ==========================================

/**
 * Busca o elemento <img> dentro do avatar para aplicar a animação diretamente
 * sobre a imagem (não o container com overflow:hidden/border-radius).
 */


/**
 * Gera e injeta um @keyframes único com os graus exatos (sem CSS var),
 * e aplica a animação na <img> do avatar com perspective no seu pai direto.
 */


/**
 * Remove a animação do avatar e restaura os estilos originais.
 */


/**
 * Função chamada pelo botão "Testar Animação Agora" no Inspector.
 */


// ==========================================
// SISTEMA DE CONFIGURAÇÃO DE CHAVES API ROTATIVAS
// ==========================================









// ==========================================
// BANCO DE DADOS LOCAL DE PERFIS (CACHE)
// Evita gastar créditos de API ao pesquisar perfis repetidos
// ==========================================




// ==========================================
// API ALTERNATIVA: Instagram Public Bulk Scraper
// Host: instagram-public-bulk-scraper.p.rapidapi.com
// Usada automaticamente como fallback quando a API principal falha
// ==========================================






// Funções para abrir/fechar o modal de chaves API




// Configura Listeners do Modal de Chaves (Usando Delegação de Eventos para evitar falhas de carregamento)
document.addEventListener('click', (e) => {
    // 1. Abrir Modal
    const btnSettings = e.target.closest('#btn-api-settings');
    if (btnSettings) {
        e.stopPropagation();
        openApiKeysModal();
        return;
    }

    // 2. Fechar Modal
    const btnClose = e.target.closest('#close-api-keys');
    const overlayClick = e.target.id === 'api-keys-overlay' ? e.target : null;
    if (btnClose || overlayClick) {
        closeApiKeysModal();
        return;
    }

    // 3. Adicionar Nova Chave
    const btnAdd = e.target.closest('#btn-add-api-key');
    if (btnAdd) {
        const inputNew = document.getElementById('input-new-api-key');
        if (inputNew) {
            const keyVal = inputNew.value.trim();
            if (!keyVal) return;
            
            const keys = getApiKeys();
            if (keys.some(k => k.key === keyVal)) {
                showCustomAlert('Esta chave já foi cadastrada!', 'warning');
                return;
            }
            
            keys.push({
                key: keyVal,
                remaining: null,
                limit: null,
                resetSeconds: null,
                updatedAt: null,
                isBlocked: false
            });
            
            saveApiKeys(keys);
            inputNew.value = '';
            renderApiKeysModal();
            showCustomAlert('Chave cadastrada com sucesso!', 'success');
        }
        return;
    }

    // 4. Ações da Lista (Definir ativa / Excluir)
    const targetSetActive = e.target.closest('.btn-set-active-key');
    if (targetSetActive) {
        const idx = parseInt(targetSetActive.getAttribute('data-index'), 10);
        setActiveKeyIndex(idx);
        renderApiKeysModal();
        showCustomAlert('Chave ativa alterada!', 'success');
        return;
    }

    // 4b. Desbloquear chave manualmente
    const targetUnblock = e.target.closest('.btn-unblock-api-key');
    if (targetUnblock) {
        const idx = parseInt(targetUnblock.getAttribute('data-index'), 10);
        const keys = getApiKeys();
        if (keys[idx]) {
            keys[idx].isBlocked = false;
            keys[idx].remaining = null;
            keys[idx].resetSeconds = null;
            keys[idx].updatedAt = null;
            saveApiKeys(keys);
            renderApiKeysModal();
            showCustomAlert('Chave desbloqueada! Pode fazer nova busca.', 'success');
        }
        return;
    }

    const targetDelete = e.target.closest('.btn-delete-api-key');
    if (targetDelete) {
        const idx = parseInt(targetDelete.getAttribute('data-index'), 10);
        const keys = getApiKeys();
        let activeIndex = getActiveKeyIndex();
        
        keys.splice(idx, 1);
        saveApiKeys(keys);
        
        if (activeIndex === idx) {
            setActiveKeyIndex(0);
        } else if (activeIndex > idx) {
            setActiveKeyIndex(activeIndex - 1);
        }
        
        renderApiKeysModal();
        showCustomAlert('Chave excluída com sucesso!', 'success');
        return;
    }
});
