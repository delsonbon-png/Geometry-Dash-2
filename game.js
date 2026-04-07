document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('bg-particles');
    const playBtn = document.getElementById('btn-play');
    
    // --- Screen Elements ---
    const homeScreen = document.getElementById('home-screen');
    const levelSelectScreen = document.getElementById('level-select-screen');
    const gameStage = document.getElementById('game-stage');
    const backBtn = document.getElementById('btn-back-home');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const progressBar = document.getElementById('game-progress-bar');
    const attemptText = document.getElementById('attempt-counter');
    const deathOverlay = document.getElementById('death-overlay');

    // --- Navigation Logic ---
    const showScreen = (screenToShow) => {
        console.log('Alternando para tela:', screenToShow.id);
        
        [homeScreen, levelSelectScreen, gameStage].forEach(s => {
            s.classList.remove('active-screen');
            s.classList.add('screen-hidden');
        });
        
        setTimeout(() => {
            screenToShow.classList.remove('screen-hidden');
            screenToShow.classList.add('active-screen');
            if (screenToShow.id === 'game-stage') initGame();
        }, 50);
    };

    // Global Click Handler (for better reliability)
    document.addEventListener('click', (e) => {
        const target = e.target;
        console.log('Global Click:', target.tagName, target.className, target.id);
        
        if (target.id === 'btn-play' || target.closest('#btn-play')) {
            showScreen(levelSelectScreen);
        }
        
        if (target.id === 'btn-back-home' || target.closest('#btn-back-home')) {
            showScreen(homeScreen);
        }
        
        if (target.classList.contains('btn-level-play') || target.closest('.btn-level-play')) {
            console.log('LET\'S GO Clicado!');
            showScreen(gameStage);
        }
    });

    // --- Particle System ---
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 3 + 1;
        particle.style.cssText = `
            position: absolute; width: ${size}px; height: ${size}px;
            background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%; top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;
            box-shadow: 0 0 ${size * 2}px white;
            animation: moveParticle ${Math.random() * 10 + 5}s linear ${Math.random() * 5}s infinite;
        `;
        container.appendChild(particle);
        setTimeout(() => { particle.remove(); createParticle(); }, 15000);
    };
    for (let i = 0; i < 30; i++) setTimeout(createParticle, i * 100);

    // --- Game Engine ---
    let gameActive = false;
    let attempts = 1;
    let frameId;
    
    const player = {
        x: 100, y: 0, size: 50,
        dy: 0, gravity: 0.8, jumpPower: -16,
        ground: 0, rotation: 0,
        img: new Image()
    };
    player.img.src = 'assets/cube_logo.png';

    const spikeImg = new Image();
    spikeImg.src = 'assets/spike.png';

    let obstacles = [];
    let gameSpeed = 8;
    let score = 0;
    let levelLength = 5000;

    const initGame = () => {
        console.log('Iniciando Motor do Jogo...');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        player.ground = canvas.height * 0.7;
        player.y = player.ground - player.size;
        player.dy = 0;
        player.rotation = 0;
        
        obstacles = [];
        for (let i = 0; i < 20; i++) {
            obstacles.push({
                x: 800 + i * (600 + Math.random() * 400),
                width: 50, height: 50
            });
        }
        
        score = 0;
        gameActive = true;
        deathOverlay.classList.add('hidden');
        attemptText.innerText = `ATTEMPT ${attempts}`;
        animate();
    };

    const jump = () => {
        if (player.y === player.ground - player.size && gameActive) {
            player.dy = player.jumpPower;
        }
    };

    window.addEventListener('keydown', (e) => { if (e.code === 'Space' || e.code === 'ArrowUp') jump(); });
    canvas.addEventListener('mousedown', jump);

    const animate = () => {
        if (!gameActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Ground Line
        ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, player.ground);
        ctx.lineTo(canvas.width, player.ground);
        ctx.stroke();

        // Player Physics
        player.dy += player.gravity;
        player.y += player.dy;

        if (player.y > player.ground - player.size) {
            player.y = player.ground - player.size;
            player.dy = 0;
            player.rotation = Math.round(player.rotation / 90) * 90;
        } else {
            player.rotation += 5;
        }

        // Draw Player
        ctx.save();
        ctx.translate(player.x + player.size/2, player.y + player.size/2);
        ctx.rotate(player.rotation * Math.PI / 180);
        ctx.drawImage(player.img, -player.size/2, -player.size/2, player.size, player.size);
        ctx.restore();

        // Obstacles
        obstacles.forEach((obs) => {
            obs.x -= gameSpeed;
            ctx.drawImage(spikeImg, obs.x, player.ground - obs.height, obs.width, obs.height);
            if (player.x + player.size * 0.7 > obs.x && player.x + player.size * 0.3 < obs.x + obs.width && player.y + player.size > player.ground - obs.height) {
                gameOver();
            }
        });

        // Progress
        score += gameSpeed;
        const progress = Math.min((score / levelLength) * 100, 100);
        progressBar.style.width = `${progress}%`;

        if (progress >= 100) { gameActive = false; alert('LEVEL COMPLETE!'); showScreen(levelSelectScreen); }
        frameId = requestAnimationFrame(animate);
    };

    const gameOver = () => {
        gameActive = false;
        attempts++;
        deathOverlay.classList.remove('hidden');
        cancelAnimationFrame(frameId);
        setTimeout(initGame, 1000);
    };

    // Global Ripple Effect
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

    console.log('Geometry Dash 2 Engine Ready');
});
