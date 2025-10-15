# ERP Backend

Backend API for an **Enterprise Resource Planning (ERP)** system.  
Provides user authentication, requisition management, and multi-step approval workflows.

---

## Features

- **User Authentication**: Register and login users with role-based access.
- **Requisition Management**: Create, view, and update requisitions.
- **Approval Workflow**: Multi-step approval process (`dept_head`, `reviewer`, `approver`, `finance`, `admin`).
- **Role-Based Access**: Different permissions for different roles.

---

## Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dksaddy/erp_backend.git
cd erp_backend
npm install
PORT=5000
MONGO_URI=mongodb://localhost:27017/erp
JWT_SECRET=your_jwt_secret
npm run dev


----
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "password123",
  "role": "requester",
  "department": "IT"
}
{
  "message": "Registration successful",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "requester",
    "department": "IT"
  }

