import sys
import requests
import json
import os
from workflow import create_user, view_cart, delete_cart, add_payment_info, get_payment_info, \
    get_order_history, delete_payment_info, create_order_from_cart, update_user, update_payment_info

# Base URLs of the Spring Boot application
BASE_URL_USER = "http://localhost:8080/api/users"
BASE_URL_CART = "http://localhost:8080/api/carts"
BASE_URL_ORDER = "http://localhost:8080/api/orders"
BASE_URL_PAYMENT = "http://localhost:8080/api/payments"
BASE_URL_FOOD = "http://localhost:8080/api/foods"


def save_user_id(user_id):
    with open('user_id.txt', 'w') as file:
        file.write(str(user_id))
    print(f"User ID {user_id} saved to file.")


def load_user_id():
    if os.path.exists('user_id.txt'):
        with open('user_id.txt', 'r') as file:
            user_id = file.read().strip()
        print(f"User ID {user_id} loaded from file.")
        return user_id
    else:
        print("No user ID file found. Starting fresh.")
        return None


def create_cart(user_id):
    if not user_id:
        print("No user ID available. Cannot create cart.")
        return
    url = f"{BASE_URL_CART}/user/{user_id}"
    cart_data = {
      "foodId": 1,
      "quantity": 3
    }
    response = requests.post(url, json=cart_data)
    if response.ok:
        print("Create cart response:\n", json.dumps(response.json(), indent=4))
    else:
        print("Failed to create cart:", response.text)


def main():
    user_id = load_user_id()

    if len(sys.argv) > 1:
        argument = sys.argv[1]

        if argument == "00":
            create_user()
        elif argument == "01":
            create_cart(user_id)
        elif argument == "02":
            view_cart(user_id)
        elif argument == "03":
            delete_cart(user_id)
        elif argument == "04":
            create_cart(user_id)
        elif argument == "05":
            create_order_from_cart(user_id)
        elif argument == "06":
            get_order_history(user_id)
        elif argument == "07":
            update_user(user_id)
        elif argument == "08":
            add_payment_info(user_id)
        elif argument == "09":
            get_payment_info(user_id)
        elif argument == "10":
            update_payment_info(user_id)
        else:
            print("Invalid argument. Please use a number between 00 and 11.")
    else:
        print("Please provide a test argument.")


if __name__ == "__main__":
    main()