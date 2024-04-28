# React + TypeScript + Vite
# Notes React TS
This is a note management application built using React and TypeScript, featuring a RESTful API for backend operations.

# Description
The application allows users to create, edit, delete, and mark notes as read after registering or logging into their profiles.

# Installation
1.Clone the repository:

git clone https://github.com/AngelGeorgievStoyanov/notes-react-ts

2.Install dependencies:

cd notes-react-ts
npm install
# Usage
Start the application in development mode:
npm run dev

# Built With
* React
* TypeScript
* Vite
* Emotion
* Material-UI
* React Hook Form
* React Router
* Yup
* JWT Decode

# Connection with REST API MySQL
* Default Notes React TS is the connection with REST API.   

# REST API  - https://github.com/AngelGeorgievStoyanov/rest-api-postgresql
* To run server npm run dev



This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
