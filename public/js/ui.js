// --- UI MODULE ---

function openDrawer(drawer) {
            drawer.classList.add('active');
            overlay.classList.add('active');
        }

function closeAll() {
            leftDrawer.classList.remove('active');
            rightDrawer.classList.remove('active');
            overlay.classList.remove('active');
        }

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
                
                // Coleta todos os dados preenchidos atualmente (do DOM ou do backup)
                const currentData = Object.assign({}, window.tempFormBackup || {}, {
                    avatar: document.getElementById('input-avatar')?.value || window.tempFormBackup?.avatar || '',
                    name: document.getElementById('input-name')?.value || window.tempFormBackup?.name || '',
                    arroba: document.getElementById('input-arroba')?.value || window.tempFormBackup?.arroba || '',
                    bio: document.getElementById('input-bio')?.value || window.tempFormBackup?.bio || '',
                    highlight1Img: document.getElementById('input-highlight1-img')?.value || window.tempFormBackup?.highlight1Img || '',
                    highlight1Title: document.getElementById('input-highlight1-title')?.value || window.tempFormBackup?.highlight1Title || '',
                    highlight2Img: document.getElementById('input-highlight2-img')?.value || window.tempFormBackup?.highlight2Img || '',
                    highlight2Title: document.getElementById('input-highlight2-title')?.value || window.tempFormBackup?.highlight2Title || '',
                    highlight3Img: document.getElementById('input-highlight3-img')?.value || window.tempFormBackup?.highlight3Img || '',
                    highlight3Title: document.getElementById('input-highlight3-title')?.value || window.tempFormBackup?.highlight3Title || '',
                    btn1Title: document.getElementById('input-btn1-title')?.value || window.tempFormBackup?.btn1Title || '',
                    btn1Url: document.getElementById('input-btn1-url')?.value || window.tempFormBackup?.btn1Url || '',
                    btn2Title: document.getElementById('input-btn2-title')?.value || window.tempFormBackup?.btn2Title || '',
                    btn2Url: document.getElementById('input-btn2-url')?.value || window.tempFormBackup?.btn2Url || '',
                    btn3Title: document.getElementById('input-btn3-title')?.value || window.tempFormBackup?.btn3Title || '',
                    btn3Url: document.getElementById('input-btn3-url')?.value || window.tempFormBackup?.btn3Url || '',
                    btn4Title: document.getElementById('input-btn4-title')?.value || window.tempFormBackup?.btn4Title || '',
                    btn4Url: document.getElementById('input-btn4-url')?.value || window.tempFormBackup?.btn4Url || ''
                });

                // Atualiza o backup global
                window.tempFormBackup = currentData;

                loadTemplatePreview(templateId, currentData);

                // Abre a gaveta do Inspector automaticamente para o usuário ver os campos!
                if (typeof openDrawer === 'function' && rightDrawer) {
                    openDrawer(rightDrawer);
                }
            }, 350);
        }

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

function openLoadSiteModal() {
            loadSiteOverlay.classList.add('active');
            loadSiteModal.classList.add('active');
            renderLoadSiteList();
        }

function closeLoadSiteModal() {
            loadSiteOverlay.classList.remove('active');
            loadSiteModal.classList.remove('active');
        }

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

