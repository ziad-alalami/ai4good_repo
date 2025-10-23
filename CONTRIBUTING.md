# Contributing to AI4Good Speech Therapy Assessment

Thank you for your interest in contributing to the **AI4Good Speech Therapy Assessment** project!  
This document provides guidelines for contributing to the codebase.  

---

## Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

---

## Getting Started

Before contributing, please:
1. Read the [README.md](README.md) for project overview  
2. Check existing issues and pull requests to avoid duplicates  
3. Open an issue to discuss major changes before implementing them  

---

## Development Setup

### Prerequisites
- Python 3.10 or higher  
- pip (for installing uv)  
- espeak-ng (required by phonemizer)  
- OpenAI API key  

### Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/ziad-alalami/ai4good_repo.git
   cd ai4good_repo
   ```

2. **Install uv package manager**  
   ```bash
   pip install uv
   ```

3. **Install dependencies**  
   ```bash
   uv sync
   ```

4. **Configure environment variables**  
   ```bash
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

5. **Create required directories**  
   ```bash
   mkdir -p data/audio
   mkdir -p data/background/user_responses
   mkdir -p data/agent_convo
   mkdir -p data/models
   ```

For detailed setup instructions, see the Quick Start Guide.  

---

## Code Standards

### Python Style
- Follow PEP 8 style guidelines  
- Use meaningful variable and function names  
- Add docstrings to all functions and classes  
- Keep functions focused and concise  

### Dependencies
- Add new dependencies using:
  ```bash
  uv add <package_name>
  ```
- Document why new dependencies are needed in your PR  
- Avoid adding unnecessary dependencies  

### File Organization
- Place utility functions in `utils/`  
- Keep model-related code in `model/`  
- Store data files in appropriate `data/` subdirectories  
- Update `.env.example` if adding new environment variables  

---

## Making Changes

### Branch Naming
Use descriptive branch names:
- `feature/description` - for new features  
- `fix/description` - for bug fixes  
- `docs/description` - for documentation updates  
- `refactor/description` - for code refactoring  

### Commit Messages
Write clear, concise commit messages:

```
<type>: <short summary>

<optional detailed description>

<optional footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`  

Example:

```
feat: add phoneme analysis to BERT classifier

Implemented phoneme extraction using phonemizer library  
to improve speech assessment accuracy.

Closes #42
```

---

## Testing

### Running the Application
```bash
uv run python app/app.py
```
for the frontend and (in another terminal)
```bash
cd frontend/my-react-app
```
followed by
```bash
npm install
npm run dev
```

### Testing API Endpoints
Test endpoints manually or using tools like curl:

```bash
curl http://localhost:5000/questions
```

Before submitting:
- Ensure the Flask server starts without errors  
- Test all modified endpoints  
- Verify environment variables are properly documented  
- Check that new features work with existing data structures  

---

## Submitting Changes

### Pull Request Process

1. **Update your branch**
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

2. **Push your changes**
   ```bash
   git push origin your-branch
   ```

3. **Create a Pull Request**
   - Use a clear, descriptive title  
   - Reference related issues (e.g., "Fixes #123")  
   - Describe what changes were made and why  
   - Include screenshots for UI changes  
   - List any breaking changes  

### PR Checklist
- [ ] Code follows project style guidelines  
- [ ] Documentation updated (if needed)  
- [ ] `.env.example` updated (if new variables added)  
- [ ] Dependencies added via `uv add` (if applicable)  
- [ ] Tested locally  
- [ ] No merge conflicts  

---

## Review Process
- Maintainers will review your PR  
- Address any requested changes  
- Once approved, your PR will be merged  

---

## Project Structure

```
ai4good_repo/
├── app/              # Flask application
├── frontend/         # Frotnend application
├── model/            # ML models (BERT, agents)
├── utils/            # Utility functions
├── data/             # Data storage
│   ├── audio/        # Audio files
│   ├── background/   # User questionnaires
│   ├── models/       # Trained models
│   └── agent_convo/  # Conversation logs
├── .env.example      # Environment template
├── uv.lock           # Dependency lock file
└── pyproject.toml    # Project configuration
```

---

## Key Technologies
- **Flask 3.1.2** – Web framework  
- **PyTorch 2.8.0** – Deep learning  
- **Transformers 4.57.0** – BERT implementation  
- **OpenAI 2.3.0** – GPT-4 integration  
- **Librosa 0.11.0** – Audio analysis  
- **Phonemizer 3.2.1** – Text-to-phoneme conversion  

---

## Questions or Issues?
- Open an issue for bugs or feature requests  
- Check existing documentation in the wiki  
- Contact maintainers for major architectural changes  

---

## License
By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to AI4Good! 🎉

---

## Notes
This is the same content as before, but now formatted as a single text block that can be copied directly into a `CONTRIBUTING.md` file or rendered on your website.  
The content is based on the Flask application structure and the project's dependency management using `uv`.

Wiki pages you might want to explore:
- [System Architecture (ziad-alalami/ai4good_repo)](/wiki/ziad-alalami/ai4good_repo#2)
