// Mermaid preview handling
const previewContainer = document.getElementById('mermaid-preview');
const mermaidInput = document.getElementById('mermaid-input');

console.log('Mermaid preview initialized');

function validateMermaidSyntax(code) {
    console.log('Validating syntax:', code);
    if (!code.trim()) {
        throw new Error('Please enter some Mermaid.js syntax');
    }
    if (!code.includes('graph') && !code.includes('flowchart')) {
        throw new Error('Invalid Mermaid syntax: Must start with "graph" or "flowchart"');
    }
}

async function renderMermaidDiagram() {
    console.log('Starting render process');
    if (!state.mermaidCode) {
        console.log('No mermaid code to render');
        return;
    }

    try {
        // Set rendering state
        state.isRendering = true;
        previewContainer.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"><span class="material-icons animate-spin mr-2">sync</span><span>Rendering diagram...</span></div>';

        // Validate syntax
        validateMermaidSyntax(state.mermaidCode);

        // Clear previous content
        previewContainer.innerHTML = '';

        // Create a unique ID for this diagram
        const diagramId = 'mermaid-diagram-' + Date.now();
        console.log('Creating diagram with ID:', diagramId);

        // Create and append the diagram container
        const diagramDiv = document.createElement('div');
        diagramDiv.id = diagramId;
        diagramDiv.className = 'mermaid';
        diagramDiv.textContent = state.mermaidCode;
        previewContainer.appendChild(diagramDiv);

        console.log('Attempting to render diagram');
        try {
            // Force Mermaid to reinitialize
            await mermaid.run({
                querySelector: '#' + diagramId
            });
            
            // Get the rendered SVG
            const svg = diagramDiv.querySelector('svg');
            if (svg) {
                state.diagramSvg = svg.outerHTML;
                updateUrlWithCode();
                console.log('Diagram rendered successfully');
            } else {
                throw new Error('SVG element not found after rendering');
            }
        } catch (renderError) {
            console.error('Mermaid rendering error:', renderError);
            previewContainer.innerHTML = `
                <div class="flex items-center justify-center h-full">
                    <div class="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-lg">
                        <div class="flex items-center mb-2">
                            <span class="material-icons mr-2">error</span>
                            <p class="font-medium">Error rendering diagram</p>
                        </div>
                        <p class="text-sm mt-1">${renderError.message}</p>
                        <p class="text-sm mt-2">Please check your Mermaid.js syntax and try again.</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error in renderMermaidDiagram:', error);
        previewContainer.innerHTML = `
            <div class="flex items-center justify-center h-full">
                <div class="p-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-lg">
                    <div class="flex items-center mb-2">
                        <span class="material-icons mr-2">error</span>
                        <p class="font-medium">Error</p>
                    </div>
                    <p class="text-sm mt-1">${error.message}</p>
                </div>
            </div>
        `;
    } finally {
        state.isRendering = false;
    }
}

// Live preview (optional)
let previewTimeout;
mermaidInput.addEventListener('input', () => {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
        if (state.currentStep === 2) {
            state.mermaidCode = mermaidInput.value;
            renderMermaidDiagram();
        }
    }, 500);
}); 