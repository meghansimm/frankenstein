window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('violencefire-2');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = 2000;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const particles = [];

    
    

    class Particle {
        constructor(x, y, speed, angle) {
            this.x = x;
            this.y = y;
            this.speed = speed;
            this.initialRadius = Math.random() * 15 + 0.5;
            this.currentRadius = this.initialRadius;
            this.angle = angle;
            // this.color = Math.random() < 0.25 ? '#FF0000' : '#000000';
            this.isAlive = true;
            this.lifeSpan = 100;
            this.lifeRemaining = this.lifeSpan;

            this.color = "#000000";

            this.redChance = Math.random();
        this.hasTurnedRed = false;
        if (this.redChance < 0.5) { 
            this.redTimer = Math.floor(Math.random() * 80) + 10; // Random delay between 50 and 200 frames
        } else {
            this.redTimer = -1; // No timer for particles that won't turn red
        }
        }
        
        

        draw(context) {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
            context.fill();
        }

        update() {
            // Move particle
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
            this.lifeRemaining--;

            // Shrink the particle based on remaining lifespan
            // This creates a smooth shrinking effect towards the end of its life
            this.currentRadius = this.initialRadius * (this.lifeRemaining / this.lifeSpan);

            // Mark particle for removal if lifespan is over or it's too small
            if (this.lifeRemaining <= 0 || this.currentRadius <= 0.1) {
                this.isAlive = false;
            }

                    if (this.redTimer > 0) {
            this.redTimer--;
            if (this.redTimer === 0) {
                this.color = "#F1271C";
                this.hasTurnedRed = true;
            }
        }
        }
    }

    // Function to add new particles
    const addParticles = (x, y) => {
        const numOfParticlesOnMouseMove = 100;
        for (let i = 0; i < numOfParticlesOnMouseMove; i++) {
            const speed = Math.random() * 20;
            const angle = Math.random() * Math.PI * 2;
            particles.push(new Particle(x, y, speed, angle));
        }
    };

    // Main animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            if (particle.isAlive) {
                particle.update();
                particle.draw(ctx);
            } else {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Start the animation
    animate();

    let lastMouseX = 0;
    let lastMouseY = 0;


    // Update mouse coordinates when the mouse moves
    window.addEventListener("mousemove", e => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        addParticles(mouseX, mouseY);
        updateRelativeMousePosition();
    });

    const updateRelativeMousePosition = () => {
    const rect = canvas.getBoundingClientRect();
    mouseX = lastMouseX - rect.left;
    mouseY = lastMouseY - rect.top;
     };
    
    // Adjust mouse coordinates when the window is scrolled
    window.addEventListener("scroll", () => {
        updateRelativeMousePosition();
        // Create a new set of particles at the adjusted coordinates
        addParticles(mouseX + window.scrollX, mouseY + window.scrollY);
    });


});
