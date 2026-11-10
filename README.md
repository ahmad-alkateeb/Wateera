# Wateera (وتيرة) — Autonomous All-in-One Workspace

**Wateera (وتيرة)** is an enterprise-grade, all-in-one digital workspace web application engineered to eliminate administrative friction and maximize deep work focus. At the heart of Wateera is **EVA**, an interactive, floating 3D AI robot companion that autonomously orchestrates workflows, manages Smart Hours, safeguards session integrity with context-aware security, and drives fair performance evaluation.

---

## 1. Project Description

Modern software and enterprise teams lose hours of productive flow to fragmented tools, manual status handoffs, and intrusive security checks. **Wateera (وتيرة)** unifies project orchestration, developer workflows, time & break management, and HR dashboards into a single distraction-free environment.

Powered by **EVA**—a real-time 3D interactive AI companion rendered in the browser—Wateera adapts to each user's work rhythm, automates Dev-to-QA transitions, protects sessions invisibly in the background, and rewards consistent deep work through a transparent **Points Matrix**.

### Tech Stack
- **Frontend:** React, TypeScript, Next.js, Tailwind CSS, GSAP (ScrollTrigger), Framer Motion, Spline 3D Runtime
- **Backend:** Java (Spring Boot, Spring Data JPA, Spring Security, Maven)
- **Database:** PostgreSQL

---

## 2. Features

- **EVA — Floating 3D AI Companion:** Interactive 3D robot assistant with real-time cursor tracking, expressive animations, and autonomous workspace orchestration.
- **Context-Aware Security:** Dual-layer authentication (QR & GPS) paired with continuous behavioral and randomized biometric verification that protects session integrity (99.9% SLA) without interrupting flow.
- **Smart Hours & Privacy-First Breaks:** Precision time tracking supporting flexible developer shifts, with an automatic privacy shield that halts location and biometric tracking during breaks.
- **Automated Dev Workflows:** Deep GitHub and GitLab integrations tying active focus hours to real engineering output, featuring automated task handoffs (`Dev → QA`) and bottleneck escalation.
- **The Points Matrix & Gamification:** A fair, programmatic evaluation engine that tracks **Green Streaks**, deep work consistency, and `5x/15x` infraction recovery logic to unlock merits.
- **Unified HR & Kanban Dashboards:** Centralized ecosystem for interactive Kanban boards, leave management, and transparent dispute resolution workflows.
- **Full Bilingual Support (EN / AR):** Seamless switching between English (`LTR`) and Arabic (`RTL`) layouts.

---

## 3. Prerequisites

Ensure the following tools are installed on your machine before setting up the project:

- **Node.js:** `v18.18+` or `v20+` (includes `npm`)
- **Java Development Kit (JDK):** `JDK 17` or `JDK 21`
- **Apache Maven:** `v3.9+` (or use the included `./mvnw` wrapper)
- **PostgreSQL:** `v15+` (running locally on default port `5432` or via Docker)
- **Git:** Latest stable version

Verify your installations:

```bash
node -v
npm -v
java -version
psql --version
```

---

## 4. Step-by-Step Installation & Setup Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/wateera.git
cd Wateera
```

---

### Step 2: Configure the PostgreSQL Database

1. Open the PostgreSQL interactive terminal (`psql`) or **pgAdmin** and create the `wateera_db` database:

```sql
CREATE DATABASE wateera_db;
CREATE USER wateera_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE wateera_db TO wateera_user;
```

2. Configure the database connection in the Java backend configuration file (`backend/src/main/resources/application.properties` or `application.yml`):

```properties
# Server Configuration
server.port=8080

# PostgreSQL Database Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/wateera_db
spring.datasource.username=wateera_user
spring.datasource.password=your_secure_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

---

### Step 3: Build & Run the Java Backend

1. Navigate to the `backend` directory:

```bash
cd backend
```

2. Install dependencies and start the Spring Boot server using the Maven wrapper:

**On Windows (PowerShell / CMD):**
```powershell
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

**On macOS / Linux:**
```bash
./mvnw clean install
./mvnw spring-boot:run
```

> The backend API server will start at **`http://localhost:8080`**.

---

### Step 4: Install & Run the React Frontend

1. Open a new terminal window and navigate to the `frontend` directory:

```bash
cd frontend
```

2. (Optional) Create a `.env.local` file in the `frontend` directory to point to the backend API:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

3. Install the required Node.js dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and visit:

```text
http://localhost:3000
```

---

## 5. Project Structure

```text
Wateera/
├── backend/                  # Java Spring Boot Backend
│   ├── src/main/java/        # Controllers, Services, Repositories, Entities
│   ├── src/main/resources/   # application.properties & database configuration
│   └── pom.xml               # Maven dependencies & build configuration
├── frontend/                 # React / Next.js Frontend
│   ├── public/               # Static assets, 3D scenes & media
│   ├── src/
│   │   ├── app/              # Application routes & global styles
│   │   ├── components/       # UI Sections, 3D EVA Viewer & GSAP animations
│   │   └── context/          # Global state & EN/AR localization context
│   └── package.json          # Frontend scripts & dependencies
└── README.md                 # Project documentation
```

---

## License

© 2026 **Wateera (وتيرة)**. All rights reserved.
