# Outdoor Gear Rental API

A role-based backend API for an outdoor gear rental platform where customers can rent equipment, providers can manage gear listings and orders, and administrators can oversee platform activities.

## Live Server
https://gearup-backend-szbl.onrender.com

## API Base URL
https://gearup-backend-szbl.onrender.com

## GitHub Repository
https://github.com/mdalamin0/GearUp-Backend

## Project Overview

The Outdoor Gear Rental API allows customers to rent outdoor equipment, providers to manage gear inventory and rental requests, and administrators to monitor the platform. The system includes authentication, rental management, payment processing, and customer reviews.


## Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Customer, Provider, Admin)
- Secure password hashing with bcryptjs
- Protected routes

### Category Management

- Create categories
- Retrieve all categories
- Organize gear items by category

### Gear Management

- Create gear listings
- Update gear information
- Delete gear listings
- Get all gear items
- Get single gear details
- Search, filter, and sort gear listings
- Manage stock availability

### Rental Orders

- Create rental orders
- Automatic rental cost calculation
- Date-based rental duration handling
- View customer rental history
- Get rental order details

### Provider Management

- Manage owned gear listings
- View incoming rental orders
- Update rental order status

### Payment Integration

- SSLCommerz payment gateway integration
- Payment initiation
- Payment verification
- Payment history tracking

### Reviews

- Customers can leave reviews after returning rented gear

### Admin Management

- View all users
- Update user status
- View all gear listings
- View all rental orders

## Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- JWT (JSON Web Token)
- bcryptjs

### Payment Gateway

- SSLCommerz


## Database Models

- User
- Category
- GearItem
- RentalOrder
- Payment
- Review

## API Endpoints

### Auth

| Method | Endpoint |
|---------|----------|
| POST | `/api/auth/register` |
| POST | `/api/auth/login` |
| GET | `/api/auth/me` |

### Categories

| Method | Endpoint |
|---------|----------|
| POST | `/api/categories` |
| GET | `/api/categories` |
| UPDATE | `/api/categories/:id` |
| DELETE | `/api/categories/:id` |

### Gear

| Method | Endpoint |
|---------|----------|
| GET | `/api/gears` |
| GET | `/api/gears/:id` |

### Provider

| Method | Endpoint |
|---------|----------|
| POST | `/api/provider/gear` |
| PUT | `/api/provider/gear/:id` |
| DELETE | `/api/provider/gear/:id` |
| GET | `/api/provider/orders` |
| PATCH | `/api/provider/orders/:id` |

### Rental orders

| Method | Endpoint |
|---------|----------|
| POST | `/api/rentals` |
| GET | `/api/rentals` |
| GET | `/api/rentals/:id` |

### Payments

| Method | Endpoint |
|---------|----------|
| POST | `/api/payment/create` |
| GET | `/api/payment` |
| GET | `/api/payment/:id` |

### Reviews

| Method | Endpoint |
|---------|----------|
| POST | `/api/reviews` |

### Admin

| Method | Endpoint |
|---------|----------|
| GET | `/api/admin/users` |
| PATCH | `/api/admin/users/:id` |
| GET | `/api/admin/gear` |
| GET | `/api/admin/rentals` |


## Author

**Md Alamin**

GitHub: https://github.com/mdalamin0