# 👟 Nital Shop – E-Commerce Website for Shoes

## 📖 About
**Nital Shop** is a full-stack e-commerce web application built with **Node.js, Express, PostgreSQL, and EJS**.  
It allows customers to browse and purchase shoes online, while shop owners can manage products and stock efficiently.



## ✨ Features
- 👤 **User Authentication** (Sign in / Sign up )  
- 🛒 **Shopping Cart** (per-user session or database)  
- 👟 **Shoes Management** (name, category, price, quantity, images)  
- 📦 **Order System** (customers can place orders)  
- 📱 **Responsive Design** with Bootstrap  
- 🌍 **Public testing** using ngrok  

---

## 🛠 Tech Stack
- **Backend**: Node.js, Express  
- **Frontend**: EJS, Bootstrap  
- **Database**: PostgreSQL  
- **Authentication**: Passport.js   

---

## 📂 Project Structure

nital-shop/
│── index.js # main server file
│── routes/ # Express routes
│── views/ # EJS templates 
│── public/ # static assets 
│── package.json # dependencies


## ⚡ Getting Started

1. Clone the repository

    git clone https://github.com/eyou17/nital-shop.git
    cd nital-shop


2. Install dependencies
   
   npm install
   
4. Setup PostgreSQL

   Create a database (e.g., nital_shop)
   Create required tables: customer, shoes and orders

4. Start the server

   node index.js
   Server runs at: http://localhost:3000

5. Optional: Expose with ngrok

    npx ngrok http 3000


🤝 Contributing

    Pull requests are welcome!
    For major changes, open an issue first to discuss what you’d like to add.

📜 License

    MIT License – free to use, modify, and distribute.

   

