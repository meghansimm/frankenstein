


window.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('violencehouse');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    class Particle {
        constructor(effect, x, y, color,) {
            this.effect = effect;
            this.x = Math.random() * this.effect.canvasWidth;
            this.y = Math.random() * this.effect.canvasHeight;
            this.color = color;
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.size = Math.floor(Math.random() * 4);
            this.dx = 0;
            this.dy = 0;
            this.vx = 0;
            this.vy = 0;
            this.force = 0;
            this.angle = 0;
            this.distance = 0;
            this.friction = Math.random() * 0.6 + 0.15;
            this.ease = Math.random() * 0.1 + 0.006;
            this.jiggleAngle = Math.random() * Math.PI * .5;
            this.jiggleSpeed = Math.random() * 0.1 + 0.05;
            this.jiggleIntensity = Math.random() * 1;


    }
        draw() {
            this.effect.context.fillStyle = this.color;
            this.effect.context.beginPath();
            this.effect.context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            this.effect.context.fill();
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

            this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
            this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;

            this.jiggleAngle += this.jiggleSpeed;
            this.x += Math.sin(this.jiggleAngle) * this.jiggleIntensity;
            this.y += Math.cos(this.jiggleAngle) * this.jiggleIntensity;
        }
    }

    class Effect {
        constructor(context, canvasWidth, canvasHeight) {
            this.context = context;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;
            this.image = document.getElementById('violence-img');
            // this.centerX = Math.random() * canvasWidth;
            // this.centerY = Math.random() * canvasHeight;
            this.particles = [];
            this.gap = 6;
            this.mouse = {
                radius: 4000,
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
            // Ensure image is fully loaded before processing pixels
            if (!this.image.complete) {
                this.image.onload = () => this.processImage();
            } else {
                this.processImage();
            }
        }

        processImage() {
            this.particles = [];
            
            // 1. Generate and store the random coordinates for the image
            const imageX = Math.random() * (this.canvasWidth - this.image.width);
            const imageY = Math.random() * (this.canvasHeight - this.image.height);
            
            // Draw the image to get the pixel data
            this.context.drawImage(this.image, imageX, imageY);
            
            // Get pixel data using the same coordinates
            const pixels = this.context.getImageData(imageX, imageY, this.image.width, this.image.height).data;
            
            // Clear the canvas immediately after reading the pixels
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            
            for (let y = 0; y < this.image.height; y += this.gap) {
                for (let x = 0; x < this.image.width; x += this.gap) {
                    const index = (y * this.image.width + x) * 4;
                    const alpha = pixels[index + 3];
                    
                    if (alpha > 0) {
                        const red = pixels[index];
                        const green = pixels[index + 1];
                        const blue = pixels[index + 2];
                        const color = 'rgb(' + red + ',' + green + ',' + blue + ')';

                        // 2. Add the random image offset to the particle's origin
                        const particleOriginX = x + imageX;
                        const particleOriginY = y + imageY;
                        
                        // Now create the particle with the corrected origin
                        const emanate = Math.random() < this.emanateChance;
                        this.particles.push(new Particle(this, particleOriginX, particleOriginY, color, emanate));
                    }
                }
            }
        }


        render() {
            this.particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
        }
    }

    let effect; // Declare effect with `let` to allow re-assignment

    // Function to run the animation
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        effect.render();
        requestAnimationFrame(animate);
    }

    // A function to set up and start the whole animation
    function loadAndStartAnimation() {
        effect = new Effect(ctx, canvas.width, canvas.height);
        effect.init(); // Call the init method correctly
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
