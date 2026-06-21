# Deployment Guide

## Required environment variables

- `PORT` - server port (Render provides `PORT` automatically)
- `DB_URL` - JDBC URL for production database (e.g. `jdbc:mysql://host:3306/dbname`)
- `DB_USERNAME` - database username
- `DB_PASSWORD` - database password
- `MAIL_USERNAME` - SMTP username (Gmail/email account)
- `MAIL_PASSWORD` - SMTP password or app password
- `FRONTEND_URL` - frontend origin for CORS (e.g. `https://my-frontend.com`)
- `UPLOAD_DIR` - optional uploads directory (default `uploads`)

- `AI_PROVIDER` - optional AI provider identifier (e.g. `ollama`)
- `OLLAMA_BASE_URL` - base URL for Ollama when using local/remote Ollama
- `OLLAMA_MODEL` - model name to use with Ollama (dev default `llama3`)
- `GROQ_API_KEY` - optional Groq API key if using Groq
- `GROQ_MODEL` - optional Groq model identifier

## Local setup

1. Copy `.env.example` to `.env` and fill in any local values you want.
2. Ensure MySQL is running locally and create database `portfolio`.
3. Run with the `dev` profile (default):

```bash
mvn clean package
java -jar target/*.jar
```

The application defaults to the `dev` profile which uses `application-dev.yml`.

## Production setup (Render / Railway)

1. Add the environment variables listed above to the platform's dashboard.
2. Ensure `SPRING_PROFILES_ACTIVE=prod` is set (Render: environment variable; Railway: service env vars).
3. Build and deploy the application (Render will run `mvn -DskipTests package` by default if configured).

Notes:
- `server.port` is configured to use `${PORT:8080}` so the platform-provided `PORT` will be respected.
- Database and mail credentials are read from environment variables in `application-prod.yml`.
- CORS origins in production are read from `FRONTEND_URL`.
- Local Ollama-based LLM is only enabled in the `dev` profile; production disables local Ollama by default.
