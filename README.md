# 🏨 StayNest – Accommodation Booking Platform

StayNest is a full-stack web application built using Node.js, Express.js, MongoDB, and EJS that allows users to browse, view, and book accommodations such as PGs, rooms, and rental stays. It provides a simple and efficient platform for students and working professionals to find suitable housing.

🔗 Live Demo: https://stayhub-5fzj.onrender.com

---

## 📌 Problem Statement
Finding suitable accommodation is difficult due to unverified listings, unclear pricing, and lack of proper filtering. StayNest solves this by providing a centralized platform with verified listings, image uploads, and map-based location view.

---

## 💡 Features
- User authentication using Passport.js
- Secure login and session handling
- Browse and view property listings
- Add and manage listings
- Image upload using Cloudinary
- Map-based location display using Mapbox
- Booking functionality
- Server-side rendering using EJS
- RESTful routing

---

## 🛠️ Tech Stack
Backend: Node.js, Express.js  
Frontend: EJS, HTML, CSS, Bootstrap  
Database: MongoDB (Mongoose)  

### Integrations
- Cloudinary (Image storage)
- Passport.js (Authentication)
- Mapbox (Maps & location services)

### Tools
Git, GitHub, Postman, Nodemon, Render  

---

## 🏗️ Architecture
Client (Browser) → Server (Node.js + Express + EJS) → Database (MongoDB)

---

## 📂 Project Structure
StayNest/
├── models/ (Database schemas)  
├── routes/ (Application routes)  
├── controllers/ (Logic handling)  
├── views/ (EJS templates)  
├── public/ (Static files – CSS, JS)  
├── app.js / server.js  
└── README.md  

---

## 📡 Routes (Sample)
GET / → Home page  
GET /listings → View all stays  
GET /listings/:id → View stay details  
POST /listings → Create new listing  
POST /login → User login  
POST /register → User signup  

---

## ⚙️ Setup Instructions

### Clone repository
git clone https://github.com/Rahulkumarjha07/StayNest
cd StayNest

### Install dependencies
npm install

### Environment Variables (.env)
MONGO_URI=your_mongodb_connection_string  
SESSION_SECRET=your_secret_key  

CLOUDINARY_CLOUD_NAME=your_cloud_name  
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret  

MAPBOX_TOKEN=your_mapbox_token  

---

## ▶️ Run the Project


 
nodemon app.js  

---

## ⚠️ Challenges
- Implementing authentication using Passport.js  
- Integrating Cloudinary for image uploads  
- Handling Mapbox for location display  
- Managing server-side rendering with EJS  
- Structuring MVC architecture  

---

## 🚀 Future Improvements
- Ratings & Reviews system  
- Payment gateway integration  
- Advanced search filters  
- Admin panel  
- Booking history  

---

## 🎯 Learning Outcomes
- Backend development using Node.js & Express  
- Authentication with Passport.js  
- MongoDB database design  
- Third-party API integration  
- MVC architecture implementation  

---

## 👨‍💻 Author
Rahul Kumar  
GitHub: https://github.com/Rahulkumarjha07  
Portfolio: https://portfolio-680k.onrender.com  

---

## ⭐ Support
If you like this project, give it a ⭐ on GitHub!
