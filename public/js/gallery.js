// ===============================================================================
// PAINELBIO - MÓDULO DE GALERIA E PUBLICAÇÃO (GALLERY.JS)
// ===============================================================================

function filterGallery() {
    const searchInput = document.getElementById('gallery-search');
    if (!searchInput || !window.allSitesData) return;
    const term = searchInput.value.toLowerCase().trim();
    const filtered = window.allSitesData.filter(site => site.arroba && site.arroba.toLowerCase().includes(term));
    renderGallery(filtered);
}

function renderGallery(sitesArray) {
    const galleryContent = document.getElementById('gallery-overlay')?.querySelector('.gallery-content');
    if (!galleryContent) return;

    if (sitesArray && sitesArray.length > 0) {
        let html = '<div style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 500px; margin: 0 auto; padding-bottom: 20px;">';
        sitesArray.forEach(site => {
            const dateObj = new Date(site.createdAt);
            const formattedDate = dateObj.toLocaleDateString('pt-BR') + ' ' + dateObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            
            const presetMap = {
                'gray': 'Básico', 'sunset': 'Sunset', 'neon-blue': 'Neon Blue', 'synthwave': 'Synthwave',
                'fire': 'Fire', 'aurora': 'Aurora', 'indigo': 'Indigo', 'cyber-lime': 'Cyber Lime',
                'rose-gold': 'Rose Gold', 'golden': 'Golden', 'deep-purple': 'Deep Purple', 'platinum': 'Platinum'
            };
            const themeName = presetMap[site.preset] || 'Básico';
            
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
                btnStyle = 'background: rgba(140, 140, 140, 0.15); color: #a0a0a0; border: 1px solid rgba(160, 160, 160, 0.3);';
                btnTitle = 'Status: Não publicado. Clique para publicar no ar!';
                btnBadgeText = 'Pendente';
            }

            html += `
                <div style="background: #0d1117; border: 1px solid #30363d; border-radius: 12px; padding: 12px; display: flex; gap: 12px; align-items: stretch; transition: all 0.2s; min-width: 0; box-sizing: border-box; overflow: hidden;">
                    <div style="width: 70px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden; background: #000; border: 1px solid #222;">
                        <img src="${site.previewPath || site.previewBase64 || ''}" onerror="this.src='${site.avatar || ''}'" style="width: 100%; height: auto; object-fit: cover; display: block;" />
                    </div>
                    <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 4px; min-width: 0;">
                                <div style="font-size: 0.95rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0;">
                                    ${site.arroba}
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
                                    <button onclick="openSiteInfoModal('${site.arroba}')" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.35); width: 22px; height: 22px; border-radius: 50%; padding: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="Ficha do Cliente & Relatório (i)">
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
                        <div style="display: flex; gap: 6px; margin-top: 12px; width: 100%; box-sizing: border-box;">
                            <button onclick="previewSiteOffline('${site.arroba}')" style="flex: 1; min-width: 0; background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 8px 0; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="Ver Prévia">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            </button>
                            <button onclick="startUploadSite('${site.arroba}')" style="flex: 1; min-width: 0; ${btnStyle} padding: 8px 0; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="${btnTitle}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </button>
                            ${(status === 'published' || status === 'modified') ? `
                            <button onclick="copySiteUrl('${site.arroba}', this)" style="flex: 1; min-width: 0; background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.35); padding: 8px 0; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" title="Copiar URL para o Cliente">
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
}

function copySiteUrl(arroba, btnEl) {
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
}

async function startUploadSite(arroba) {
    let savedLeads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
    const site = savedLeads.find(l => l.arroba.toLowerCase() === arroba.toLowerCase());
    
    if (!site) {
        showCustomAlert('Dados do site não encontrados!', 'error');
        return;
    }

    const oldModal = document.getElementById('upload-progress-modal');
    if (oldModal) oldModal.remove();

    const modalHtml = `
        <div id="upload-progress-modal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;">
            <div style="background: #161b22; border: 1px solid #30363d; border-radius: 16px; width: 100%; max-width: 380px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); text-align: center; color: #fff; font-family: 'Inter', sans-serif;">
                <h3 style="margin: 0 0 16px 0; font-size: 1.1rem; color: #f0f6fc; font-weight: 600;">Publicando no Ar...</h3>
                <p style="font-size: 0.85rem; color: #8b949e; margin-bottom: 20px;">${site.arroba}</p>
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

    const scraperNotificationList = document.getElementById('scraper-notification-list');
    const scraperBadge = document.getElementById('scraper-badge');

    if (scraperNotificationList) scraperNotificationList.innerHTML = '';
    if (scraperBadge) { scraperBadge.style.display = 'none'; scraperBadge.className = 'notification-badge'; }
    if (typeof addScraperLog === 'function') addScraperLog(`Iniciando publicação do site ${site.arroba}...`, 'info');

    setProgress(15, 'Preparando réplica estática...');
    if (typeof addScraperLog === 'function') addScraperLog('[Upload] Preparando réplica do site...', 'info');
    await new Promise(r => setTimeout(r, 400));

    setProgress(40, 'Conectando ao Cloudflare...');
    if (typeof addScraperLog === 'function') addScraperLog('[Upload] Conectando à API do Cloudflare Pages...', 'info');
    await new Promise(r => setTimeout(r, 400));

    try {
        setProgress(65, 'Enviando banco de dados...');
        if (typeof addScraperLog === 'function') addScraperLog('[Upload] Enviando dados para /api/publish...', 'info');
        
        const response = await fetch('/api/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(site)
        });

        if (response.ok) {
            const result = await response.json();
            setProgress(100, 'Site no ar com sucesso!');
            if (typeof addScraperLog === 'function') addScraperLog(`[Upload] Sucesso! Site no ar: ${result.url || site.arroba}`, 'success');
            
            if (scraperBadge) {
                scraperBadge.style.display = 'block';
                scraperBadge.className = 'notification-badge success';
            }

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
                    renderGallery(window.allSitesData);
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
            if (statusText) {
                statusText.style.color = '#ef4444';
                statusText.textContent = `Erro: ${errMsg}`;
            }
            
            if (typeof addScraperLog === 'function') addScraperLog(`[Upload Erro] ${fullErrString}`, 'error');
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
        if (typeof addScraperLog === 'function') addScraperLog(`[Upload Erro] Falha na requisição: ${err.message}`, 'error');
        if (scraperBadge) {
            scraperBadge.style.display = 'block';
            scraperBadge.className = 'notification-badge error';
        }

        setProgress(100, 'Erro de Conexão');
        if (statusText) {
            statusText.style.color = '#ef4444';
            statusText.textContent = `Erro: ${err.message}`;
        }
        
        if (resultActions) resultActions.style.display = 'flex';
        if (liveLink) liveLink.style.display = 'none';
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('upload-progress-modal').remove();
            });
        }
    }
}

async function deleteSite(arroba) {
    if (confirm(`ATENÇÃO: Deseja realmente deletar o site ${arroba}?\n\nEsta ação irá apagar o projeto da sua galeria e RETIRÁ-LO DO AR no Cloudflare automaticamente.`)) {
        try {
            try {
                const response = await fetch(`/api/publish?arroba=${encodeURIComponent(arroba)}`, {
                    method: 'DELETE'
                });
                if (response.ok && typeof addScraperLog === 'function') {
                    addScraperLog(`[Exclusão] Site ${arroba} removido do Cloudflare KV e retirado do ar!`, 'info');
                }
            } catch (netErr) {
                console.warn('Não foi possível conectar ao Cloudflare para deletar remoto:', netErr);
            }

            let leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
            leads = leads.filter(l => l.arroba.toLowerCase() !== arroba.toLowerCase());
            localStorage.setItem('painelbio-insta-leads', JSON.stringify(leads));
            window.allSitesData = leads;

            if (typeof showCustomAlert === 'function') {
                showCustomAlert(`Site ${arroba} deletado com sucesso!`, 'success');
            }
            
            const navGallery = document.getElementById('nav-gallery');
            if (navGallery) navGallery.click();
        } catch (e) {
            if (typeof showCustomAlert === 'function') {
                showCustomAlert('Erro ao tentar deletar o site.', 'error');
            }
        }
    }
}

function previewSiteOffline(arroba) {
    let leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
    const siteData = leads.find(l => l.arroba.toLowerCase() === arroba.toLowerCase());
    
    if (siteData) {
        if (typeof generateStaticSite === 'function') {
            const htmlContent = generateStaticSite(siteData);
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        }
    } else {
        if (typeof showCustomAlert === 'function') {
            showCustomAlert('Site não encontrado na memória.', 'error');
        }
    }
}

async function openSiteInfoModal(arroba) {
    let leads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
    const site = leads.find(l => l.arroba.toLowerCase() === arroba.toLowerCase());

    if (!site) {
        if (typeof showCustomAlert === 'function') showCustomAlert('Dados do site não encontrados!', 'error');
        return;
    }

    const oldModal = document.getElementById('site-info-modal');
    if (oldModal) oldModal.remove();

    const cleanSlug = site.arroba.replace('@', '').toLowerCase();
    const currentMonthKey = new Date().toISOString().substring(0, 7);
    const createdDateFormatted = site.createdAt ? new Date(site.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recente';

    const modalHtml = `
        <div id="site-info-modal" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px; box-sizing: border-box; overflow-y: auto;">
            <div style="background: #161b22; border: 1px solid #30363d; border-radius: 20px; width: 100%; max-width: 420px; max-height: 90vh; overflow-y: auto; padding: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.9); color: #fff; font-family: -apple-system, sans-serif; position: relative;">
                
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

                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                    <a href="https://instagram.com/${cleanSlug}" target="_blank" style="flex: 1; background: rgba(225, 48, 108, 0.15); color: #e1306c; border: 1px solid rgba(225, 48, 108, 0.35); text-decoration: none; padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        📸 Instagram
                    </a>
                    <a id="info-whatsapp-direct-btn" href="#" target="_blank" style="flex: 1; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.35); text-decoration: none; padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        💬 WhatsApp
                    </a>
                </div>

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

                <div style="background: #0d1117; border: 1px solid #21262d; border-radius: 12px; padding: 12px; margin-bottom: 16px; font-size: 0.75rem; color: #8b949e; display: flex; flex-direction: column; gap: 4px;">
                    <div><strong>Criado em:</strong> ${createdDateFormatted}</div>
                    <div><strong>Modelo Atual:</strong> ${site.model === 'vitrine' ? 'Vitrine' : 'Classic'} (${site.preset || 'gray'})</div>
                    <div><strong>Status da Hospedagem:</strong> ${site.status === 'published' ? '🟢 Online no Cloudflare' : site.status === 'modified' ? '🔴 Modificado (Requer Upload)' : '🔘 Pendente de Upload'}</div>
                </div>

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

    const whatsappBtn = document.getElementById('info-whatsapp-direct-btn');
    const ownerNameInput = document.getElementById('info-owner-name');
    const ownerPhoneInput = document.getElementById('info-owner-phone');

    let activePhone = site.ownerPhone || '';
    let foundPhone = activePhone;
    if (!activePhone) {
        let foundBtnPhone = '';
        if (site.btn1Url && site.btn1Url.includes('wa.me')) foundBtnPhone = site.btn1Url.replace(/[^0-9]/g, '');
        else if (site.btn2Url && site.btn2Url.includes('wa.me')) foundBtnPhone = site.btn2Url.replace(/[^0-9]/g, '');
        else if (site.btn3Url && site.btn3Url.includes('wa.me')) foundBtnPhone = site.btn3Url.replace(/[^0-9]/g, '');
        
        if (foundBtnPhone) {
            activePhone = foundBtnPhone;
            foundPhone = foundBtnPhone;
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

    loadStats(currentMonthKey);

    const monthSelect = document.getElementById('info-month-select');
    if (monthSelect) {
        monthSelect.addEventListener('change', (e) => {
            loadStats(e.target.value);
        });
    }

    const closeBtn = document.getElementById('close-info-modal-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('site-info-modal').remove();
        });
    }

    const btnEdit = document.getElementById('info-btn-edit');
    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            document.getElementById('site-info-modal').remove();
            if (typeof loadLeadData === 'function') {
                loadLeadData(site);
            }
            if (typeof openDrawer === 'function') {
                openDrawer(document.getElementById('right-drawer'));
            }
        });
    }

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

    const btnSendReport = document.getElementById('info-btn-send-report');
    if (btnSendReport) {
        btnSendReport.addEventListener('click', () => {
            const views = document.getElementById('stat-views-val')?.textContent || '0';
            const clicks = document.getElementById('stat-clicks-val')?.textContent || '0';
            const selectedMonthText = monthSelect ? monthSelect.options[monthSelect.selectedIndex].text : '';

            const reportMsg = `Olá ${site.name || site.arroba}! 👋\n\nSegue o resumo de acessos do seu *PainelBio* em *${selectedMonthText}*:\n\n👁️ *${views}* visitas na sua Bio\n💬 *${clicks}* contatos iniciados!\n\nSeu Link em destaque no ar: ${window.location.origin}/${cleanSlug}`;

            const targetPhone = foundPhone ? foundPhone.replace(/[^0-9]/g, '') : '';
            const waUrl = targetPhone ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(reportMsg)}` : `https://wa.me/?text=${encodeURIComponent(reportMsg)}`;
            
            window.open(waUrl, '_blank');
        });
    }
}

