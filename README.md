# LensBot Backend 

A smart WhatsApp AI assistant for photography studios, built with NestJS. It handles customer inquiries, manages bookings, and automates responses using Groq AI.

##  Live Demo

> Bot Number: `+1 415 523 8886` (Twilio Sandbox)
> Send `join angry-decide` to start chatting with the bot

---

##  Features

-  **AI WhatsApp Bot** - Intelligent customer assistant powered by Groq (LLaMA 3.3)
-  **Booking Management** - Full booking lifecycle (pending → confirmed → completed)
-  **Package Management** - Photography packages with pricing and features
-  **Customer Management** - Auto-register customers from WhatsApp
-  **Availability System** - Time slot management with conflict detection
-  **Conversation Memory** - Bot remembers full conversation context
-  **Dashboard Stats** - Revenue, bookings, and analytics endpoints
-  **JWT Authentication** - Secure admin access

---

##  Tech Stack

| Technology | Purpose |
|---|---|
| NestJS + TypeScript | Backend Framework |
| PostgreSQL + TypeORM | Database & ORM |
| Groq AI (LLaMA 3.3) | AI Responses |
| Twilio WhatsApp API | WhatsApp Integration |
| JWT + Passport | Authentication |
| Swagger | API Documentation |

---

##  Project Structure

```
src/
├── auth/           # JWT Authentication
├── users/          # User management
├── packages/       # Photography packages
├── customers/      # Customer management
├── bookings/       # Booking system
├── availability/   # Schedule management
├── conversation/   # Chat history & booking state
├── ai/             # Groq AI integration
└── whats-app/      # Twilio WhatsApp webhook
```

---

##  Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- Twilio Account
- Groq API Key

### Installation

```bash
git clone https://github.com/MujtabaFadiel/lensbot-backend
cd lensbot-backend
npm install
```

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=lensbot

# JWT
JWT_SECRET=your_jwt_secret

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Run

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

##  API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register admin |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Get current user |

### Packages
| Method | Endpoint | Description |
|---|---|---|
| GET | `/packages` | Get all packages |
| GET | `/packages?type=wedding` | Filter by type |
| POST | `/packages` | Create package |
| PATCH | `/packages/:id` | Update package |

### Bookings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/bookings` | Get all bookings |
| GET | `/bookings/upcoming` | Upcoming bookings |
| GET | `/bookings/dashboardStats` | Booking statistics |
| PATCH | `/bookings/:id/status` | Confirm or cancel |

### WhatsApp
| Method | Endpoint | Description |
|---|---|---|
| POST | `/whatsapp/webhook` | Twilio webhook |

---

##  How the AI Bot Works

```
Customer sends WhatsApp message
        ↓
Twilio forwards to /whatsapp/webhook
        ↓
AI Service processes:
  1. Register customer (if new)
  2. Load conversation history
  3. Fetch packages & availability from DB
  4. Build system prompt with real data
  5. Send to Groq LLaMA 3.3
  6. Extract booking data (name, package, date)
  7. Auto-create booking when data complete
        ↓
Reply sent back to customer 
```

---

##  API Documentation

After running, visit:
```
http://localhost:3000/api
```

---

##  Author

**Mujtaba Fadiel**
- GitHub: [@MujtabaFadiel](https://github.com/MujtabaFadiel)
- Email: mujtabafadiel@gmail.com
