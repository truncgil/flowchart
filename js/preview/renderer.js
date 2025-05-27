// Mermaid diagram rendering
import state from '../core/state.js';
import { elements } from '../core/events.js';

function validateMermaidSyntax(code) {
    if (!code.trim()) {
        throw new Error('Please enter some Mermaid.js syntax');
    }
    if (!code.includes('graph') && !code.includes('flowchart')) {
        throw new Error('Invalid Mermaid syntax: Must start with "graph" or "flowchart"');
    }
}

async function renderMermaidDiagram() {
    if (!state.mermaidCode) {
        return;
    }

    try {
        // Set rendering state
        state.isRendering = true;
        elements.mermaidPreview.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"><span class="material-icons animate-spin mr-2">sync</span><span>Rendering diagram...</span></div>';

        // Validate syntax
        validateMermaidSyntax(state.mermaidCode);

        // Clear previous content
        elements.mermaidPreview.innerHTML = '';

        // Create a unique ID for this diagram
        const diagramId = 'mermaid-diagram-' + Date.now();

        // Create and append the diagram container
        const diagramDiv = document.createElement('div');
        diagramDiv.id = diagramId;
        diagramDiv.className = 'mermaid';
        diagramDiv.textContent = state.mermaidCode;
        elements.mermaidPreview.appendChild(diagramDiv);

        try {
            // Force Mermaid to reinitialize
            const { svg } = await mermaid.render(diagramId, state.mermaidCode);
            
            // Create a new div for the SVG
            const svgContainer = document.createElement('div');
            svgContainer.className = 'mermaid-svg-container';
            svgContainer.style.width = '100%';
            svgContainer.style.height = '100%';
            svgContainer.style.display = 'flex';
            svgContainer.style.alignItems = 'center';
            svgContainer.style.justifyContent = 'center';
            
            // Insert the SVG
            svgContainer.innerHTML = svg;
            
            // Clear the preview container and add the SVG
            elements.mermaidPreview.innerHTML = '';
            elements.mermaidPreview.appendChild(svgContainer);
            
            // Get the rendered SVG
            const svgElement = svgContainer.querySelector('svg');
            if (svgElement) {
                // Set SVG attributes for proper display
                svgElement.style.width = '100%';
                svgElement.style.height = '100%';
                svgElement.style.maxWidth = '100%';
                svgElement.style.maxHeight = '100%';
                
                state.diagramSvg = svgElement.outerHTML;
                updateUrlWithCode();
            } else {
                throw new Error('SVG element not found after rendering');
            }
        } catch (renderError) {
            console.error('Mermaid rendering error:', renderError);
            elements.mermaidPreview.innerHTML = `
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
        elements.mermaidPreview.innerHTML = `
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

function updateUrlWithCode() {
    try {
        const encodedCode = encodeURIComponent(state.mermaidCode);
        const newUrl = `${window.location.pathname}#${encodedCode}`;
        window.history.pushState({}, '', newUrl);
    } catch (error) {
        console.error('Error updating URL:', error);
    }
}

export { renderMermaidDiagram, validateMermaidSyntax }; 