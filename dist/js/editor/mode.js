// Mermaid mode for CodeMirror
CodeMirror.defineMode("mermaid", function() {
    return {
        token: function(stream, state) {
            // Keywords
            if (stream.match(/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|gantt|pie|erDiagram|journey)\b/)) {
                return "keyword";
            }
            
            // Node shapes
            if (stream.match(/^\[.*?\]/)) {
                return "bracket";
            }
            
            // Edge types
            if (stream.match(/^(-->|==>|-.->|==>|-->|==>|-.->|==>)\b/)) {
                return "operator";
            }
            
            // Comments
            if (stream.match(/^%%/)) {
                stream.skipToEnd();
                return "comment";
            }
            
            // Default
            stream.next();
            return null;
        }
    };
});

// Register the mode
CodeMirror.defineMIME("text/x-mermaid", "mermaid"); 