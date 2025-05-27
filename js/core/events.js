// Event handling
import { state } from './state.js';

// DOM Elements
const elements = {
    mermaidInput: document.getElementById('mermaid-input'),
    mermaidPreview: document.getElementById('mermaid-preview'),
    zoomIn: document.getElementById('zoom-in'),
    zoomOut: document.getElementById('zoom-out'),
    zoomLevel: document.getElementById('zoom-level'),
    themeToggle: document.getElementById('theme-toggle'),
    lightIcon: document.getElementById('light-icon'),
    darkIcon: document.getElementById('dark-icon'),
    exportBtn: document.getElementById('export-btn'),
    exportPng: document.getElementById('export-png'),
    exportSvg: document.getElementById('export-svg'),
    editorContainer: document.getElementById('code-editor-container'),
    editorHeader: document.getElementById('editor-header'),
    editorContent: document.getElementById('editor-content'),
    toggleEditor: document.getElementById('toggle-editor')
};

// Initialize event listeners
function initializeEventListeners() {
    elements.zoomIn.addEventListener('click', () => updateZoom(10));
    elements.zoomOut.addEventListener('click', () => updateZoom(-10));
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.toggleEditor.addEventListener('click', toggleEditorCollapse);
}

// Theme handling
function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    
    // Update localStorage
    localStorage.setItem('darkMode', state.isDarkMode);
    
    // Update document class
    if (state.isDarkMode) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        elements.lightIcon.classList.add('hidden');
        elements.darkIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        elements.lightIcon.classList.remove('hidden');
        elements.darkIcon.classList.add('hidden');
    }
    
    // Update CodeMirror theme
    if (state.editor) {
        state.editor.setOption('theme', state.isDarkMode ? 'monokai' : 'default');
    }
}

// Toggle editor collapse
function toggleEditorCollapse() {
    state.isEditorCollapsed = !state.isEditorCollapsed;
    elements.editorContent.style.display = state.isEditorCollapsed ? 'none' : 'block';
    elements.toggleEditor.querySelector('.material-icons').textContent = 
        state.isEditorCollapsed ? 'expand_less' : 'expand_more';
}

// Update zoom level
function updateZoom(delta) {
    const oldZoom = state.zoomLevel;
    state.zoomLevel = Math.max(50, Math.min(200, state.zoomLevel + delta));
    elements.zoomLevel.textContent = `${state.zoomLevel}%`;
    
    // Update preview transform
    const preview = elements.mermaidPreview;
    if (preview) {
        preview.style.transform = `scale(${state.zoomLevel / 100})`;
    }
}

export { elements, initializeEventListeners, toggleTheme, toggleEditorCollapse, updateZoom }; 