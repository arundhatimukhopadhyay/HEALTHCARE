# Omega - Healthcare Companion Backend

Omega is the JavaScript backend API service powering the Healthcare Companion App. It handles secure data communication, patient information tracking, and medical appointment scheduling by integrating Node.js/Express with a Supabase database cluster.

## 🚀 Project Architecture

Based on the core workspace layout, the project structure organizes concerns by infrastructure setups and logic routes:

```text
omega/
├── config/
│   └── supabaseClient.js    # Supabase initialization & configuration
├── route/
│   ├── appointments.js      # Appointment management routes (CRUD)
│   └── patients.js          # Patient profile & medical record routes
├── supabase/                # Local Supabase configurations or migrations
├── .env                     # Local environment & secret variables
└── app.js                   # Application entry point & Express configuration
```

## 🛠️ Prerequisites

Ensure you have the following installed on your local development machine:
* [Node.js](https://nodejs.org/) (v18.x or higher recommended)
* [npm](https://npmjs.com) (comes bundled with Node.js)
* A [Supabase Account](https://supabase.com) and active project instance

## ⚙️ Getting Started

### 1. Clone & Navigate
Clone your repository locally and move into the workspace directory:
```bash
git clone <your-repository-url>
cd omega
```

### 2. Install Dependencies
Install all required Node modules specified in the ecosystem:
```bash
npm install express @supabase/supabase-js dotenv cors
```

### 3. Environment Configuration
Create a `.env` file in the root directory (matching your `.env` layout) and populate it with your Supabase credentials:
```env
PORT=3000
SUPABASE_URL=https://supabase.co
SUPABASE_ANON_KEY=your-actual-supabase-anonymous-public-key
```
> ⚠️ **Security Warning:** Never commit your actual `.env` file to your Git history or push it to public remote repositories.

### 4. Running the Application

**Development Mode (With Hot Reloading):**
If you have `nodemon` installed globally or configured in your scripts:
```bash
npm run dev
```

**Production Mode:**
Start the server using standard Node execution via your main entry point:
```bash
node app.js
```
The server will boot up and spin online at `http://localhost:3000`.

## 🛣️ API Endpoints Reference

### Patient Management (`/route/patients.js`)
* **`GET /api/patients`** - Retrieves a list of all registered patients.
* **`GET /api/patients/:id`** - Fetches details for a single specific patient profile.
* **`POST /api/patients`** - Registers a new patient record into the healthcare index.
* **`PUT /api/patients/:id`** - Updates historical patient data or contact metrics.

### Appointment Scheduling (`/route/appointments.js`)
* **`GET /api/appointments`** - Retrieves upcoming medical appointments.
* **`POST /api/appointments`** - Books a new visit block with a healthcare professional.
* **`PATCH /api/appointments/:id`** - Reschedules, updates notes, or flags an appointment status.
* **`DELETE /api/appointments/:id`** - Cancels a scheduled appointment slot.

## 🛟 Database Integration

Database interactions are centralized through the initialization routine configured in `config/supabaseClient.js`. This guarantees single-instance client creation across asynchronous API calls, utilizing connectionPooling schemas native to Supabase PostgreSQL.

## 🤝 Contribution Guidelines

1. Ensure your local branch is synchronized before coding.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes safely: `git commit -m 'Add some amazing feature'`.
4. Push your changes back upstream: `git push origin feature/amazing-feature`.
5. Submit a formal Pull Request for review.
