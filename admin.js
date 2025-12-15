// Admin Mode - Simple Content Management System
class AdminMode {
    constructor() {
        this.isActive = false;
        this.password = 'wandering2024'; // Fallback password
        this.contentData = this.loadContent();
        this.loadConfig();
    }
    
    async loadConfig() {
        try {
            const response = await fetch('config.json');
            const config = await response.json();
            if (config.settings && config.settings.adminPassword) {
                this.password = config.settings.adminPassword;
            }
        } catch (error) {
            console.warn('Could not load config, using default password');
        }
        this.init();
    }

    init() {
        // Check URL parameters for admin access
        const urlParams = new URLSearchParams(window.location.search);
        const isAdminUrl = urlParams.get('admin') === 'true' || urlParams.get('edit') === 'true';
        
        // Check if admin mode is enabled in session
        if (sessionStorage.getItem('adminMode') === 'true' || isAdminUrl) {
            if (isAdminUrl && sessionStorage.getItem('adminAuthenticated') !== 'true') {
                this.login();
            } else {
                this.activate();
            }
        }
    }

    toggleAdmin() {
        if (!this.isActive) {
            this.login();
        } else {
            this.deactivate();
        }
    }

    login() {
        const password = prompt('🔐 Enter admin password to edit this website:');
        if (password === this.password) {
            this.activate();
            sessionStorage.setItem('adminMode', 'true');
            sessionStorage.setItem('adminAuthenticated', 'true');
        } else if (password !== null) {
            alert('❌ Incorrect password. Access denied.');
            // Remove admin parameter from URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    activate() {
        this.isActive = true;
        document.body.classList.add('admin-mode');
        
        this.makeEditable();
        this.createAdminPanel();
        this.showNotification('✏️ Admin mode activated - Click any text to edit');
    }

    deactivate() {
        this.isActive = false;
        document.body.classList.remove('admin-mode');
        sessionStorage.removeItem('adminMode');
        sessionStorage.removeItem('adminAuthenticated');
        
        this.removeEditability();
        this.removeAdminPanel();
        this.showNotification('🔒 Admin mode deactivated');
        
        // Remove admin parameter from URL and reload
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => window.location.reload(), 1500);
    }

