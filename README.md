# Local Development Setup

Follow these steps to set up and run the project locally:

## 1. Clone the repository
```sh
git clone https://github.com/mdkulkarni2005/manim_video_generation
cd manim_video_generation
```

## 2. Install dependencies
```sh
npm install
```

## 3. Set up environment variables
- Copy `.env.example` to `.env.local`:
  ```sh
  cp .env.example .env.local
  ```
- Add your Google Gemini API key to `.env.local` (already included if you use the provided key).

## 4. Start the backend (FastAPI)
You can run the backend directly or with Docker Compose:

### Option A: Using Docker Compose
```sh
docker-compose up
```

### Option B: Manually (requires Python 3.12+ and pip)
```sh
pip install -r requirements.txt
uvicorn backend:app --reload
```

## 5. Start the frontend (Vite + React)
```sh
npm run dev
```

The frontend will be available at http://localhost:5173 and the backend at http://localhost:8000 (or http://localhost:8080 if using Docker Compose).

---

## Environment Variables
- See `.env.example` for required variables.
- Do not commit your `.env.local` with real API keys to version control.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
