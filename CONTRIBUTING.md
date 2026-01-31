# Contributing to Scriptable Scripts

Thank you for your interest in contributing to this collection of Scriptable scripts!

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [VS Code](https://code.visualstudio.com/) (recommended) or your preferred editor
- [Scriptable app](https://scriptable.app/) for iOS (for testing on device)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ckyPur3/scriptable.git
   cd scriptable
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install recommended VS Code extensions**
   
   When you open the project in VS Code, you'll be prompted to install recommended extensions:
   - ESLint - for JavaScript linting
   - Prettier - for code formatting
   - Code Spell Checker - for spell checking

## Development Workflow

### Code Quality

This project uses ESLint and Prettier to maintain code quality and consistency.

- **Linting**: Check for code issues
  ```bash
  npm run lint
  ```

- **Auto-fix linting issues**:
  ```bash
  npm run lint:fix
  ```

- **Format code**:
  ```bash
  npm run format
  ```

- **Check formatting**:
  ```bash
  npm run format:check
  ```

- **Run all checks** (recommended before committing):
  ```bash
  npm run check
  ```

### VS Code Integration

If you're using VS Code with the recommended extensions:

- Code will be **automatically formatted** on save
- Linting errors will appear as you type
- Auto-fix available via quick actions (Cmd/Ctrl + .)

### Writing Scriptable Scripts

Scriptable scripts use JavaScript ES2021. Key points:

1. **Global APIs**: Scriptable provides global APIs like `Calendar`, `FileManager`, `Request`, etc.
2. **No Node.js**: Remember that Scriptable runs on iOS, not Node.js
3. **Module System**: Use `importModule()` for importing other scripts
4. **Type Hints**: With TypeScript definitions installed, you'll get IntelliSense for Scriptable APIs

### Code Style Guidelines

- Use **single quotes** for strings
- Use **semicolons**
- Use **2 spaces** for indentation
- Maximum line length: **100 characters**
- Prefer `const` over `let` when variables won't be reassigned
- Use arrow functions where appropriate

### Testing Your Scripts

1. **Local Development**: Edit scripts in your editor with linting and formatting
2. **Device Testing**: 
   - Copy scripts to `iCloud Drive/Scriptable/`
   - Open Scriptable app on iOS
   - Run and test your script

## Submitting Changes

1. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Run linting and formatting**:
   ```bash
   npm run lint:fix
   npm run format
   ```

4. **Commit your changes** with a descriptive message
   ```bash
   git commit -m "Add feature: description of your changes"
   ```

5. **Push to your fork** and create a pull request

## Project Structure

```
scriptable/
├── .vscode/              # VS Code workspace settings
├── lib/                  # Shared libraries and utilities
├── images/               # Screenshots and images for README
├── *.js                  # Individual Scriptable scripts
├── package.json          # Node.js dependencies and scripts
├── .eslintrc.json        # ESLint configuration
├── .prettierrc.json      # Prettier configuration
├── jsconfig.json         # JavaScript/TypeScript config for IntelliSense
└── README.md             # Project documentation
```

## Resources

- [Scriptable Documentation](https://docs.scriptable.app/)
- [Scriptable Community](https://talk.automators.fm/c/scriptable/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## Questions?

If you have questions or need help, feel free to:
- Open an issue on GitHub
- Check the [Scriptable documentation](https://docs.scriptable.app/)
- Ask in the [Scriptable community forums](https://talk.automators.fm/c/scriptable/)

Thank you for contributing! 🎉
