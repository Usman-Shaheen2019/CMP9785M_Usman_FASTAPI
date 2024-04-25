from fastapi import APIRouter, Depends, status, HTTPException, status, Response
from . import Models, Utils, JWTTokenAuth, Schema
from .database import engine, get_db
from sqlalchemy.orm import Session
import httpx
from datetime import datetime
import math
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

Models.Base.metadata.create_all(bind=engine)

dailyjoke_router = APIRouter(
    prefix="/dailyjoke",
    tags=["DailyJoke"]
)
# Custom dependency to decrease credit count
def decrease_credit(db: Session = Depends(get_db), get_current_user : Schema.loginUser = Depends(
    JWTTokenAuth.get_current_user)):
    #ORM : Object Realtion Model
    user = db.query(Models.RegisterUser).filter(Models.RegisterUser.email == get_current_user.email).first()
    # Retrieve user's subscription details
    subscription = db.query(Models.Subscription).filter(Models.Subscription.user_id == user.id).first()
    if subscription.subscription_type == 'Freemium' or subscription.subscription_type == 'Standard':
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")

        # Check if user has sufficient credits
        if int(subscription.credits_count) <= 0:
            raise HTTPException(status_code=403, detail="Insufficient credits")

        # Decrease the credit count by 1
        credits_count = int(subscription.credits_count)
        credits_count -= 1
        subscription.credits_count = str(credits_count)

        # Update the database
        db.add(subscription)
        db.commit()

    return user

@dailyjoke_router.get("/{selectedCategory}/joke", status_code=status.HTTP_200_OK)
def dailyjoke_index(selectedCategory: str, db: Session = Depends(get_db)):
    return db.query(Models.Joke).filter(Models.Joke.category == selectedCategory).all()

@dailyjoke_router.get("/getCategory", status_code=status.HTTP_200_OK)
def dailyjoke_getCategory(db: Session = Depends(get_db)):
    return db.query(Models.Category).all()

@dailyjoke_router.post("/addCategory", status_code=status.HTTP_201_CREATED)
def dailyjoke_addCategory(category: Schema.Category, db: Session = Depends(get_db), user: Models.RegisterUser = Depends(decrease_credit)):

    joke_category = Models.Category(category_name=category.category_name, user_id = user.id)
    db.add(joke_category)
    db.commit()
    db.refresh(joke_category)
    return joke_category
@dailyjoke_router.post("/create", status_code=status.HTTP_201_CREATED)
def create_dailyjoke(joke: Schema.Joke, db: Session = Depends(get_db), user: Models.RegisterUser = Depends(decrease_credit)):

    db_user = Models.Joke(text=joke.text, category=joke.category, user_id=user.id, author_name = user.username, created_at = datetime.now())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@dailyjoke_router.post("/register", status_code=status.HTTP_201_CREATED)
def user_registration(registerUser: Schema.RegisterUser, db: Session = Depends(get_db)):

    user = db.query(Models.RegisterUser).filter(Models.RegisterUser.email == registerUser.email).first()

    if not user:
        if registerUser.subscription_type == "Freemium":
            credit_count = '5'
        else:
            credit_count = 'Unlimited'

        db_register_user = Models.RegisterUser(username=registerUser.username, email=registerUser.email,
                                               password=Utils.get_password_hash(registerUser.password))
        db.add(db_register_user)
        db.commit()


        # Create a subscription record for the user
        db_subscription = Models.Subscription(user_id=db_register_user.id, subscription_type=registerUser.subscription_type, credits_count=credit_count)
        db.add(db_subscription)

        db.commit()

        db.refresh(db_register_user)

    else:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"User Already Exist!!!")

    return db_register_user

@dailyjoke_router.get("/getSubscription", status_code=status.HTTP_200_OK)
def get_subscription_by_user(user_id: int, db: Session = Depends(get_db)):
    subscriptions = db.query(Models.Subscription).filter(Models.Subscription.user_id == user_id).first()
    if not subscriptions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriptions not found")
    return subscriptions

@dailyjoke_router.put("/updateSubscription", status_code=status.HTTP_200_OK)
def update_subscription(update_subscription: Schema.Subscription, db: Session = Depends(get_db)):

    subscription = db.query(Models.Subscription).filter(Models.Subscription.user_id == update_subscription.user_id).first()

    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriptions not found")

    if update_subscription.subscription_type == "Freemium":
        credit_count = '5'
    elif update_subscription.subscription_type == "Standard":
        credit_count = '10000'
    else:
        credit_count = 'Unlimited'
    subscription.subscription_type = update_subscription.subscription_type

    # Convert credits_count string to integer, decrement by 1, and then convert back to string
    subscription.credits_count = credit_count

    db.commit()
    db.refresh(subscription)

    return subscription

@dailyjoke_router.put("/updatePassword", status_code=status.HTTP_200_OK)
def update_password(update_passwords: Schema.UpdatePassword, db: Session = Depends(get_db)):

    user = db.query(Models.RegisterUser).filter(Models.RegisterUser.email == update_passwords.email).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscriptions not found")

    if not Utils.verify_password(update_passwords.current_password, user.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Password is incorrect")

    user.password = Utils.get_password_hash(update_passwords.update_password)

    db.commit()
    db.refresh(user)

    return user

@dailyjoke_router.get("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):
    response.delete_cookie(key="session_token")
    return {"message": "Logged out successfully"}


@dailyjoke_router.post("/cohere_llm_joke/", status_code=status.HTTP_200_OK)
async def generate_llm_joke(joke: Schema.CohereLLMData, user: Models.RegisterUser = Depends(decrease_credit)):

    CO_API_KEY = os.getenv("COHERE_API_KEY")  # Replace with your Cohere API key
    API_URL = "https://api.cohere.ai/v1/chat"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {CO_API_KEY}"
    }

    prompt = f"Write a joke about the given query: {joke.text} in the category tone of {joke.category_tone} within 5 to 25 words"

    payload = {
        "message": prompt,
        "temperature": 0.8
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(API_URL, json=payload, headers=headers)

            if response.status_code == 200:
                data = response.json()
                return {"Cohere Generate Joke": data}
            else:
                error_message = response.text or response.content.decode()
                raise HTTPException(status_code=response.status_code, detail=error_message)

    except httpx.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        raise HTTPException(status_code=500, detail=f"HTTP error occurred: {http_err}")

    except Exception as err:
        print(f"An error occurred: {err}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {err}")