// Export utilities
const elements = {
    exportPng: document.getElementById('export-png'),
    exportSvg: document.getElementById('export-svg')
};

// Export as PNG
elements.exportPng.addEventListener('click', async () => {
    try {
        const previewContainer = document.getElementById('mermaid-preview');
        const svg = previewContainer.querySelector('svg');
        
        if (!svg) {
            throw new Error('No diagram to export');
        }

        // Show loading state
        const loadingToast = showToast('Exporting PNG...', 'info');

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
});

// Export as SVG
elements.exportSvg.addEventListener('click', () => {
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
        link.download = 'mermaid-diagram.svg';
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
});

// Toast notification system
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed bottom-4 right-4 z-50';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `flex items-center p-4 mb-4 rounded-lg shadow-lg transform transition-all duration-300 translate-y-2 opacity-0 ${
        type === 'error' ? 'bg-red-500' :
        type === 'success' ? 'bg-green-500' :
        'bg-blue-500'
    } text-white`;

    // Add icon based on type
    const icon = document.createElement('span');
    icon.className = 'material-icons mr-2';
    icon.textContent = type === 'error' ? 'error' :
                      type === 'success' ? 'check_circle' :
                      'info';
    toast.appendChild(icon);

    // Add message
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    toast.appendChild(messageSpan);

    // Add to container
    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });

    // Remove after delay
    setTimeout(() => {
        toast.classList.add('translate-y-2', 'opacity-0');
        setTimeout(() => {
            toast.remove();
            if (toastContainer.children.length === 0) {
                toastContainer.remove();
            }
        }, 300);
    }, 3000);

    return toast;
} 