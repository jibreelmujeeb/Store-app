# POS System API & Frontend Integration Documentation

## Table of Contents

1. [Overview](#overview)
2. [API Architecture](#api-architecture)
3. [Authentication System](#authentication-system)
4. [API Endpoints](#api-endpoints)
5. [Frontend Architecture](#frontend-architecture)
6. [Integration Setup](#integration-setup)
7. [Component Integration Examples](#component-integration-examples)
8. [Error Handling](#error-handling)
9. [Security Considerations](#security-considerations)
10. [Testing & Deployment](#testing--deployment)

---

## Overview

The POS (Point of Sale) System consists of a Python backend API built with the `http.server` module and a React frontend built with Vite. The system provides comprehensive functionality for managing inventory, sales, customers, staff, and business analytics.

### Technology Stack

**Backend:**
- Python 3.8+
- MySQL database
- JWT for authentication
- Built-in HTTP server

**Frontend:**
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons

### System Architecture

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐
│   React Frontend│◄────────────────►│ Python API Server│
│                 │                  │                 │
│ - Components    │                  │ - Routes        │
│ - Pages         │                  │ - Handlers      │
│ - API Service   │                  │ - Database      │
│ - Auth Context  │                  │ - JWT Auth      │
└─────────────────┘                  └─────────────────┘
         │                                   │
         └───────────────────────────────────┼─────────────┐
                                             ▼             │
                                   ┌─────────────────┐     │
                                   │   MySQL Database│◄────┘
                                   │                 │
                                   │ - users         │
                                   │ - products      │
                                   │ - customers     │
                                   │ - orders        │
                                   │ - order_items   │
                                   │ - staff         │
                                   │ - expenses      │
                                   │ - suppliers     │
                                   │ - notifications │
                                   │ - settings      │
                                   └─────────────────┘
```

---

## API Architecture

### Base URL
```
http://localhost:5000
```

