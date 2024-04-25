from fastapi import APIRouter, status, Depends, HTTPException
from . import Schema, Models, Utils, JWTTokenAuth
from .database import get_db
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

login_router = APIRouter(
    prefix="/dailyjoke",
    tags=["Login"]
)

@login_router.post("/login", response_model=Schema.Token)
def user_login(request_login: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):

    user_detail = db.query(Models.RegisterUser).filter(Models.RegisterUser.email == request_login.username).first()

    if not user_detail:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User doesn't exist")
    if not Utils.verify_password(request_login.password, user_detail.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Password is incorrect")

    access_token = JWTTokenAuth.create_access_token(data={"sub": user_detail.email})
    return Schema.Token(access_token=access_token, token_type="bearer", user_id = user_detail.id, username = user_detail.username, email = user_detail.email)
