
import Paneer from "./CardImage/paneer.jpg";
import Gujrati from "./CardImage/gujrati.jpeg";

import beefLasagnaImage from '../../../foodImages/lasagna.jpg';
import chocoChipImage from '../../../foodImages/cchipmuffin2.jpeg';
import cw from '../../../foodImages/chickenw.jpeg';
import il from '../../../foodImages/ilemontea.jpeg';
import sm from '../../../foodImages/smr.jpeg';
import vsf from '../../../foodImages/vsfryt.jpeg'

export const MenuList = [
  {
    foodId: 5,
    name: "Beef Lasagna",
    description: "Layers of pasta, seasoned beef, and cheese",
    detailedDescription: "A hearty Italian dish made with layers of pasta sheets, our special seasoned beef, rich tomato sauce, and a blend of melted cheeses.",
    ingredients: ["Pasta", "Seasoned Beef", "Tomato Sauce", "Cheese"],
    nutritionalInfo: {
      calories: "850 kcal",
      protein: "47g",
      fat: "25g",
      carbs: "96g",
    },
    image: beefLasagnaImage,
    price: 11.49,
  },
  {
    foodId: 7,
    name: "Choco Chip Muffin Deluxe",
    description: "Classic choco chip muffin, soft and delicious",
    detailedDescription: "Our classic choco chip muffin is a treat for the senses with its soft crumb and generous amount of chocolate chips in every bite.",
    ingredients: ["Flour", "Sugar", "Chocolate Chips", "Eggs", "Butter"],
    nutritionalInfo: {
      calories: "420 kcal",
      protein: "5g",
      fat: "20g",
      carbs: "57g",
    },
    image: chocoChipImage,
    price: 2.79,
  },
  {
    foodId: 2,
    name: "Chicken Wings",
    description: "Spicy and savory, served with blue cheese dressing",
    detailedDescription: "Perfectly crispy and juicy chicken wings tossed in our signature spicy sauce served with a side of cooling blue cheese dressing.",
    ingredients: ["Chicken", "Hot Sauce", "Blue Cheese", "Celery"],
    nutritionalInfo: {
      calories: "480 kcal",
      protein: "24g",
      fat: "34g",
      carbs: "12g",
    },
    image: cw,
    price: 5.49,
  },
  {
    foodId: 10,
    name: "Iced Lemon Tea",
    description: "Refreshing lemon tea served chilled with a slice of lemon",
    detailedDescription: "Beat the heat with our refreshing iced lemon tea, freshly brewed and served with a slice of lemon for that extra zing.",
    ingredients: ["Tea", "Lemon", "Sugar", "Ice"],
    nutritionalInfo: {
      calories: "90 kcal",
      protein: "0g",
      fat: "0g",
      carbs: "25g",
    },
    image: il,
    price: 1.99,
  },
  {
    foodId: 3,
    name: "Stuffed Mushrooms",
    description: "Mushrooms filled with herbs and cream cheese",
    detailedDescription: "Succulent mushrooms stuffed with a creamy blend of herbs and cream cheese, baked to perfection.",
    ingredients: ["Mushrooms", "Cream Cheese", "Herbs", "Breadcrumbs"],
    nutritionalInfo: {
      calories: "310 kcal",
      protein: "14g",
      fat: "22g",
      carbs: "18g",
    },
    image: sm,
    price: 4.59,
  },
  {
    foodId: 6,
    name: "Vegetable Stir Fry",
    description: "A mix of fresh vegetables sautéed with soy sauce",
    detailedDescription: "A vibrant dish of sautéed fresh vegetables, seasoned with soy sauce and a hint of garlic, served over steamed rice.",
    ingredients: ["Bell Peppers", "Broccoli", "Carrots", "Soy Sauce", "Garlic"],
    nutritionalInfo: {
      calories: "350 kcal",
      protein: "8g",
      fat: "5g",
      carbs: "68g",
    },
    image: vsf,
    price: 9.99,
  },
];