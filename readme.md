
---

# Node-Mongo Backend Boilerplate Template

A boilerplate template for building a Node.js backend server using MongoDB, TypeScript, and various useful packages and middleware.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Dev Dependencies](#dev-dependencies)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/node-mongo-backend-boilerplate.git
   cd node-mongo-backend-boilerplate
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Build the project:**

   ```bash
   npm run build
   ```

## Configuration

1. **Environment Variables:**

   Create a `.env` file in the root directory of your project and copy the contents of `.env.example` into it. Modify the values as necessary.

   ```env
   # Port number
   PORT=3000

   # URL of the Mongo DB
   MONGODB_URL=mongodb+srv://username:password@host/db_name

   # JWT
   # JWT secret key
   JWT_SECRET=yourjwtsecret
   # Number of minutes after which an access token expires
   JWT_ACCESS_EXPIRATION_MINUTES=1440
   # Number of days after which a refresh token expires
   JWT_REFRESH_EXPIRATION_DAYS=30
   # Number of minutes after which a reset password token expires
   JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
   # Number of minutes after which a verify email token expires
   JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
   # Number of minutes after which a verify phone token expires
   JWT_VERIFY_PHONE_EXPIRATION_MINUTES=10

   # AWS
   AWS_S3_KEY_ID=
   AWS_S3_SECRET_ACCESS_KEY=
   AWS_S3_BUCKET_NAME=
   AWS_S3_REGION=
   ```

## Scripts

- **Build the project:**

  ```bash
  npm run build
  ```

- **Start the server:**

  ```bash
  npm start
  ```

- **Start the server in development mode:**

  ```bash
  npm run dev
  ```

- **Lint the code:**

  ```bash
  npm run lint
  ```

- **Fix linting errors:**

  ```bash
  npm run lint:fix
  ```

## Dependencies

- `aws-sdk`: AWS SDK for JavaScript
- `axios`: Promise based HTTP client for the browser and node.js
- `bcrypt`: A library to help you hash passwords
- `compression`: Node.js compression middleware
- `cors`: Node.js CORS middleware
- `cross-env`: Run scripts that set and use environment variables across platforms
- `dotenv`: Loads environment variables from a .env file into process.env
- `express`: Fast, unopinionated, minimalist web framework for node
- `express-rate-limit`: Basic IP rate-limiting middleware for express
- `express-session`: Simple session middleware for Express
- `helmet`: Helmet helps you secure your Express apps by setting various HTTP headers
- `http-status`: Utility to interact with HTTP status code
- `joi`: Object schema validation
- `jsonwebtoken`: JSON Web Token implementation
- `moment`: Parse, validate, manipulate, and display dates and times in JavaScript
- `mongoose`: MongoDB object modeling tool designed to work in an asynchronous environment
- `morgan`: HTTP request logger middleware for node.js
- `multer`: Node.js middleware for handling `multipart/form-data`
- `passport`: Simple, unobtrusive authentication for Node.js
- `passport-jwt`: Passport authentication strategy using JSON Web Tokens
- `sharp`: High-performance image processing library
- `ts-node`: TypeScript execution and REPL for node.js
- `typescript`: TypeScript is a language for application-scale JavaScript
- `winston`: A logger for just about everything
- `winston-mongodb`: A MongoDB transport for winston

## Dev Dependencies

- `@types/bcrypt`: TypeScript definitions for bcrypt
- `@types/compression`: TypeScript definitions for compression
- `@types/cors`: TypeScript definitions for cors
- `@types/express`: TypeScript definitions for express
- `@types/express-session`: TypeScript definitions for express-session
- `@types/morgan`: TypeScript definitions for morgan
- `@types/multer`: TypeScript definitions for multer
- `@types/node`: TypeScript definitions for node
- `@types/passport`: TypeScript definitions for passport
- `@types/passport-jwt`: TypeScript definitions for passport-jwt
- `@typescript-eslint/eslint-plugin`: TypeScript plugin for ESLint
- `@typescript-eslint/parser`: TypeScript parser for ESLint
- `eslint`: A fully pluggable tool for identifying and reporting on patterns in JavaScript
- `eslint-config-prettier`: Turns off all rules that are unnecessary or might conflict with Prettier
- `eslint-plugin-prettier`: Runs Prettier as an ESLint rule
- `eslint-plugin-sort-destructure-keys`: ESLint rule for sorting destructure keys
- `nodemon`: Simple monitor script for use during development of a node.js app
- `tsconfig-paths`: Load node modules according to tsconfig paths

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
