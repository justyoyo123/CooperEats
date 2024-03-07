import sys
import requests
import json
import os
from workflow import delete_user, delete_cart, view_food, get_all_orders

# Base URLs of the Spring Boot application
BASE_URL_USER = "http://localhost:8080/api/users"
BASE_URL_CART = "http://localhost:8080/api/carts"
BASE_URL_ORDER = "http://localhost:8080/api/orders"
BASE_URL_PAYMENT = "http://localhost:8080/api/payments"
BASE_URL_FOOD = "http://localhost:8080/api/foods"


def save_admin_id(user_id):
    with open('admin_id.txt', 'w') as file:
        file.write(str(user_id))
    print(f"User ID {user_id} saved to file.")


def load_admin_id():
    if os.path.exists('admin_id.txt'):
        with open('admin_id.txt', 'r') as file:
            user_id = file.read().strip()
        print(f"User ID {user_id} loaded from file.")
        return user_id
    else:
        print("No user ID file found. Starting fresh.")
        return None


def create_admin():
    url = BASE_URL_USER
    user_data = {
        "userName": "newusertest",
        "password": "testpassword",
        "email": "frankie@cooper.edu",
        "fullName": "New User",
        "phoneNumber": "0987654321"
    }
    response = requests.post(url, json=user_data)
    if response.ok:
        user_id = response.json().get('userId')
        print("Create user response:\n", json.dumps(response.json(), indent=4))
        save_admin_id(user_id)
    else:
        print("Failed to create user:", response.text)


def create_food_items(admin_id):
    if not admin_id:
        print("No user ID available. Cannot create food.")
        return

    food_items = [
        {"name": "Choco Chip Muffin Classic", "description": "Classic choco chip muffin, soft and delicious.",
         "price": 2.59, "image": "url_to_chocolate_chip_muffin_image", "quantity": 30, "category": "DRINK"},
        {"name": "Double Chocolate Muffin", "description": "Rich double chocolate delight, every bite full of chips.",
         "price": 2.69, "image": "url_to_chocolate_chip_muffin_image", "quantity": 30, "category": "DESSERT"},
        {"name": "Choco Chip Muffin Deluxe", "description": "Deluxe version with extra chocolate chips.", "price": 2.79,
         "image": "url_to_chocolate_chip_muffin_image", "quantity": 30, "category": "DESSERT"},
        {"name": "Mini Chocolate Muffin", "description": "Tiny treats, big chocolate chip flavors.", "price": 2.49,
         "image": "url_to_chocolate_chip_muffin_image", "quantity": 30, "category": "DESSERT"},
        {"name": "Chicken Teriyaki", "description": "Succulent chicken in a rich teriyaki sauce, served with rice.",
         "price": 10.49, "image": "url_to_chicken_teriyaki_image", "quantity": 20, "category": "DESSERT"},
        {"name": "Chocolate Muffin Special", "description": "Special edition muffin, loaded with chocolate chips.",
         "price": 2.89, "image": "url_to_chocolate_chip_muffin_image", "quantity": 30, "category": "DESSERT"},
        {"name": "Choco Chip Muffin Extra", "description": "Extra chocolate, extra deliciousness.", "price": 2.99,
         "image": "url_to_chocolate_chip_muffin_image", "quantity": 30, "category": "DESSERT"},
        {"name": "Chocolate Chip Treat", "description": "A treat for chocolate lovers, filled with gourmet chips.",
         "price": 3.09, "image": "url_to_chocolate_chip_muffin_image", "quantity": 30, "category": "DESSERT"},
        {"name": "Choco Muffin Delight", "description": "Delightful chocolate muffins, with a moist texture.",
         "price": 2.69, "image": "url_to_chocolate_chip_muffin_image", "quantity": 30, "category": "DESSERT"},
        {"name": "Ultimate Chocolate Muffin", "description": "The ultimate muffin for choco chip enthusiasts.",
         "price": 3.19, "image": "url_to_chocolate_chip_muffin_image", "quantity": 30, "category": "DESSERT"},
        {"name": "Chocolate Chip Muffin Supreme", "description": "Supreme quality, with the finest chocolate chips.",
         "price": 3.29, "image": "url_to_chocolate_chip_muffin_image", "quantity": 30, "category": "DESSERT"}
    ]

    for food_data in food_items:
        url = f"{BASE_URL_FOOD}/{admin_id}"
        response = requests.post(url, json=food_data)
        if response.ok:
            print(f"Successfully created food item: {food_data['name']}")
        else:
            print(f"Failed to create food item {food_data['name']}")


def main():
    admin_id = load_admin_id()
    if len(sys.argv) > 1:
        argument = sys.argv[1]

        if argument == "00":
            create_admin()
        elif argument == "01":
            create_food_items(admin_id)
        elif argument == "02":
            delete_user(admin_id)
        elif argument == "04":
            get_all_orders(admin_id)
        else:
            print("Invalid argument. Please use a number between 00 and 11.")
    else:
        print("Please provide a test argument.")


if __name__ == "__main__":
    main()
