# Weather Dashboard

A modern, full-stack weather dashboard application built with FastAPI (Python) backend and React + TypeScript frontend. Get real-time weather data and 5-day forecasts for any city worldwide.

## Features

### Backend
- **FastAPI** REST API with async/await support
- **OpenWeatherMap API** integration for weather data
- **Rate limiting** to prevent API abuse
- **CORS** middleware for frontend connectivity
- **Input validation** using Pydantic models
- **Comprehensive error handling** with meaningful messages
- **Structured logging** for debugging and monitoring

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for modern, responsive styling
- **Dark/Light theme** toggle with system preference detection
- **City search** with autocomplete suggestions
- **Current weather display** with detailed metrics
- **5-day forecast** with daily high/low temperatures
- **Favorites system** with localStorage persistence
- **Temperature unit toggle** (Celsius/Fahrenheit)
- **Fully responsive** design (mobile, tablet, desktop)
- **Smooth animations** and transitions
- **Error boundaries** for graceful error handling

## Project Structure

```
weather-dashboard/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application and routes
│   │   ├── models.py        # Pydantic models for validation
│   │   ├── services.py      # Weather API service layer
│   │   └── config.py        # Configuration and settings
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example        # Example environment variables
│   └── Dockerfile          # Backend Docker configuration
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript interfaces
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── tsconfig.json       # TypeScript configuration
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── Dockerfile          # Frontend Docker configuration
├── docker-compose.yml       # Docker Compose configuration
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

## Prerequisites

- **Python 3.11+** (for backend)
- **Node.js 20+** and npm (for frontend)
- **Docker** and Docker Compose (optional, for containerized deployment)
- **OpenWeatherMap API Key** (free tier available at [openweathermap.org](https://openweathermap.org/api))

## Getting Started

### 1. Get an OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API keys section
4. Generate a new API key (free tier allows 60 calls/minute)

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env

# Edit .env and add your OpenWeatherMap API key
# OPENWEATHER_API_KEY=your_api_key_here

# Run the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

API documentation will be available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Using Docker (Optional)

```bash
# From the project root directory

# Create .env file in backend directory
cd backend
cp .env.example .env
# Edit .env and add your API key

# Return to project root
cd ..

# Build and start containers
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:80
```

## Environment Variables

### Backend (.env)

```env
# Required
OPENWEATHER_API_KEY=your_api_key_here

# Optional (with defaults)
APP_NAME=Weather Dashboard API
APP_VERSION=1.0.0
DEBUG=false
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
RATE_LIMIT_PER_MINUTE=60
LOG_LEVEL=INFO
```

### Frontend

The frontend uses Vite's environment variable system. Create a `.env` file in the frontend directory if needed:

```env
VITE_API_URL=http://localhost:8000
```

## API Endpoints

### Health Check
- `GET /api/health` - Health check endpoint

### Weather
- `GET /api/weather/{city}` - Get current weather for a city
- `GET /api/weather/{city}/forecast` - Get 5-day weather forecast

### Cities
- `GET /api/cities/search?q={query}` - Search for cities by name

## Usage

1. **Search for a city**: Type in the search bar to find cities worldwide
2. **View current weather**: See temperature, conditions, humidity, wind speed, and pressure
3. **Check forecast**: View 5-day forecast with daily highs and lows
4. **Toggle temperature units**: Switch between Celsius and Fahrenheit
5. **Add favorites**: Click the heart icon to save favorite cities
6. **Switch themes**: Toggle between light and dark mode
7. **View favorites**: Access your saved cities from the favorites panel

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate  # Activate virtual environment
uvicorn app.main:app --reload  # Run with auto-reload
```

### Frontend Development

```bash
cd frontend
npm run dev  # Start Vite dev server with hot reload
```

### Building for Production

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build  # Creates optimized production build in dist/
npm run preview  # Preview production build locally
```

## Technologies Used

### Backend
- **FastAPI** - Modern, fast web framework
- **Pydantic** - Data validation using Python type annotations
- **httpx** - Async HTTP client
- **slowapi** - Rate limiting middleware
- **python-dotenv** - Environment variable management
- **uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

## Code Quality

- TypeScript strict mode enabled
- Pydantic models for request/response validation
- Comprehensive error handling
- Logging throughout the application
- Rate limiting to prevent abuse
- CORS configuration for security
- Responsive design principles
- Accessibility considerations

## Troubleshooting

### Backend Issues

**API Key Errors:**
- Ensure your `.env` file exists in the `backend` directory
- Verify your API key is correct and active
- Check that the key has proper permissions

**Import Errors:**
- Make sure all dependencies are installed: `pip install -r requirements.txt`
- Verify you're using Python 3.11 or higher

### Frontend Issues

**Connection Errors:**
- Ensure the backend is running on port 8000
- Check CORS settings in backend configuration
- Verify API URL in frontend environment variables

**Build Errors:**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires 20+)

### Docker Issues

**Container won't start:**
- Ensure Docker and Docker Compose are installed
- Check that ports 8000 and 80 are not in use
- Verify environment variables are set correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from OpenWeatherMap API

## Support

For issues, questions, or contributions, please open an issue on the repository.

