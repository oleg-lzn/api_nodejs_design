# Habit Tracking API

A RESTful API for tracking habits built with Node.js, Express, and TypeScript.

## Overview

This project is a backend API that allows users to create, manage, and track their habits. Users can create habits with descriptions, set frequency and target counts, organize them with tags, and log completion entries.

## Features

- User authentication and authorization
- Habit management (create, read, update, delete)
- Habit entry tracking
- Tag system for organizing habits
- Rate limiting for API protection
- Error handling and validation
- Security middleware
- Request logging

## Tech Stack

- Node.js
- Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- Redis (for rate limiting)
- JWT (for authentication)

## Available Scripts

- `npm run dev` - Start development server with watch mode
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:seed` - Seed the database

## API Endpoints

The API is organized into the following routes:

- `/api/auth` - Authentication endpoints
- `/api/users` - User management
- `/api/habits` - Habit CRUD operations
- `/api/tags` - Tag management
- `/health` - Health check endpoint
