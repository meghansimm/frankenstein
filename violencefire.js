window.addEventListener('DOMContentLoaded', function() {
    
    const canvas = document.getElementById('violencefire');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    
    // Particle class
    class Particle {
        constructor(effect) {
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = this.effect.height;
            this.size = Math.floor(Math.random() * 6);
            
    
            // Set initial upward speed and subtle horizontal drift
            this.vx = (Math.random() * 2 - 1) * 0.5;
            this.vy = Math.random() * 4;    // Move up between 0.5 and 2.0
            // this.color = Math.random() < 0.25 ? '#FF0000' : '#000000';
            this.color = "#000000";

            this.redChance = Math.random();
        this.hasTurnedRed = false;
        if (this.redChance < 0.25) { // 5% chance to become red
            this.redTimer = Math.floor(Math.random() * 150) + 50; // Random delay between 50 and 200 frames
        } else {
            this.redTimer = -1; // No timer for particles that won't turn red
        }
        }
        update() {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = this.effect.mouse.radius / this.distance;

            if (this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

            this.x += this.vx; // Drift horizontally
            this.y -= this.vy; // Move upward
            this.size -= 0.025; 


        // Check if this particle is scheduled to turn red
        if (this.redTimer > 0) {
            this.redTimer--;
            if (this.redTimer === 0) {
                this.color = "#DE2703";
                this.hasTurnedRed = true;
            }
        }
            
        }
        draw(context) {
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fill();
        }
    }
    
    // Effect class to manage particles
    class Effect {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.particlesArray = [];

            this.mouse = {
                radius: 7000,
                x: 0,
                y: 0
            };

            let lastMouseX = 0;
            let lastMouseY = 0;

            const updateRelativeMousePosition = () => {
                const rect = this.context.canvas.getBoundingClientRect();
                this.mouse.x = lastMouseX - rect.left;
                this.mouse.y = lastMouseY - rect.top;
            };

            window.addEventListener('mousemove', (e) => {
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
                updateRelativeMousePosition();
            });

            window.addEventListener('scroll', () => {
                updateRelativeMousePosition();
            });
        }

        
        init() {
            for(let i = 0; i < 1500; i++){
            this.particlesArray.push(new Particle(this));
            }

        }
        draw(context){
            this.particlesArray.forEach(particle => particle.draw(context));
        }
    update() {
        // Create a small number of new particles each frame
        const numParticlesPerFrame = 50; // Adjust for more or fewer particles
        for (let i = 0; i < numParticlesPerFrame; i++) {
            this.particlesArray.push(new Particle(this));
        }

        // Update existing particles
        this.particlesArray.forEach(particle => particle.update());
        
        // Filter out particles that have shrunk and disappeared
        this.particlesArray = this.particlesArray.filter(
            particle => particle.size > 0.2
        );
    }
}

    function loadAndStartAnimation() {
        const effect = new Effect(canvas.width, canvas.height);
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'source-over';
            
            effect.draw(ctx);
            effect.update();
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    // Use Intersection Observer to trigger the animation
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadAndStartAnimation(); // Call the load function
                obs.unobserve(entry.target); // Stop observing after it's loaded
            }
        });
    });

    // Start observing the canvas element
    observer.observe(canvas);
});


    
//     const effect = new Effect(canvas.width, canvas.height);

    
//     // Animation loop
// function animate() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     // Set composite operation here, outside the loop
//     ctx.globalCompositeOperation = 'source-over';
    
//     effect.draw(ctx);
//     effect.update();
//     requestAnimationFrame(animate);
// }

    
//     animate();

//         // Use Intersection Observer to trigger the animation
//     const observer = new IntersectionObserver((entries, obs) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 loadAndStartAnimation(); // Call the load function
//                 obs.unobserve(entry.target); // Stop observing after it's loaded
//             }
//         });
//     });

//     // Start observing the canvas element
//     observer.observe(canvas);
// });
