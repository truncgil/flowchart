// CodeMirror initialization
import { state } from '../core/state.js';
import { elements } from '../core/events.js';
import { renderMermaidDiagram } from '../preview/renderer.js';

// Initialize CodeMirror
function initializeCodeMirror() {
    state.editor = CodeMirror.fromTextArea(elements.mermaidInput, {
        mode: 'mermaid',
        theme: state.isDarkMode ? 'monokai' : 'default',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "Ctrl-S": function(cm) {
                // Save functionality if needed
                return false;
            }
        },
        hintOptions: {
            completeSingle: false,
            hint: CodeMirror.hint.mermaid
        }
    });

    // Set initial content
    state.editor.setValue(`graph TD
    A[Start] --> B[Process]
    B --> C[End]`);

    // Handle editor changes
    state.editor.on('change', () => {
        clearTimeout(state.previewTimeout);
        state.previewTimeout = setTimeout(() => {
            state.mermaidCode = state.editor.getValue();
            renderMermaidDiagram();
        }, 500);
    });

    // Enable autocomplete on typing
    state.editor.on('inputRead', function(cm, change) {
        if (change.text.length === 1 && /[\w[\](){}]/.test(change.text[0])) {
            CodeMirror.commands.autocomplete(cm);
        }
    });
}

export default initializeCodeMirror; 