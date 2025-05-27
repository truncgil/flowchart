// State management
const state = {
    mermaidCode: '',
    diagramSvg: null,
    isRendering: false,
    zoomLevel: 100,
    isDarkMode: false,
    editor: null,
    isEditorCollapsed: false
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
        mode: 'javascript',
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
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', state.isDarkMode);
    
    // Update CodeMirror theme
    if (state.editor) {
        state.editor.setOption('theme', state.isDarkMode ? 'monokai' : 'default');
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
    if (localStorage.getItem('darkMode') === 'true' || 
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
        state.isDarkMode = true;
        document.documentElement.classList.add('dark');
    }

    // Initialize CodeMirror
    initializeCodeMirror();

    // Initialize drag and drop
    initializeDragAndDrop();

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