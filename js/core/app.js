// Main application module
import { state } from './state.js';
import { elements, initializeEventListeners } from './events.js';
import initializeCodeMirror from '../editor/codemirror.js';
import { initializeDeepSeekEditor } from '../editor/deepseek-editor.js';
import { initializeLivePreview } from '../preview/renderer.js';
import { initializePreviewControls } from '../preview/controls.js';
import exportAsPng from '../export/png.js';
import exportAsSvg from '../export/svg.js';

// Initialize system preference listener
function initializeSystemPreferenceListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to handle system preference change
    const handleSystemPreferenceChange = (e) => {
        // Only update if user hasn't set a preference in localStorage
        if (localStorage.getItem('darkMode') === null) {
            state.isDarkMode = e.matches;
            updateThemeUI();
        }
    };

    // Add listener for system preference changes
    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleSystemPreferenceChange);
    } else {
        // For older browsers
        mediaQuery.addListener(handleSystemPreferenceChange);
    }
}

// Update theme based on current state
function updateTheme() {
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
    if (state.deepseekEditor) {
        state.deepseekEditor.setOption('theme', state.isDarkMode ? 'monokai' : 'default');
    }
}

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
    elements.deepseekEditorHeader.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === elements.editorHeader || e.target.parentNode === elements.editorHeader ||
            e.target === elements.deepseekEditorHeader || e.target.parentNode === elements.deepseekEditorHeader) {
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
            setTranslate(currentX, currentY, elements.deepseekEditorContainer);
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
            initializeLivePreview();
        } catch (e) {
            console.error('Invalid URL hash:', e);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }
}

// Initialize the application
export function initialize() {
    console.log('Initializing app...');
    
    try {
        // Initialize state
        state.isDarkMode = document.documentElement.classList.contains('dark');
        state.isEditorCollapsed = false;
        state.zoomLevel = 100;
        state.previewTimeout = null;

        // Initialize event listeners
        initializeEventListeners();

        // Initialize CodeMirror editors
        initializeCodeMirror();
        initializeDeepSeekEditor();

        // Initialize live preview
        initializeLivePreview();

        // Initialize preview controls
        initializePreviewControls();

        // Initialize system preference listener
        initializeSystemPreferenceListener();

        // Set initial theme
        updateTheme();

        // Set up export handlers
        elements.exportPng.addEventListener('click', exportAsPng);
        elements.exportSvg.addEventListener('click', exportAsSvg);

        // Load code from URL if exists
        loadCodeFromUrl();

        // Update UI based on initial state
        updateThemeUI();
        updateZoomUI();

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

// Update theme UI
function updateThemeUI() {
    elements.lightIcon.classList.toggle('hidden', state.isDarkMode);
    elements.darkIcon.classList.toggle('hidden', !state.isDarkMode);
}

// Update zoom UI
function updateZoomUI() {
    elements.zoomLevel.textContent = `${state.zoomLevel}%`;
}

// Export functions
export { updateThemeUI, updateZoomUI }; 