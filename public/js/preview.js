// --- PREVIEW MODULE ---

function updatePreviewFromForm() {
            const activeModel = window.currentActiveModel || 'classic';
            updateAddonCatalogButtonStates();

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
                const pauseBetweenSec = parseInt(document.getElementById('input-addon-tb-pause-between')?.value || '1', 10);
                const mqSpeed = parseInt(document.getElementById('input-addon-tb-marquee-speed')?.value || '5', 10);
                const mqPause = parseInt(document.getElementById('input-addon-tb-marquee-pause')?.value || '3', 10);

                const texts = [tbText1, tbText2, tbText3].filter(Boolean);

                if (phoneScreen && texts.length > 0) {
                    if (!phoneTopBanner) {
                        phoneTopBanner = document.createElement('div');
                        phoneTopBanner.id = 'phone-live-top-banner';
                        phoneScreen.prepend(phoneTopBanner);
                    }
                    
                    phoneTopBanner.style.cssText = `position: absolute; top: 46px; left: 0; width: 100%; padding: 8px 10px; font-size: 0.72rem; font-weight: 700; text-align: center; z-index: 999; box-shadow: 0 4px 12px rgba(0,0,0,0.5); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.1); box-sizing: border-box; background: ${tbBg}; color: ${tbColor}; transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;`;
                    phoneTopBanner.style.display = 'flex';

                    const currentConfigKey = `${texts.join('|')}_${effect}_${pauseSec}_${pauseBetweenSec}_${mqSpeed}_${mqPause}_${tbBg}_${tbColor}`;
                    if (window.phoneTbConfigKey !== currentConfigKey) {
                        window.phoneTbConfigKey = currentConfigKey;
                        if (window.phoneTbTimers) { window.phoneTbTimers.forEach(clearTimeout); }
                        window.phoneTbTimers = [];
                        if (window.phoneTbIntervals) { window.phoneTbIntervals.forEach(clearInterval); }
                        window.phoneTbIntervals = [];
                        
                        const safeSetTimeout = (fn, ms) => {
                            const id = setTimeout(fn, ms);
                            window.phoneTbTimers.push(id);
                            return id;
                        };
                        const safeSetInterval = (fn, ms) => {
                            const id = setInterval(fn, ms);
                            window.phoneTbIntervals.push(id);
                            return id;
                        };

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
                                safeSetTimeout(() => {
                                    phoneTopBanner.style.transform = 'translateY(0)';
                                    phoneTopBanner.style.opacity = '1';
                                    window.phoneTbTimer1 = safeSetTimeout(() => {
                                        phoneTopBanner.style.transform = 'translateY(-100%)';
                                        phoneTopBanner.style.opacity = '0';
                                        window.phoneTbTimer2 = safeSetTimeout(() => {
                                            window.phoneTbIdx = (window.phoneTbIdx + 1) % window.phoneTbTexts.length;
                                            txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                            runLiveEffectCycle();
                                        }, pauseSec * 1000);
                                    }, pauseBetweenSec * 1000);
                                }, 100);
                            } else if (effect === 'fade') {
                                txtEl.style.transition = 'opacity 0.3s';
                                if (texts.length > 1) {
                                    window.phoneTbInterval = safeSetTimeout(() => {
                                        txtEl.style.opacity = '0';
                                        safeSetTimeout(() => {
                                            window.phoneTbIdx = (window.phoneTbIdx + 1) % window.phoneTbTexts.length;
                                            txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                            txtEl.style.opacity = '1';
                                            runLiveEffectCycle();
                                        }, 300);
                                    }, pauseBetweenSec * 1000);
                                }
                            } else if (effect === 'marquee') {
                                txtEl.style.whiteSpace = 'nowrap';
                                txtEl.innerHTML = window.phoneTbTexts.join(' &nbsp;&nbsp;&nbsp;⭐&nbsp;&nbsp;&nbsp; ');
                                
                                phoneTopBanner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                                phoneTopBanner.style.height = '0px';
                                phoneTopBanner.style.padding = '0px';
                                phoneTopBanner.style.overflow = 'hidden';
                                
                                safeSetTimeout(() => {
                                    phoneTopBanner.style.height = 'auto';
                                    phoneTopBanner.style.padding = '8px 10px';
                                    
                                    let pos = 100;
                                    txtEl.style.transform = 'translateX(100%)';
                                    
                                    const step = mqSpeed * 0.4; 
                                    window.phoneTbInterval = safeSetInterval(() => {
                                        pos -= step;
                                        txtEl.style.transform = 'translateX(' + pos + '%)';
                                        if (pos < -150) {
                                            clearInterval(window.phoneTbInterval);
                                            phoneTopBanner.style.height = '0px';
                                            phoneTopBanner.style.padding = '0px';
                                            safeSetTimeout(() => {
                                                runLiveEffectCycle();
                                            }, mqPause * 1000);
                                        }
                                    }, 20);
                                }, 500);
                            } else if (effect === 'bounce') {
                                phoneTopBanner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                                txtEl.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s';
                                
                                phoneTopBanner.style.height = '0px';
                                phoneTopBanner.style.padding = '0px';
                                
                                safeSetTimeout(() => {
                                    phoneTopBanner.style.height = 'auto';
                                    phoneTopBanner.style.padding = '8px 10px';
                                    txtEl.style.transform = 'scale(1)';
                                    
                                    let currentIdx = 0;
                                    function playNext() {
                                        if (currentIdx >= texts.length - 1) {
                                            safeSetTimeout(() => {
                                                phoneTopBanner.style.height = '0px';
                                                phoneTopBanner.style.padding = '0px';
                                                safeSetTimeout(() => { runLiveEffectCycle(); }, pauseSec * 1000);
                                            }, pauseBetweenSec * 1000);
                                            return;
                                        }
                                        safeSetTimeout(() => {
                                            txtEl.style.transform = 'scale(0)';
                                            setTimeout(() => {
                                                currentIdx++;
                                                window.phoneTbIdx = currentIdx;
                                                txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                                txtEl.style.transform = 'scale(1)';
                                                playNext();
                                            }, 500);
                                        }, pauseBetweenSec * 1000);
                                    }
                                    playNext();
                                }, 100);
                            } else if (effect === 'flip') {
                                phoneTopBanner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                                txtEl.style.transition = 'transform 0.4s ease-in, opacity 0.3s';
                                
                                phoneTopBanner.style.height = '0px';
                                phoneTopBanner.style.padding = '0px';
                                
                                setTimeout(() => {
                                    phoneTopBanner.style.height = 'auto';
                                    phoneTopBanner.style.padding = '8px 10px';
                                    txtEl.style.transform = 'rotateX(0deg)';
                                    
                                    let currentIdx = 0;
                                    function playNext() {
                                        if (currentIdx >= texts.length - 1) {
                                            setTimeout(() => {
                                                phoneTopBanner.style.height = '0px';
                                                phoneTopBanner.style.padding = '0px';
                                                setTimeout(() => { runLiveEffectCycle(); }, pauseSec * 1000);
                                            }, pauseBetweenSec * 1000);
                                            return;
                                        }
                                        setTimeout(() => {
                                            txtEl.style.transform = 'rotateX(90deg)';
                                            setTimeout(() => {
                                                currentIdx++;
                                                window.phoneTbIdx = currentIdx;
                                                txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                                txtEl.style.transform = 'rotateX(0deg)';
                                                playNext();
                                            }, 400);
                                        }, pauseBetweenSec * 1000);
                                    }
                                    playNext();
                                }, 100);
                            } else if (effect === 'shutter') {
                                phoneTopBanner.style.transition = 'height 0.4s ease-in-out, padding 0.4s ease-in-out';
                                
                                phoneTopBanner.style.height = '0px';
                                phoneTopBanner.style.padding = '0px';
                                
                                setTimeout(() => {
                                    phoneTopBanner.style.height = 'auto';
                                    phoneTopBanner.style.padding = '8px 10px';
                                    
                                    let currentIdx = 0;
                                    function playNext() {
                                        if (currentIdx >= texts.length - 1) {
                                            setTimeout(() => {
                                                phoneTopBanner.style.height = '0px';
                                                phoneTopBanner.style.padding = '0px';
                                                setTimeout(() => { runLiveEffectCycle(); }, pauseSec * 1000);
                                            }, pauseBetweenSec * 1000);
                                            return;
                                        }
                                        setTimeout(() => {
                                            phoneTopBanner.style.height = '0px';
                                            phoneTopBanner.style.padding = '0px';
                                            setTimeout(() => {
                                                currentIdx++;
                                                window.phoneTbIdx = currentIdx;
                                                txtEl.textContent = window.phoneTbTexts[window.phoneTbIdx];
                                                phoneTopBanner.style.height = 'auto';
                                                phoneTopBanner.style.padding = '8px 10px';
                                                playNext();
                                            }, 400);
                                        }, pauseBetweenSec * 1000);
                                    }
                                    playNext();
                                }, 100);
                            }
                        }
                        
                        runLiveEffectCycle();
                    }
                } else if (phoneTopBanner) {
                    phoneTopBanner.style.display = 'none';
                    if (window.phoneTbTimers) { window.phoneTbTimers.forEach(clearTimeout); }
                        window.phoneTbTimers = [];
                        if (window.phoneTbInterval) clearInterval(window.phoneTbInterval);
                        const safeSetTimeout = (fn, ms) => {
                            const id = setTimeout(fn, ms);
                            window.phoneTbTimers.push(id);
                            return id;
                        };
                }
            } else if (phoneTopBanner) {
                phoneTopBanner.style.display = 'none';
                if (window.phoneTbTimers) { window.phoneTbTimers.forEach(clearTimeout); }
                        window.phoneTbTimers = [];
                        if (window.phoneTbInterval) clearInterval(window.phoneTbInterval);
                        const safeSetTimeout = (fn, ms) => {
                            const id = setTimeout(fn, ms);
                            window.phoneTbTimers.push(id);
                            return id;
                        };
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

                    let targetContainer = phoneScreen.querySelector('.v-live-page') || phoneScreen.querySelector('.preview-bio-page') || phoneScreen;
                    
                    if (!phoneEmojiRain || phoneEmojiRain.parentNode !== targetContainer) {
                        if (phoneEmojiRain && phoneEmojiRain.parentNode) {
                            phoneEmojiRain.parentNode.removeChild(phoneEmojiRain);
                        }
                        phoneEmojiRain = document.createElement('div');
                        phoneEmojiRain.id = 'phone-live-emoji-rain';
                        targetContainer.prepend(phoneEmojiRain);
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
                    styleEl.textContent = `
                        @keyframes pb-emojifall    { 0%{top:-80px;opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{top:100%;opacity:0} }
                        @keyframes pb-emojifall-cw { 0%{top:-80px;transform:rotate(0deg);opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{top:100%;transform:rotate(540deg);opacity:0} }
                        @keyframes pb-emojifall-ccw{ 0%{top:-80px;transform:rotate(0deg);opacity:0} 10%{opacity:.38} 90%{opacity:.38} 100%{top:100%;transform:rotate(-540deg);opacity:0} }
                    `;

                    const count = Math.min(Math.max(erCount, 1), 20);
                    const emojiArray = Array.from(erEmoji);
                    for (let i = 0; i < count; i++) {
                        const span = document.createElement('span');
                        const emoji = emojiArray[i % emojiArray.length] || '🌸';
                        const size = (1.2 + Math.random() * 1.2).toFixed(2);
                        const left = (Math.random() * 90).toFixed(1);
                        const duration = (baseDuration * (0.7 + Math.random() * 0.7)).toFixed(2);
                        const delay = -(Math.random() * baseDuration * 2).toFixed(2);
                        let animName = 'pb-emojifall';
                        if (erRotate) {
                            animName = Math.random() > 0.5 ? 'pb-emojifall-cw' : 'pb-emojifall-ccw';
                        }
                        span.textContent = emoji;
                        span.style.cssText = `position:absolute;top:0;left:${left}%;font-size:${size}rem;filter:blur(2px);pointer-events:none;animation:${animName} ${duration}s linear ${delay}s infinite;`;
                        phoneEmojiRain.appendChild(span);
                    }
                }
            } else if (phoneEmojiRain) {
                phoneEmojiRain.style.display = 'none';
                window.phoneErConfigKey = null;
            }

            // =========================================================================
            // ADD-ON 3: RODOPIO DO AVATAR (Giro 3D desacelerando ao abrir o site)
            // =========================================================================
            const cardAvatarSpinCheck = document.getElementById('card-addon-avatarspin');
            const isAvatarSpinActive = cardAvatarSpinCheck && cardAvatarSpinCheck.style.display !== 'none';

            if (isAvatarSpinActive) {
                const asDuration = parseFloat(document.getElementById('input-addon-as-duration')?.value || '3');
                const asSpins   = parseInt(document.getElementById('input-addon-as-spins')?.value || '4', 10);
                const asRepeat  = document.getElementById('input-addon-as-repeat')?.checked || false;
                const asInterval = parseInt(document.getElementById('input-addon-as-interval')?.value || '5', 10);
                const configKey  = `${asDuration}_${asSpins}_${asRepeat}_${asInterval}`;

                if (window.phoneAsConfigKey !== configKey) {
                    window.phoneAsConfigKey = configKey;
                    if (window.phoneAsRepeatTimer) { clearInterval(window.phoneAsRepeatTimer); window.phoneAsRepeatTimer = null; }
                    applyAvatarSpinAnimation(asDuration, asSpins, activeModel);
                    if (asRepeat) {
                        window.phoneAsRepeatTimer = setInterval(() => {
                            applyAvatarSpinAnimation(asDuration, asSpins, activeModel);
                        }, (asDuration + asInterval) * 1000);
                    }
                }
            } else {
                // Remove animação se add-on desativado
                removeAvatarSpinAnimation();
                if (window.phoneAsRepeatTimer) { clearInterval(window.phoneAsRepeatTimer); window.phoneAsRepeatTimer = null; }
                window.phoneAsConfigKey = null;
            }

            // =========================================================================
            // ADD-ON 4: PLAYER DE ÁUDIO FLUTUANTE (Funciona em TODOS os modelos)
            // =========================================================================
            const cardAudioPlayer = document.getElementById('card-addon-audioplayer');
            const isAudioPlayerActive = cardAudioPlayer && cardAudioPlayer.style.display !== 'none';
            let phoneAudioPlayer = document.getElementById('phone-live-audio-player');

            if (isAudioPlayerActive) {
                const apUrl = document.getElementById('input-addon-ap-url')?.value.trim() || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3';
                const apLabel = document.getElementById('input-addon-ap-label')?.value.trim() || 'Música da Loja';
                const apPosition = document.getElementById('select-addon-ap-position')?.value || 'bottom-right';
                const apColor = document.getElementById('input-addon-ap-color')?.value || '#ec4899';
                const apWaveColor = document.getElementById('input-addon-ap-wave-color')?.value || '#ffffff';

                if (phoneScreen) {
                    if (!phoneAudioPlayer) {
                        phoneAudioPlayer = document.createElement('div');
                        phoneAudioPlayer.id = 'phone-live-audio-player';
                        phoneScreen.appendChild(phoneAudioPlayer);
                    }

                    let posCss = 'bottom: 16px; right: 16px;';
                    if (apPosition === 'bottom-left') posCss = 'bottom: 16px; left: 16px;';
                    if (apPosition === 'top-right') posCss = 'top: 60px; right: 16px;';

                    const existingAudio = document.getElementById('phone-audio-el');
                    const isPlaying = existingAudio && !existingAudio.paused;

                    phoneAudioPlayer.style.cssText = `position: absolute; ${posCss} z-index: 999; display: flex; align-items: center; gap: 9px; background: linear-gradient(135deg, rgba(15, 23, 42, 0.88), rgba(30, 41, 59, 0.92)); color: #ffffff; padding: 6px 14px 6px 7px; border-radius: 40px; font-size: 0.74rem; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; border: 1px solid rgba(255, 255, 255, 0.18); border-top: 1px solid rgba(255, 255, 255, 0.35); box-shadow: 0 10px 30px rgba(0,0,0,0.55), 0 0 18px ${apColor}44; cursor: pointer; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); user-select: none; opacity: ${isPlaying ? '1' : '0.88'};`;

                    phoneAudioPlayer.innerHTML = `
                        <div class="ap-icon-circle" style="width: 26px; height: 26px; border-radius: 50%; background: ${apColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 0 12px ${apColor}bb; transition: transform 0.2s;">
                            <svg class="ap-icon-play" width="10" height="10" viewBox="0 0 24 24" fill="#ffffff" style="margin-left: 2px; display: ${isPlaying ? 'none' : 'block'};">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <svg class="ap-icon-pause" width="10" height="10" viewBox="0 0 24 24" fill="#ffffff" style="display: ${isPlaying ? 'block' : 'none'};">
                                <rect x="5" y="3" width="4" height="18" rx="1"></rect>
                                <rect x="15" y="3" width="4" height="18" rx="1"></rect>
                            </svg>
                        </div>
                        <div class="ap-wave-bars" style="display: flex; align-items: flex-end; gap: 2px; height: 11px;">
                            <span class="ap-wbar" style="width: 2.5px; height: 100%; background: ${apWaveColor}; border-radius: 2px; animation: ${isPlaying ? 'apWave 0.75s ease-in-out infinite alternate' : 'none'}; opacity: 0.9;"></span>
                            <span class="ap-wbar" style="width: 2.5px; height: 60%; background: ${apWaveColor}; border-radius: 2px; animation: ${isPlaying ? 'apWave 0.75s ease-in-out infinite 0.18s alternate' : 'none'}; opacity: 0.9;"></span>
                            <span class="ap-wbar" style="width: 2.5px; height: 85%; background: ${apWaveColor}; border-radius: 2px; animation: ${isPlaying ? 'apWave 0.75s ease-in-out infinite 0.36s alternate' : 'none'}; opacity: 0.9;"></span>
                            <span class="ap-wbar" style="width: 2.5px; height: 45%; background: ${apWaveColor}; border-radius: 2px; animation: ${isPlaying ? 'apWave 0.75s ease-in-out infinite 0.54s alternate' : 'none'}; opacity: 0.9;"></span>
                        </div>
                        <span style="letter-spacing: 0.3px; max-width: 105px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${apLabel}</span>
                        <audio id="phone-audio-el" src="${apUrl}" loop></audio>
                    `;
                    phoneAudioPlayer.style.display = 'flex';

                    let waveStyle = document.getElementById('phone-ap-wave-style');
                    if (!waveStyle) {
                        waveStyle = document.createElement('style');
                        waveStyle.id = 'phone-ap-wave-style';
                        waveStyle.textContent = `@keyframes apWave { 0% { height: 25%; } 100% { height: 100%; } }`;
                        document.head.appendChild(waveStyle);
                    }

                    // Toggle play/pause ao clicar no player do mockup
                    phoneAudioPlayer.onclick = (e) => {
                        e.stopPropagation();
                        const audioEl = document.getElementById('phone-audio-el');
                        const playIcon = phoneAudioPlayer.querySelector('.ap-icon-play');
                        const pauseIcon = phoneAudioPlayer.querySelector('.ap-icon-pause');
                        const wbars = phoneAudioPlayer.querySelectorAll('.ap-wbar');

                        if (audioEl) {
                            if (audioEl.paused) {
                                audioEl.play().then(() => {
                                    if (playIcon) playIcon.style.display = 'none';
                                    if (pauseIcon) pauseIcon.style.display = 'block';
                                    phoneAudioPlayer.style.opacity = '1';
                                    phoneAudioPlayer.style.boxShadow = `0 10px 30px rgba(0,0,0,0.65), 0 0 22px ${apColor}77`;
                                    wbars.forEach((bar, idx) => {
                                        bar.style.animation = `apWave 0.75s ease-in-out infinite ${idx * 0.18}s alternate`;
                                    });
                                }).catch(() => {});
                            } else {
                                audioEl.pause();
                                if (playIcon) playIcon.style.display = 'block';
                                if (pauseIcon) pauseIcon.style.display = 'none';
                                phoneAudioPlayer.style.opacity = '0.85';
                                phoneAudioPlayer.style.boxShadow = `0 6px 20px rgba(0,0,0,0.45), 0 0 12px ${apColor}33`;
                                wbars.forEach(bar => {
                                    bar.style.animation = 'none';
                                });
                            }
                        }
                    };
                }
            } else if (phoneAudioPlayer) {
                phoneAudioPlayer.style.display = 'none';
            }

            // =========================================================================
            // ADD-ON 5: BALÃO DE ATENDIMENTO "ONLINE AGORA" (PREVIEW)
            // =========================================================================
            const cardLivechatCheck = document.getElementById('card-addon-livechat');
            const isLiveChatActive = cardLivechatCheck && cardLivechatCheck.style.display !== 'none';
            let phoneLiveChat = document.getElementById('phone-live-chat-addon');

            if (isLiveChatActive) {
                const lcAvatar = document.getElementById('input-addon-lc-avatar')?.value.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
                const lcName = document.getElementById('input-addon-lc-name')?.value.trim() || 'Suporte Amanda';
                const lcStatusText = document.getElementById('input-addon-lc-status')?.value.trim() || 'Online Agora';
                const lcPosition = document.getElementById('select-addon-lc-position')?.value || 'bottom-left';
                const lcColor = document.getElementById('input-addon-lc-color')?.value || '#22c55e';
                const lcMessage = document.getElementById('input-addon-lc-message')?.value.trim() || 'Dúvidas sobre produtos? Fale comigo no WhatsApp! 💬';

                // Usamos phoneScreen diretamente para que fique fixo em relação à borda do celular, independentemente do scroll
                let targetContainer = phoneScreen;

                if (!phoneLiveChat || phoneLiveChat.parentNode !== targetContainer) {
                    if (phoneLiveChat && phoneLiveChat.parentNode) {
                        phoneLiveChat.parentNode.removeChild(phoneLiveChat);
                    }
                    phoneLiveChat = document.createElement('a');
                    phoneLiveChat.id = 'phone-live-chat-addon';
                    phoneLiveChat.href = '#';
                    targetContainer.appendChild(phoneLiveChat);
                } else {
                    phoneLiveChat.style.display = 'flex';
                }

                let posCss = 'bottom: 20px; left: 20px;';
                if (lcPosition === 'bottom-right') posCss = 'bottom: 20px; right: 20px;';

                phoneLiveChat.style.cssText = `position: absolute; ${posCss} z-index: 99998; display: flex; align-items: center; gap: 10px; background: rgba(15, 23, 42, 0.9); color: #ffffff; padding: 8px 14px 8px 10px; border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.18); box-shadow: 0 12px 30px rgba(0,0,0,0.6), 0 0 20px ${lcColor}33; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); text-decoration: none; max-width: 310px; animation: lcPop 0.6s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;`;
                
                phoneLiveChat.innerHTML = `
                    <div style="position: relative; width: 42px; height: 42px; flex-shrink: 0;">
                        <img src="${lcAvatar}" alt="${lcName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid ${lcColor};">
                        <span style="position: absolute; bottom: 0; right: 0; width: 11px; height: 11px; background: ${lcColor}; border-radius: 50%; border: 2px solid #0f172a; animation: lcPulse 2s infinite;"></span>
                    </div>
                    <div style="display: flex; flex-direction: column; overflow: hidden;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="font-size: 0.78rem; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lcName}</span>
                            <span style="font-size: 0.65rem; font-weight: 600; color: ${lcColor}; background: ${lcColor}22; padding: 1px 6px; border-radius: 10px; white-space: nowrap;">${lcStatusText}</span>
                        </div>
                        <span style="font-size: 0.72rem; color: #94a3b8; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lcMessage}</span>
                    </div>
                `;

                let lcStyle = document.getElementById('phone-lc-style');
                if (!lcStyle) {
                    lcStyle = document.createElement('style');
                    lcStyle.id = 'phone-lc-style';
                    document.head.appendChild(lcStyle);
                }
                lcStyle.textContent = `
                    @keyframes lcPulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 ${lcColor}aa; } 70% { transform: scale(1); box-shadow: 0 0 0 8px ${lcColor}00; } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 ${lcColor}00; } }
                    @keyframes lcPop { 0% { transform: scale(0.8) translateY(20px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
                `;

            } else if (phoneLiveChat) {
                phoneLiveChat.style.display = 'none';
            }



            // =========================================================================
            // MODELO: CARROSSEL STORIES (3 Fotos Tela Cheia com Progresso no Topo)
            // =========================================================================
            if (activeModel === 'carousel') {
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

                const img1 = document.getElementById('c-view-img1');
                const img2 = document.getElementById('c-view-img2');
                const img3 = document.getElementById('c-view-img3');
                
                const storiesProgress = document.getElementById('c-view-stories-progress');
                const avatarWrapper = document.getElementById('c-view-avatar-wrapper');
                const avatarInner = document.getElementById('c-view-avatar-inner');
                const profileCard = document.getElementById('c-view-profile-card');
                const viewName = document.getElementById('c-view-name');
                const viewArroba = document.getElementById('c-view-arroba');
                const viewBio = document.getElementById('c-view-bio');
                const viewButtons = document.getElementById('c-view-buttons');

                const c1Url = document.getElementById('input-carousel1-img')?.value.trim() || '';
                const c2Url = document.getElementById('input-carousel2-img')?.value.trim() || '';
                const c3Url = document.getElementById('input-carousel3-img')?.value.trim() || '';

                const fakeToggle = document.getElementById('fake-data-toggle');
                const isFakeOn = fakeToggle && fakeToggle.checked;

                const fallbackImg1 = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000';
                const fallbackImg2 = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000';
                const fallbackImg3 = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1000';

                if (fakeToggle && fakeToggle.checked) {
                    const c1Input = document.getElementById('input-carousel1-img');
                    const c2Input = document.getElementById('input-carousel2-img');
                    const c3Input = document.getElementById('input-carousel3-img');
                    if (c1Input && !c1Input.value) c1Input.value = fallbackImg1;
                    if (c2Input && !c2Input.value) c2Input.value = fallbackImg2;
                    if (c3Input && !c3Input.value) c3Input.value = fallbackImg3;
                }

                // Fotos de Fundo
                let finalImg1 = c1Url || (c1ImgInput ? c1ImgInput.value : '');
                let finalImg2 = c2Url || (c2ImgInput ? c2ImgInput.value : '');
                let finalImg3 = c3Url || (c3ImgInput ? c3ImgInput.value : '');
                if (!finalImg1 && !finalImg2 && !finalImg3 && isFakeOn) {
                    finalImg1 = fallbackImg1;
                    finalImg2 = fallbackImg2;
                    finalImg3 = fallbackImg3;
                }

                const hasPhotos = Boolean(finalImg1 || finalImg2 || finalImg3);
                if (storiesProgress) {
                    storiesProgress.style.display = hasPhotos ? 'flex' : 'none';
                }

                if (img1) img1.src = finalImg1 || '';
                if (img2) img2.src = finalImg2 || '';
                if (img3) img3.src = finalImg3 || '';

                const configKey = `${finalImg1}_${finalImg2}_${finalImg3}_${themeBorderColor}`;
                if (window.carouselConfigKey !== configKey) {
                    window.carouselConfigKey = configKey;
                    if (window.carouselTimer) clearInterval(window.carouselTimer);
                    
                    if (hasPhotos) {
                        window.carouselSlideIdx = 0;
                        window.carouselIsPaused = false;

                        const slides = [
                            document.getElementById('c-slide-1'),
                            document.getElementById('c-slide-2'),
                            document.getElementById('c-slide-3')
                        ];
                        const progs = [
                            document.getElementById('c-prog-1'),
                            document.getElementById('c-prog-2'),
                            document.getElementById('c-prog-3')
                        ];

                        function showSlide(idx) {
                            slides.forEach((s, i) => {
                                if (s) s.style.opacity = (i === idx) ? '1' : '0';
                            });
                            progs.forEach((p, i) => {
                                if (p) {
                                    p.style.width = (i <= idx) ? '100%' : '0%';
                                    p.style.background = themeBorderColor;
                                }
                            });
                        }

                        showSlide(0);

                        function nextSlide() {
                            if (window.carouselIsPaused) return;
                            window.carouselSlideIdx = (window.carouselSlideIdx + 1) % 3;
                            showSlide(window.carouselSlideIdx);
                        }

                        window.carouselTimer = setInterval(nextSlide, 4000);

                        // Pressionar e segurar para pausar no preview
                        const sliderContainer = document.getElementById('c-view-slider');
                        if (sliderContainer && !sliderContainer.dataset.holdEventsBound) {
                            sliderContainer.dataset.holdEventsBound = 'true';
                            
                            const pause = () => { window.carouselIsPaused = true; };
                            const resume = () => { window.carouselIsPaused = false; };

                            sliderContainer.addEventListener('mousedown', pause);
                            sliderContainer.addEventListener('mouseup', resume);
                            sliderContainer.addEventListener('mouseleave', resume);
                            sliderContainer.addEventListener('touchstart', pause, { passive: true });
                            sliderContainer.addEventListener('touchend', resume);
                            sliderContainer.addEventListener('touchcancel', resume);
                        }
                    }
                }

                const avatarUrl = document.getElementById('input-avatar')?.value.trim() || '';
                const name = document.getElementById('input-name')?.value.trim() || '';
                const arroba = document.getElementById('input-arroba')?.value.trim() || '';
                const bio = document.getElementById('input-bio')?.value.trim() || '';

                // Ocultar bolinha do avatar se não houver foto
                if (avatarWrapper && avatarInner) {
                    if (avatarUrl) {
                        avatarWrapper.style.display = 'flex';
                        avatarWrapper.style.background = `linear-gradient(135deg, ${themeBorderColor}, #ec4899)`;
                        avatarInner.innerHTML = `<img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    } else {
                        avatarWrapper.style.display = 'none';
                        avatarInner.innerHTML = '';
                    }
                }

                // Ocultar balão de perfil se nome, @ e bio estiverem todos vazios
                const hasProfileText = Boolean(name || arroba || bio);
                if (profileCard) {
                    profileCard.style.display = hasProfileText ? 'block' : 'none';
                }

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
                    viewBio.style.textAlign = activeAlignBtn ? activeAlignBtn.getAttribute('data-align') : 'left';
                }

                const btn1Title = document.getElementById('input-btn1-title')?.value.trim() || '';
                const btn1Url = document.getElementById('input-btn1-url')?.value.trim() || '';
                const btn2Title = document.getElementById('input-btn2-title')?.value.trim() || '';
                const btn2Url = document.getElementById('input-btn2-url')?.value.trim() || '';

                let btnsHtml = '';
                const createCBtn = (title, url) => `
                    <div style="flex: 1; background: rgba(15, 23, 42, 0.78); color: #ffffff; border: 1.5px solid ${themeBorderColor}; padding: 13px 10px; border-radius: 14px; font-weight: 700; font-size: 0.82rem; text-align: center; box-shadow: 0 8px 20px rgba(0,0,0,0.5), 0 0 12px ${themeBorderColor}33; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: pointer; transition: transform 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" onclick="${url ? `window.open('${url}', '_blank')` : ''}">
                        ${title}
                    </div>
                `;

                if (btn1Title) btnsHtml += createCBtn(btn1Title, btn1Url);
                if (btn2Title) btnsHtml += createCBtn(btn2Title, btn2Url);

                if (viewButtons) {
                    viewButtons.style.display = (btn1Title || btn2Title) ? 'flex' : 'none';
                    viewButtons.innerHTML = btnsHtml;
                }
                return;
            }

            
            // =========================================================================
            // MODELO: SHOP (Catálogo de Produtos em Carrossel)
            // =========================================================================
            if (activeModel === 'shop') {
                const avatarWrapper = document.getElementById('s-view-avatar-wrapper');
                const avatarInner = document.getElementById('s-view-avatar-inner');
                const viewName = document.getElementById('s-view-name');
                const viewArroba = document.getElementById('s-view-arroba');
                const viewBio = document.getElementById('s-view-bio');
                
                const p1Card = document.getElementById('s-view-p1-card');
                const p1Img = document.getElementById('s-view-p1-img');
                const p1Title = document.getElementById('s-view-p1-title');
                const p1Price = document.getElementById('s-view-p1-price');
                const p1Btn = document.getElementById('s-view-p1-btn');
                
                const p2Card = document.getElementById('s-view-p2-card');
                const p2Img = document.getElementById('s-view-p2-img');
                const p2Title = document.getElementById('s-view-p2-title');
                const p2Price = document.getElementById('s-view-p2-price');
                const p2Btn = document.getElementById('s-view-p2-btn');
                
                const p3Card = document.getElementById('s-view-p3-card');
                const p3Img = document.getElementById('s-view-p3-img');
                const p3Title = document.getElementById('s-view-p3-title');
                const p3Price = document.getElementById('s-view-p3-price');
                const p3Btn = document.getElementById('s-view-p3-btn');

                const catalogBtn = document.getElementById('s-view-catalog-btn');

                if (!viewName) return;

                const avatarUrl = document.getElementById('input-avatar')?.value.trim() || '';
                const name = document.getElementById('input-name')?.value.trim() || '';
                const arroba = document.getElementById('input-arroba')?.value.trim() || '';
                const bio = document.getElementById('input-bio')?.value.trim() || '';

                if (avatarUrl) {
                    avatarWrapper.style.display = 'block';
                    avatarInner.innerHTML = `<img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" />`;
                } else {
                    avatarWrapper.style.display = 'none';
                    avatarInner.innerHTML = '';
                }

                viewName.textContent = name;
                viewName.style.display = name ? 'block' : 'none';

                if (arroba) {
                    const cleanArrobaText = '@' + arroba.replace(/^@+/, '');
                    viewArroba.textContent = cleanArrobaText;
                    viewArroba.href = 'https://instagram.com/' + arroba.replace(/^@+/, '');
                    viewArroba.style.display = 'inline-block';
                } else {
                    viewArroba.style.display = 'none';
                }

                viewBio.textContent = bio;
                viewBio.style.display = bio ? 'block' : 'none';
                
                const activeAlignBtn = document.querySelector('.align-btn.active');
                if (activeAlignBtn) {
                    viewBio.style.textAlign = activeAlignBtn.getAttribute('data-align');
                }

                const p1ImgUrl = document.getElementById('input-shop-p1-img')?.value.trim() || '';
                const p1TitleText = document.getElementById('input-shop-p1-title')?.value.trim() || '';
                const p1PriceText = document.getElementById('input-shop-p1-price')?.value.trim() || '';
                const p1Url = document.getElementById('input-shop-p1-url')?.value.trim() || '';
                if (p1ImgUrl || p1TitleText || p1PriceText) {
                    p1Card.style.display = 'block';
                    p1Img.src = p1ImgUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600';
                    p1Title.textContent = p1TitleText;
                    p1Price.textContent = p1PriceText;
                    p1Btn.href = p1Url || '#';
                } else { p1Card.style.display = 'none'; }

                const p2ImgUrl = document.getElementById('input-shop-p2-img')?.value.trim() || '';
                const p2TitleText = document.getElementById('input-shop-p2-title')?.value.trim() || '';
                const p2PriceText = document.getElementById('input-shop-p2-price')?.value.trim() || '';
                const p2Url = document.getElementById('input-shop-p2-url')?.value.trim() || '';
                if (p2ImgUrl || p2TitleText || p2PriceText) {
                    p2Card.style.display = 'block';
                    p2Img.src = p2ImgUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600';
                    p2Title.textContent = p2TitleText;
                    p2Price.textContent = p2PriceText;
                    p2Btn.href = p2Url || '#';
                } else { p2Card.style.display = 'none'; }

                const p3ImgUrl = document.getElementById('input-shop-p3-img')?.value.trim() || '';
                const p3TitleText = document.getElementById('input-shop-p3-title')?.value.trim() || '';
                const p3PriceText = document.getElementById('input-shop-p3-price')?.value.trim() || '';
                const p3Url = document.getElementById('input-shop-p3-url')?.value.trim() || '';
                if (p3ImgUrl || p3TitleText || p3PriceText) {
                    p3Card.style.display = 'block';
                    p3Img.src = p3ImgUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';
                    p3Title.textContent = p3TitleText;
                    p3Price.textContent = p3PriceText;
                    p3Btn.href = p3Url || '#';
                } else { p3Card.style.display = 'none'; }

                const catUrl = document.getElementById('input-shop-catalog-url')?.value.trim() || '';
                if (catUrl) {
                    catalogBtn.style.display = 'block';
                    catalogBtn.href = catUrl;
                } else { catalogBtn.style.display = 'none'; }

                // ── Fundo desfocado com imagem do produto 1 ──
                const bgEl  = document.getElementById('s-view-bg');
                const bgFade = document.getElementById('s-view-bg-fade');
                const firstImgUrl = document.getElementById('input-shop-p1-img')?.value.trim()
                                 || document.getElementById('input-shop-p2-img')?.value.trim()
                                 || document.getElementById('input-shop-p3-img')?.value.trim()
                                 || '';
                if (bgEl && firstImgUrl) {
                    bgEl.style.backgroundImage = `url('${firstImgUrl}')`;
                    bgEl.style.display = 'block';
                    if (bgFade) bgFade.style.display = 'block';
                } else if (bgEl) {
                    bgEl.style.display = 'none';
                    if (bgFade) bgFade.style.display = 'none';
                }

                // ── Rolagem por notches da rodinha do mouse (Navegação por produtos) ──
                const carousel = document.getElementById('s-view-carousel');
                if (carousel && !carousel._wheelBound) {
                    carousel._wheelBound = true;
                    let isScrolling = false;
                    carousel.addEventListener('wheel', e => {
                        if (e.deltaY !== 0) {
                            const cards = carousel.querySelectorAll('[id*="-card"]');
                            const visibleCards = Array.from(cards).filter(c => c.style.display !== 'none');
                            if (visibleCards.length > 0) {
                                const step = visibleCards[0].offsetWidth + 12;
                                const canScrollRight = carousel.scrollLeft + carousel.clientWidth < carousel.scrollWidth - 10;
                                const canScrollLeft = carousel.scrollLeft > 10;
                                if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
                                    e.preventDefault();
                                    if (!isScrolling) {
                                        isScrolling = true;
                                        carousel.scrollBy({
                                            left: (e.deltaY > 0 ? 1 : -1) * step,
                                            behavior: 'smooth'
                                        });
                                        setTimeout(() => { isScrolling = false; }, 320);
                                    }
                                }
                            }
                        }
                    }, { passive: false });
                }

                return;
            }
            
            // =========================================================================
            // MODELO 5: E-BOOK (Infoproduto com Card Flutuante e Capa 3D)
            // =========================================================================
            if (activeModel === 'ebook') {
                const avatarWrapper = document.getElementById('eb-view-avatar-wrapper');
                const avatarInner = document.getElementById('eb-view-avatar-inner');
                const viewName = document.getElementById('eb-view-name');
                const viewArroba = document.getElementById('eb-view-arroba');
                const viewBio = document.getElementById('eb-view-bio');
                
                const card = document.getElementById('eb-view-card');
                const cover = document.getElementById('eb-view-cover');
                const title = document.getElementById('eb-view-title');
                const desc = document.getElementById('eb-view-desc');
                const buyBtn = document.getElementById('eb-view-buy-btn');
                const viewButtons = document.getElementById('eb-view-buttons');

                const avatarUrl = document.getElementById('input-avatar')?.value.trim() || '';
                const name = document.getElementById('input-name')?.value.trim() || '';
                const arroba = document.getElementById('input-arroba')?.value.trim() || '';
                const bio = document.getElementById('input-bio')?.value.trim() || '';

                const ebCover = document.getElementById('input-ebook-cover')?.value.trim() || '';
                const ebTitle = document.getElementById('input-ebook-title')?.value.trim() || '';
                const ebDesc = document.getElementById('input-ebook-desc')?.value.trim() || '';
                const ebBtnText = document.getElementById('input-ebook-btn-text')?.value.trim() || 'Comprar E-book 🛒';
                const ebBuyUrl = document.getElementById('input-ebook-buy-url')?.value.trim() || '#';

                const btn1Title = document.getElementById('input-btn1-title')?.value.trim() || '';
                const btn1Url = document.getElementById('input-btn1-url')?.value.trim() || '';
                const btn2Title = document.getElementById('input-btn2-title')?.value.trim() || '';
                const btn2Url = document.getElementById('input-btn2-url')?.value.trim() || '';

                // Header Profile
                if (avatarWrapper) {
                    if (avatarUrl) {
                        avatarWrapper.style.display = 'block';
                        if (avatarInner) avatarInner.innerHTML = `<img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" />`;
                    } else {
                        avatarWrapper.style.display = 'none';
                    }
                }
                if (viewName) viewName.textContent = name;
                if (viewArroba) {
                    viewArroba.textContent = arroba ? `@${arroba.replace('@', '')}` : '';
                    viewArroba.href = arroba ? `https://instagram.com/${arroba.replace('@', '')}` : '#';
                }
                if (viewBio) viewBio.textContent = bio;

                // E-book Card
                if (card) {
                    if (ebCover || ebTitle) {
                        card.style.display = 'flex';
                        if (cover) cover.src = ebCover || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="%23222"/>';
                        if (title) title.textContent = ebTitle || 'Título do E-book';
                        if (desc) desc.textContent = ebDesc || 'Descrição do E-book...';
                        if (buyBtn) {
                            buyBtn.textContent = ebBtnText;
                            buyBtn.href = ebBuyUrl;
                        }
                    } else {
                        card.style.display = 'none';
                    }
                }

                // Renderiza os botões extras
                if (viewButtons) {
                    viewButtons.innerHTML = '';
                    const buttons = [
                        { title: btn1Title, url: btn1Url },
                        { title: btn2Title, url: btn2Url }
                    ];

                    buttons.forEach(btn => {
                        if (!btn.title) return;
                        const btnEl = document.createElement('a');
                        btnEl.href = btn.url || '#';
                        btnEl.target = '_blank';
                        btnEl.style.cssText = `width: 100%; height: 46px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff; text-decoration: none; font-weight: 600; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; transition: background 0.2s, transform 0.15s;`;
                        btnEl.textContent = btn.title;
                        
                        btnEl.addEventListener('mouseenter', () => btnEl.style.background = 'rgba(255,255,255,0.12)');
                        btnEl.addEventListener('mouseleave', () => btnEl.style.background = 'rgba(255,255,255,0.06)');
                        btnEl.addEventListener('click', () => {
                            btnEl.style.transform = 'scale(0.97)';
                            setTimeout(() => btnEl.style.transform = 'none', 150);
                        });
                        viewButtons.appendChild(btnEl);
                    });
                }

                return;
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
                    if (avatarWrapper && avatarWrapper.parentNode !== heroGrid) {
                        heroGrid.appendChild(avatarWrapper);
                    }
                    if (avatarWrapper) {
                        avatarWrapper.style.position = 'absolute';
                        avatarWrapper.style.bottom = '-38px';
                        avatarWrapper.style.left = '50%';
                        avatarWrapper.style.transform = 'translateX(-50%)';
                        avatarWrapper.style.margin = '0';
                    }
                } else {
                    heroGrid.style.display = 'none';
                    if (avatarWrapper && avatarWrapper.parentNode !== infoSection) {
                        infoSection.prepend(avatarWrapper);
                    }
                    if (avatarWrapper) {
                        avatarWrapper.style.position = 'relative';
                        avatarWrapper.style.bottom = '0';
                        avatarWrapper.style.left = '0';
                        avatarWrapper.style.transform = 'none';
                        avatarWrapper.style.margin = '0 auto 20px auto';
                    }
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

            if (activeModel === 'carousel') {
                previewScreen.style.background = '#000000';
                
                previewScreen.innerHTML = `
                    <div class="c-live-page" style="position: relative; width: 100%; height: 100%; overflow: hidden; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        
                        <!-- Carrossel de Fotos em Tela Cheia -->
                        <div id="c-view-slider" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
                            <div id="c-slide-1" class="c-slide active" style="position: absolute; inset: 0; opacity: 1; transition: opacity 0.8s ease-in-out;">
                                <img id="c-view-img1" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000'" />
                            </div>
                            <div id="c-slide-2" class="c-slide" style="position: absolute; inset: 0; opacity: 0; transition: opacity 0.8s ease-in-out;">
                                <img id="c-view-img2" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000'" />
                            </div>
                            <div id="c-slide-3" class="c-slide" style="position: absolute; inset: 0; opacity: 0; transition: opacity 0.8s ease-in-out;">
                                <img id="c-view-img3" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1000'" />
                            </div>
                        </div>

                        <!-- Dark Overlay Degradê para contraste de leitura -->
                        <div style="position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 35%, rgba(0,0,0,0.85) 100%); z-index: 2; pointer-events: none;"></div>

                        <!-- Barra de Progresso Estilo Instagram Stories no Topo -->
                        <div id="c-view-stories-progress" style="position: absolute; top: 12px; left: 12px; right: 12px; display: flex; gap: 4px; z-index: 10;">
                            <div class="c-progress-bar" style="flex: 1; height: 3px; background: rgba(255,255,255,0.35); border-radius: 2px; overflow: hidden;">
                                <div id="c-prog-1" style="width: 100%; height: 100%; background: #ffffff; transition: width 0.3s;"></div>
                            </div>
                            <div class="c-progress-bar" style="flex: 1; height: 3px; background: rgba(255,255,255,0.35); border-radius: 2px; overflow: hidden;">
                                <div id="c-prog-2" style="width: 0%; height: 100%; background: #ffffff; transition: width 0.3s;"></div>
                            </div>
                            <div class="c-progress-bar" style="flex: 1; height: 3px; background: rgba(255,255,255,0.35); border-radius: 2px; overflow: hidden;">
                                <div id="c-prog-3" style="width: 0%; height: 100%; background: #ffffff; transition: width 0.3s;"></div>
                            </div>
                        </div>

                        <!-- Perfil no Canto Superior -->
                        <div id="c-view-header" style="position: absolute; top: 26px; left: 14px; right: 14px; display: flex; align-items: flex-start; gap: 10px; z-index: 10;">
                            <!-- Avatar Circular no Canto -->
                            <div id="c-view-avatar-wrapper" style="width: 48px; height: 48px; border-radius: 50%; padding: 2.5px; background: linear-gradient(135deg, #ec4899, #f59e0b, #3b82f6); flex-shrink: 0; box-shadow: 0 4px 14px rgba(0,0,0,0.4); display: none;">
                                <div id="c-view-avatar-inner" style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden; background: #000;"></div>
                            </div>
                            <!-- Handle, Nome e Bio em Card de Vidro Fino -->
                            <div id="c-view-profile-card" style="flex: 1; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 14px; padding: 10px 12px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 8px 24px rgba(0,0,0,0.5); display: none;">
                                <h1 id="c-view-name" style="font-size: 0.92rem; font-weight: 700; color: #ffffff; margin: 0 0 2px 0;"></h1>
                                <a id="c-view-arroba" href="#" target="_blank" style="font-size: 0.76rem; color: #ec4899; text-decoration: none; font-weight: 600; margin-bottom: 4px; display: inline-block;"></a>
                                <p id="c-view-bio" style="font-size: 0.75rem; color: rgba(255,255,255,0.85); line-height: 1.35; margin: 0; white-space: pre-wrap;"></p>
                            </div>
                        </div>

                        <!-- Botões de Ação na Parte Inferior Lado a Lado -->
                        <div id="c-view-buttons" style="position: absolute; bottom: 22px; left: 14px; right: 14px; display: flex; gap: 10px; z-index: 10;"></div>

                        <!-- Rodapé Criado com PainelBio -->
                        <div style="position: absolute; bottom: 6px; left: 0; right: 0; text-align: center; font-size: 0.65rem; color: rgba(255,255,255,0.4); z-index: 10; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            CRIADO COM PAINELBIO
                        </div>

                    </div>
                `;
            } else if (activeModel === 'shop') {
                previewScreen.style.background = '#0f172a';
                
                previewScreen.innerHTML = `
                    <div class="s-live-page" style="position: relative; width: 100%; min-height: 100%; padding: 24px 0 30px 0; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; background: #0f172a; color: #fff; overflow: hidden;">

                        <!-- Fundo desfocado com degradê (preenchido via JS com a imagem do produto 1) -->
                        <div id="s-view-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 55%; background-size: cover; background-position: center; filter: blur(22px) brightness(0.45); transform: scale(1.1); z-index: 0; display: none;"></div>
                        <div id="s-view-bg-fade" style="position: absolute; top: 0; left: 0; width: 100%; height: 60%; background: linear-gradient(to bottom, rgba(15,23,42,0) 0%, #0f172a 100%); z-index: 1; pointer-events: none; display: none;"></div>

                        <!-- Conteúdo (z-index acima do fundo) -->
                        <div style="position: relative; z-index: 2; width: 100%; display: flex; flex-direction: column; align-items: center;">

                            <!-- Profile -->
                            <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 20px; padding: 0 16px;">
                                <div id="s-view-avatar-wrapper" style="width: 80px; height: 80px; border-radius: 50%; overflow: hidden; border: 3px solid var(--theme-color-1, #f59e0b); margin-bottom: 12px; display: none; box-shadow: 0 0 20px var(--theme-color-1, #f59e0b)44;">
                                    <div id="s-view-avatar-inner" style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden;"></div>
                                </div>
                                <h1 id="s-view-name" style="font-size: 1.25rem; font-weight: 700; margin: 0 0 4px 0;"></h1>
                                <a id="s-view-arroba" href="#" target="_blank" style="font-size: 0.85rem; color: var(--theme-color-1, #f59e0b); text-decoration: none; font-weight: 600; margin-bottom: 8px;"></a>
                                <p id="s-view-bio" style="font-size: 0.85rem; color: #cbd5e1; line-height: 1.4; margin: 0; white-space: pre-wrap; width: 100%;"></p>
                            </div>

                            <!-- Carousel -->
                            <div style="width: 100%; margin-bottom: 20px; display: flex; flex-direction: column;">
                                <div style="font-size: 0.8rem; font-weight: 700; color: var(--theme-color-1, #f59e0b); margin-bottom: 10px; padding: 0 16px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.85;">✦ Mais Vendidos</div>
                                <div id="s-view-carousel" style="display: flex; gap: 12px; overflow-x: auto; padding: 0 16px 16px 16px; scroll-snap-type: x mandatory; scrollbar-width: none; -ms-overflow-style: none; cursor: grab; user-select: none; -webkit-overflow-scrolling: touch;">
                                    <!-- Prod 1 -->
                                    <div id="s-view-p1-card" style="display: none; flex: 0 0 82%; background: rgba(30,41,59,0.85); border-radius: 18px; overflow: hidden; scroll-snap-align: center; border: 1px solid var(--theme-color-1, #f59e0b)33; backdrop-filter: blur(8px); box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
                                        <div style="width: 100%; height: 200px; background: #0f172a; position: relative; overflow: hidden;">
                                            <img id="s-view-p1-img" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'" />
                                            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(to top, rgba(15,23,42,0.9), transparent);"></div>
                                        </div>
                                        <div style="padding: 14px;">
                                            <div id="s-view-p1-title" style="font-size: 1rem; font-weight: 600; margin-bottom: 4px; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></div>
                                            <div id="s-view-p1-price" style="font-size: 1.2rem; font-weight: 700; color: var(--theme-color-1, #f59e0b); margin-bottom: 12px;"></div>
                                            <a id="s-view-p1-btn" href="#" target="_blank" style="display: block; width: 100%; padding: 10px 0; background: var(--theme-color-1, #f59e0b); color: #0f172a; text-align: center; border-radius: 10px; font-weight: 800; text-decoration: none; font-size: 0.9rem; box-sizing: border-box;">Eu quero este 🛍️</a>
                                        </div>
                                    </div>
                                    <!-- Prod 2 -->
                                    <div id="s-view-p2-card" style="display: none; flex: 0 0 82%; background: rgba(30,41,59,0.85); border-radius: 18px; overflow: hidden; scroll-snap-align: center; border: 1px solid var(--theme-color-1, #f59e0b)33; backdrop-filter: blur(8px); box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
                                        <div style="width: 100%; height: 200px; background: #0f172a; position: relative; overflow: hidden;">
                                            <img id="s-view-p2-img" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'" />
                                            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(to top, rgba(15,23,42,0.9), transparent);"></div>
                                        </div>
                                        <div style="padding: 14px;">
                                            <div id="s-view-p2-title" style="font-size: 1rem; font-weight: 600; margin-bottom: 4px; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></div>
                                            <div id="s-view-p2-price" style="font-size: 1.2rem; font-weight: 700; color: var(--theme-color-1, #f59e0b); margin-bottom: 12px;"></div>
                                            <a id="s-view-p2-btn" href="#" target="_blank" style="display: block; width: 100%; padding: 10px 0; background: var(--theme-color-1, #f59e0b); color: #0f172a; text-align: center; border-radius: 10px; font-weight: 800; text-decoration: none; font-size: 0.9rem; box-sizing: border-box;">Eu quero este 🛍️</a>
                                        </div>
                                    </div>
                                    <!-- Prod 3 -->
                                    <div id="s-view-p3-card" style="display: none; flex: 0 0 82%; background: rgba(30,41,59,0.85); border-radius: 18px; overflow: hidden; scroll-snap-align: center; border: 1px solid var(--theme-color-1, #f59e0b)33; backdrop-filter: blur(8px); box-shadow: 0 8px 32px rgba(0,0,0,0.4);">
                                        <div style="width: 100%; height: 200px; background: #0f172a; position: relative; overflow: hidden;">
                                            <img id="s-view-p3-img" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'" />
                                            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(to top, rgba(15,23,42,0.9), transparent);"></div>
                                        </div>
                                        <div style="padding: 14px;">
                                            <div id="s-view-p3-title" style="font-size: 1rem; font-weight: 600; margin-bottom: 4px; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"></div>
                                            <div id="s-view-p3-price" style="font-size: 1.2rem; font-weight: 700; color: var(--theme-color-1, #f59e0b); margin-bottom: 12px;"></div>
                                            <a id="s-view-p3-btn" href="#" target="_blank" style="display: block; width: 100%; padding: 10px 0; background: var(--theme-color-1, #f59e0b); color: #0f172a; text-align: center; border-radius: 10px; font-weight: 800; text-decoration: none; font-size: 0.9rem; box-sizing: border-box;">Eu quero este 🛍️</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Catalog Button -->
                            <div style="width: 100%; padding: 0 16px; box-sizing: border-box; margin-bottom: 16px;">
                                <a id="s-view-catalog-btn" href="#" target="_blank" style="display: none; width: 100%; padding: 14px 0; background: transparent; border: 2px solid var(--theme-color-1, #f59e0b); color: var(--theme-color-1, #f59e0b); text-align: center; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 0.95rem; box-sizing: border-box;">Ver todo o catálogo →</a>
                            </div>

                            <!-- Footer -->
                            <div style="margin-top: 8px; font-size: 0.65rem; color: rgba(255,255,255,0.3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">CRIADO COM PAINELBIO</div>
                        </div>

                        <!-- Névoa + Partículas subindo -->
                        <div id="s-particles-root" style="position: absolute; bottom: 0; left: 0; right: 0; height: 100%; pointer-events: none; z-index: 1; overflow: hidden;">
                            <div style="position: absolute; bottom: -30px; left: -15%; width: 130%; height: 110px; border-radius: 50%; background: radial-gradient(ellipse at center, var(--theme-color-1, #f59e0b) 0%, transparent 70%); opacity: 0.14; filter: blur(20px); animation: shopFogPulse 4s ease-in-out infinite;"></div>
                            <div style="position: absolute; bottom: -10px; left: 15%; width: 70%; height: 65px; border-radius: 50%; background: radial-gradient(ellipse at center, var(--theme-color-1, #f59e0b) 0%, transparent 70%); opacity: 0.10; filter: blur(28px); animation: shopFogPulse 5.5s ease-in-out infinite 2s;"></div>
                        </div>
                    </div>
                `;

                // Inject keyframes (névoa + faíscas subindo)
                if (!document.getElementById('shop-glow-style')) {
                    const glowStyle = document.createElement('style');
                    glowStyle.id = 'shop-glow-style';
                    glowStyle.textContent = `
                        @keyframes shopFogPulse {
                            0%, 100% { opacity: 0.10; transform: scaleX(1); }
                            50%      { opacity: 0.22; transform: scaleX(1.07); }
                        }
                        @keyframes shopSparkRise {
                            0%   { transform: translateY(0px)   scale(1);   opacity: 0; }
                            8%   { opacity: 1; }
                            88%  { opacity: 0.6; }
                            100% { transform: translateY(-270px) scale(0.4); opacity: 0; }
                        }
                    `;
                    document.head.appendChild(glowStyle);
                }

                // Gerar faíscas dinamicamente
                const particlesRoot = document.getElementById('s-particles-root');
                if (particlesRoot && !particlesRoot._sparksCreated) {
                    particlesRoot._sparksCreated = true;
                    const SPARK_COUNT = 16;
                    for (let i = 0; i < SPARK_COUNT; i++) {
                        const spark = document.createElement('div');
                        const size = 1.5 + Math.random() * 3.5;
                        const left = 3 + Math.random() * 94;
                        const delay = Math.random() * 7;
                        const dur   = 3.5 + Math.random() * 5;
                        const blur  = Math.random() > 0.6 ? '1px' : '0px';
                        spark.style.cssText = [
                            'position:absolute',
                            `bottom:${Math.random() * 20}px`,
                            `left:${left}%`,
                            `width:${size}px`,
                            `height:${size}px`,
                            'border-radius:50%',
                            'background:var(--theme-color-1,#f59e0b)',
                            `box-shadow:0 0 ${size*2.5}px ${size}px var(--theme-color-1,#f59e0b)`,
                            'opacity:0',
                            `animation:shopSparkRise ${dur}s ease-in ${delay}s infinite`,
                            `filter:blur(${blur})`
                        ].join(';');
                        particlesRoot.appendChild(spark);
                    }
                }

            } else if (activeModel === 'ebook') {
                previewScreen.style.background = 'radial-gradient(circle at 50% 10%, #1e1b4b 0%, #090514 80%)';
                
                previewScreen.innerHTML = `
                    <div class="eb-live-page" style="width: 100%; min-height: 100%; padding: 24px 14px 30px 14px; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; color: #fff; overflow-y: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        
                        <!-- Header com Avatar Pequeno, Nome e @ -->
                        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 20px; width: 100%;">
                            <div id="eb-view-avatar-wrapper" style="width: 68px; height: 68px; border-radius: 50%; overflow: hidden; border: 2.5px solid var(--theme-color-1, #6366f1); margin-bottom: 8px; display: none; box-shadow: 0 0 16px rgba(99,102,241,0.3);">
                                <div id="eb-view-avatar-inner" style="width: 100%; height: 100%; border-radius: 50%; overflow: hidden;"></div>
                            </div>
                            <h1 id="eb-view-name" style="font-size: 1.15rem; font-weight: 700; margin: 0 0 2px 0; color: #fff;"></h1>
                            <a id="eb-view-arroba" href="#" target="_blank" style="font-size: 0.82rem; color: var(--theme-color-1, #818cf8); text-decoration: none; font-weight: 600; margin-bottom: 6px; display: inline-block;"></a>
                            <p id="eb-view-bio" style="font-size: 0.78rem; color: #94a3b8; line-height: 1.4; margin: 0; white-space: pre-wrap; width: 90%;"></p>
                        </div>

                        <!-- Card de Destaque do E-book (Flutuante 3D Glassmorphism) -->
                        <div id="eb-view-card" style="width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 16px; box-sizing: border-box; display: none; flex-direction: column; gap: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); margin-bottom: 20px;">
                            <div style="display: flex; gap: 14px; align-items: flex-start;">
                                <!-- Imagem com perspectiva 3D (Capa de Livro) -->
                                <div style="width: 85px; height: 115px; flex-shrink: 0; perspective: 1000px;">
                                    <img id="eb-view-cover" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px; box-shadow: -5px 5px 12px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.1); transform: rotateY(-12deg) rotateX(5deg); display: block;" onerror="this.src='https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'" />
                                </div>
                                <!-- Informações do Livro -->
                                <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                                    <h3 id="eb-view-title" style="font-size: 0.95rem; font-weight: 800; color: #fff; margin: 0; line-height: 1.3;"></h3>
                                    <p id="eb-view-desc" style="font-size: 0.74rem; color: #94a3b8; line-height: 1.35; margin: 0; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;"></p>
                                </div>
                            </div>

                            <!-- Botão de Compra Destaque Verde -->
                            <a id="eb-view-buy-btn" href="#" target="_blank" style="width: 100%; height: 42px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 10px; color: #fff; text-decoration: none; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(16,185,129,0.3); transition: transform 0.2s; text-align: center;">
                                Comprar E-book 🛒
                            </a>
                        </div>

                        <!-- Botões Extras Linktree -->
                        <div id="eb-view-buttons" style="width: 100%; display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;"></div>

                        <!-- Rodapé Criado com PainelBio -->
                        <div id="eb-view-footer" style="margin-top: auto; font-size: 0.72rem; color: rgba(255,255,255,0.3); display: flex; align-items: center; gap: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                            CRIADO COM <a href="#" style="color: rgba(255,255,255,0.5); text-decoration: none; font-weight: 700;">PAINELBIO</a>
                        </div>

                    </div>
                `;
            } else if (activeModel === 'vitrine') {
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
                            
                            <div class="preview-footer" id="view-footer" style="display: none; margin-top: 25px; font-size: 0.75rem; color: rgba(255,255,255,0.4); align-items: center; justify-content: center; gap: 6px;">
                                CRIADO COM <a href="#" style="color: rgba(255,255,255,0.6); text-decoration: none; font-weight: 600; text-transform: uppercase;">PAINELBIO</a>
                            </div>
                        </div>
                    </div>
                `;
            }

            // Injeta o formulário do modelo dinamicamente no Inspector (/models/<activeModel>/inspector.html)
            try {
                const res = await fetch(`/models/${activeModel}/inspector.html?v=${Date.now()}`);
                let modelHtml = '';
                if (res.ok) {
                    modelHtml = await res.text();
                } else {
                    const fallbackRes = await fetch('/models/classic/inspector.html?v=' + Date.now());
                    modelHtml = await fallbackRes.text();
                }
                
                // Fetch Add-ons Partials
                let addonsActiveHtml = '';
                let addonsCatalogHtml = '';
                try {
                    const activeRes = await fetch('/partials/addons-active.html?v=' + Date.now());
                    const catalogRes = await fetch('/partials/addons-catalog.html?v=' + Date.now());
                    if (activeRes.ok) addonsActiveHtml = await activeRes.text();
                    if (catalogRes.ok) addonsCatalogHtml = await catalogRes.text();
                } catch(e) { console.error("Erro ao carregar add-ons", e); }
                
                inspectorContent.innerHTML = modelHtml;
                
                // Injetar Add-ons
                const activeContainer = inspectorContent.querySelector('#active-addons-list');
                const catalogContainer = inspectorContent.querySelector('#panel-addons');
                if (activeContainer && addonsActiveHtml) activeContainer.innerHTML = addonsActiveHtml;
                if (catalogContainer && addonsCatalogHtml) catalogContainer.innerHTML = addonsCatalogHtml;
                
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
                    'input-carousel1-img': backup.carousel1Img || '',
                    'input-carousel2-img': backup.carousel2Img || '',
                    'input-carousel3-img': backup.carousel3Img || '',
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
                    'input-shop-p1-img': backup.shopP1Img || '',
                    'input-shop-p1-title': backup.shopP1Title || '',
                    'input-shop-p1-price': backup.shopP1Price || '',
                    'input-shop-p1-url': backup.shopP1Url || '',
                    'input-shop-p2-img': backup.shopP2Img || '',
                    'input-shop-p2-title': backup.shopP2Title || '',
                    'input-shop-p2-price': backup.shopP2Price || '',
                    'input-shop-p2-url': backup.shopP2Url || '',
                    'input-shop-p3-img': backup.shopP3Img || '',
                    'input-shop-p3-title': backup.shopP3Title || '',
                    'input-shop-p3-price': backup.shopP3Price || '',
                    'input-shop-p3-url': backup.shopP3Url || '',
                    'input-shop-catalog-url': backup.shopCatalogUrl || '',
                    'input-addon-tb-text1': backup.addonTopbannerText1 || '',
                    'input-addon-tb-text2': backup.addonTopbannerText2 || '',
                    'input-addon-tb-text3': backup.addonTopbannerText3 || '',
                    'input-addon-tb-bg': backup.addonTopbannerBg || '#0f172a',
                    'input-addon-tb-color': backup.addonTopbannerColor || '#38bdf8',
                    'input-addon-tb-pause': backup.addonTopbannerPause || 2,
                    'input-addon-er-emoji': backup.addonEmojiRainEmoji || '',
                    'input-addon-er-count': backup.addonEmojiRainCount || 8,
                    'input-addon-er-coverage': backup.addonEmojiRainCoverage || 80,
                    'input-addon-ap-url': backup.addonAudioPlayerUrl || '',
                    'input-addon-ap-label': backup.addonAudioPlayerLabel || 'Música da Loja',
                    'select-addon-ap-position': backup.addonAudioPlayerPosition || 'bottom-right',
                    'input-addon-ap-color': backup.addonAudioPlayerColor || '#ec4899',
                    'input-addon-ap-wave-color': backup.addonAudioPlayerWaveColor || '#ffffff'
                };
                const apAutoplayEl = document.getElementById('input-addon-ap-autoplay');
                if (apAutoplayEl && backup.addonAudioPlayerAutoplay !== undefined) {
                    apAutoplayEl.checked = Boolean(backup.addonAudioPlayerAutoplay);
                }
                for (const [id, val] of Object.entries(fieldsToRestore)) {
                    const el = document.getElementById(id);
                    if (el) el.value = val;
                }

                const effectSelect = document.getElementById('select-addon-tb-effect');
                if (effectSelect) {
                    effectSelect.value = backup.addonTopbannerEffect || 'fade';
                    const containerPause = document.getElementById('container-addon-tb-pause');
                    const containerMarquee = document.getElementById('container-addon-tb-marquee-settings');
                    const mqSpeedInput = document.getElementById('input-addon-tb-marquee-speed');
                    const mqPauseInput = document.getElementById('input-addon-tb-marquee-pause');
                    
                    if (mqSpeedInput) mqSpeedInput.value = backup.addonTopbannerMarqueeSpeed || '5';
                    if (mqPauseInput) mqPauseInput.value = backup.addonTopbannerMarqueePause || '3';
                    
                    function updateAddonFields() {
                        if (containerPause) containerPause.style.display = (['slide', 'bounce', 'flip', 'shutter'].includes(effectSelect.value)) ? 'block' : 'none';
                        if (containerMarquee) containerMarquee.style.display = (effectSelect.value === 'marquee') ? 'block' : 'none';
                    }
                    updateAddonFields();
                    effectSelect.addEventListener('change', updateAddonFields);
                }

                if (backup.addonTopbannerActive) {
                    const cardTb = document.getElementById('card-addon-topbanner');
                    if (cardTb) cardTb.style.display = 'block';
                }

                if (backup.addonEmojiRainActive) {
                    const cardEr = document.getElementById('card-addon-emojirain');
                    if (cardEr) cardEr.style.display = 'block';
                }

                if (backup.addonAvatarSpinActive) {
                    const cardAs = document.getElementById('card-addon-avatarspin');
                    if (cardAs) cardAs.style.display = 'block';
                }

                if (backup.addonAudioPlayerActive) {
                    const cardAp = document.getElementById('card-addon-audioplayer');
                    if (cardAp) cardAp.style.display = 'block';
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
                if (fakeDataToggle && fakeDataToggle.checked) {
                    populateFakeDataForModel(activeModel);
                }

                // Habilita taxa de serviço se for um site existente e pago anteriormente
                const feeRow = document.getElementById('cart-service-fee-row');
                if (feeRow) {
                    const leads = (typeof getLeads === 'function') ? getLeads() : (JSON.parse(localStorage.getItem('painelbio-insta-leads')) || []);
                    const exists = leads.some(l => l.arroba && l.arroba.toLowerCase() === (backup.arroba || '').toLowerCase() && l.lastPaidAt);
                    feeRow.style.display = exists ? 'flex' : 'none';
                    // Restaura valor da taxa se houver
                    const feeInput = document.getElementById('cart-service-fee');
                    if (feeInput) feeInput.value = backup.serviceFee || 0;
                }

                updatePreviewFromForm();
            } else if (fakeDataToggle && fakeDataToggle.checked) {
                populateFakeDataForModel(activeModel);
                updatePreviewFromForm();
            } else {
                updatePreviewFromForm();
            }

            // Atualiza catálogo de add-ons e resumo do carrinho após injetar os inputs novos
            if (typeof updateAddonCatalogButtonStates === 'function') {
                updateAddonCatalogButtonStates();
            } else if (typeof updateCartSummary === 'function') {
                updateCartSummary();
            }
        }

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

            const c1ImgInput = document.getElementById('input-carousel1-img');
            const c2ImgInput = document.getElementById('input-carousel2-img');
            const c3ImgInput = document.getElementById('input-carousel3-img');

            if (activeModel === 'carousel') {
                if (c1ImgInput && !c1ImgInput.value) c1ImgInput.value = "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000";
                if (c2ImgInput && !c2ImgInput.value) c2ImgInput.value = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000";
                if (c3ImgInput && !c3ImgInput.value) c3ImgInput.value = "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1000";

                if (avatarInput && !avatarInput.value) avatarInput.value = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300";
                if (nameInput && !nameInput.value) nameInput.value = "Studio Beauty | Estética & Cílios";
                if (arrobaInput && !arrobaInput.value) arrobaInput.value = "studiobeauty.oficial";
                if (bioInput && !bioInput.value) bioInput.value = `Especialista em extensão de cílios & micropigmentação ✨\nAgende seu horário online com praticidade!`;

                if (btn1TitleInput && !btn1TitleInput.value) btn1TitleInput.value = "💬 WhatsApp";
                if (btn1UrlInput && !btn1UrlInput.value) btn1UrlInput.value = "https://wa.me/5511999999999";
                if (btn2TitleInput && !btn2TitleInput.value) btn2TitleInput.value = "🛍️ Ver Preços";
                if (btn2UrlInput && !btn2UrlInput.value) btn2UrlInput.value = "https://wa.me/5511999999999";
            } else if (activeModel === 'vitrine') {
                if (h1ImgInput && !h1ImgInput.value) h1ImgInput.value = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";
                if (h1TitleInput && !h1TitleInput.value) h1TitleInput.value = "🔥 Coleção de Verão 2026";
                if (h2ImgInput && !h2ImgInput.value) h2ImgInput.value = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500";
                if (h2TitleInput && !h2TitleInput.value) h2TitleInput.value = "✨ Novidades";
                if (h3ImgInput && !h3ImgInput.value) h3ImgInput.value = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500";
                if (h3TitleInput && !h3TitleInput.value) h3TitleInput.value = "💥 Mais Vendido";
                
                if (avatarInput && !avatarInput.value) avatarInput.value = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";
                if (nameInput && !nameInput.value) nameInput.value = "Boutique Elegance | Moda Feminina";
                if (arrobaInput && !arrobaInput.value) arrobaInput.value = "boutique.elegance";
                if (bioInput && !bioInput.value) bioInput.value = `Moda feminina premium & peças exclusivas.\nEnviamos para todo o Brasil com Frete Grátis! 🛍️`;
                
                if (btn1TitleInput && !btn1TitleInput.value) btn1TitleInput.value = "💬 Atendimento no WhatsApp";
                if (btn1UrlInput && !btn1UrlInput.value) btn1UrlInput.value = "https://wa.me/5511999999999";
                if (btn2TitleInput && !btn2TitleInput.value) btn2TitleInput.value = "🛍️ Ver Coleção Completa";
                if (btn2UrlInput && !btn2UrlInput.value) btn2UrlInput.value = "https://instagram.com/boutique.elegance";
                if (btn3TitleInput && !btn3TitleInput.value) btn3TitleInput.value = "📍 Endereço da Loja Física";
                if (btn3UrlInput && !btn3UrlInput.value) btn3UrlInput.value = "https://maps.google.com";
                if (btn4TitleInput && !btn4TitleInput.value) btn4TitleInput.value = "💳 Pagamento via PIX";
                if (btn4UrlInput && !btn4UrlInput.value) btn4UrlInput.value = "https://wa.me/5511999999999";
            } else if (activeModel === 'shop') {
                if (avatarInput && !avatarInput.value) avatarInput.value = "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300";
                if (nameInput && !nameInput.value) nameInput.value = "Boutique Elegance";
                if (arrobaInput && !arrobaInput.value) arrobaInput.value = "boutique.elegance";
                if (bioInput && !bioInput.value) bioInput.value = `Roupas importadas e exclusivas.\nEntregamos para todo o Brasil. 🛍️`;

                const p1Img = document.getElementById('input-shop-p1-img');
                const p1Title = document.getElementById('input-shop-p1-title');
                const p1Price = document.getElementById('input-shop-p1-price');
                const p1Url = document.getElementById('input-shop-p1-url');
                if (p1Img && !p1Img.value) p1Img.value = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600";
                if (p1Title && !p1Title.value) p1Title.value = "Vestido Floral";
                if (p1Price && !p1Price.value) p1Price.value = "R$ 199,90";
                if (p1Url && !p1Url.value) p1Url.value = "https://wa.me/5511999999999";

                const p2Img = document.getElementById('input-shop-p2-img');
                const p2Title = document.getElementById('input-shop-p2-title');
                const p2Price = document.getElementById('input-shop-p2-price');
                const p2Url = document.getElementById('input-shop-p2-url');
                if (p2Img && !p2Img.value) p2Img.value = "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600";
                if (p2Title && !p2Title.value) p2Title.value = "Bolsa de Couro";
                if (p2Price && !p2Price.value) p2Price.value = "R$ 299,90";
                if (p2Url && !p2Url.value) p2Url.value = "https://wa.me/5511999999999";

                const p3Img = document.getElementById('input-shop-p3-img');
                const p3Title = document.getElementById('input-shop-p3-title');
                const p3Price = document.getElementById('input-shop-p3-price');
                const p3Url = document.getElementById('input-shop-p3-url');
                if (p3Img && !p3Img.value) p3Img.value = "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600";
                if (p3Title && !p3Title.value) p3Title.value = "Óculos Sunset";
                if (p3Price && !p3Price.value) p3Price.value = "R$ 149,90";
                if (p3Url && !p3Url.value) p3Url.value = "https://wa.me/5511999999999";

                const catUrl = document.getElementById('input-shop-catalog-url');
                if (catUrl && !catUrl.value) catUrl.value = "https://wa.me/c/5511999999999";
            } else if (activeModel === 'ebook') {
                if (avatarInput && !avatarInput.value) avatarInput.value = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200";
                if (nameInput && !nameInput.value) nameInput.value = "Bruna Silva | Infoprodutora";
                if (arrobaInput && !arrobaInput.value) arrobaInput.value = "bruna.infomarketing";
                if (bioInput && !bioInput.value) bioInput.value = `Ajudo iniciantes a faturar no digital de forma descomplicada. 🚀\nMais de 10.000 alunos transformados!`;

                const ebCover = document.getElementById('input-ebook-cover');
                const ebTitle = document.getElementById('input-ebook-title');
                const ebDesc = document.getElementById('input-ebook-desc');
                const ebBtnText = document.getElementById('input-ebook-btn-text');
                const ebBuyUrl = document.getElementById('input-ebook-buy-url');

                if (ebCover && !ebCover.value) ebCover.value = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600";
                if (ebTitle && !ebTitle.value) ebTitle.value = "Descomplicando o Marketing Digital";
                if (ebDesc && !ebDesc.value) ebDesc.value = "O passo a passo definitivo para você faturar seus primeiros R$ 10.000 como produtor de conteúdo trabalhando de casa.";
                if (ebBtnText && !ebBtnText.value) ebBtnText.value = "Comprar E-book por R$ 29,90 🛒";
                if (ebBuyUrl && !ebBuyUrl.value) ebBuyUrl.value = "https://pay.hotmart.com";

                if (btn1TitleInput && !btn1TitleInput.value) btn1TitleInput.value = "💬 Falar no WhatsApp (Suporte)";
                if (btn1UrlInput && !btn1UrlInput.value) btn1UrlInput.value = "https://wa.me/5511999999999";
                if (btn2TitleInput && !btn2TitleInput.value) btn2TitleInput.value = "🌐 Meu Site Oficial";
                if (btn2UrlInput && !btn2UrlInput.value) btn2UrlInput.value = "https://meusite.com";
            } else {
                // MODELO 1: CLASSIC
                if (avatarInput && !avatarInput.value) avatarInput.value = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200";
                if (nameInput && !nameInput.value) nameInput.value = "Ana Carolina | Semijoias de Luxo";
                if (arrobaInput && !arrobaInput.value) arrobaInput.value = "anacarolina.semijoias";
                if (bioInput && !bioInput.value) bioInput.value = `Peças exclusivas banhadas a ouro 18k.\nFrete grátis para todo o Brasil. ✨\nEnviamos com amor.`;
                
                if (btn1TitleInput && !btn1TitleInput.value) btn1TitleInput.value = "🛍️ Ver Catálogo no WhatsApp";
                if (btn1UrlInput && !btn1UrlInput.value) btn1UrlInput.value = "https://wa.me/5511999999999";
                if (btn2TitleInput && !btn2TitleInput.value) btn2TitleInput.value = "✨ Seguir no Instagram";
                if (btn2UrlInput && !btn2UrlInput.value) btn2UrlInput.value = "https://instagram.com/anacarolina.semijoias";
                if (btn3TitleInput && !btn3TitleInput.value) btn3TitleInput.value = "📍 Como Chegar (Localização)";
                if (btn3UrlInput && !btn3UrlInput.value) btn3UrlInput.value = "https://maps.google.com";
            }
        }

async function loadClassicModel() {
    try {
        const response = await fetch('/models/classic/inspector.html?v=' + Date.now());
        CLASSIC_FORM_HTML = await response.text();
    } catch (e) {
        console.error("Erro ao carregar o modelo Classic:", e);
    }
}

