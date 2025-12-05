Create a complete Weather Dashboard application with the following specifications:

### Backend (Python/FastAPI)
- Create a FastAPI backend server with the following endpoints:
  - `GET /api/weather/{city}` - Get current weather for a city
  - `GET /api/weather/{city}/forecast` - Get 5-day weather forecast
  - `GET /api/cities/search?q={query}` - Search for cities by name
  - `GET /api/health` - Health check endpoint
- Use the OpenWeatherMap API (use a free API key - I'll provide it in environment variables)
- Implement proper error handling with meaningful error messages
- Add CORS middleware to allow frontend connections
- Create a requirements.txt with all dependencies
- Include environment variable support for API keys (use python-dotenv)
- Add input validation using Pydantic models
- Structure the code with separate modules: `main.py`, `models.py`, `services.py`, `config.py`
- Include proper logging
- Add rate limiting to prevent API abuse

### Frontend (React + TypeScript)
- Create a modern React application with TypeScript
- Use Vite as the build tool for fast development
- Implement a beautiful, responsive UI with:
  - A search bar to find cities
  - Current weather display with:
    - City name and country
    - Temperature (with unit toggle: Celsius/Fahrenheit)
    - Weather condition with icon
    - Humidity, wind speed, pressure
    - "Feels like" temperature
  - 5-day forecast cards showing:
    - Day of week
    - High/low temperatures
    - Weather condition icon
    - Brief description
  - Loading states and error messages
  - Smooth animations and transitions
- Use Tailwind CSS for styling
- Implement proper TypeScript interfaces for all API responses
- Add error boundaries for graceful error handling
- Include a favorites feature (store in localStorage)
- Make it fully responsive (mobile, tablet, desktop)
- Add a dark/light theme toggle

### Additional Features
- Create a comprehensive README.md with:
  - Setup instructions for both frontend and backend
  - Environment variable configuration
  - How to get an OpenWeatherMap API key
  - How to run the application
  - Project structure overview
- Add a .gitignore file for both Python and Node.js
- Include example .env files (.env.example)
- Create a Docker setup:
  - Dockerfile for backend
  - Dockerfile for frontend
  - docker-compose.yml to run both services

### Code Quality
- Follow best practices and coding standards
- Add helpful comments where necessary
- Use async/await properly
- Implement proper error handling throughout
- Make the code production-ready (not just a prototype)

### Project Structure
```
weather-dashboard/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── services.py
│   │   └── config.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
├── README.md
└── .gitignore
```

Start by creating the backend, then the frontend, and ensure they work together seamlessly.

