# Course Management System UI

A modern web application for managing courses built with React, TypeScript, and Ant Design.

## Prerequisites

- Node.js (v18 or higher)
- npm (included with Node.js)

## Tech Stack

- React 19.1.0
- TypeScript 5.8.3
- Vite 7.0.0
- Ant Design 5.26.3
- React Router 7.6.3
- Axios 1.10.0

## Getting Started

### Local Development

1. Install dependencies:
    ```bash
    npm install
    ```

2. Start the development server:
   ```bash
    npm run dev
   ```

The application will be available at `http://localhost:5173` by default.

### Building for Production

1. To create a production build:
    ```bash
    npm run build
    ```

The built files will be available in the `dist` directory.

### Docker Deployment

To run the application using Docker:

1. Build the Docker image:
    ```bash
    docker build -t course-management-ui .
    ```

2. Run the container:
    ```bash
    docker run -p 3000:3000 course-management-ui
    ```

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Creates a production build
- `npm run lint` - Runs ESLint for code quality
- `npm run preview` - Preview the production build locally

## Project Structure
course-management-system-ui/ 
├── src/ 
│ ├── components/ # Reusable components 
│ ├── models/ # TypeScript interfaces and types 
│ ├── services/ # API services 
│ └── pages/ # Page components 
├── public/ # Static assets 
└── package.json # Project dependencies and scripts

## Code Quality

The project uses ESLint for code quality and maintains consistent code style. Run the linter using:
   ```bash
   npm run lint
   ```
