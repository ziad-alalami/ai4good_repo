# AI4Good Speech Therapy Assessment 🧠🎤  

Welcome to the **AI4Good Speech Therapy Assessment** project!  
This repository is part of the **AI4Good initiative**, aiming to leverage AI to improve accessibility and assistive healthcare — in this case, by developing intelligent tools for **speech therapy assessment and feedback**.  

Our goal is to create a system that uses **AI-driven speech analysis**, **phoneme recognition**, and **language modeling** to evaluate and support users in speech improvement, with a user-friendly **Flask + React** interface.

---

## 🌟 Overview

The AI4Good Speech Therapy Assessment project combines **machine learning**, **speech analysis**, and **conversational AI** to assess and provide insights into speech patterns.  
It integrates:
- Deep learning models (BERT, Transformers, custom-trained PyTorch models)  
- Speech-to-text and text-to-phoneme conversion  
- Real-time conversation tracking with GPT-4  
- Frontend built with React for interactive sessions  
- Flask backend for model serving and API management  

---

## 🧩 Features

✅ Speech-to-text and phoneme-based analysis  
✅ GPT-4 integrated feedback system  
✅ Real-time speech assessment  
✅ Audio storage and conversation tracking  
✅ Modular ML model integration  
✅ Cross-platform React + Flask setup  

---

## 🏗️ Project Structure

```
ai4good_repo/
├── app/              # Flask application (API endpoints, routing, server)
├── frontend/         # React-based frontend for user interaction
├── model/            # ML models (BERT, speech analysis, GPT agents)
├── utils/            # Helper and utility functions
├── data/             # Data storage (audio, models, logs, user responses)
│   ├── audio/        
│   ├── background/   
│   ├── models/       
│   └── agent_convo/  
├── .env.example      # Environment variable template
├── uv.lock           # Dependency lock file
└── pyproject.toml    # Project configuration and dependencies
```

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ziad-alalami/ai4good_repo.git
cd ai4good_repo
```

### 2. Install Dependencies
We use **uv** for dependency management:
```bash
pip install uv
uv sync
```

### 3. Set Environment Variables
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 4. Run the Backend
```bash
uv run python app/app.py
```

### 5. Run the Frontend
```bash
cd frontend/my-react-app
npm install
npm run dev
```

The backend will handle model inference and API endpoints, while the frontend provides an interactive UI for users and therapists.

---

## 🧠 Key Technologies

| Category | Technology | Purpose |
|-----------|-------------|----------|
| Backend | Flask 3.1.2 | REST API for AI logic |
| Frontend | React + Vite | Web interface for interactions |
| ML Framework | PyTorch 2.8.0 | Training and inference |
| NLP | Transformers 4.57.0 | BERT-based analysis |
| AI Assistant | OpenAI 2.3.0 | GPT-4 integration |
| Audio Processing | Librosa 0.11.0 | Feature extraction |
| Phoneme Conversion | Phonemizer 3.2.1 | Speech pattern analysis |

---

## 🧑‍💻 Contributing

Contributions are welcome and encouraged!  
Whether it’s fixing bugs, improving documentation, or adding new ML models — every bit helps.  

Please read the full [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines including setup, testing, and pull request standards.

---

## 🧾 Documentation & Wiki

All documentation, system architecture details, and deep explanations can be found here:  
👉 **[AI4Good DeepWiki](https://deepwiki.com/ziad-alalami/ai4good_repo)**

There, you can even **interact with an AI assistant** trained to explain the repository, its architecture, and development workflow.  
This AI companion can walk you through the setup, model logic, and contribution process directly on the wiki.

---

## 🐞 Issues & Support

- Found a bug? Open an issue in this repo.  
- Want to propose a feature? Discuss it first on the **DeepWiki AI assistant** or through GitHub issues.  
- Need help understanding the codebase? Ask the wiki AI or check the architecture diagrams there.

---

## ⚖️ License

- **Code & Software**: Licensed under the [MIT License](./LICENSE.md)  
- **Documentation, designs, and other creative works**: Licensed under the [CC-BY 4.0 License](./LICENSE-CC-BY-4.0.md)
- By contributing, you agree that your contributions will be licensed under the same terms.

---

## 💬 Contact

For major architectural or research discussions, please open an issue or contact the maintainers via the [AI4Good DeepWiki page](https://deepwiki.com/ziad-alalami/ai4good_repo).

---

### 🌍 Join the AI4Good Mission

We’re using artificial intelligence to make therapy and accessibility tools more inclusive, intelligent, and impactful.  
Your contributions — whether code, design, or ideas — help make that mission a reality.

**Let’s build something good. Together. 💙**
