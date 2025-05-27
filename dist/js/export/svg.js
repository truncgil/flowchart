// SVG export functionality
import { state } from '../core/state.js';
import { elements } from '../core/events.js';

function exportAsSvg() {
    try {
        const previewContainer = document.getElementById('mermaid-preview');
        const svg = previewContainer.querySelector('svg');
        
        if (!svg) {
            throw new Error('No diagram to export');
        }

        // Get SVG content
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        // Create download link
        const link = document.createElement('a');
        link.download = 'truncgil-flowchart-diagram.svg';
        link.href = svgUrl;
        link.click();

        // Clean up
        URL.revokeObjectURL(svgUrl);

        // Show success message
        showToast('SVG exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting SVG:', error);
        showToast('Error exporting SVG: ' + error.message, 'error');
    }
}

function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 
        'bg-blue-500'
    } text-white`;
    toast.textContent = message;

    // Add to document
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

export default exportAsSvg; 