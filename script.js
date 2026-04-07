document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bg-particles');
    const playBtn = document.getElementById('btn-play');
    
    // --- Particle System ---
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            top: ${posY}%;
            left: ${posX}%;
            box-shadow: 0 0 ${size * 2}px white;
            animation: moveParticle ${duration}s linear ${delay}s infinite;
        `;
        
        container.appendChild(particle);
        
        // Remove and recreate for performance/loop
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, (duration + delay) * 1000);
    };

    // Add CSS for particles dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes moveParticle {
            0% { transform: translate(0, 0); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translate(${(Math.random() - 0.5) * 200}px, -300px); opacity: 0; }
        }
        
        .ripple {
            position: absolute;
            border: 2px solid var(--neon-cyan);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
            z-index: 999;
        }
        
        @keyframes rippleEffect {
            to { transform: scale(4); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Initial particles
    for (let i = 0; i < 50; i++) {
        setTimeout(createParticle, i * 100);
    }

    // --- Navigation Logic ---
    const homeScreen = document.getElementById('home-screen');
    const levelSelectScreen = document.getElementById('level-select-screen');
    const gameStageScreen = document.getElementById('game-stage');
    const charSelectScreen = document.getElementById('character-select-screen');
    const levelEditorScreen = document.getElementById('level-editor-screen');
    const backBtn = document.getElementById('btn-back-home');
    const backBtnChar = document.getElementById('btn-back-home-char');
    const btnIcons = document.getElementById('btn-icons');
    const btnLevels = document.getElementById('btn-levels');
    const cardCreateLevel = document.getElementById('card-create-level');
    const btnBackEditor = document.getElementById('btn-back-editor');

    const showScreen = (screenToShow) => {
        // Hide all screens
        [homeScreen, levelSelectScreen, gameStageScreen, charSelectScreen, levelEditorScreen].forEach(s => {
            if (s) {
                s.classList.remove('active-screen');
                s.classList.add('screen-hidden');
            }
        });

        // Show the target screen
        setTimeout(() => {
            if (screenToShow) {
                screenToShow.classList.remove('screen-hidden');
                screenToShow.classList.add('active-screen');
            }
        }, 50);
    };

    // Play Button logic
    playBtn.addEventListener('click', () => {
        console.log('Navigating to Level Select...');
        playBtn.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            playBtn.style.transform = '';
            showScreen(levelSelectScreen);
        }, 200);
    });

    // Back Button logic
    if (backBtn) backBtn.addEventListener('click', () => showScreen(homeScreen));
    if (backBtnChar) backBtnChar.addEventListener('click', () => showScreen(homeScreen));
    if (btnBackEditor) btnBackEditor.addEventListener('click', () => showScreen(levelSelectScreen));
    
    // Icon Buttons on Home Screen
    if (btnIcons) btnIcons.addEventListener('click', () => showScreen(charSelectScreen));
    if (btnLevels) btnLevels.addEventListener('click', () => showScreen(levelSelectScreen));
    if (cardCreateLevel) cardCreateLevel.addEventListener('click', () => showScreen(levelEditorScreen));

    // Level Editor Logic
    window.customLevelSequence = [];
    const editorSequenceEl = document.getElementById('editor-sequence');
    
    function renderEditorSequence() {
        if (!editorSequenceEl) return;
        if (window.customLevelSequence.length === 0) {
            editorSequenceEl.innerHTML = '<div style="color: #666; font-style: italic;">[ Começo ]</div>';
            return;
        }
        editorSequenceEl.innerHTML = window.customLevelSequence.map((item) => {
            return `<div style="background: rgba(0,243,255,0.2); border: 1px solid #00f3ff; padding: 0.3rem 0.8rem; border-radius: 4px; white-space: nowrap; font-size: 0.8rem; color: white;">
                ${item.replace('_', ' ').toUpperCase()}
            </div>`;
        }).join('<span style="color:#666;">➔</span>');
        
        // Auto scroll to end
        editorSequenceEl.scrollLeft = editorSequenceEl.scrollWidth;
    }

    document.querySelectorAll('.btn-editor-tool').forEach(btn => {
        btn.addEventListener('click', () => {
            window.customLevelSequence.push(btn.dataset.type);
            renderEditorSequence();
        });
    });

    const btnEditorClear = document.getElementById('btn-editor-clear');
    if (btnEditorClear) {
        btnEditorClear.addEventListener('click', () => {
            window.customLevelSequence = [];
            renderEditorSequence();
        });
    }

    const btnEditorPlay = document.getElementById('btn-editor-play');
    if (btnEditorPlay) {
        btnEditorPlay.addEventListener('click', () => {
            if (window.customLevelSequence.length === 0) {
                alert('Adicione alguns obstáculos primeiro!');
                return;
            }
            
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(e => console.log(e));
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen().catch(e => console.log(e));
            }
            
            showScreen(gameStageScreen);
            startGame(3); // Level 3 = Custom Level
        });
    }

    // Character Select Logic
    window.selectedPlayerColor = '#ff00c1'; // default initial selection
    const charCards = document.querySelectorAll('.char-card');
    // Pre-select first
    if(charCards[0]) charCards[0].style.transform = 'scale(1.1)';
    
    charCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection effect from all
            charCards.forEach(c => c.style.transform = '');
            // Apply to chosen
            card.style.transform = 'scale(1.1)';
            window.selectedPlayerColor = card.dataset.color;
        });
    });

    // Level Play Button logic
    const levelPlayBtns = document.querySelectorAll('.btn-level-play');
    levelPlayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(e => console.log(e));
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen().catch(e => console.log(e));
            }
            showScreen(gameStageScreen);
            const level = btn.id === 'btn-play-level-2' ? 2 : 1;
            startGame(level);
        });
    });

    // --- Interaction Logic ---

    // Global click ripple
    document.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.left = `${e.clientX - 25}px`;
        ripple.style.top = `${e.clientY - 25}px`;
        ripple.style.width = '50px';
        ripple.style.height = '50px';
        document.body.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });

    // Hover sound effect placeholder
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            // Play hover sound if we had one
            // new Audio('assets/hover.mp3').play();
        });
    });

    // --- GAME ENGINE ---
    let gameEngine = null;

    function startGame(level) {
        if (!gameEngine) {
            gameEngine = new GameEngine();
        }
        gameEngine.start(level);
    }

    class GameEngine {
        constructor() {
            this.canvas = document.getElementById('game-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.cubeImg = document.getElementById('cube-img');
            this.spikeImg = document.getElementById('spike-img');
            this.blockImg = document.getElementById('block-img');
            
            this.resize();
            window.addEventListener('resize', () => this.resize());
            
            // Interaction
            this.jumpHeld = false;
            
            window.addEventListener('keydown', (e) => {
                if (e.code === 'Space' || e.code === 'ArrowUp') {
                    this.jumpHeld = true;
                    this.jump();
                }
            });
            window.addEventListener('keyup', (e) => {
                if (e.code === 'Space' || e.code === 'ArrowUp') {
                    this.jumpHeld = false;
                }
            });
            
            window.addEventListener('mousedown', () => {
                this.jumpHeld = true;
                this.jump();
            });
            window.addEventListener('mouseup', () => {
                this.jumpHeld = false;
            });
            
            // Touch support for mobile browsers
            window.addEventListener('touchstart', (e) => {
                this.jumpHeld = true;
                this.jump();
            });
            window.addEventListener('touchend', (e) => {
                this.jumpHeld = false;
            });
            
            // UI elements
            this.attemptEl = document.getElementById('attempt-counter');
            this.progressBar = document.getElementById('level-progress');
            this.progressText = document.getElementById('progress-text');
            
            // Audio Engine
            this.audio = new AudioEngine();
            
            this.resetState();
            this.attempts = 1;
        }
        
        resize() {
            // Utiliza uma altura lógica de 600px para que o jogo não pareça "muito perto" em telas horizontais
            const logicalHeight = 600;
            const aspectRatio = window.innerWidth / window.innerHeight;
            
            this.canvas.width = logicalHeight * aspectRatio;
            this.canvas.height = logicalHeight;
            
            this.groundY = this.canvas.height - 100;
            this.ceilingY = 100;
            
            // O CSS cuida de esticar o canvas na tela inteira
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
        }
        
        resetState() {
            this.player = {
                x: 200,
                y: this.groundY - 50,
                size: 50,
                vy: 0,
                rotation: 0,
                isJumping: false
            };
            this.gravity = 0.8;
            this.jumpForce = -15;
            this.speed = 8;
            this.obstacles = [];
            this.distance = 0;
            this.levelLength = 10000; // pixels
            this.isGameOver = false;
            this.spawnTimer = 0;
            this.isFinished = false;
            this.trailParticles = [];
            this.isPlane = false;
            this.customSequenceIndex = 0;
            this.isCustomLevel = false;
        }
        
        start(level = 1) {
            this.currentLevel = level;
            this.resetState();
            
            if (this.currentLevel === 3) {
                this.isCustomLevel = true;
                // Base length relative to the number of parts we spawned
                this.levelLength = (window.customLevelSequence ? window.customLevelSequence.length * 400 : 0) + 1200;
            } else {
                this.isCustomLevel = false;
                this.levelLength = 10000;
            }
            
            this.attemptEl.innerText = `ATTEMPT ${this.attempts}`;
            this.progressBar.style.width = '0%';
            this.progressText.innerText = '0%';
            
            this.audio.toggleBGM(true, this.currentLevel);
            
            if (!this.looping) {
                this.looping = true;
                this.loop();
            }
        }
        
        jump() {
            if (this.isPlane) return; // Plane mode doesn't jump
            if (!this.player.isJumping && !this.isGameOver) {
                this.player.vy = this.jumpForce;
                this.player.isJumping = true;
                // Snap rotation to nearest 90 degrees before jumping
                this.player.rotation = Math.round(this.player.rotation / 90) * 90;
                
                this.audio.playJump();
            }
        }
        
        die() {
            this.isGameOver = true;
            this.attempts++;
            
            this.audio.toggleBGM(false); // Stop music on crash
            this.audio.playCrash();
            
            // Explosion effect flash
            this.ctx.fillStyle = 'rgba(255, 0, 193, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            setTimeout(() => {
                if (!this.isFinished) this.start(this.currentLevel);
            }, 1000);
        }
        
        win() {
            this.isFinished = true;
            this.isGameOver = true;
            this.audio.toggleBGM(false);
            
            if (this.isCustomLevel) {
                alert('PARABÉNS! Você completou seu NÍVEL CUSTOMIZADO!');
                showScreen(document.getElementById('level-select-screen'));
                return;
            }
            
            alert('PARABÉNS! Você passou dessa fase!\nO Jogo 2 foi desbloqueado!');
            
            // Unlock level 2
            const level2Card = document.getElementById('level-2-card');
            if (level2Card) level2Card.classList.remove('locked-card');
            
            const level2Lock = document.getElementById('level-2-lock');
            if (level2Lock) level2Lock.style.display = 'none';
            
            const btnPlayLevel2 = document.getElementById('btn-play-level-2');
            if (btnPlayLevel2) btnPlayLevel2.style.display = 'block';
            
            // Assuming levelSelectScreen is defined in the outer scope
            showScreen(document.getElementById('level-select-screen') || document.querySelector('.screen-hidden#level-select-screen'));
        }
        
        spawnObstacle() {
            this.spawnTimer++;
            // Procedural simple spawning
            if (this.spawnTimer > 60 + Math.random() * 60) {
                const randType = Math.random();
                
                if (randType > 0.85) {
                    // Custom Stair Pattern
                    let startX = this.canvas.width + 50;
                    
                    // 1 block of height
                    this.obstacles.push({ type: 'block', x: startX, y: this.groundY - 50, width: 50, height: 50 });
                    // 6 spikes
                    this.obstacles.push({ type: 'spike', x: startX + 50, y: this.groundY - 50, width: 240, height: 50 });
                    // 2 blocks of height
                    this.obstacles.push({ type: 'block', x: startX + 290, y: this.groundY - 100, width: 50, height: 100 });
                    // 6 spikes
                    this.obstacles.push({ type: 'spike', x: startX + 340, y: this.groundY - 50, width: 240, height: 50 });
                    // 3 blocks of height
                    this.obstacles.push({ type: 'block', x: startX + 580, y: this.groundY - 150, width: 50, height: 150 });
                    
                    // Delay next spawn so it doesn't overlap stairs
                    this.spawnTimer -= 150;
                }
                else if (randType > 0.55) {
                    // 30% chance to spawn a block instead of a spike
                    const isDouble = Math.random() > 0.6;
                    const isUpsideDown = this.isPlane && Math.random() > 0.5;
                    
                    this.obstacles.push({
                        type: 'block',
                        isUpsideDown: isUpsideDown,
                        x: this.canvas.width + 50,
                        y: isUpsideDown ? this.ceilingY : this.groundY - (isDouble ? 100 : 50),
                        width: 50,
                        height: (isDouble ? 100 : 50)
                    });
                } else if (randType > 0.15) {
                    // Decide number of spikes: 1, 2, or 3
                    const rand = Math.random();
                    let numSpikes = 1;
                    if (rand > 0.85) numSpikes = 3;       // 15% chance for 3 spikes
                    else if (rand > 0.5) numSpikes = 2;   // 35% chance for 2 spikes
                    
                    const isUpsideDown = this.isPlane && Math.random() > 0.5;
                    
                    this.obstacles.push({
                        type: 'spike',
                        isUpsideDown: isUpsideDown,
                        x: this.canvas.width + 50,
                        y: isUpsideDown ? this.ceilingY : this.groundY - 50,
                        width: 40 * numSpikes,
                        height: 50
                    });
                } else {
                    // 15% chance to spawn a portal
                    this.obstacles.push({
                        type: 'portal',
                        x: this.canvas.width + 50,
                        y: this.groundY - 120, // Float in the air
                        width: 50,
                        height: 100,
                        isTargetPlane: !this.isPlane // Flips you to opposite mode
                    });
                    this.spawnTimer -= 50; // extra space after portal
                }
                this.spawnTimer = 0;
            }
        }

        spawnCustomSequence() {
            if (!window.customLevelSequence) return;
            if (this.customSequenceIndex >= window.customLevelSequence.length) return;
            
            this.spawnTimer++;
            if (this.spawnTimer > 50) { // spawn interval matches generic spacing
                const chunkType = window.customLevelSequence[this.customSequenceIndex];
                this.customSequenceIndex++;
                
                let startX = this.canvas.width + 50;
                
                switch (chunkType) {
                    case 'block':
                        this.obstacles.push({ type: 'block', x: startX, y: this.groundY - 50, width: 50, height: 50, isUpsideDown: false });
                        break;
                    case 'spike_1':
                        this.obstacles.push({ type: 'spike', x: startX, y: this.groundY - 50, width: 40, height: 50, isUpsideDown: false });
                        break;
                    case 'spike_3':
                        this.obstacles.push({ type: 'spike', x: startX, y: this.groundY - 50, width: 120, height: 50, isUpsideDown: false });
                        break;
                    case 'space':
                        this.spawnTimer -= 50;
                        break;
                    case 'portal':
                        this.obstacles.push({ type: 'portal', x: startX, y: this.groundY - 120, width: 50, height: 100, isTargetPlane: !this.isPlane });
                        break;
                    case 'ceiling_spike':
                        this.obstacles.push({ type: 'spike', x: startX, y: this.ceilingY, width: 40, height: 50, isUpsideDown: true });
                        break;
                    case 'ceiling_block':
                        this.obstacles.push({ type: 'block', x: startX, y: this.ceilingY, width: 50, height: 50, isUpsideDown: true });
                        break;
                }
                this.spawnTimer = 0;
            }
        }
        
        update() {
            if (this.isGameOver) return;
            
            // Physics
            if (this.isPlane) {
                if (this.jumpHeld) {
                    this.player.vy -= 1.2; // Fly up
                } else {
                    this.player.vy += 0.8; // Fall down
                }
                
                // Clamp velocity for smooth flying
                if (this.player.vy < -8) this.player.vy = -8;
                if (this.player.vy > 8) this.player.vy = 8;
                
                this.player.y += this.player.vy;
                
                // Ceiling collision
                if (this.player.y <= this.ceilingY) {
                    this.player.y = this.ceilingY;
                    this.player.vy = 0;
                }
                
                // Ground collision
                if (this.player.y >= this.groundY - this.player.size) {
                    this.player.y = this.groundY - this.player.size;
                    this.player.vy = 0;
                }
                
                // Visual rotation: tilt up or down based on velocity
                this.player.rotation = this.player.vy * 3;
                this.player.isJumping = true; // Prevents normal jumping bugs
                
            } else {
                this.player.vy += this.gravity;
                this.player.y += this.player.vy;
                
                if (this.player.y >= this.groundY - this.player.size) {
                    this.player.y = this.groundY - this.player.size;
                    this.player.vy = 0;
                    this.player.isJumping = false;
                    
                    // Snap rotation to nearest 90
                    this.player.rotation = Math.round(this.player.rotation / 90) * 90;
                } else {
                    // Rotate while jumping
                    this.player.rotation += 4;
                }
            }
            
            // Advance level
            this.distance += this.speed;
            const progressPct = Math.min(100, Math.floor((this.distance / this.levelLength) * 100));
            this.progressBar.style.width = `${progressPct}%`;
            this.progressText.innerText = `${progressPct}%`;
            
            if (this.distance >= this.levelLength) {
                this.win();
                return;
            }
            
            // Obstacles & Collisions
            if (this.isCustomLevel) {
                this.spawnCustomSequence();
            } else {
                this.spawnObstacle();
            }
            
            let onBlock = false;
            
            for (let i = 0; i < this.obstacles.length; i++) {
                let obs = this.obstacles[i];
                obs.x -= this.speed;
                
                let collidePadding = (obs.type === 'spike') ? 10 : 2;
                if (obs.type === 'portal') collidePadding = 0;
                
                // AABB Collision Check
                if (this.player.x < obs.x + obs.width - collidePadding &&
                    this.player.x + this.player.size > obs.x + collidePadding &&
                    this.player.y < obs.y + obs.height - collidePadding &&
                    this.player.y + this.player.size > obs.y + collidePadding) {
                    
                    if (obs.type === 'portal') {
                        // Transform player logic
                        this.isPlane = obs.isTargetPlane;
                        this.player.rotation = 0;
                        this.player.vy = 0; // reset momentum
                        
                        // Disable this portal so it doesn't re-trigger continuously
                        obs.type = 'used_portal';
                    } else if (obs.type === 'spike') {
                        this.die(); // Always die on spikes
                    } else if (obs.type === 'block') {
                        // Check if landing on top
                        const isLandingFromAbove = (this.player.y + this.player.size - this.player.vy) <= obs.y + collidePadding * 2;
                        
                        if (isLandingFromAbove && this.player.vy >= 0) {
                            this.player.y = obs.y - this.player.size;
                            this.player.vy = 0;
                            if (!this.isPlane) {
                                this.player.isJumping = false;
                                this.player.rotation = Math.round(this.player.rotation / 90) * 90;
                            }
                            onBlock = true;
                        } else {
                            // Hit the side or bottom of the block
                            this.die();
                        }
                    }
                }
            }
            
            // If player was on a block but falls off, gravity should apply next tick naturally.
            
            // Trail Particles
            if (!this.player.isJumping && !this.isGameOver) {
                // Spawn trail
                if (Math.random() > 0.5) {
                    this.trailParticles.push({
                        x: this.player.x + Math.random() * this.player.size/2,
                        y: this.player.y + this.player.size - 5,
                        size: Math.random() * 8 + 2,
                        alpha: 1
                    });
                }
            }
            
            // Update trail
            for (let i = 0; i < this.trailParticles.length; i++) {
                let p = this.trailParticles[i];
                p.x -= this.speed;
                p.alpha -= 0.05;
            }
            this.trailParticles = this.trailParticles.filter(p => p.alpha > 0);
            
            // Cleanup passed obstacles
            this.obstacles = this.obstacles.filter(obs => obs.x + obs.width > 0);
            
            // Continuous jumping if held
            if (this.jumpHeld && !this.player.isJumping) {
                this.jump();
            }
        }
        
        draw() {
            // Clear
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (this.isFinished) return;
            
            // Draw Ceiling line
            this.ctx.strokeStyle = '#00f3ff';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.ceilingY);
            this.ctx.lineTo(this.canvas.width, this.ceilingY);
            this.ctx.stroke();
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#00f3ff';
            this.ctx.stroke(); // Double stroke for glow
            this.ctx.shadowBlur = 0;
            
            // Fill ceiling area
            this.ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.ceilingY);

            // Draw Ground line
            this.ctx.strokeStyle = '#00f3ff';
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.groundY);
            this.ctx.lineTo(this.canvas.width, this.groundY);
            this.ctx.stroke();
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = '#00f3ff';
            this.ctx.stroke(); // Double stroke for glow
            this.ctx.shadowBlur = 0;
            
            // Fill ground area
            this.ctx.fillStyle = 'rgba(0, 243, 255, 0.1)';
            this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
            
            // Draw Player
            if (!this.isGameOver) {
                this.ctx.save();
                this.ctx.translate(this.player.x + this.player.size/2, this.player.y + this.player.size/2);
                this.ctx.rotate(this.player.rotation * Math.PI / 180);
                
                if (this.isPlane) {
                    // Draw a plane/ship shape
                    this.ctx.fillStyle = window.selectedPlayerColor || '#ff00c1';
                    this.ctx.beginPath();
                    // Rocket body
                    this.ctx.moveTo(-this.player.size/2, -this.player.size/4);
                    this.ctx.lineTo(this.player.size/2, 0);
                    this.ctx.lineTo(-this.player.size/2, this.player.size/4);
                    this.ctx.closePath();
                    this.ctx.fill();
                    
                    // Cockpit
                    this.ctx.fillStyle = '#fff';
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, this.player.size/6, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    if (!window.selectedPlayerColor && this.cubeImg.complete && this.cubeImg.naturalHeight !== 0) {
                        this.ctx.drawImage(this.cubeImg, -this.player.size/2, -this.player.size/2, this.player.size, this.player.size);
                    } else {
                        this.ctx.fillStyle = window.selectedPlayerColor || '#ff00c1';
                        this.ctx.fillRect(-this.player.size/2, -this.player.size/2, this.player.size, this.player.size);
                        
                        // Inner square for geometry dash aesthetic
                        this.ctx.fillStyle = '#111';
                        this.ctx.fillRect(-this.player.size/4, -this.player.size/4, this.player.size/2, this.player.size/2);
                    }
                }
                this.ctx.restore();
            }
            
            // Draw Trail
            for (let p of this.trailParticles) {
                this.ctx.globalAlpha = p.alpha;
                this.ctx.fillStyle = window.selectedPlayerColor || '#00f3ff';
                this.ctx.fillRect(p.x, p.y, p.size, p.size);
            }
            this.ctx.globalAlpha = 1.0;
            
            // Draw Obstacles
            for (let obs of this.obstacles) {
                if (obs.type === 'spike') {
                    this.ctx.fillStyle = '#39ff14';
                    this.ctx.shadowBlur = 10;
                    this.ctx.shadowColor = '#39ff14';
                    let numSpikes = Math.round(obs.width / 40);
                    for (let s = 0; s < numSpikes; s++) {
                        this.ctx.beginPath();
                        if (obs.isUpsideDown) {
                            // Point goes downward
                            this.ctx.moveTo(obs.x + (s*40) + 20, obs.y + obs.height);
                            this.ctx.lineTo(obs.x + (s*40) + 40, obs.y);
                            this.ctx.lineTo(obs.x + (s*40), obs.y);
                        } else {
                            // Point goes upward
                            this.ctx.moveTo(obs.x + (s*40) + 20, obs.y);
                            this.ctx.lineTo(obs.x + (s*40) + 40, obs.y + obs.height);
                            this.ctx.lineTo(obs.x + (s*40), obs.y + obs.height);
                        }
                        this.ctx.fill();
                    }
                    this.ctx.shadowBlur = 0;
                } else if (obs.type === 'block') {
                    if (this.blockImg.complete && this.blockImg.naturalHeight !== 0) {
                        let numBlocks = Math.round(obs.height / 50);
                        for (let b = 0; b < numBlocks; b++) {
                            this.ctx.drawImage(this.blockImg, obs.x, obs.y + (b * 50), obs.width, 50);
                        }
                    } else {
                        this.ctx.fillStyle = '#00f3ff';
                        this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
                        this.ctx.strokeStyle = '#fff';
                        this.ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
                    }
                } else if (obs.type === 'portal') {
                    // Draw a glowing oval portal
                    const portalColor = obs.isTargetPlane ? '#ff8800' : '#0088ff';
                    this.ctx.strokeStyle = portalColor;
                    this.ctx.lineWidth = 5;
                    this.ctx.shadowBlur = 20;
                    this.ctx.shadowColor = portalColor;
                    
                    this.ctx.beginPath();
                    this.ctx.ellipse(obs.x + obs.width/2, obs.y + obs.height/2, obs.width/2, Math.max(obs.height/2 - 10, 10), 0, 0, Math.PI * 2);
                    this.ctx.stroke();
                    
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                    this.ctx.fill();
                    
                    this.ctx.shadowBlur = 0;
                    this.ctx.lineWidth = 1;
                }
            }
        }
        
        loop() {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.loop());
        }
    }

    // --- AUDIO ENGINE ---
    class AudioEngine {
        constructor() {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.bgmOscillator = null;
            this.bgmGain = null;
            this.isPlayingBgm = false;
        }

        resume() {
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playJump() {
            this.resume();
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
        }

        playCrash() {
            this.resume();
            
            // Noise buffer
            const bufferSize = this.ctx.sampleRate * 0.5; // 0.5 seconds
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1; // white noise
            }
            
            const noiseSource = this.ctx.createBufferSource();
            noiseSource.buffer = buffer;
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);
            
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
            
            noiseSource.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            
            noiseSource.start();
        }

        toggleBGM(play, level = 1) {
            this.resume();
            this.currentLevel = level;
            if (play && !this.isPlayingBgm) {
                this.isPlayingBgm = true;
                this.playArpeggio();
            } else if (!play && this.isPlayingBgm) {
                this.isPlayingBgm = false;
            }
        }

        playArpeggio() {
            if (!this.isPlayingBgm) return;
            
            const isLevel2 = this.currentLevel === 2;
            const notes = isLevel2 
                ? [293.66, 349.23, 440.00, 523.25] // D Minor scale arpeggio
                : [220.00, 261.63, 329.63, 392.00]; // A Minor Pentatonic
            
            const speed = isLevel2 ? 0.12 : 0.15; // slightly faster for level 2
            const oscType = isLevel2 ? 'square' : 'sawtooth'; // different instrument
            
            const now = this.ctx.currentTime;
            
            for (let i = 0; i < 8; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = oscType;
                // Loop through notes
                let note = notes[i % notes.length];
                if (i >= 4) note *= 2; // Octave up
                
                osc.frequency.setValueAtTime(note, now + i * speed);
                
                gain.gain.setValueAtTime(0, now + i * speed);
                gain.gain.linearRampToValueAtTime(0.05, now + i * speed + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * speed);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start(now + i * speed);
                osc.stop(now + (i + 1) * speed);
            }
            
            setTimeout(() => {
                if (this.isPlayingBgm) this.playArpeggio();
            }, 8 * speed * 1000);
        }
    }

    console.log('Geometry Dash 2 Home Screen Initialized');
});