function openLoadSiteModal() {
    const loadSiteOverlay = document.getElementById('load-site-overlay');
    const loadSiteModal = document.getElementById('load-site-modal');
    if (loadSiteOverlay && loadSiteModal) {
        loadSiteOverlay.classList.add('active');
        loadSiteModal.classList.add('active');
        renderLoadSiteList();
    }
}

function closeLoadSiteModal() {
    const loadSiteOverlay = document.getElementById('load-site-overlay');
    const loadSiteModal = document.getElementById('load-site-modal');
    if (loadSiteOverlay && loadSiteModal) {
        loadSiteOverlay.classList.remove('active');
        loadSiteModal.classList.remove('active');
    }
}

function renderLoadSiteList() {
    const loadSiteList = document.getElementById('load-site-list');
    if (!loadSiteList) return;
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
    if (typeof loadTemplatePreview === 'function') {
        loadTemplatePreview(targetModel, siteData);
    }

    const rightDrawer = document.getElementById('right-drawer');
    if (typeof openDrawer === 'function' && rightDrawer) {
        openDrawer(rightDrawer);
    }
    if (typeof showCustomAlert === 'function') {
        showCustomAlert(`Site ${siteData.arroba} carregado com sucesso!`, 'success');
    }
}

// Expor funções globais para chamadas inline no HTML (onclick="...")
window.filterGallery = filterGallery;
window.renderGallery = renderGallery;
window.copySiteUrl = copySiteUrl;
window.startUploadSite = startUploadSite;
window.deleteSite = deleteSite;
window.previewSiteOffline = previewSiteOffline;
window.openSiteInfoModal = openSiteInfoModal;
window.openLoadSiteModal = openLoadSiteModal;
window.closeLoadSiteModal = closeLoadSiteModal;
window.renderLoadSiteList = renderLoadSiteList;
window.loadSiteIntoEditor = loadSiteIntoEditor;
