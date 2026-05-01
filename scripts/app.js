// ============================================
// ALL-IN-ONE PORTFOLIO SCRIPT
// ============================================

console.log('Portfolio script loaded');

class PortfolioApp {
    constructor() {
        this.projects = [];
        this.services = [];
        this.init();
    }

    init() {
        console.log('Initializing portfolio...');
        this.initNavigation();
        this.initTypingEffect();
        this.initSkillAnimations();
        this.loadProjects();
        this.loadServices();
        this.initModals();
    }

    // ==================== NAVIGATION ====================
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
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger?.classList.remove('active');
                navMenu?.classList.remove('active');
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
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ==================== TYPING EFFECT ====================
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

        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = isDeleting ? 50 : 100;

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

    // ==================== SKILLS ====================
    initSkillAnimations() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.5 });

        skillItems.forEach(item => observer.observe(item));
    }

    // ==================== PROJECTS ====================
    async loadProjects() {
        console.log('Loading projects...');
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) throw new Error('Failed to load projects');
            
            const data = await response.json();
            this.projects = data.projects;
            console.log('Projects loaded:', this.projects.length);
            
            this.renderProjects(this.projects);
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
            <div class="project-card" data-category="${project.category}" data-id="${project.id}">
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
    }

    initProjectFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('projectModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">${project.title}</h2>
                <div class="modal-meta">
                    <span class="meta-item">
                        <i class="fas fa-folder"></i> ${project.category}
                    </span>
                    <span class="meta-item">
                        <i class="fas fa-code"></i> ${project.techStack.length} Technologies
                    </span>
                </div>
            </div>

            <div class="project-gallery">
                <div class="gallery-main">
                    ${project.images.map((img, index) => `
                        <img src="${img}" alt="${project.title}" 
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
                        <img src="${img}" alt="Thumbnail" 
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
                        ${project.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>

                <div class="detail-section">
                    <h3><i class="fas fa-tools"></i> Technologies Used</h3>
                    <div class="project-tech">
                        ${project.techStack.map(t => `<span class="tech-badge">${t}</span>`).join('')}
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

        this.initGallery();
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

        prevBtn?.addEventListener('click', () => {
            const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            showImage(newIndex);
        });

        nextBtn?.addEventListener('click', () => {
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            showImage(newIndex);
        });

        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                showImage(parseInt(thumb.dataset.index));
            });
        });
    }

    showProjectError() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p style="color: var(--text-secondary);">
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem;"></i><br>
                    Unable to load projects. Please check data/projects.json
                </p>
            </div>
        `;
    }

    // ==================== SERVICES ====================
    async loadServices() {
        console.log('Loading services...');
        try {
            const response = await fetch('data/services.json');
            if (!response.ok) throw new Error('Failed to load services');
            
            const data = await response.json();
            this.services = data.services;
            console.log('Services loaded:', this.services.length);
            
            this.renderServices(data);
        } catch (error) {
            console.error('Error loading services:', error);
            this.showServiceError();
        }
    }

    renderServices(data) {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;

        grid.innerHTML = data.services.map(service => `
            <div class="service-card">
                <div class="service-header">
                    <div class="service-icon">${service.icon}</div>
                    <div class="service-title-group">
                        <h3 class="service-title">${service.title}</h3>
                        <p class="service-tagline">${service.tagline}</p>
                    </div>
                </div>
                <p class="service-description">${service.description}</p>
                <ul class="service-features">
                    ${service.features.slice(0, 5).map(f => `<li>${f}</li>`).join('')}
                </ul>
                <div class="service-technologies">
                    ${service.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <div class="service-meta">
                    <span class="meta-badge">
                        <i class="fas fa-dollar-sign"></i> ${service.pricing}
                    </span>
                    <span class="meta-badge">
                        <i class="far fa-clock"></i> ${service.deliveryTime}
                    </span>
                </div>
            </div>
        `).join('');

        // Render process
        const processSteps = document.getElementById('processSteps');
        if (processSteps && data.process) {
            processSteps.innerHTML = data.process.map(step => `
                <div class="process-step">
                    <div class="step-number">
                        <span class="step-icon">${step.icon}</span>
                    </div>
                    <h4 class="step-title">${step.title}</h4>
                    <p class="step-description">${step.description}</p>
                </div>
            `).join('');
        }

        // Update CTA if provided
        if (data.cta) {
            const ctaNote = document.getElementById('ctaNote');
            if (ctaNote) {
                ctaNote.innerHTML = `<i class="fas fa-info-circle"></i> ${data.cta.note}`;
            }
        }
    }

    showServiceError() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p style="color: var(--text-secondary);">
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem;"></i><br>
                    Unable to load services. Please check data/services.json
                </p>
            </div>
        `;
    }

    // ==================== MODALS ====================
    initModals() {
        // Project Modal
        const projectModal = document.getElementById('projectModal');
        const closeProjectBtn = document.getElementById('closeProjectModal');
        const projectOverlay = document.getElementById('projectModalOverlay');

        const closeProjectModal = () => {
            projectModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeProjectBtn?.addEventListener('click', closeProjectModal);
        projectOverlay?.addEventListener('click', closeProjectModal);

        // Pricing Modal
        const pricingModal = document.getElementById('pricingModal');
        const openPricingBtn = document.getElementById('pricingModalBtn');
        const closePricingBtn = document.getElementById('closePricingModal');
        const pricingOverlay = document.getElementById('pricingModalOverlay');

        const closePricingModal = () => {
            pricingModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        openPricingBtn?.addEventListener('click', () => {
            pricingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closePricingBtn?.addEventListener('click', closePricingModal);
        pricingOverlay?.addEventListener('click', closePricingModal);

        // ESC key closes modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeProjectModal();
                closePricingModal();
            }
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PortfolioApp();
    });
} else {
    new PortfolioApp();
}