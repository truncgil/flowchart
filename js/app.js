// State management
const state = {
    mermaidCode: '',
    diagramSvg: null,
    isRendering: false,
    zoomLevel: 100,
    isDarkMode: false
};

// DOM Elements
const elements = {
    mermaidInput: document.getElementById('mermaid-input'),
    mermaidPreview: document.getElementById('mermaid-preview'),
    zoomIn: document.getElementById('zoom-in'),
    zoomOut: document.getElementById('zoom-out'),
    zoomLevel: document.getElementById('zoom-level'),
    themeToggle: document.getElementById('theme-toggle'),
    exportBtn: document.getElementById('export-btn'),
    exportPng: document.getElementById('export-png'),
    exportSvg: document.getElementById('export-svg')
};

console.log('App initialized with elements:', elements);

// Theme handling
function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', state.isDarkMode);
    
    // Update Mermaid theme
    mermaid.initialize({
        startOnLoad: false,
        theme: state.isDarkMode ? 'dark' : 'default',
        securityLevel: 'loose',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
        }
    });
    
    // Re-render diagram if exists
    if (state.mermaidCode) {
        renderMermaidDiagram();
    }
}

// Zoom handling
function updateZoom(delta) {
    state.zoomLevel = Math.max(50, Math.min(200, state.zoomLevel + delta));
    elements.zoomLevel.textContent = `${state.zoomLevel}%`;
    elements.mermaidPreview.style.transform = `scale(${state.zoomLevel / 100})`;
    elements.mermaidPreview.style.transformOrigin = 'top left';
}

// Event Listeners
function initializeEventListeners() {
    elements.zoomIn.addEventListener('click', () => updateZoom(10));
    elements.zoomOut.addEventListener('click', () => updateZoom(-10));
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Live preview
    let previewTimeout;
    elements.mermaidInput.addEventListener('input', () => {
        clearTimeout(previewTimeout);
        previewTimeout = setTimeout(() => {
            state.mermaidCode = elements.mermaidInput.value;
            renderMermaidDiagram();
        }, 500);
    });
}

// URL handling for sharing
function encodeForUrl(str) {
    return encodeURIComponent(str);
}

function decodeFromUrl(str) {
    return decodeURIComponent(str);
}

function updateUrlWithCode() {
    try {
        const encodedCode = encodeForUrl(state.mermaidCode);
        const newUrl = `${window.location.pathname}#${encodedCode}`;
        window.history.pushState({}, '', newUrl);
    } catch (error) {
        console.error('Error updating URL:', error);
    }
}

function loadCodeFromUrl() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        try {
            const decodedCode = decodeFromUrl(hash);
            elements.mermaidInput.value = decodedCode;
            state.mermaidCode = decodedCode;
            renderMermaidDiagram();
        } catch (e) {
            console.error('Invalid URL hash:', e);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }
}

// Initialize
function initialize() {
    console.log('Initializing app...');
    
    // Initialize theme
    if (localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
        state.isDarkMode = true;
        document.documentElement.classList.add('dark');
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis'
            }
        });
    }

    // Initialize event listeners
    initializeEventListeners();

    // Load code from URL if exists
    loadCodeFromUrl();

    console.log('App initialized');
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
} 