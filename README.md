# Luna Joy Backend

Backend API service for the Luna Joy Mental Health Progress Tracker. Built with Node.js, Express, and TypeScript.

## Features

- Express.js with TypeScript
- PostgreSQL with TypeORM
- JWT Authentication
- Google OAuth verification
- RESTful API design
- Unit tests with Jest

## Prerequisites

- Node.js (>=20.0.0 <21.0.0)
- npm (>=9.0.0 <10.0.0)
- PostgreSQL (v14 or higher)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   PORT=3001
   DATABASE_URL=postgresql://user:password@localhost:5432/lunajoy
   JWT_SECRET=your_jwt_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

3. Set up the database:
   ```bash
   npm run db:setup
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests
- `npm run db:setup` - Set up database schema
- `npm run lint` - Run ESLint

## Project Structure

```
src/
  ├── config/       # Configuration files
  ├── controllers/  # Route controllers
  ├── entities/     # TypeORM entities
  ├── middleware/   # Express middleware
  ├── routes/       # API routes
  └── index.ts      # Application entry point
```

## API Endpoints

- `POST /api/auth/google` - Google OAuth authentication
- `GET /api/daily-logs` - Get user's daily logs
- `POST /api/daily-logs` - Create a new daily log

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
