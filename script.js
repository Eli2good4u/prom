// script.js
(function() {
    // ---------- FALLING FLOWERS (continuous) ----------
    const garden = document.getElementById('flowerGarden');
    const FLOWER_COLORS = ['#ff99aa', '#ffb3c6', '#ffc1cc', '#ffa5b9', '#f9acbc', '#ffb7c5', '#f8c3cd', '#ffd1dc'];
    
    function createFallingFlower() {
        const flower = document.createElement('div');
        flower.className = 'falling-flower';
        
        // random position, size, duration
        flower.style.left = Math.random() * 100 + '%';
        const scale = 0.6 + Math.random() * 1.0;
        flower.style.transform = `scale(${scale})`;
        const duration = 6 + Math.random() * 8;
        flower.style.animationDuration = duration + 's';
        flower.style.animationDelay = Math.random() * 5 + 's';
        
        const petalColor = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];
        
        // build petals
        for (let i = 1; i <= 5; i++) {
            const petal = document.createElement('div');
            petal.className = `petal petal${i}`;
            petal.style.background = petalColor;
            flower.appendChild(petal);
        }
        const center = document.createElement('div');
        center.className = 'center';
        flower.appendChild(center);
        
        garden.appendChild(flower);
        
        // remove after animation ends
        setTimeout(() => flower.remove(), (duration + 2) * 1000);
    }
    
    // generate flowers periodically
    setInterval(createFallingFlower, 600);
    for (let i = 0; i < 8; i++) setTimeout(createFallingFlower, i * 200);

    // ---------- CONFETTI (trigger on YES) ----------
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let animFrame = null;
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class ConfettiParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 5 + 4;
            this.speedX = Math.random() * 2 - 1;
            this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y > canvas.height + 20) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size * 0.6);
        }
    }

    function startConfetti() {
        if (animFrame) cancelAnimationFrame(animFrame);
        particles = Array.from({ length: 120 }, () => new ConfettiParticle());
        canvas.style.display = 'block';
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            animFrame = requestAnimationFrame(animate);
        }
        animate();
        
        setTimeout(() => {
            cancelAnimationFrame(animFrame);
            canvas.style.display = 'none';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animFrame = null;
        }, 5500);
    }

    // ---------- BUTTON LOGIC (yes/no) ----------
    const stageQuestion = document.getElementById('stageQuestion');
    const stageAccepted = document.getElementById('stageAccepted');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    let yesSize = 2.2, noSize = 2.2;
    const MAX_YES = 6.0;
    let noClicks = 0;

    function updateSizes() {
        yesBtn.style.fontSize = yesSize + 'rem';
        noBtn.style.fontSize = noSize + 'rem';
        yesBtn.style.padding = yesSize > 3.5 ? '20px 50px' : '16px 40px';
        if (noSize < 1.4) {
            noBtn.style.padding = '8px 20px';
            noBtn.style.minWidth = '80px';
        } else {
            noBtn.style.padding = '16px 40px';
            noBtn.style.minWidth = '140px';
        }
    }

    noBtn.addEventListener('click', () => {
        noClicks++;
        yesSize = Math.min(yesSize + 0.5, MAX_YES);
        noSize = Math.max(noSize - 0.4, 0.6);
        updateSizes();

        if (yesSize >= MAX_YES) {
            yesBtn.style.transform = 'scale(1.02)';
            setTimeout(() => yesBtn.style.transform = '', 200);
        }

        if (noClicks >= 3) noBtn.innerText = 'nope';
        if (noClicks >= 6) noBtn.innerText = 'stop';
        if (noClicks >= 8) noBtn.innerText = '🤨';
    });

    yesBtn.addEventListener('click', () => {
        stageQuestion.style.display = 'none';
        stageAccepted.style.display = 'flex';
        startConfetti();
        document.getElementById('dynamicSubtitle').innerText = '🎉 YOU SAID YES! 🎉';
        // extra flower burst
        for (let i = 0; i < 5; i++) setTimeout(createFallingFlower, i * 100);
    });

    // initial sync
    updateSizes();
})();