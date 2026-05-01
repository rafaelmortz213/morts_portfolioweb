// ============================================
// MAIN APPLICATION LOGIC
// ============================================

class Portfolio {
    constructor() {
        this.init();
    }

    init() {
        this.initNavigation();
        this.initScrollAnimations();
        this.initTypingEffect();
        this.loadProjects();
        this.initSkillAnimations();
    }

    // Navigation
    initNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .stagger-item').forEach(el => {
            observer.observe(el);
        });
    }

    // Typing Effect
    initTypingEffect() {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;

        const texts = [
            'Junior System Developer',
            'Database Architect',
            'Problem Solver',
            'Code Enthusiast'
        ];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500;
            }

            setTimeout(type, typingSpeed);
        };

        type();
    }

    // Load Projects
    async loadProjects() {
        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            window.projectsData = data.projects;
            this.renderProjects(data.projects);
            this.initProjectFilters();
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showProjectError();
        }
    }

    renderProjects(projects) {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        grid.innerHTML = projects.map(project => `
            <div class="project-card fade-in" data-category="${project.category}" data-id="${project.id}">
                <div class="project-header">
                    <div class="project-icon">${project.icon}</div>
                    <span class="project-category">${project.category}</span>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.shortDescription}</p>
                <div class="project-tech">
                    ${project.techStack.slice(0, 4).map(tech => `
                        <span class="tech-badge">${tech}</span>
                    `).join('')}
                    ${project.techStack.length > 4 ? `<span class="tech-badge">+${project.techStack.length - 4}</span>` : ''}
                </div>
                <div class="project-footer">
                    <button class="view-details" data-id="${project.id}">
                        View Details <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const projectId = parseInt(e.currentTarget.dataset.id);
                this.openProjectModal(projectId);
            });
        });

        // Reinitialize scroll animations
        this.initScrollAnimations();
    }

    initProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                // Filter projects
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => card.classList.add('visible'), 10);
                    } else {
                        card.classList.remove('visible');
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    openProjectModal(projectId) {
        const project = window.projectsData.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('projectModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">${project.title}</h2>
                <div class="modal-meta">
                    <span class="meta-item">
                        <i class="fas fa-folder"></i>
                        ${project.category}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-code"></i>
                        ${project.techStack.length} Technologies
                    </span>
                </div>
            </div>

            <div class="project-gallery">
                <div class="gallery-main">
                    ${project.images.map((img, index) => `
                        <img src="${img}" alt="${project.title} - Image ${index + 1}" 
                             class="gallery-image ${index === 0 ? 'active' : ''}" 
                             data-index="${index}">
                    `).join('')}
                    <div class="gallery-nav">
                        <button class="gallery-btn prev-btn">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <button class="gallery-btn next-btn">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div class="gallery-thumbnails">
                    ${project.images.map((img, index) => `
                        <img src="${img}" alt="Thumbnail ${index + 1}" 
                             class="thumbnail ${index === 0 ? 'active' : ''}" 
                             data-index="${index}">
                    `).join('')}
                </div>
            </div>

            <div class="project-details">
                <div class="detail-section">
                    <h3><i class="fas fa-info-circle"></i> About This Project</h3>
                    <p>${project.fullDescription}</p>
                </div>

                <div class="detail-section">
                    <h3><i class="fas fa-list"></i> Key Features</h3>
                    <ul class="features-list">
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>

                <div class="detail-section">
                    <h3><i class="fas fa-tools"></i> Technologies Used</h3>
                    <div class="project-tech">
                        ${project.techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                    </div>
                </div>

                <div class="detail-section">
                    <h3><i class="fas fa-lightbulb"></i> Project Highlights</h3>
                    <div class="highlights-grid">
                        <div class="highlight-card">
                            <h4><i class="fas fa-puzzle-piece"></i> Challenge</h4>
                            <p>${project.highlights.challenge}</p>
                        </div>
                        <div class="highlight-card">
                            <h4><i class="fas fa-check-circle"></i> Solution</h4>
                            <p>${project.highlights.solution}</p>
                        </div>
                        <div class="highlight-card">
                            <h4><i class="fas fa-chart-line"></i> Impact</h4>
                            <p>${project.highlights.impact}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Initialize gallery
        this.initGallery();

        // Close handlers
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');

        closeBtn.addEventListener('click', () => this.closeModal());
        overlay.addEventListener('click', () => this.closeModal());

        // ESC key to close
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    initGallery() {
        const images = document.querySelectorAll('.gallery-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentIndex = 0;

        const showImage = (index) => {
            images.forEach(img => img.classList.remove('active'));
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            images[index].classList.add('active');
            thumbnails[index].classList.add('active');
            currentIndex = index;
        };

        prevBtn.addEventListener('click', () => {
            const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            showImage(newIndex);
        });

        nextBtn.addEventListener('click', () => {
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            showImage(newIndex);
        });

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                showImage(parseInt(thumb.dataset.index));
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        });
    }

    closeModal() {
        const modal = document.getElementById('projectModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showProjectError() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p style="color: var(--text-secondary);">
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 10px;"></i><br>
                    Unable to load projects. Please try again later.
                </p>
            </div>
        `;
    }

    // Skill Animations
    initSkillAnimations() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });

        skillItems.forEach(item => skillObserver.observe(item));
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
});

// Add some interactive particles (optional)
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    hero.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Uncomment to enable particles
// createParticles();