// Main application module
import { state, initializeMermaid } from './state.js';
import { elements, initializeEventListeners } from './events.js';
import initializeCodeMirror from '../editor/codemirror.js';
import { initializePreviewControls } from '../preview/controls.js';
import { renderMermaidDiagram } from '../preview/renderer.js';
import exportAsPng from '../export/png.js';
import exportAsSvg from '../export/svg.js';

// Initialize drag and drop functionality
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

// URL handling for sharing
function loadCodeFromUrl() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        try {
            const decodedCode = decodeURIComponent(hash);
            state.editor.setValue(decodedCode);
            state.mermaidCode = decodedCode;
            renderMermaidDiagram();
        } catch (e) {
            console.error('Invalid URL hash:', e);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }
}

// Initialize the application
function initialize() {
    console.log('Initializing app...');
    
    try {
        // Initialize Mermaid
        initializeMermaid();

        // Initialize CodeMirror
        initializeCodeMirror();

        // Initialize drag and drop
        initializeDragAndDrop();

        // Initialize preview controls
        initializePreviewControls();

        // Initialize event listeners
        initializeEventListeners();

        // Set up export handlers
        elements.exportPng.addEventListener('click', exportAsPng);
        elements.exportSvg.addEventListener('click', exportAsSvg);

        // Load code from URL if exists
        loadCodeFromUrl();

        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error during initialization:', error);
        throw error;
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}

// Export the initialize function
export { initialize }; 