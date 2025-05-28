import { state } from '../core/state.js';
import { elements } from '../core/events.js';

// Initialize DeepSeek AI Editor
function initializeDeepSeekEditor() {
    state.deepseekEditor = CodeMirror.fromTextArea(elements.deepseekInput, {
        mode: 'javascript',
        theme: state.isDarkMode ? 'monokai' : 'default',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        extraKeys: {
            "Ctrl-Space": "autocomplete"
        }
    });

    // Set initial content
    state.deepseekEditor.setValue(`// Write your code here
// Example:
function example() {
    console.log("Hello World");
}`);

    // Handle convert button click
    elements.convertToFlowchart.addEventListener('click', async () => {
        const code = state.deepseekEditor.getValue();
        try {
            // Call DeepSeek AI API to convert code to flowchart
            const flowchart = await convertToFlowchart(code);
            // Update the main editor with the flowchart
            state.editor.setValue(flowchart);
        } catch (error) {
            console.error('Error converting code to flowchart:', error);
            // Show error message to user
            alert('Error converting code to flowchart. Please try again.');
        }
    });
}

// Function to convert code to flowchart using DeepSeek AI
async function convertToFlowchart(code) {
    // TODO: Implement DeepSeek AI API call
    // For now, return a simple flowchart
    return `graph TD
    A[Start] --> B[Process]
    B --> C[End]`;
}

// Export functions
export { initializeDeepSeekEditor }; 