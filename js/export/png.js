// PNG export functionality
import state from '../core/state.js';
import { elements } from '../core/events.js';

async function exportAsPng() {
    try {
        const previewContainer = document.getElementById('mermaid-preview');
        const svg = previewContainer.querySelector('svg');
        
        if (!svg) {
            throw new Error('No diagram to export');
        }

        // Show loading state
        showToast('Exporting PNG...', 'info');

        // Convert SVG to PNG
        const dataUrl = await domtoimage.toPng(svg, {
            quality: 1.0,
            bgcolor: state.isDarkMode ? '#1f2937' : '#ffffff'
        });

        // Create download link
        const link = document.createElement('a');
        link.download = 'mermaid-diagram.png';
        link.href = dataUrl;
        link.click();

        // Show success message
        showToast('PNG exported successfully!', 'success');
    } catch (error) {
        console.error('Error exporting PNG:', error);
        showToast('Error exporting PNG: ' + error.message, 'error');
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

export default exportAsPng; 