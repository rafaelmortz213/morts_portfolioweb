// ============================================
// PROJECT-SPECIFIC FUNCTIONALITY
// ============================================

class ProjectManager {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
    }

    async fetchProjects() {
        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            this.projects = data.projects;
            return this.projects;
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    }

    filterProjects(category) {
        this.currentFilter = category;
        if (category === 'all') {
            return this.projects;
        }
        return this.projects.filter(project => project.category === category);
    }

    getProjectById(id) {
        return this.projects.find(project => project.id === id);
    }

    searchProjects(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.projects.filter(project => 
            project.title.toLowerCase().includes(lowercaseQuery) ||
            project.shortDescription.toLowerCase().includes(lowercaseQuery) ||
            project.techStack.some(tech => tech.toLowerCase().includes(lowercaseQuery))
        );
    }
}

// Export for use in main app
window.ProjectManager = ProjectManager;