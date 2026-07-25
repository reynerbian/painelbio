// ===============================================================================
// PAINELBIO - ARQUIVO PRINCIPAL (APP.JS ~60-80 LINHAS)
// Inicializa os elementos da interface e vincula os eventos globais
// ===============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Elementos Principais ---
    const leftIcon = document.querySelector('.left-icon');
    const rightIcon = document.querySelector('.right-icon');
    const leftDrawer = document.getElementById('left-drawer');
    const rightDrawer = document.getElementById('right-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const closeBtns = document.querySelectorAll('.drawer-close');

    const navEditor = document.getElementById('nav-editor');
    const navGallery = document.getElementById('nav-gallery');
    const galleryOverlay = document.getElementById('gallery-overlay');
    const topBar = document.querySelector('.top-bar');

    // --- 2. Gavetas e Navegação do Rodapé ---
    if (leftIcon && leftDrawer) leftIcon.addEventListener('click', () => openDrawer(leftDrawer));
    if (rightIcon && rightDrawer) rightIcon.addEventListener('click', () => openDrawer(rightDrawer));
    if (overlay) overlay.addEventListener('click', closeAll);
    closeBtns.forEach(btn => btn.addEventListener('click', closeAll));

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
            if (galleryContent) {
                galleryContent.innerHTML = '<div style="display: flex; justify-content: center; width: 100%;"><div class="loader" style="width: 30px; height: 30px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite;"></div></div>';
            }
            
            try {
                let savedLeads = JSON.parse(localStorage.getItem('painelbio-insta-leads')) || [];
                const sites = savedLeads.map(lead => ({
                    ...lead,
                    previewPath: lead.previewBase64 || null
                }));
                window.allSitesData = sites;
                renderGallery(window.allSitesData);
            } catch (err) {
                if (galleryContent) galleryContent.innerHTML = '<p style="text-align: center; color: #ff6b6b; width: 100%;">Erro ao carregar galeria.</p>';
            }
        });
    }

    // --- 3. Seletor de Cores e Temas ---
    const topActionBtn = document.querySelector('.top-action-btn');
    const colorBalloon = document.getElementById('color-balloon');
    const savedPresetName = localStorage.getItem('selected-theme-preset') || 'gray';
    applyThemePreset(savedPresetName);

    if (topActionBtn) {
        topActionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleColorPicker();
        });
    }

    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const presetName = option.getAttribute('data-preset');
            applyThemePreset(presetName);
        });
    });

    document.addEventListener('click', (e) => {
        if (colorBalloon && colorBalloon.classList.contains('active')) {
            if (!colorBalloon.contains(e.target) && topActionBtn && !topActionBtn.contains(e.target)) {
                colorBalloon.classList.toggle('low-opacity');
            } else {
                colorBalloon.classList.remove('low-opacity');
            }
        }
    });

    // --- 4. Sistema de Favoritos e Ordenação dos Modelos ---
    const templatesGrid = document.querySelector('.templates-grid');
    const templateCards = Array.from(document.querySelectorAll('.template-card'));
    let favorites = JSON.parse(localStorage.getItem('favorite-templates')) || [];

    templateCards.forEach(card => {
        const templateId = card.getAttribute('data-template');
        const star = card.querySelector('.template-star');
        if (star && favorites.includes(templateId)) star.classList.add('is-favorite');
    });

    function sortTemplates() {
        if (!templatesGrid) return;
        const sortedCards = templateCards.sort((a, b) => {
            const aId = a.getAttribute('data-template');
            const bId = b.getAttribute('data-template');
            const aFav = favorites.includes(aId) ? 1 : 0;
            const bFav = favorites.includes(bId) ? 1 : 0;
            return bFav - aFav;
        });
        sortedCards.forEach(card => templatesGrid.appendChild(card));
    }
    sortTemplates();

    templateCards.forEach(card => {
        const star = card.querySelector('.template-star');
        const templateId = card.getAttribute('data-template');
        if (star) {
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                const isFav = star.classList.toggle('is-favorite');
                if (isFav) {
                    if (!favorites.includes(templateId)) favorites.push(templateId);
                } else {
                    favorites = favorites.filter(id => id !== templateId);
                }
                localStorage.setItem('favorite-templates', JSON.stringify(favorites));
                sortTemplates();
            });
        }

        card.addEventListener('click', () => {
            const arrobaInput = document.getElementById('input-arroba');
            const currentArroba = arrobaInput ? arrobaInput.value.trim() : '';

            if (currentArroba && window.loadedFromGallery) {
                if (confirm(`Atenção: O site ${currentArroba} está carregado no gerador.\n\nDeseja SALVAR as alterações antes de iniciar um novo projeto vazio?`)) {
                    const btnSave = document.getElementById('btn-save-inspector');
                    if (btnSave) btnSave.click();
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
                        return;
                    }
                }
            } else {
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
        const searchInsta = document.getElementById('search-insta');
        if (searchInsta) searchInsta.value = '';
        const previewScreen = document.getElementById('phone-preview-screen');
        if (previewScreen) previewScreen.innerHTML = '';
    }

    function processTemplateSelection(card) {
        templateCards.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');

        setTimeout(() => {
            closeAll();
            const templateId = card.getAttribute('data-template');
            const currentData = Object.assign({}, window.tempFormBackup || {}, {
                avatar: document.getElementById('input-avatar')?.value || window.tempFormBackup?.avatar || '',
                name: document.getElementById('input-name')?.value || window.tempFormBackup?.name || '',
                arroba: document.getElementById('input-arroba')?.value || window.tempFormBackup?.arroba || '',
                bio: document.getElementById('input-bio')?.value || window.tempFormBackup?.bio || '',
                btn1Title: document.getElementById('input-btn1-title')?.value || window.tempFormBackup?.btn1Title || '',
                btn1Url: document.getElementById('input-btn1-url')?.value || window.tempFormBackup?.btn1Url || '',
                btn2Title: document.getElementById('input-btn2-title')?.value || window.tempFormBackup?.btn2Title || '',
                btn2Url: document.getElementById('input-btn2-url')?.value || window.tempFormBackup?.btn2Url || '',
                btn3Title: document.getElementById('input-btn3-title')?.value || window.tempFormBackup?.btn3Title || '',
                btn3Url: document.getElementById('input-btn3-url')?.value || window.tempFormBackup?.btn3Url || ''
            });

            window.tempFormBackup = currentData;
            loadTemplatePreview(templateId, currentData);

            if (typeof openDrawer === 'function' && rightDrawer) {
                openDrawer(rightDrawer);
            }
        }, 350);
    }

    // --- 5. Busca do Instagram & Dropdown ---
    const searchInsta = document.getElementById('search-insta');
    const searchDropdown = document.getElementById('search-dropdown');

    function renderDropdown(filterText = '') {
        if (!searchDropdown) return;
        const history = getSearchHistory();
        let items = [];

        if (!filterText.trim()) {
            items = history;
        } else {
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

        if (!filterText.trim() && history.length > 0) {
            dropdownHtml += `
                <div class="dropdown-clear-btn" id="clear-search-history">
                    Limpar Histórico de Pesquisa
                </div>
            `;
        }

        searchDropdown.innerHTML = dropdownHtml;
        searchDropdown.style.display = 'flex';

        const clearBtn = document.getElementById('clear-search-history');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                localStorage.removeItem('painelbio-search-history');
                searchDropdown.style.display = 'none';
            });
        }
    }

    if (searchInsta) {
        searchInsta.addEventListener('focus', () => renderDropdown(searchInsta.value));
        searchInsta.addEventListener('input', () => renderDropdown(searchInsta.value));
        searchInsta.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const val = searchInsta.value.trim();
                if (!val) return;
                searchDropdown.style.display = 'none';
                let cleanQuery = val.toLowerCase();
                if (!cleanQuery.startsWith('@')) cleanQuery = '@' + cleanQuery;

                const leads = getLeads();
                const foundLead = leads.find(l => l.arroba.toLowerCase() === cleanQuery);
                
                if (foundLead) {
                    loadLeadData(foundLead);
                } else {
                    generateInstagramBio(val);
                }
            }
        });
    }

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

    document.addEventListener('click', (e) => {
        const container = document.querySelector('.search-container');
        if (container && !container.contains(e.target)) {
            if (searchDropdown) searchDropdown.style.display = 'none';
        }
    });

    // --- 6. Sininho de Notificações do Scraper ---
    const btnScraperNotifications = document.getElementById('btn-scraper-notifications');
    const scraperNotificationBalloon = document.getElementById('scraper-notification-balloon');
    const btnCloseNotifications = document.getElementById('btn-close-notifications');

    if (btnScraperNotifications && scraperNotificationBalloon) {
        btnScraperNotifications.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = scraperNotificationBalloon.style.display === 'block';
            scraperNotificationBalloon.style.display = isVisible ? 'none' : 'block';
            if (colorBalloon) colorBalloon.style.display = 'none';
        });
    }

    if (btnCloseNotifications && scraperNotificationBalloon) {
        btnCloseNotifications.addEventListener('click', (e) => {
            e.stopPropagation();
            scraperNotificationBalloon.style.display = 'none';
        });
    }

    document.addEventListener('click', (e) => {
        if (scraperNotificationBalloon && !scraperNotificationBalloon.contains(e.target) && e.target !== btnScraperNotifications) {
            scraperNotificationBalloon.style.display = 'none';
        }
    });

    // --- 7. Modal Carregar Site Salvo ---
    const btnLoadSite = document.getElementById('btn-load-site');
    const closeLoadSiteBtn = document.getElementById('close-load-site');
    const loadSiteOverlay = document.getElementById('load-site-overlay');

    if (btnLoadSite) btnLoadSite.addEventListener('click', openLoadSiteModal);
    if (closeLoadSiteBtn) closeLoadSiteBtn.addEventListener('click', closeLoadSiteModal);
    if (loadSiteOverlay) loadSiteOverlay.addEventListener('click', closeLoadSiteModal);
});

// Helper para carregar site no editor a partir dos modais
function loadLeadData(data) {
    const currentTemplate = document.querySelector('.template-card.is-selected');
    const rightDrawer = document.getElementById('right-drawer');

    if (currentTemplate) {
        const templateId = currentTemplate.getAttribute('data-template');
        loadTemplatePreview(templateId, data);
    } else {
        const classicCard = document.querySelector('.template-card[data-template="classic"]');
        if (classicCard) classicCard.classList.add('is-selected');
        loadTemplatePreview('classic', data);
    }

    const topActionBtn = document.querySelector('.top-action-btn');
    if (topActionBtn) topActionBtn.classList.remove('disabled');

    if (typeof openDrawer === 'function' && rightDrawer) {
        openDrawer(rightDrawer);
    }
}
