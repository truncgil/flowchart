import { state } from '../core/state.js';
import { elements } from '../core/events.js';
import { renderMermaidDiagram } from '../preview/renderer.js';

const GEMINI_API_KEY = 'AIzaSyDMqZgcvL8XDfTvrO4b8jsyfQfOUKvfXrc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Initialize Truncgil AI Editor
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
            // Show loading state
            elements.convertToFlowchart.disabled = true;
            elements.convertToFlowchart.innerHTML = '<span class="material-icons animate-spin">sync</span> Converting...';

            // Call Gemini API to convert code to flowchart
            const flowchart = await convertToFlowchart(code);
            
            // Update both editors with the flowchart
            state.editor.setValue(flowchart);
            elements.mermaidInput.value = flowchart;
            
            // Update the preview
            state.mermaidCode = flowchart;
            renderMermaidDiagram();
        } catch (error) {
            console.error('Error converting code to flowchart:', error);
            // Show error message to user
            alert('Error converting code to flowchart. Please try again.');
        } finally {
            // Reset button state
            elements.convertToFlowchart.disabled = false;
            elements.convertToFlowchart.innerHTML = 'Convert';
        }
    });
}

// Function to clean and format the flowchart code
function cleanFlowchartCode(code) {
    // Remove markdown code block markers if present
    code = code.replace(/```mermaid\n?/g, '');
    code = code.replace(/```\n?/g, '');
    
    // Remove any extra whitespace at the beginning and end
    code = code.trim();
    
    // Ensure it starts with graph TD
    if (!code.startsWith('graph TD')) {
        code = `graph TD\n${code}`;
    }
    
    // Remove any duplicate graph TD declarations
    code = code.replace(/graph TD\n?graph TD\n?/g, 'graph TD\n');
    
    // Remove semicolons at the end of lines
    code = code.replace(/;/g, '');
    
    // Ensure proper line endings
    code = code.replace(/\r\n/g, '\n');
    
    // Split into lines and clean each line
    const lines = code.split('\n');
    const cleanedLines = lines.map(line => {
        // Remove any trailing whitespace
        line = line.trim();
        
        // Remove any semicolons
        line = line.replace(/;/g, '');
        
        // Ensure proper spacing around arrows
        line = line.replace(/\s*-->\s*/g, ' --> ');
        
        // Clean up node definitions
        line = line.replace(/\s*\[\s*/g, '[');
        line = line.replace(/\s*\]\s*/g, ']');
        line = line.replace(/\s*{\s*/g, '{');
        line = line.replace(/\s*}\s*/g, '}');
        
        // Remove parentheses and clean up function calls
        line = line.replace(/\(\)/g, '');
        line = line.replace(/console\.log\([^)]*\)/g, 'Print to console');
        line = line.replace(/\([^)]*\)/g, '');
        
        // Clean up any remaining special characters
        line = line.replace(/[()]/g, '');
        
        return line;
    });
    
    // Join lines back together
    code = cleanedLines.join('\n');
    
    return code;
}

// Function to convert code to flowchart using Gemini API
async function convertToFlowchart(code) {
    const prompt = `Convert the following JavaScript code into a Mermaid.js flowchart TD format. 
    Follow these rules:
    1. Use simple, readable node labels without special characters
    2. For console.log statements, use "Print to console" or similar readable text
    3. For function calls, use the function name without parentheses
    4. Do not use semicolons at the end of lines
    5. Use proper spacing around arrows and node definitions
    6. Keep the flowchart simple and easy to read
    
    Here's the code:

    ${code}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.2,
                topK: 32,
                topP: 0.95,
                maxOutputTokens: 1024
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
        })
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    let flowchart = data.candidates[0].content.parts[0].text.trim();
    
    // Clean and format the flowchart code
    flowchart = cleanFlowchartCode(flowchart);

    return flowchart;
}

// Export functions
export { initializeDeepSeekEditor }; 