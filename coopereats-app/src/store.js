import { configureStore, createSlice } from '@reduxjs/toolkit'

let user = createSlice({
    name : 'user',
    initialState: 'kim',
    reducers : {
        changeName(state){
            return 'john ' + state
        }
    }
})

let cart = createSlice({
    name : 'cart',
    initialState: [
        {
            foodId: 1,
            name: "Pizza",
            description: "A delicious pizza with tomato sauce, cheese, and pepperoni.",
            price: 10.99,
            // image: "path/to/pizza/image.jpg", // Replace with actual image path or URL
            quantity: 100,
            category: "MAIN_COURSE"
        },
        {
            foodId: 2,
            name: "Cheesecake",
            description: "Creamy cheesecake with a graham cracker crust and strawberries.",
            price: 6.99,
            // image: "path/to/cheesecake/image.jpg", // Replace with actual image path or URL
            quantity: 50,
            category: "DESSERT"
        },
        {
            foodId: 3,
            name: "Caesar Salad",
            description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese.",
            price: 8.99,
            // image: "path/to/salad/image.jpg", // Replace with actual image path or URL
            quantity: 75,
            category: "APPETIZER"
        }
    ],
    reducers : {
        addCount(state, action){
            let number = state.findIndex((a)=>{ return a.foodId === action.payload })
            state[number].quantity++
          }
    }
})

export let { changeName } = user.actions
export let { addCount } = cart.actions
export default configureStore({
  reducer: {
    user : user.reducer,
    cart : cart.reducer
   }
}) 