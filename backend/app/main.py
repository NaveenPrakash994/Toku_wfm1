from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.forecasting import router as forecast_router
from app.api.scheduling import router as schedule_router

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(forecast_router, prefix="/forecast", tags=["forecast"])
app.include_router(schedule_router, prefix="/schedule", tags=["schedule"])

@app.get("/")
async def root():
    return {"message": "Workforce Management API"}