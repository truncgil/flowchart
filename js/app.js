// State management
const state = {
    mermaidCode: '',
    diagramSvg: null,
    isRendering: false,
    zoomLevel: 100,
    isDarkMode: localStorage.getItem('darkMode') === 'true' || window.matchMedia('(prefers-color-scheme: dark)').matches,
    editor: null,
    isEditorCollapsed: false,
    // Preview pan state
    isPanning: false,
    startX: 0,
    startY: 0,
    translateX: 0,
    translateY: 0
};

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

console.log('App initialized with elements:', elements);

// Initialize CodeMirror
function initializeCodeMirror() {
    state.editor = CodeMirror.fromTextArea(elements.mermaidInput, {
        mode: 'mermaid',
        theme: state.isDarkMode ? 'monokai' : 'default',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        extraKeys: {
            "Ctrl-Space": "autocomplete"
        }
    });

    // Set initial content
    state.editor.setValue(`graph TD
    A[Start] --> B[Process]
    B --> C[End]`);

    // Handle editor changes
    state.editor.on('change', () => {
        clearTimeout(state.previewTimeout);
        state.previewTimeout = setTimeout(() => {
            state.mermaidCode = state.editor.getValue();
            renderMermaidDiagram();
        }, 500);
    });
}

// Drag and Drop functionality
function initializeDragAndDrop() {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    elements.editorHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === elements.editorHeader || e.target.parentNode === elements.editorHeader) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, elements.editorContainer);
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
}

// Toggle editor collapse
function toggleEditorCollapse() {
    state.isEditorCollapsed = !state.isEditorCollapsed;
    elements.editorContent.style.display = state.isEditorCollapsed ? 'none' : 'block';
    elements.toggleEditor.querySelector('.material-icons').textContent = 
        state.isEditorCollapsed ? 'expand_less' : 'expand_more';
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

    // Force a reflow to ensure transitions work
    document.body.offsetHeight;
}

// Initialize theme
function initializeTheme() {
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

    // Force a reflow to ensure transitions work
    document.body.offsetHeight;
}

// Preview zoom and pan handling
function initializePreviewControls() {
    // Mouse wheel zoom
    elements.mermaidPreview.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -10 : 10;
        updateZoom(delta, e.clientX, e.clientY);
    });

    // Mouse drag pan
    elements.mermaidPreview.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left mouse button
            state.isPanning = true;
            state.startX = e.clientX - state.translateX;
            state.startY = e.clientY - state.translateY;
            elements.mermaidPreview.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (state.isPanning) {
            e.preventDefault();
            const currentX = e.clientX - state.startX;
            const currentY = e.clientY - state.startY;
            state.translateX = currentX;
            state.translateY = currentY;
            updatePreviewTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        if (state.isPanning) {
            state.isPanning = false;
            elements.mermaidPreview.style.cursor = 'grab';
        }
    });

    // Set initial cursor style
    elements.mermaidPreview.style.cursor = 'grab';
}

// Update zoom with mouse position
function updateZoom(delta, mouseX, mouseY) {
    const oldZoom = state.zoomLevel;
    state.zoomLevel = Math.max(50, Math.min(200, state.zoomLevel + delta));
    
    if (mouseX && mouseY) {
        // Calculate mouse position relative to preview
        const rect = elements.mermaidPreview.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;
        
        // Calculate zoom center
        const zoomFactor = state.zoomLevel / oldZoom;
        state.translateX = x - (x - state.translateX) * zoomFactor;
        state.translateY = y - (y - state.translateY) * zoomFactor;
    }
    
    elements.zoomLevel.textContent = `${state.zoomLevel}%`;
    updatePreviewTransform();
}

// Update preview transform
function updatePreviewTransform() {
    elements.mermaidPreview.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.zoomLevel / 100})`;
    elements.mermaidPreview.style.transformOrigin = '0 0';
}

// Reset preview position and zoom
function resetPreview() {
    state.zoomLevel = 100;
    state.translateX = 0;
    state.translateY = 0;
    elements.zoomLevel.textContent = '100%';
    updatePreviewTransform();
}

// Event Listeners
function initializeEventListeners() {
    elements.zoomIn.addEventListener('click', () => updateZoom(10));
    elements.zoomOut.addEventListener('click', () => updateZoom(-10));
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.toggleEditor.addEventListener('click', toggleEditorCollapse);
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
            state.editor.setValue(decodedCode);
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
    initializeTheme();

    // Initialize CodeMirror
    initializeCodeMirror();

    // Initialize drag and drop
    initializeDragAndDrop();

    // Initialize preview controls
    initializePreviewControls();

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