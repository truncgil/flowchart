// PNG export functionality
import { state } from '../core/state.js';
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

        // Create a container for the export
        const exportContainer = document.createElement('div');
        exportContainer.style.backgroundColor = state.isDarkMode ? '#1f2937' : '#ffffff';
        exportContainer.style.padding = '20px';
        exportContainer.style.display = 'flex';
        exportContainer.style.flexDirection = 'column';
        exportContainer.style.alignItems = 'center';
        exportContainer.style.gap = '20px';
        exportContainer.style.width = '100%';
        exportContainer.style.height = 'auto';

        // Add logo
        const logo = document.createElement('img');
        logo.src = 'assets/icons/logo.svg';
        logo.style.width = '30%';
        logo.style.height = 'auto';
        logo.style.display = 'block';
        
        // Wait for logo to load
        await new Promise((resolve, reject) => {
            logo.onload = resolve;
            logo.onerror = reject;
        });
        
        exportContainer.appendChild(logo);

        // Add separator line
        const separator = document.createElement('div');
        separator.style.width = '100%';
        separator.style.height = '2px';
        separator.style.backgroundColor = state.isDarkMode ? '#4b5563' : '#e5e7eb';
        exportContainer.appendChild(separator);

        // Add the diagram
        const diagramClone = svg.cloneNode(true);
        diagramClone.style.width = '100%';
        diagramClone.style.height = 'auto';
        diagramClone.style.display = 'block';
        exportContainer.appendChild(diagramClone);

        // Add container to document temporarily
        document.body.appendChild(exportContainer);

        // Convert to PNG with higher quality settings
        const dataUrl = await domtoimage.toPng(exportContainer, {
            quality: 1.0,
            bgcolor: state.isDarkMode ? '#1f2937' : '#ffffff',
            width: exportContainer.offsetWidth,
            height: exportContainer.offsetHeight,
            style: {
                transform: 'none',
                'transform-origin': 'top left'
            }
        });

        // Create download link
        const link = document.createElement('a');
        link.download = 'truncgil-flowchart-diagram.png';
        link.href = dataUrl;
        link.click();

        // Clean up
        exportContainer.remove();

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

export { exportAsPng }; 