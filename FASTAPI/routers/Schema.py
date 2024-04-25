from pydantic import BaseModel
from typing import Optional

class RegisterUser(BaseModel):
    username: str
    email: str
    password: str
    subscription_type : str

    class Config():
        from_attributes = True



class loginUser(BaseModel):
    username: str
    password: str

class Joke(BaseModel):
    text: str
    category: str

    class Config():
        from_attributes = True
class Category(BaseModel):
    category_name : str

    class Config():
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id : int
    username : str
    email : str



class TokenData(BaseModel):
    email: Optional[str] = None

class CohereLLMData(BaseModel):
    text: str
    category_tone: str

class Subscription(BaseModel):

    user_id : int
    subscription_type : str

class UpdatePassword(BaseModel):
    email :  str
    current_password : str
    update_password : str