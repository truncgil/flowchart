# Mermaid.js Flowchart Wizard

A modern, responsive web application that allows users to create, preview, and export flowcharts using Mermaid.js syntax.

## 🚀 Features

- **Real-time Preview**: See your flowchart come to life as you type
- **Intelligent Editor**: CodeMirror integration with Mermaid-specific autocomplete
- **Export Options**: Download your diagrams as PNG or SVG
- **Responsive Design**: Works seamlessly on all devices
- **Modern UI**: Built with Tailwind CSS for a beautiful interface
- **Dark Mode**: Toggle between light and dark themes

## 🛠️ Technology Stack

- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Editor**: CodeMirror with custom Mermaid mode
- **Diagram Engine**: [Mermaid.js](https://mermaid-js.github.io/)
- **Export Tools**: 
  - SVG: Native Mermaid export
  - PNG: DOM-to-image conversion

## 📁 Project Structure

```bash
mermaid-wizard/
├── index.html              # Main application entry point
├── assets/                 # Static assets
│   ├── styles/            # CSS styles
│   │   ├── main.css      # Main styles
│   │   ├── editor.css    # Editor-specific styles
│   │   └── themes.css    # Theme-related styles
│   └── icons/            # Application icons
├── js/                    # JavaScript modules
│   ├── core/             # Core functionality
│   │   ├── app.js        # Main application logic
│   │   ├── state.js      # State management
│   │   └── events.js     # Event handling
│   ├── editor/           # Editor-related functionality
│   │   ├── codemirror.js # CodeMirror initialization
│   │   ├── hints.js      # Autocomplete hints
│   │   └── mode.js       # Custom Mermaid mode
│   ├── preview/          # Preview functionality
│   │   ├── renderer.js   # Diagram rendering
│   │   └── controls.js   # Preview controls (zoom, pan)
│   └── export/           # Export functionality
│       ├── png.js        # PNG export
│       └── svg.js        # SVG export
└── lib/                  # Third-party libraries
    └── mermaid.min.js    # Mermaid.js library
```

## 🎯 Module Descriptions

### Core Modules
- **app.js**: Main application initialization and coordination
- **state.js**: Application state management
- **events.js**: Global event handling

### Editor Modules
- **codemirror.js**: CodeMirror editor setup and configuration
- **hints.js**: Mermaid-specific autocomplete functionality
- **mode.js**: Custom Mermaid syntax highlighting mode

### Preview Modules
- **renderer.js**: Mermaid diagram rendering and error handling
- **controls.js**: Preview controls (zoom, pan, reset)

### Export Modules
- **png.js**: PNG export functionality
- **svg.js**: SVG export functionality

## 💡 How to Use

### Basic Usage
1. Open the application in your browser
2. Start typing Mermaid syntax in the editor
3. See the preview update in real-time
4. Use the export menu to download your diagram

### Editor Features
- **Autocomplete**: Press `Ctrl+Space` for suggestions
- **Syntax Highlighting**: Mermaid-specific syntax highlighting
- **Live Preview**: Real-time diagram updates
- **Error Handling**: Visual feedback for syntax errors

### Preview Controls
- **Zoom**: Use mouse wheel or zoom buttons
- **Pan**: Click and drag to move the diagram
- **Reset**: Double-click to reset view

### Export Options
- **PNG**: Download as PNG image
- **SVG**: Download as SVG vector file

## 🔧 Development

### Prerequisites
- Modern web browser
- Node.js (for development)
- npm or yarn (for development)

### Local Development
1. Clone the repository
2. Install dependencies (if any)
3. Open `index.html` in your browser
4. Make changes to the source files
5. Refresh to see your changes

### Building
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Syntax highlighting works correctly
- [ ] Autocomplete suggestions are accurate
- [ ] Real-time preview updates properly
- [ ] Export functions work in all browsers
- [ ] Dark mode toggle works correctly
- [ ] Responsive design works on all devices

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mermaid.js](https://mermaid-js.github.io/) for the powerful diagramming library
- [CodeMirror](https://codemirror.net/) for the code editor
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework

## 📞 Support

If you encounter any issues or have questions:
1. Check the [documentation](https://mermaid-js.github.io/)
2. Open an issue in the GitHub repository
3. Contact the maintainers 