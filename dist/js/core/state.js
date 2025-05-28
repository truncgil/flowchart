// Application state
export const state = {
    // Editor instances
    editor: null,
    truncgilAIEditor: null,
    
    // Current mermaid code
    mermaidCode: '',
    
    // Theme state
    isDarkMode: false,
    
    // Zoom state
    zoomLevel: 100,
    diagramSvg: null,
    isRendering: false,
    isEditorCollapsed: false,
    // Preview pan state
    isPanning: false,
    startX: 0,
    startY: 0,
    translateX: 0,
    translateY: 0,
    currentStep: 1
};

// Initialize state
export function initializeState() {
    // Check for saved theme preference
    state.isDarkMode = document.documentElement.classList.contains('dark');
    
    // Initialize zoom level
    state.zoomLevel = 100;
}

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
        },
        themeVariables: {
            primaryColor: '#85E1E6',
            primaryTextColor: '#1f2937',
            primaryBorderColor: '#6BCFD4',
            lineColor: '#85E1E6',
            secondaryColor: '#E6F7F8',
            tertiaryColor: '#4BB5BC'
        }
    });
} 