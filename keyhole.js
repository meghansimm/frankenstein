const canvas = document.getElementById('keyhole');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;

canvas.style.width = `${window.innerWidth}px`;
canvas.style.height = `${window.innerHeight}px`;

class Particle {
    constructor(x, y, effect) {
        this.originX = x;
        this.originY = y;
        this.effect = effect;
        this.x = Math.floor(x);
        this.y = Math.floor(y);
        this.ctx = this.effect.ctx;
        this.ctx.fillStyle = 'black';
        this.vx = 0;
        this.vy = 0;
        this.ease = Math.random () * 0.5 + 0.3;
        this.friction = Math.random () * 0.1 + 0.5;
        this.dx = 0;
        this.dy = 0;
        this.distance = 0;
        this.force = 0;
        this.angle = 0;
        this.size = Math.floor(Math.random() * 12);
        this.draw();
        
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    update() {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = this.dx * this.dx + this.dy * this.dy;
        this.force = -this.effect.mouse.radius / this.distance * 20;

        if (this.distance < this.effect.mouse.radius) {
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
        }

        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
        this.draw();
    }
}

class Effect {
    constructor(canvas, width, height, context) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.ctx = context;
        this.particlesArray = [];
        this.gap = 5;
        this.mouse = {
            radius: 500000,
            x: 0,
            y: 0
        };

        // Add wheel event listener directly to the canvas
        this.canvas.addEventListener('wheel', e => {
            

            if (e.deltaY < 0) { // Scrolled up
                this.mouse.radius = Math.max(this.mouse.radius / 1.012, 500000);
            } else { // Scrolled down
                this.mouse.radius = Math.min(this.mouse.radius * 1.012, 300000000);
            }
        });

        // Add mousemove listener directly to the canvas
        window.addEventListener('mousemove', e => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * window.devicePixelRatio;
            this.mouse.y = (e.clientY - rect.top) * window.devicePixelRatio;
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth * window.devicePixelRatio;
            canvas.height = window.innerHeight * window.devicePixelRatio;
            this.width = canvas.width;
            this.height = canvas.height;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;

            this.particlesArray = [];
            this.init();
        });
        this.init();
    }

    init() {
        for (let x = 0; x < this.width; x += this.gap) {
            for (let y = 0; y < this.height; y += this.gap) {
                this.particlesArray.push(new Particle(x, y, this));
            }
        }
    }

    update() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        for (let i = 0; i < this.particlesArray.length; i++) {
            this.particlesArray[i].update();
        }
    }
}

// Pass the canvas element to the Effect constructor
let effect = new Effect(canvas, canvas.width, canvas.height, ctx);

function animate() {
    effect.update();
    requestAnimationFrame(animate);
}
animate();
