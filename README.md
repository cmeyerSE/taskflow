# ✅ TaskFlow

A full-stack task management application with a **Ruby** backend and **TypeScript/React** frontend, fully containerized with **Docker Compose** for seamless local development and deployment.

## ✨ Features

- Create, manage, and track tasks
- Type-safe frontend built with TypeScript and React
- RESTful Ruby backend API
- Fully containerized — spin up the entire stack with a single command
- Docker Compose orchestration for backend, frontend, and database

## 🛠️ Tech Stack

| Layer      | Technology         |
|------------|--------------------|
| Backend    | Ruby (52%)         |
| Frontend   | TypeScript (43%)   |
| Container  | Docker & Docker Compose |
| Styling    | CSS / HTML         |

## 📦 Getting Started

> Requires [Docker](https://www.docker.com/) and Docker Compose installed.

```bash
git clone https://github.com/cmeyerSE/taskflow.git
cd taskflow
docker-compose up --build
```

The app will be available at `http://localhost:3000` (or as configured in `docker-compose.yml`).

## 📁 Project Structure

```
taskflow/
├── backend/    # Ruby API
├── frontend/   # TypeScript/React app
└── docker-compose.yml
```

## 👤 Author

**Cory Meyer** — [GitHub](https://github.com/cmeyerSE) | [Portfolio](https://cmeyerSE.github.io)
