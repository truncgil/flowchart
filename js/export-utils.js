// Export utilities
const exportPngButton = document.getElementById('export-png');
const exportSvgButton = document.getElementById('export-svg');
const copyLinkButton = document.getElementById('copy-link');

// Export as PNG
exportPngButton.addEventListener('click', async () => {
    if (!state.diagramSvg) return;

    try {
        const svgElement = previewContainer.querySelector('svg');
        if (!svgElement) throw new Error('No SVG element found');

        // Convert SVG to PNG using dom-to-image
        const dataUrl = await domtoimage.toPng(svgElement, {
            quality: 1.0,
            bgcolor: '#ffffff',
            style: {
                'transform': 'scale(1)',
                'transform-origin': 'top left'
            }
        });

        // Create download link
        const link = document.createElement('a');
        link.download = 'flowchart.png';
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Error exporting PNG:', error);
        alert('Error exporting PNG: ' + error.message);
    }
});

// Export as SVG
exportSvgButton.addEventListener('click', () => {
    if (!state.diagramSvg) return;

    try {
        // Create download link
        const link = document.createElement('a');
        link.download = 'flowchart.svg';
        link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(state.diagramSvg);
        link.click();
    } catch (error) {
        console.error('Error exporting SVG:', error);
        alert('Error exporting SVG: ' + error.message);
    }
});

// Copy shareable link
copyLinkButton.addEventListener('click', () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        // Show success message
        const originalText = copyLinkButton.textContent;
        copyLinkButton.textContent = 'Copied!';
        copyLinkButton.classList.add('bg-green-500');
        copyLinkButton.classList.remove('bg-blue-500');

        setTimeout(() => {
            copyLinkButton.textContent = originalText;
            copyLinkButton.classList.remove('bg-green-500');
            copyLinkButton.classList.add('bg-blue-500');
        }, 2000);
    }).catch(error => {
        console.error('Error copying link:', error);
        alert('Error copying link: ' + error.message);
    });
}); 