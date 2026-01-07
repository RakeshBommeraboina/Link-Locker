# Memory Capture Extension

A comprehensive bookmarking and memory capture system consisting of a browser extension, backend API, and frontend dashboard.

## Overview

Memory Capture allows users to save and organize web content (articles, products, videos) with AI-powered summarization and categorization. The system includes:

- **Browser Extension**: Capture content directly from web pages
- **Backend API**: Handles data storage, authentication, and AI processing
- **Frontend Dashboard**: Web interface for managing captured memories

## Features

- Capture articles, products, and videos from web pages
- AI-powered content summarization using Groq
- User authentication and secure storage
- Responsive web dashboard
- Browser extension integration

## Tech Stack

### Backend

- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Groq AI SDK for content processing
- bcryptjs for password hashing

### Frontend

- React 19 with Vite
- Tailwind CSS for styling
- Axios for API calls
- React Router for navigation
- Lucide React for icons

### Extension

- Manifest V3 Chrome Extension
- Service worker background script
- Content scripts for page interaction
- Popup interface

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Groq API key
- Chrome browser for extension

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd BookmarksExtensionBackend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GROQ_API_KEY=your_groq_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd BookMarksFronted
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will run on http://localhost:5173

### Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `BookmarksExtension` folder
4. The extension will be loaded and ready to use

## Usage

1. **Register/Login**: Create an account or log in through the frontend dashboard
2. **Install Extension**: Load the extension in Chrome as described above
3. **Capture Content**: While browsing, use the extension popup to capture articles, products, or videos
4. **View Memories**: Access your captured content through the web dashboard

## API Endpoints

### Authentication

- `POST /register` - User registration
- `POST /login` - User login

### Memory Management

- `POST /capture` - Capture new memory (requires auth)
- `GET /memories` - Get user's memories (requires auth)
- `DELETE /memories/:id` - Delete a memory (requires auth)
- `POST /search` - Search memories (requires auth)

## Development

### Running Tests

- Backend: Add test scripts to `package.json` as needed
- Frontend: Add test scripts to `package.json` as needed

### Building for Production

1. Backend: `npm start`
2. Frontend: `npm run build`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
