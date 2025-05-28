// Event handling
import { state } from './state.js';

// DOM Elements
const elements = {
    // Editor elements
    editor: document.getElementById('mermaid-input'),
    editorContainer: document.getElementById('code-editor-container'),
    editorHeader: document.getElementById('editor-header'),
    toggleEditor: document.getElementById('toggle-editor'),
    
    // Truncgil AI Editor elements
    truncgilAIInput: document.getElementById('truncgilAI-input'),
    truncgilAIEditorContainer: document.getElementById('truncgilAI-editor-container'),
    truncgilAIEditorHeader: document.getElementById('truncgilAI-editor-header'),
    toggleTruncgilAIEditor: document.getElementById('toggle-truncgilAI-editor'),
    convertToFlowchart: document.getElementById('convert-to-flowchart'),
    
    // Preview elements
    preview: document.getElementById('mermaid-preview'),
    zoomIn: document.getElementById('zoom-in'),
    zoomOut: document.getElementById('zoom-out'),
    zoomLevel: document.getElementById('zoom-level'),
    
    // Export elements
    exportBtn: document.getElementById('export-btn'),
    exportPng: document.getElementById('export-png'),
    exportSvg: document.getElementById('export-svg'),
    
    // Theme elements
    themeToggle: document.getElementById('theme-toggle'),
    lightIcon: document.getElementById('light-icon'),
    darkIcon: document.getElementById('dark-icon')
};

// Initialize event listeners
function initializeEvents() {
    // Editor toggle
    elements.toggleEditor.addEventListener('click', () => {
        elements.editorContainer.classList.toggle('collapsed');
        elements.toggleEditor.querySelector('.material-icons').textContent = 
            elements.editorContainer.classList.contains('collapsed') ? 'expand_less' : 'expand_more';
    });

    // Truncgil AI Editor toggle
    elements.toggleTruncgilAIEditor.addEventListener('click', () => {
        elements.truncgilAIEditorContainer.classList.toggle('collapsed');
        elements.toggleTruncgilAIEditor.querySelector('.material-icons').textContent = 
            elements.truncgilAIEditorContainer.classList.contains('collapsed') ? 'expand_less' : 'expand_more';
    });

    // Make editors draggable
    makeDraggable(elements.editorHeader, elements.editorContainer);
    makeDraggable(elements.truncgilAIEditorHeader, elements.truncgilAIEditorContainer);

    // Zoom controls
    elements.zoomIn.addEventListener('click', () => {
        const currentZoom = parseFloat(elements.zoomLevel.textContent);
        if (currentZoom < 200) {
            elements.zoomLevel.textContent = `${currentZoom + 10}%`;
            elements.preview.style.transform = `scale(${(currentZoom + 10) / 100})`;
        }
    });

    elements.zoomOut.addEventListener('click', () => {
        const currentZoom = parseFloat(elements.zoomLevel.textContent);
        if (currentZoom > 50) {
            elements.zoomLevel.textContent = `${currentZoom - 10}%`;
            elements.preview.style.transform = `scale(${(currentZoom - 10) / 100})`;
        }
    });

    // Theme toggle
    elements.themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        elements.lightIcon.classList.toggle('hidden');
        elements.darkIcon.classList.toggle('hidden');
    });
}

// Helper function to make elements draggable
function makeDraggable(handle, element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        const newTop = element.offsetTop - pos2;
        const newLeft = element.offsetLeft - pos1;
        
        // Keep element within window bounds
        const maxTop = window.innerHeight - element.offsetHeight;
        const maxLeft = window.innerWidth - element.offsetWidth;
        
        element.style.top = `${Math.min(Math.max(0, newTop), maxTop)}px`;
        element.style.left = `${Math.min(Math.max(0, newLeft), maxLeft)}px`;
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// Theme handling
function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    
    // Update localStorage with user preference
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
    if (state.truncgilAIEditor) {
        state.truncgilAIEditor.setOption('theme', state.isDarkMode ? 'monokai' : 'default');
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
    const preview = elements.preview;
    if (preview) {
        preview.style.transform = `scale(${state.zoomLevel / 100})`;
    }
}

// Export all functions and elements
export {
    elements,
    initializeEvents,
    toggleTheme,
    toggleEditorCollapse,
    updateZoom
}; 