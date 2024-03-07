import requests
import json
import sys

# Base URLs of Spring Boot application
BASE_URL_USER = "http://localhost:8080/api/users"
BASE_URL_CART = "http://localhost:8080/api/carts"
BASE_URL_ORDER = "http://localhost:8080/api/orders"

# Create a new user
def create_user():
    url = BASE_URL_USER
    user_data = {
        "userName": "newuser",
        "password": "password",
        "email": "newuser@example.com",
        "fullName": "New User",
        "phoneNumber": "1234567890"
    }
    response = requests.post(url, json=user_data)
    print("Create user response:", response.text)

def create_cart(user_id):
    url = f"{BASE_URL_CART}/user/{user_id}"
    cart = {
        "totalPrice": 120.50,
        "paymentStatus": "PENDING",
        "products": {
            "1": 3,
            "2": 2,
            "5": 1
        }
    }
    response = requests.post(url, json=cart)
    print("Create cart response:", response.text)

def create_order_from_cart(user_id):
    url = f"{BASE_URL_ORDER}/placeOrder/{user_id}"
    response = requests.post(url)
    print("Change cart to order response: ", response.text)

def get_order_history(user_id):
    url = f"{BASE_URL_ORDER}/user/{user_id}"
    response = requests.get(url)
    print("Get order history response: ", response.text)

def get_cart(user_id):
    url = f"{BASE_URL_CART}/user/{user_id}"
    response = requests.get(url)
    print("Get carts response", response.text)

def get_user(user_id):
    url = f"{BASE_URL_USER}/{user_id}"
    response = requests.get(url)
    print(f"Get user {user_id} response:", response.text)

if __name__ == "__main__":
    create_user()  # Create a new user
    create_cart(1) # create a cart, will break this up more as we get the item table set up
    create_order_from_cart(1) #as if a user decides to click place order
    get_order_history(1)
    create_cart(1)
    create_order_from_cart(1)
    get_order_history(1)
    # get_cart(1)
    # get_user(1)

    sys.exit()
