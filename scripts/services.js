// ============================================
// SERVICES MANAGEMENT
// ============================================

class ServicesManager {
    constructor() {
        this.services = [];
        this.process = [];
        this.cta = null;
    }

    async loadServices() {
        try {
            const response = await fetch('data/services.json');
            const data = await response.json();
            
            this.services = data.services;
            this.process = data.process;
            this.cta = data.cta;
            
            this.renderServices();
            this.renderProcess();
            this.renderCTA();
            this.initPricingModal();
            
        } catch (error) {
            console.error('Error loading services:', error);
            this.showError();
        }
    }

    renderServices() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;

        grid.innerHTML = this.services.map(service => `
            <div class="service-card fade-in" data-category="${service.category}">
                <div class="service-header">
                    <div class="service-icon">${service.icon}</div>
                    <div class="service-title-group">
                        <h3 class="service-title">${service.title}</h3>
                        <p class="service-tagline">${service.tagline}</p>
                    </div>
                </div>
                
                <p class="service-description">${service.description}</p>
                
                <ul class="service-features">
                    ${service.features.slice(0, 5).map(feature => `
                        <li>${feature}</li>
                    `).join('')}
                    ${service.features.length > 5 ? `
                        <li style="color: var(--primary); cursor: pointer;" 
                            onclick="UIComponents.showToast('View full details in project discussion', 'info')">
                            +${service.features.length - 5} more features...
                        </li>
                    ` : ''}
                </ul>
                
                <div class="service-technologies">
                    ${service.technologies.map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
                
                <div class="service-meta">
                    <span class="meta-badge">
                        <i class="fas fa-dollar-sign"></i>
                        ${service.pricing}
                    </span>
                    <span class="meta-badge">
                        <i class="far fa-clock"></i>
                        ${service.deliveryTime}
                    </span>
                </div>
            </div>
        `).join('');

        // Add hover effects and animations
        this.animateServiceCards();
    }

    renderProcess() {
        const container = document.getElementById('processSteps');
        if (!container) return;

        container.innerHTML = this.process.map(step => `
            <div class="process-step fade-in">
                <div class="step-number">
                    <span class="step-icon">${step.icon}</span>
                </div>
                <h4 class="step-title">${step.title}</h4>
                <p class="step-description">${step.description}</p>
            </div>
        `).join('');
    }

    renderCTA() {
        if (!this.cta) return;

        const titleEl = document.getElementById('ctaTitle');
        const subtitleEl = document.getElementById('ctaSubtitle');
        const noteEl = document.getElementById('ctaNote');

        if (titleEl) titleEl.textContent = this.cta.title;
        if (subtitleEl) subtitleEl.textContent = this.cta.subtitle;
        if (noteEl) {
            noteEl.innerHTML = `
                <i class="fas fa-info-circle"></i>
                ${this.cta.note}
            `;
        }
    }

    animateServiceCards() {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Add tilt effect on mouse move
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `
                    translateY(-8px) 
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg)
                `;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    initPricingModal() {
        const modal = document.getElementById('pricingModal');
        const openBtn = document.getElementById('pricingModalBtn');
        const closeBtn = document.getElementById('closePricingModal');
        const overlay = modal?.querySelector('.modal-overlay');

        if (!modal || !openBtn) return;

        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn?.addEventListener('click', closeModal);
        overlay?.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    showError() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;

        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p style="color: var(--text-secondary);">
                    <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 10px;"></i><br>
                    Unable to load services. Please try again later.
                </p>
            </div>
        `;
    }

    // Filter services by category (optional feature)
    filterByCategory(category) {
        const cards = document.querySelectorAll('.service-card');
        
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Initialize services when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const servicesManager = new ServicesManager();
    servicesManager.loadServices();
    
    // Make it globally accessible
    window.servicesManager = servicesManager;
});