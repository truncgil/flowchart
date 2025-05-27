// Preview controls (zoom, pan)
import state from '../core/state.js';
import { elements } from '../core/events.js';

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

function updatePreviewTransform() {
    elements.mermaidPreview.style.transform = `translate(${state.translateX}px, ${state.translateY}px) scale(${state.zoomLevel / 100})`;
    elements.mermaidPreview.style.transformOrigin = '0 0';
}

function resetPreview() {
    state.zoomLevel = 100;
    state.translateX = 0;
    state.translateY = 0;
    elements.zoomLevel.textContent = '100%';
    updatePreviewTransform();
}

export { initializePreviewControls, updateZoom, resetPreview }; 