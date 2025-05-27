// State management
const state = {
    currentStep: 1,
    mermaidCode: '',
    diagramSvg: null,
    isRendering: false
};

// DOM Elements
const elements = {
    stepIndicators: document.querySelectorAll('.step-indicator'),
    stepContents: document.querySelectorAll('.step-content'),
    mermaidInput: document.getElementById('mermaid-input'),
    nextToPreview: document.getElementById('next-to-preview'),
    backToInput: document.getElementById('back-to-input'),
    nextToExport: document.getElementById('next-to-export'),
    backToPreview: document.getElementById('back-to-preview')
};

console.log('App initialized with elements:', elements);

// Navigation functions
function updateStepIndicators(step) {
    elements.stepIndicators.forEach((indicator, index) => {
        const circle = indicator.querySelector('div');
        if (index + 1 <= step) {
            circle.classList.remove('bg-gray-300');
            circle.classList.add('bg-blue-500');
        } else {
            circle.classList.remove('bg-blue-500');
            circle.classList.add('bg-gray-300');
        }
    });
}

function showStep(step) {
    console.log('Showing step:', step);
    elements.stepContents.forEach((content, index) => {
        if (index + 1 === step) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });
    updateStepIndicators(step);
    state.currentStep = step;
}

// Event Listeners
elements.nextToPreview.addEventListener('click', () => {
    console.log('Next to preview clicked');
    if (state.isRendering) {
        console.log('Already rendering, ignoring click');
        return;
    }
    state.mermaidCode = elements.mermaidInput.value;
    console.log('Mermaid code:', state.mermaidCode);
    showStep(2);
    renderMermaidDiagram();
});

elements.backToInput.addEventListener('click', () => {
    console.log('Back to input clicked');
    showStep(1);
});

elements.nextToExport.addEventListener('click', () => {
    console.log('Next to export clicked');
    if (!state.diagramSvg) {
        alert('Please wait for the diagram to render before proceeding.');
        return;
    }
    showStep(3);
});

elements.backToPreview.addEventListener('click', () => {
    console.log('Back to preview clicked');
    showStep(2);
});

// URL handling for sharing
function encodeForUrl(str) {
    // Use encodeURIComponent to handle all characters
    return encodeURIComponent(str);
}

function decodeFromUrl(str) {
    // Use decodeURIComponent to handle all characters
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
        } catch (e) {
            console.error('Invalid URL hash:', e);
            // Clear invalid hash
            window.history.replaceState({}, '', window.location.pathname);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    loadCodeFromUrl();
    showStep(1);
}); 