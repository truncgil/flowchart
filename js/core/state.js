// Core state management
export const state = {
    mermaidCode: '',
    diagramSvg: null,
    isRendering: false,
    zoomLevel: 100,
    isDarkMode: (() => {
        // Check localStorage first
        const storedTheme = localStorage.getItem('darkMode');
        if (storedTheme !== null) {
            return storedTheme === 'true';
        }
        // If no stored preference, use system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    })(),
    editor: null,
    isEditorCollapsed: false,
    // Preview pan state
    isPanning: false,
    startX: 0,
    startY: 0,
    translateX: 0,
    translateY: 0,
    currentStep: 1
};

// Initialize Mermaid
export function initializeMermaid() {
    mermaid.initialize({
        startOnLoad: true,
        theme: state.isDarkMode ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        flowchart: {
            htmlLabels: true,
            curve: 'basis'
        }
    });
} 