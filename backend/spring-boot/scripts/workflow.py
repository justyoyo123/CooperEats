import sys
import requests
import json
import os

# Base URLs of the Spring Boot application
BASE_URL_USER = "http://localhost:8080/api/users"
BASE_URL_CART = "http://localhost:8080/api/carts"
BASE_URL_ORDER = "http://localhost:8080/api/orders"
BASE_URL_PAYMENT = "http://localhost:8080/api/payments"

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


def create_user():
    url = BASE_URL_USER
    user_data = {
        "userName": "newusertest",
        "password": "testpassword",
        "email": "test@example.com",
        "fullName": "New User",
        "phoneNumber": "1234567890"
    }
    response = requests.post(url, json=user_data)
    if response.ok:
        user_id = response.json().get('userId')
        print("Create user response:\n", json.dumps(response.json(), indent=4))
        save_user_id(user_id)
    else:
        print("Failed to create user:", response.text)


def get_user(user_id):
    if not user_id:
        print("No user ID available. Cannot fetch user.")
        return
    url = f"{BASE_URL_USER}/{user_id}"
    response = requests.get(url)
    if response.ok:
        print(f"Get user {user_id} response:\n", json.dumps(response.json(), indent=4))
    else:
        print(f"Failed to get user {user_id}:", response.text)


def create_cart(user_id):
    if not user_id:
        print("No user ID available. Cannot create cart.")
        return
    url = f"{BASE_URL_CART}/user/{user_id}"
    cart_data = {
        "totalPrice": 120.50,
        "paymentStatus": "PENDING",
        "products": {
            "1": 3,
            "2": 2,
            "5": 1
        }
    }
    response = requests.post(url, json=cart_data)
    if response.ok:
        print("Create cart response:\n", json.dumps(response.json(), indent=4))
    else:
        print("Failed to create cart:", response.text)


# View the cart for a user
def view_cart(user_id):
    url = f"{BASE_URL_CART}/user/{user_id}"
    response = requests.get(url)
    if response.ok:
        print("View cart response:\n", json.dumps(response.json(), indent=4))
    else:
        print("Failed to view cart:", response.text)

# Delete a cart for a user
def delete_cart(user_id):
    temp_url = f"{BASE_URL_CART}/user/{user_id}"
    response = requests.get(temp_url)
    cart_id = response.json().get('cartId')
    url = f"{BASE_URL_CART}/{cart_id}"
    response = requests.delete(url)
    if response.ok:
        print(f"Cart with ID {user_id} deleted, simulating cart abandonment.")
    else:
        print(f"Failed to delete cart with ID {user_id}.", response.text)


def create_order_from_cart(user_id):
    if not user_id:
        print("No user ID available. Cannot create order.")
        return
    url = f"{BASE_URL_ORDER}/placeOrder/{user_id}"
    response = requests.post(url)
    if response.ok:
        print("Change cart to order response:\n", json.dumps(response.json(), indent=4))
    else:
        print("Failed to change cart to order:", response.text)

def get_order_history(user_id):
    if not user_id:
        print("No user ID available. Cannot get order history.")
        return
    url = f"{BASE_URL_ORDER}/user/{user_id}"
    response = requests.get(url)
    if response.ok:
        print("Get order history response:\n", json.dumps(response.json(), indent=4))
    else:
        print("Failed to get order history:", response.text)

def update_user(user_id):
    if not user_id:
        print("No user ID available. Cannot update user.")
        return
    updated_user_data = {
        "userName": "updateduser",
        "password": "newpassword",
        "email": "updateduser@example.com",
        "fullName": "Updated User",
        "phoneNumber": "0987654321"
    }
    response = requests.put(f"{BASE_URL_USER}/{user_id}", json=updated_user_data)
    if response.ok:
        print(f"Update user {user_id} response:\n", json.dumps(response.json(), indent=4))
    else:
        print(f"Failed to update user {user_id}:", response.text)
    return response.ok

def delete_user(user_id):
    if not user_id:
        print("No user ID available. Cannot delete user.")
        return
    response = requests.delete(f"{BASE_URL_USER}/{user_id}")
    if response.ok:
        print(f"Delete user {user_id} response: User successfully deleted.")
    else:
        print(f"Failed to delete user {user_id}:", response.text)
    return response.ok


def add_payment_info(user_id):
    if not user_id:
        print("No user ID available. Cannot add payment info.")
        return
    payment_info = {
        "user_id": user_id,
        "billingAddress": "123 Fake St, Faketown, FK 12345",
        "phoneNumber": "1",
        "paymentMethodId": "someid",
    }
    temp_url = f"{BASE_URL_CART}/user/{user_id}"
    response = requests.get(temp_url)
    payment_info_id = response.json().get('cartId')
    url = f"{BASE_URL_PAYMENT}/user/{payment_info_id}"
    response = requests.post(url, json=payment_info)
    print("Add payment info response:", json.dumps(response.json(), indent=4))

# id used in GET is payment_info_id not user_id
def get_payment_info(user_id):
    if not user_id:
        print("No user ID available. Cannot get payment info.")
        return
    url = f"{BASE_URL_PAYMENT}/{user_id}"
    response = requests.get(url)
    if response.ok:
        print("Get payment info response:\n", json.dumps(response.json(), indent=4))
    else:
        print("Failed to get payment info:", response.text)

# Delete by payement_id not user id
def delete_payment_info(user_id):
    if not user_id:
        print("No user ID available. Cannot delete payment info.")
        return
    url = f"{BASE_URL_PAYMENT}/{user_id}"
    response = requests.delete(url)
    if response.ok:
        print(f"Payment info for user {user_id} deleted")
    else:
        print("Failed to delete payment info:", response.text)

def main():
    user_id = load_user_id()

    if len(sys.argv) > 1:
        argument = sys.argv[1]

        if argument == "00":
            create_user()
        elif argument == "01":
            get_user(user_id)
        elif argument == "02":
            create_cart(user_id)
        elif argument == "03":
            view_cart(user_id)
        elif argument == "04":
            delete_cart(user_id)
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
            delete_payment_info(user_id)
        elif argument == "11":
            delete_user(user_id)
        else:
            print("Invalid argument. Please use a number between 00 and 11.")
    else:
        print("Please provide a test argument.")

if __name__ == "__main__":
    main()