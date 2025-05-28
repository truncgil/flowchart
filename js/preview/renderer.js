// Mermaid diagram rendering
import { state } from '../core/state.js';
import { elements } from '../core/events.js';

// Initialize drag state
let isDragging = false;
let currentElement = null;
let startX = 0;
let startY = 0;
let initialX = 0;
let initialY = 0;

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
        elements.preview.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 dark:text-gray-400"><span class="material-icons animate-spin mr-2">sync</span><span>Rendering diagram...</span></div>';

        // Validate syntax
        validateMermaidSyntax(state.mermaidCode);

        // Clear previous content
        elements.preview.innerHTML = '';

        // Create a unique ID for this diagram
        const diagramId = 'truncgil-flowchart-diagram-' + Date.now();

        // Create and append the diagram container
        const diagramDiv = document.createElement('div');
        diagramDiv.id = diagramId;
        diagramDiv.className = 'mermaid';
        diagramDiv.textContent = state.mermaidCode;
        elements.preview.appendChild(diagramDiv);

        try {
            // Force Mermaid to reinitialize
            const { svg } = await mermaid.render(diagramId, state.mermaidCode);
            
            // Create a new div for the SVG
            const svgContainer = document.createElement('div');
            svgContainer.className = 'mermaid-svg-container';
            
            // Insert the SVG
            svgContainer.innerHTML = svg;
            
            // Clear the preview container and add the SVG
            elements.preview.innerHTML = '';
            elements.preview.appendChild(svgContainer);
            
            // Get the rendered SVG
            const svgElement = svgContainer.querySelector('svg');
            if (svgElement) {
                // Set SVG attributes for proper display
                svgElement.removeAttribute('width');
                svgElement.removeAttribute('height');
                svgElement.style.width = 'auto';
                svgElement.style.height = '80vh';
                svgElement.style.maxWidth = 'none';
                svgElement.style.maxHeight = 'none';
                
                // Set viewBox to ensure proper scaling
                const bbox = svgElement.getBBox();
                svgElement.setAttribute('viewBox', `0 0 ${bbox.width} ${bbox.height}`);
                
                state.diagramSvg = svgElement.outerHTML;
                updateUrlWithCode();

                // Make SVG elements draggable
                svgElement.style.cursor = 'grab';

                // Make all flowchart nodes draggable
                const nodes = svgElement.querySelectorAll('.node');
                nodes.forEach(node => {
                    node.style.cursor = 'move';
                    node.setAttribute('data-draggable', 'true');
                    
                    // Add drag event listeners
                    node.addEventListener('mousedown', startDrag);
                });

                // Add mouse move and up listeners to the SVG
                svgElement.addEventListener('mousemove', drag);
                svgElement.addEventListener('mouseup', endDrag);
                svgElement.addEventListener('mouseleave', endDrag);
            } else {
                throw new Error('SVG element not found after rendering');
            }
        } catch (renderError) {
            console.error('Mermaid rendering error:', renderError);
            elements.preview.innerHTML = `
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
        elements.preview.innerHTML = `
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

// Drag and drop functions
function startDrag(e) {
    if (e.target.getAttribute('data-draggable') === 'true') {
        isDragging = true;
        currentElement = e.target;
        
        // Get initial position
        const transform = currentElement.getAttribute('transform');
        if (transform) {
            const match = transform.match(/translate\(([^,]+),([^)]+)\)/);
            if (match) {
                initialX = parseFloat(match[1]);
                initialY = parseFloat(match[2]);
            }
        }

        // Get mouse position
        const svg = currentElement.closest('svg');
        const CTM = svg.getScreenCTM();
        startX = (e.clientX - CTM.e) / CTM.a;
        startY = (e.clientY - CTM.f) / CTM.d;

        // Change cursor
        currentElement.style.cursor = 'grabbing';
        svg.style.cursor = 'grabbing';
    }
}

function drag(e) {
    if (!isDragging || !currentElement) return;

    // Get current mouse position
    const svg = currentElement.closest('svg');
    const CTM = svg.getScreenCTM();
    const currentX = (e.clientX - CTM.e) / CTM.a;
    const currentY = (e.clientY - CTM.f) / CTM.d;

    // Calculate new position
    const newX = initialX + (currentX - startX);
    const newY = initialY + (currentY - startY);

    // Update element position
    currentElement.setAttribute('transform', `translate(${newX},${newY})`);

    // Update connected edges
    updateConnectedEdges(currentElement);
}

function endDrag() {
    if (isDragging && currentElement) {
        isDragging = false;
        currentElement.style.cursor = 'move';
        currentElement.closest('svg').style.cursor = 'grab';
        currentElement = null;
    }
}

// Update connected edges when a node is moved
function updateConnectedEdges(node) {
    const nodeId = node.id;
    const edges = document.querySelectorAll(`.edgePath[data-edge-id*="${nodeId}"]`);
    
    edges.forEach(edge => {
        // Force Mermaid to redraw the edge
        const path = edge.querySelector('path');
        if (path) {
            path.setAttribute('d', path.getAttribute('d'));
        }
    });
}

// Initialize live preview
export function initializeLivePreview() {
    // Initial render
    renderMermaidDiagram();

    // Set up auto-update
    state.editor.on('change', () => {
        clearTimeout(state.previewTimeout);
        state.previewTimeout = setTimeout(() => {
            state.mermaidCode = state.editor.getValue();
            renderMermaidDiagram();
        }, 500);
    });
}

export { renderMermaidDiagram, validateMermaidSyntax }; 