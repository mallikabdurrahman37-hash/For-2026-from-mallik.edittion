// --- AUDIO ELEMENTS ---
const audioIntro = document.getElementById('bg-intro');
const audioFunny = document.getElementById('bg-funny');
const audioParty = document.getElementById('bg-party');
const videoElement = document.getElementById('memeVideo');

// Helper to stop all audio
function stopAllAudio() {
    audioIntro.pause();
    audioIntro.currentTime = 0;
    audioFunny.pause();
    audioFunny.currentTime = 0;
    audioParty.pause();
    audioParty.currentTime = 0;
    
    // Also pause video audio if it's playing
    videoElement.pause();
    videoElement.currentTime = 0;
}

// --- START EXPERIENCE (Modified to fix Audio Issue) ---
function startExperience() {
    // 1. Try to play the music immediately on the first click
    audioIntro.volume = 0.5;
    audioIntro.play().catch(error => {
        console.log("Browser blocked audio. Please click again.");
    });

    // 2. Find the button that was clicked
    const btn = document.querySelector('#slide-1 button');
    
    // 3. Change the button text instead of changing the slide immediately
    // This ensures the music plays while the user reads the warning
    btn.innerText = "ENTER THE CHAOS >>";
    btn.style.background = "linear-gradient(45deg, #ff0000, #ff4444)"; // Make it look urgent
    
    // 4. The NEXT click will take them to the video
    btn.onclick = function() {
        nextSlide(1);
    };
}

// --- NAVIGATION LOGIC ---
function nextSlide(currentSlideNumber) {
    // Hide current slide
    const current = document.getElementById(`slide-${currentSlideNumber}`);
    current.classList.remove('active');

    // Show next slide
    const nextNumber = currentSlideNumber + 1;
    const next = document.getElementById(`slide-${nextNumber}`);
    
    if (next) {
        next.classList.add('active');

        // --- MUSIC LOGIC PER SLIDE ---
        
        // SLIDE 2: VIDEO (The Prophecy)
        if (nextNumber === 2) {
            // FADE OUT Intro Music so we can hear the video
            audioIntro.pause(); 
            // Play Video
            videoElement.play().catch(e => console.log("Video autoplay blocked"));
            videoElement.muted = false; // Ensure sound is on
        }

        // SLIDE 3: MEMES START (Switch to Funny Music)
        if (nextNumber === 3) {
            // Stop Video
            videoElement.pause();
            // Start Funny Music
            audioFunny.volume = 0.6;
            audioFunny.play();
        }

        // SLIDE 7: MOCHA START (Switch to Party Music)
        if (nextNumber === 7) {
            stopAllAudio(); // Stop Funny Music
            audioParty.volume = 0.8;
            audioParty.play();
        }

        // SLIDE 10: FINALE
        if (nextNumber === 10) {
            // Party music keeps playing!
            startFireworks();
        }
    }
}

// --- HEAVY FIREWORKS LOGIC ---
function startFireworks() {
    const canvas = document.getElementById('fireworksCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let rockets = [];

    class Rocket {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
            this.velocity = {
                x: (Math.random() - 0.5) * 6,
                y: -(Math.random() * 5 + 12)
            };
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.velocity.y += 0.2;
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 10;
            this.velocity = {
                x: Math.cos(angle) * velocity,
                y: Math.sin(angle) * velocity
            };
            this.alpha = 1;
            this.friction = 0.96;
            this.gravity = 0.08;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
        update() {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.velocity.y += this.gravity;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.015;
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (Math.random() < 0.08) rockets.push(new Rocket());

        rockets.forEach((rocket, i) => {
            rocket.update();
            rocket.draw();
            if (rocket.velocity.y >= 0) {
                rockets.splice(i, 1);
                for (let j = 0; j < 100; j++) {
                    particles.push(new Particle(rocket.x, rocket.y, rocket.color));
                }
            }
        });

        particles.forEach((particle, i) => {
            if (particle.alpha > 0) {
                particle.update();
                particle.draw();
            } else {
                particles.splice(i, 1);
            }
        });
    }
    animate();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
