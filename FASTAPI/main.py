from fastapi import FastAPI
from routers.LoginAuth import login_router
from routers.DailyJoke import dailyjoke_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://dailyjoke-cmp9785m-usman-5899bc223f40.herokuapp.com", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)
app.include_router(dailyjoke_router)
app.include_router(login_router)
