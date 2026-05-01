// ============================================
// ADVANCED ANIMATIONS & EFFECTS
// ============================================

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.initParallax();
        this.initCursorEffect();
        this.initTextReveal();
    }

    // Parallax Effect
    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Custom Cursor Effect
    initCursorEffect() {
        if (window.innerWidth < 768) return; // Skip on mobile

        const cursor = document.createElement('div');
        cursor.className = 'cursor-trail';
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animate = () => {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;
            
            cursorX += dx * 0.1;
            cursorY += dy * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(animate);
        };

        animate();

        // Scale cursor on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }

    // Text Reveal Animation
    initTextReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.revealText(entry.target);
                }
            });
        }, { threshold: 0.5 });

        revealElements.forEach(el => observer.observe(el));
    }

    revealText(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = 1;

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = 0;
            span.style.animation = `fadeInChar 0.5s ease forwards ${index * 0.03}s`;
            element.appendChild(span);
        });
    }

    // Smooth Page Transitions
    static pageTransition(callback) {
        document.body.style.opacity = 0;
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            callback();
            document.body.style.opacity = 1;
        }, 300);
    }

    // Count Up Animation
    static countUp(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// Add animation keyframes
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes fadeInChar {
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(animStyle);

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});

window.AnimationController = AnimationController;