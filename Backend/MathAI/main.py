from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Router.router import router
from fastapi.staticfiles import StaticFiles


app = FastAPI(
    title="Math Visualization API",
    description="API for solving math problems and generating visualization videos.",
    version="1.0.0"
)

app.mount("/media", StaticFiles(directory="media"), name="media")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

app.include_router(router)