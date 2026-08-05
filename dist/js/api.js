// --- API MODULE ---

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
            console.log(`[PainelBio Search] ----------------------------------------`);
            console.log(`[PainelBio Search] 🔍 Nova busca iniciada para o perfil: @${cleanArroba}`);

            // Busca via RapidAPI Instagram Scraper (direto do navegador, sem servidor)
            try {
                // 1. VERIFICA SE O PERFIL JÁ ESTÁ NO BANCO DE DADOS LOCAL (CACHE)
                const cachedProfile = getProfileCache(cleanArroba);
                if (cachedProfile) {
                    console.log(`[PainelBio Cache] ⚡ Perfil @${cleanArroba} encontrado no cache local! Carregando sem gastar créditos.`);
                    addScraperLog(`⚡ Perfil @${cleanArroba} carregado do banco de dados local (0 créditos gastando).`, 'success');
                    scrapedRealData = cachedProfile;
                } else {
                    const isMockUser = cleanArroba === 'test' || cleanArroba === 'mock';

                    if (isMockUser) {
                        console.log(`[PainelBio Search] 🧪 Modo Mock Ativo para usuario de teste (@${cleanArroba}). Lendo /mocks/instagram-response.json...`);
                        addScraperLog('Modo Teste Mock Ativo! Lendo dados salvos...', 'info');
                        const response = await fetch('/mocks/instagram-response.json');
                        if (response.ok) {
                            const result = await response.json();
                            scrapedRealData = parseAndLoadScrapedData(result, cleanArroba);
                            console.log('[PainelBio Search] ✅ Dados Mock carregados com sucesso:', scrapedRealData);
                        } else {
                            console.error('[PainelBio Search] ❌ Erro ao carregar o mock de testes local.');
                            addScraperLog('Erro ao carregar o mock de testes local.', 'error');
                        }
                    } else {
                        const keys = getApiKeys();
                        let activeIndex = getActiveKeyIndex();
                        
                        if (activeIndex >= keys.length) {
                            activeIndex = 0;
                            setActiveKeyIndex(0);
                        }
                        
                        const activeKeyItem = keys[activeIndex];
                        const RAPIDAPI_KEY = activeKeyItem ? activeKeyItem.key : '';

                        if (!RAPIDAPI_KEY) {
                            console.error('[PainelBio Search] ❌ Nenhuma chave RapidAPI configurada!');
                            addScraperLog('Nenhuma chave API configurada. Clique na engrenagem ⚙️ para cadastrar uma chave.', 'error');
                            if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge error'; }
                            return;
                        }

                        console.log(`[PainelBio Search] 🔑 Conectando à RapidAPI usando a Chave ${activeIndex + 1} (Final ${RAPIDAPI_KEY.slice(-6)})...`);
                        addScraperLog(`Conectando à RapidAPI usando Chave ${activeIndex + 1}...`, 'info');
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 12000);

                        const apiUrl = `https://instagram-scraper-stable-api.p.rapidapi.com/ig_get_fb_profile_hover.php?username=${encodeURIComponent(cleanArroba)}&username_or_url=${encodeURIComponent(cleanArroba)}`;
                        console.log(`[PainelBio Search] 🌐 URL da API: ${apiUrl}`);

                        const response = await fetch(apiUrl, {
                            method: 'GET',
                            headers: {
                                'x-rapidapi-key': RAPIDAPI_KEY,
                                'x-rapidapi-host': 'instagram-scraper-stable-api.p.rapidapi.com'
                            },
                            signal: controller.signal
                        });
                        clearTimeout(timeoutId);

                        console.log(`[PainelBio Search] 📡 Resposta HTTP da RapidAPI: Status ${response.status} ${response.statusText}`);

                        // Se der limite esgotado (429), tenta a próxima chave
                        if (response.status === 429) {
                            console.warn(`[PainelBio Search] ⚠️ Chave ${activeIndex + 1} esgotada (Erro 429). Tentando rotacionar...`);
                            addScraperLog(`Chave ${activeIndex + 1} esgotada (Erro 429)...`, 'warning');
                            if (activeKeyItem) {
                                activeKeyItem.isBlocked = true;
                                const reset = response.headers.get('x-ratelimit-requests-reset');
                                if (reset) {
                                    activeKeyItem.resetSeconds = parseInt(reset, 10);
                                    activeKeyItem.updatedAt = Date.now();
                                }
                                saveApiKeys(keys);
                                renderApiKeysModal();
                            }

                            // Busca próxima chave que não esteja bloqueada
                            let nextIndex = (activeIndex + 1) % keys.length;
                            let attempts = 0;
                            while (keys[nextIndex].isBlocked && attempts < keys.length) {
                                nextIndex = (nextIndex + 1) % keys.length;
                                attempts++;
                            }

                            if (nextIndex !== activeIndex && !keys[nextIndex].isBlocked) {
                                console.log(`[PainelBio Search] 🔄 Rotacionando para a Chave ${nextIndex + 1}...`);
                                addScraperLog(`Rotacionando automaticamente para a Chave ${nextIndex + 1}...`, 'info');
                                setActiveKeyIndex(nextIndex);
                                return generateInstagramBio(arrobaInput); // Recursão!
                            } else {
                                console.error('[PainelBio Search] ❌ Todas as chaves de API cadastradas estão esgotadas!');
                                addScraperLog('Todas as chaves de API cadastradas estão esgotadas!', 'error');
                                if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge error'; }
                                return;
                            }
                        }

                        if (response.ok) {
                            const result = await response.json();
                            console.log('[PainelBio Search] 🎉 RESULTADO COMPLETO DA RAPIDAPI RECEBIDO:', result);
                            
                            // Atualiza as cotas da chave ativa a partir dos headers
                            const remaining = response.headers.get('x-ratelimit-requests-remaining');
                            const limit = response.headers.get('x-ratelimit-requests-limit');
                            const reset = response.headers.get('x-ratelimit-requests-reset');
                            
                            if (activeKeyItem) {
                                if (remaining !== null) activeKeyItem.remaining = parseInt(remaining, 10);
                                if (limit !== null) activeKeyItem.limit = parseInt(limit, 10);
                                if (reset !== null) {
                                    activeKeyItem.resetSeconds = parseInt(reset, 10);
                                    activeKeyItem.updatedAt = Date.now();
                                }
                                saveApiKeys(keys);
                                renderApiKeysModal();
                            }

                            scrapedRealData = parseAndLoadScrapedData(result);

                            // SE A API PRINCIPAL NÃO TROUXE A BIO OU NÃO TROUXE AS FOTOS, TENTA COMPLEMENTAR COM A API ALTERNATIVA
                            const isBioMissing = !scrapedRealData || !scrapedRealData.bio;
                            const isPhotosMissing = !scrapedRealData || (!scrapedRealData.highlight1Img && !scrapedRealData.highlight2Img && !scrapedRealData.highlight3Img);

                            if (isBioMissing || isPhotosMissing) {
                                console.log('[PainelBio Search] ⚠️ API principal não retornou biografia ou fotos completas. Solicitando complementação da API alternativa...');
                                addScraperLog('Buscando biografia e fotos na API alternativa...', 'info');

                                const bulkData = await fetchFromBulkScraper(cleanArroba, RAPIDAPI_KEY, addScraperLog, scraperBadge);
                                if (bulkData) {
                                    if (!scrapedRealData) {
                                        scrapedRealData = bulkData;
                                    } else {
                                        if (bulkData.bio) scrapedRealData.bio = bulkData.bio;
                                        if (bulkData.name && (!scrapedRealData.name || scrapedRealData.name === cleanArroba)) scrapedRealData.name = bulkData.name;
                                        if (bulkData.avatar && !scrapedRealData.avatar) scrapedRealData.avatar = bulkData.avatar;
                                        if (bulkData.highlight1Img) scrapedRealData.highlight1Img = bulkData.highlight1Img;
                                        if (bulkData.highlight2Img) scrapedRealData.highlight2Img = bulkData.highlight2Img;
                                        if (bulkData.highlight3Img) scrapedRealData.highlight3Img = bulkData.highlight3Img;
                                    }
                                }
                            }

                            console.log('[PainelBio Search] 🌟 Dados extraídos prontos para o preview:', scrapedRealData);
                        } else {
                            const errorText = await response.text();
                            console.error(`[PainelBio Search] ❌ Erro HTTP ${response.status} da RapidAPI primária:`, errorText);
                            addScraperLog(`API principal retornou erro ${response.status}. Tentando API alternativa...`, 'warning');
                            
                            // Tenta a API alternativa (Instagram Public Bulk Scraper)
                            scrapedRealData = await fetchFromBulkScraper(cleanArroba, RAPIDAPI_KEY, addScraperLog, scraperBadge);
                            
                            if (!scrapedRealData) {
                                addScraperLog(`Ambas as APIs falharam para @${cleanArroba}.`, 'error');
                                if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge error'; }
                            }
                        }
                    }

                    // Se conseguiu obter dados reais da API, salva no Banco de Dados Local (Cache)
                    if (scrapedRealData) {
                        saveProfileCache(cleanArroba, scrapedRealData);
                    }
                }
            } catch (err) {
                console.error('[PainelBio Search] 💥 Exceção/Erro na requisição:', err);
                addScraperLog(`Erro de conexão com a API: ${err.message}`, 'error');
                if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge error'; }
            }

            // Se não conseguiu dados reais mas o switch de dados fakes estiver ativado, gera dados fakes completos
            if (!scrapedRealData && isFakeDataEnabled) {
                const capitalized = cleanArroba.charAt(0).toUpperCase() + cleanArroba.slice(1);
                scrapedRealData = {
                    name: `Loja ${capitalized}`,
                    bio: `Peças exclusivas & novidades toda semana. ✨\nEnviamos para todo o Brasil. 🛍️\nAtendimento rápido no WhatsApp!`,
                    avatar: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200',
                    highlight1Img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
                    highlight2Img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
                    highlight3Img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500'
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
                if (scrapedRealData.highlight1Img) generatedData.highlight1Img = scrapedRealData.highlight1Img;
                if (scrapedRealData.highlight2Img) generatedData.highlight2Img = scrapedRealData.highlight2Img;
                if (scrapedRealData.highlight3Img) generatedData.highlight3Img = scrapedRealData.highlight3Img;
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
                // Atualiza o backup global de formulário
                window.tempFormBackup = Object.assign({}, window.tempFormBackup || {}, generatedData);

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

async function fetchFromBulkScraper(username, rapidApiKey, addScraperLog, scraperBadge) {
    const BULK_HOST = 'instagram-public-bulk-scraper.p.rapidapi.com';
    const headers = {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': BULK_HOST,
        'Content-Type': 'application/json'
    };

    try {
        console.log(`[BulkScraper] 🔄 Tentando API alternativa para @${username}...`);
        addScraperLog('Tentando API alternativa (Instagram Bulk Scraper)...', 'info');

        // Chamada 1: User Info (nome, bio, foto)
        const infoController = new AbortController();
        const infoTimeout = setTimeout(() => infoController.abort(), 12000);
        const infoUrl = `https://${BULK_HOST}/v1/user_info?username_or_id=${encodeURIComponent(username)}`;
        console.log(`[BulkScraper] 🌐 URL User Info: ${infoUrl}`);

        const infoResponse = await fetch(infoUrl, { method: 'GET', headers, signal: infoController.signal });
        clearTimeout(infoTimeout);

        console.log(`[BulkScraper] 📡 Status User Info: ${infoResponse.status}`);

        if (!infoResponse.ok) {
            const errText = await infoResponse.text();
            console.error(`[BulkScraper] ❌ Erro na API alternativa (user_info): ${infoResponse.status}`, errText);
            addScraperLog(`API alternativa também falhou: ${infoResponse.status}`, 'error');
            return null;
        }

        const infoResult = await infoResponse.json();
        console.log('[BulkScraper] ✅ User Info recebido:', infoResult);

        const userData = infoResult?.data;
        if (!userData) {
            console.error('[BulkScraper] ❌ Estrutura de dados inválida na resposta de user_info.');
            addScraperLog('API alternativa: resposta inesperada.', 'error');
            return null;
        }

        // Chamada 2: User Posts (3 imagens do feed)
        const postsController = new AbortController();
        const postsTimeout = setTimeout(() => postsController.abort(), 12000);
        const postsUrl = `https://${BULK_HOST}/v2/user_posts?username_or_id=${encodeURIComponent(username)}&count=3`;
        console.log(`[BulkScraper] 🌐 URL Posts: ${postsUrl}`);

        const postsResponse = await fetch(postsUrl, { method: 'GET', headers, signal: postsController.signal });
        clearTimeout(postsTimeout);

        console.log(`[BulkScraper] 📡 Status Posts: ${postsResponse.status}`);

        let highlight1 = '', highlight2 = '', highlight3 = '';
        if (postsResponse.ok) {
            const postsResult = await postsResponse.json();
            const items = postsResult?.data?.items || [];
            console.log(`[BulkScraper] 📸 Posts recebidos: ${items.length}`);

            const getPostImg = (item) => {
                // Tenta a melhor resolução disponível
                return item?.image_versions2?.candidates?.[0]?.url
                    || item?.display_uri
                    || '';
            };

            if (items[0]) highlight1 = getPostImg(items[0]) ? `https://wsrv.nl/?url=${encodeURIComponent(getPostImg(items[0]))}` : '';
            if (items[1]) highlight2 = getPostImg(items[1]) ? `https://wsrv.nl/?url=${encodeURIComponent(getPostImg(items[1]))}` : '';
            if (items[2]) highlight3 = getPostImg(items[2]) ? `https://wsrv.nl/?url=${encodeURIComponent(getPostImg(items[2]))}` : '';
        } else {
            console.warn(`[BulkScraper] ⚠️ Falha ao buscar posts (${postsResponse.status}). Continuando sem imagens.`);
        }

        // Monta o resultado no mesmo formato da API principal
        const avatar = userData.hd_profile_pic_url_info?.url
            ? `https://wsrv.nl/?url=${encodeURIComponent(userData.hd_profile_pic_url_info.url)}`
            : (userData.profile_pic_url ? `https://wsrv.nl/?url=${encodeURIComponent(userData.profile_pic_url)}` : '');

        const parsedData = {
            name: userData.full_name || userData.username || username,
            bio: (userData.biography || '').trim(),
            avatar,
            highlight1Img: highlight1,
            highlight2Img: highlight2,
            highlight3Img: highlight3
        };

        console.log('[BulkScraper] 🌟 Dados da API alternativa prontos:', parsedData);
        addScraperLog(`✅ API alternativa funcionou! Nome: ${parsedData.name}`, 'success');
        if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge success'; }

        return parsedData;

    } catch (err) {
        console.error('[BulkScraper] 💥 Exceção na API alternativa:', err);
        addScraperLog(`Erro na API alternativa: ${err.message}`, 'error');
        return null;
    }
}

function parseAndLoadScrapedData(result) {
    if (result && result.user_data) {
        const userData = result.user_data;
        const userPosts = result.user_posts || [];
        
        let highlight1 = '';
        let highlight2 = '';
        let highlight3 = '';
        
        if (userPosts.length > 0) {
            const posts = [];
            userPosts.forEach(post => {
                let imgUrl = '';
                if (post.node && post.node.media_dict && post.node.media_dict.image_versions2 && post.node.media_dict.image_versions2.candidates) {
                    imgUrl = post.node.media_dict.image_versions2.candidates[0].url;
                } else if (post.node && post.node.image_versions2 && post.node.image_versions2.candidates) {
                    imgUrl = post.node.image_versions2.candidates[0].url;
                } else if (post.node && post.node.display_url) {
                    imgUrl = post.node.display_url;
                }
                if (imgUrl) {
                    posts.push(`https://wsrv.nl/?url=${encodeURIComponent(imgUrl)}`);
                }
            });
            highlight1 = posts[0] || '';
            highlight2 = posts[1] || '';
            highlight3 = posts[2] || '';
        } else {
            addScraperLog('Aviso: Nenhuma imagem encontrada no feed.', 'warning');
        }
        
        // Usa a biografia real retornada pela API. Se vier vazia, deixa em branco (não gera bio fake).
        let finalBio = (userData.biography || '').trim();
        if (finalBio) {
            console.log('[PainelBio Search] ✅ Biografia real retornada pela API:', finalBio);
            addScraperLog('Biografia real carregada com sucesso.', 'success');
        } else {
            console.log('[PainelBio Search] ℹ️ Perfil não possui biografia (bio vazia na API).');
            addScraperLog('Perfil sem biografia.', 'info');
        }
        
        const parsedData = {
            name: userData.full_name || userData.username,
            bio: finalBio,
            avatar: userData.hd_profile_pic_url_info?.url ? `https://wsrv.nl/?url=${encodeURIComponent(userData.hd_profile_pic_url_info.url)}` : (userData.profile_pic_url ? `https://wsrv.nl/?url=${encodeURIComponent(userData.profile_pic_url)}` : ''),
            highlight1Img: highlight1,
            highlight2Img: highlight2,
            highlight3Img: highlight3
        };
        
        addScraperLog(`Sucesso! Nome: ${parsedData.name}`, 'success');
        if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge success'; }
        
        return parsedData;
    } else {
        addScraperLog('Erro: Estrutura de dados inválida retornada.', 'error');
        if (scraperBadge) { scraperBadge.style.display = 'block'; scraperBadge.className = 'notification-badge error'; }
        return null;
    }
}

function getApiKeys() {
    let keys = JSON.parse(localStorage.getItem('painelbio-api-keys'));
    // Se não houver chaves ou se a primeira chave for a antiga bloqueada, atualiza para a nova chave ativa
    if (!keys || !Array.isArray(keys) || keys.length === 0 || keys[0].key === '045b178d42msh8ab87b110533394p1397eajsn3ac55c365582') {
        keys = [
            {
                key: '0e3e97244emsh041247f2ed4cb16p17e6fdjsn9789bef4bce1',
                remaining: null,
                limit: null,
                resetSeconds: null,
                updatedAt: null,
                isBlocked: false
            }
        ];
        localStorage.setItem('painelbio-api-keys', JSON.stringify(keys));
    }
    
    // Auto-desbloqueia chaves cujo tempo de reset já passou
    let changed = false;
    keys.forEach(k => {
        if (k.isBlocked && k.resetSeconds && k.updatedAt) {
            const elapsed = Math.floor((Date.now() - k.updatedAt) / 1000);
            if (elapsed >= k.resetSeconds) {
                console.log('[PainelBio] 🔓 Chave desbloqueada automaticamente (reset expirado).');
                k.isBlocked = false;
                k.remaining = k.limit;
                changed = true;
            }
        }
    });
    if (changed) localStorage.setItem('painelbio-api-keys', JSON.stringify(keys));
    
    return keys;
}

function saveApiKeys(keys) {
    localStorage.setItem('painelbio-api-keys', JSON.stringify(keys));
}

function renderApiKeysModal() {
    const container = document.getElementById('api-keys-list-container');
    if (!container) return;
    
    const keys = getApiKeys();
    const activeIndex = getActiveKeyIndex();
    
    if (keys.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #666; font-size: 0.85rem; padding: 15px; margin: 0;">Nenhuma chave cadastrada ainda.</p>`;
        return;
    }
    
    container.innerHTML = keys.map((item, idx) => {
        const isActive = idx === activeIndex;
        let quotaText = 'Sem uso recente';
        let statusDot = '⚪';
        
        if (item.isBlocked) {
            statusDot = '🔴';
            quotaText = 'Esgotada (429)';
        } else if (item.remaining !== null && item.limit !== null) {
            quotaText = `${item.remaining}/${item.limit} livres`;
            statusDot = item.remaining > 0 ? '🟢' : '🔴';
        }
        
        let resetText = '';
        if (item.resetSeconds && item.updatedAt) {
            const elapsed = Math.floor((Date.now() - item.updatedAt) / 1000);
            const remainingReset = item.resetSeconds - elapsed;
            if (remainingReset > 0) {
                const hours = Math.floor(remainingReset / 3600);
                const mins = Math.floor((remainingReset % 3600) / 60);
                resetText = ` (reseta em ${hours > 0 ? hours + 'h ' : ''}${mins}m)`;
            } else {
                item.isBlocked = false;
                item.remaining = item.limit;
            }
        }
        
        return `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid ${isActive ? '#38bdf8' : 'rgba(255,255,255,0.06)'}; border-radius: 8px; padding: 10px; font-size: 0.8rem;">
                <div style="display: flex; flex-direction: column; gap: 4px; max-width: 65%; overflow: hidden;">
                    <span style="font-family: monospace; color: ${isActive ? '#38bdf8' : '#bbb'}; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; font-size: 0.75rem;">
                        ${isActive ? '★ ' : ''}${item.key.substring(0, 8)}...${item.key.substring(item.key.length - 6)}
                    </span>
                    <span style="color: #888; font-size: 0.75rem;">
                        ${statusDot} ${quotaText}${resetText}
                    </span>
                </div>
                <div style="display: flex; gap: 5px; flex-wrap: wrap; justify-content: flex-end;">
                    ${item.isBlocked ? `<button class="btn-unblock-api-key" data-index="${idx}" style="background: rgba(34,197,94,0.15); border: none; border-radius: 4px; color: #22c55e; padding: 4px 8px; font-size: 0.75rem; cursor: pointer;">🔓 Desbloquear</button>` : ''}
                    ${!isActive ? `<button class="btn-set-active-key" data-index="${idx}" style="background: rgba(56,189,248,0.1); border: none; border-radius: 4px; color: #38bdf8; padding: 4px 8px; font-size: 0.75rem; cursor: pointer;">Usar</button>` : ''}
                    <button class="btn-delete-api-key" data-index="${idx}" style="background: rgba(239,68,68,0.1); border: none; border-radius: 4px; color: #ef4444; padding: 4px 8px; font-size: 0.75rem; cursor: pointer;">Deletar</button>
                </div>
            </div>
        `;
    }).join('');
}

function getActiveKeyIndex() {
    return parseInt(localStorage.getItem('painelbio-active-key-index') || '0', 10);
}

function setActiveKeyIndex(index) {
    localStorage.setItem('painelbio-active-key-index', index.toString());
}

function openApiKeysModal() {
    const overlay = document.getElementById('api-keys-overlay');
    const modal = document.getElementById('api-keys-modal');
    if (overlay && modal) {
        overlay.classList.add('active');
        modal.classList.add('active');
        renderApiKeysModal();
    }
}

function closeApiKeysModal() {
    const overlay = document.getElementById('api-keys-overlay');
    const modal = document.getElementById('api-keys-modal');
    if (overlay && modal) {
        overlay.classList.remove('active');
        modal.classList.remove('active');
    }
}

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

