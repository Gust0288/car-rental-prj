

# Car Rental Backend 🛠️

This is the **backend** of the Car Rental Project.  
It is built with **Express.js** and uses **PostgreSQL** as the database.

---

## ⚙️ Tech Stack

- **Express.js** (Node.js web framework)
- **PostgreSQL** (relational database)
- **Sequelize / Knex** (ORM or query builder, depending on implementation)
- **JWT** (for authentication)
- **bcrypt** (for password hashing)

---

## 📌 Features

- RESTful API for frontend communication
- User authentication and authorization
- CRUD operations for cars, users, and reservations
- Admin endpoints for managing cars and rentals
- Secure handling of user data

---

## 📂 Project Structure
```
backend/
│── src/
│   │── routes/        # Express routes
│   │── controllers/   # Business logic
│   │── models/        # Database models (Sequelize/Knex)
│   │── middleware/    # Middleware functions
│   │── app.js         # Express app entry
│── db/                # Database migrations / SQL scripts
│── package.json       # Dependencies & scripts
│── readme.md          # Documentation
```

---

## 🚀 Future Improvements

- Payment gateway integration
- Logging & monitoring
- Role-based access control (RBAC)
- Unit & integration tests