    makeEditable() {
        // Make text content editable
        const editableSelectors = [
            'h1', 'h2', 'h3', 'p', '.tagline', '.hero-badge',
            '.stat-label', '.episode-number', '.testimonial-text',
            '.testimonial-author strong', '.testimonial-author span',
            'label', '.form-note', 'button[type="submit"]',
            '.info-item h3', 'footer p'
        ];

        editableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!el.querySelector('input') && !el.querySelector('textarea') && !el.querySelector('form')) {
                    el.contentEditable = true;
                    el.classList.add('editable');
                    
                    el.addEventListener('blur', () => this.saveContent());
                    el.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' && !e.shiftKey && el.tagName !== 'P') {
                            e.preventDefault();
                            el.blur();
                        }
                    });
                }
            });
        });

        // Make links editable
        document.querySelectorAll('a[href]').forEach(link => {
            if (!link.closest('.admin-panel')) {
                link.classList.add('editable-link');
                link.addEventListener('click', (e) => {
                    if (this.isActive) {
                        e.preventDefault();
                        this.editLink(link);
                    }
                });
            }
        });

        // Make images editable
        document.querySelectorAll('img, .placeholder-image').forEach(img => {
            img.classList.add('editable-image');
            img.addEventListener('click', (e) => {
                if (this.isActive) {
                    e.preventDefault();
                    this.editImage(img);
                }
            });
        });
    }

    removeEditability() {
        document.querySelectorAll('.editable').forEach(el => {
            el.contentEditable = false;
            el.classList.remove('editable');
        });
        
        document.querySelectorAll('.editable-link, .editable-image').forEach(el => {
            el.classList.remove('editable-link', 'editable-image');
        });
    }

    createAdminPanel() {
        const panel = document.createElement('div');
        panel.id = 'adminPanel';
        panel.className = 'admin-panel';
        panel.innerHTML = `
            <div class="admin-panel-header">
                <h3>Content Manager</h3>
                <button onclick="admin.deactivate()" class="close-btn">×</button>
            </div>
            <div class="admin-panel-content">
                <div class="admin-section">
                    <h4>Quick Actions</h4>
                    <button onclick="admin.exportContent()" class="admin-btn">💾 Export Content</button>
                    <button onclick="admin.importContent()" class="admin-btn">📥 Import Content</button>
                    <button onclick="admin.resetContent()" class="admin-btn">🔄 Reset to Default</button>
                </div>
                <div class="admin-section">
                    <h4>Publishing</h4>
                    <div class="form-group">
                        <label>Release Day:</label>
                        <select id="releaseDay" onchange="admin.updateReleaseDay(this.value)">
                            <option value="Tuesday" selected>Tuesday</option>
                            <option value="Monday">Monday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                        </select>
                    </div>
                </div>
                <div class="admin-section">
                    <h4>Instructions</h4>
                    <ul class="admin-tips">
                        <li>Click any text to edit it directly</li>
                        <li>Click links to change URLs</li>
                        <li>Click images to change them</li>
                        <li>Changes save automatically</li>
                        <li>Export content to backup your changes</li>
                    </ul>
                    <p style="font-size: 12px; opacity: 0.6; margin-top: 12px;">Access: Add <code>?admin=true</code> to URL</p>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    removeAdminPanel() {
        const panel = document.getElementById('adminPanel');
        if (panel) panel.remove();
    }

    editLink(link) {
        const currentHref = link.getAttribute('href');
        const currentText = link.textContent.trim();
        
        const newHref = prompt('Enter new link URL:', currentHref);
        if (newHref !== null && newHref !== currentHref) {
            link.setAttribute('href', newHref);
            this.saveContent();
            this.showNotification('Link updated');
        }
        
        const changeText = confirm('Would you like to change the link text too?');
        if (changeText) {
            const newText = prompt('Enter new link text:', currentText);
            if (newText !== null && newText !== currentText) {
                link.textContent = newText;
                this.saveContent();
            }
        }
    }

    editImage(img) {
        const newSrc = prompt('Enter image URL:', img.src || '');
        if (newSrc !== null) {
            if (img.tagName === 'IMG') {
                img.src = newSrc;
            } else {
                // Handle placeholder
                const imgEl = document.createElement('img');
                imgEl.src = newSrc;
                imgEl.alt = 'Ashley Bradshaw - Wandering Wild';
                imgEl.style.width = '100%';
                imgEl.style.borderRadius = '12px';
                img.innerHTML = '';
                img.appendChild(imgEl);
            }
            this.saveContent();
            this.showNotification('Image updated');
        }
    }

    updateReleaseDay(day) {
        localStorage.setItem('releaseDay', day);
        this.showNotification(`Release day set to ${day}`);
        
        // Update the badge
        const badge = document.querySelector('.hero-badge');
        if (badge) {
            badge.textContent = `🎙️ New Episodes Every ${day}`;
        }
        this.saveContent();
    }

    saveContent() {
        const content = {
            html: document.documentElement.outerHTML,
            timestamp: new Date().toISOString(),
            releaseDay: localStorage.getItem('releaseDay') || 'Tuesday'
        };
        
        localStorage.setItem('wanderingWildContent', JSON.stringify(content));
    }

    loadContent() {
        const saved = localStorage.getItem('wanderingWildContent');
        return saved ? JSON.parse(saved) : null;
    }

    exportContent() {
        const content = {
            html: document.documentElement.outerHTML,
            timestamp: new Date().toISOString(),
            releaseDay: localStorage.getItem('releaseDay') || 'Tuesday'
        };
        
        const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wandering-wild-content-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Content exported successfully');
    }

    importContent() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const content = JSON.parse(event.target.result);
                    localStorage.setItem('wanderingWildContent', JSON.stringify(content));
                    this.showNotification('Content imported - Refreshing page...');
                    setTimeout(() => location.reload(), 1500);
                } catch (error) {
                    alert('Error importing content: ' + error.message);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    resetContent() {
        if (confirm('Are you sure you want to reset all content to default? This cannot be undone.')) {
            localStorage.removeItem('wanderingWildContent');
            localStorage.removeItem('releaseDay');
            sessionStorage.removeItem('adminMode');
            this.showNotification('Content reset - Refreshing page...');
            setTimeout(() => location.reload(), 1500);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'admin-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize admin mode
let admin;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        admin = new AdminMode();
    });
} else {
    admin = new AdminMode();
}
