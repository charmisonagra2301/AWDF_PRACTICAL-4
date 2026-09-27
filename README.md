# Practical 4: Building a RESTful API with Node.js and Express

## Objective

Build a Task Management REST API using Node.js and Express. The API supports CRUD operations, logs incoming requests, validates task IDs, checks JSON request content, and returns structured errors. Tasks are stored in memory and are cleared when the server restarts.

## Requirements

- Node.js and npm
- Express.js
- Postman or Thunder Client (for testing)

## Project Setup

Open a terminal in this folder and run:

```bash
npm install
```

If Express has not been installed in this project yet, run:

```bash
npm install express
```

Start the server:

```bash
node server.js
```

The server runs at <http://localhost:5000>.

## API Endpoints

| Method | Endpoint | Description | Success status |
|---|---|---|---:|
| GET | `/tasks` | Get all tasks | 200 |
| GET | `/tasks/:id` | Get one task by ID | 200 |
| POST | `/tasks` | Create a task | 201 |
| PUT | `/tasks/:id` | Update a task | 200 |
| DELETE | `/tasks/:id` | Delete a task | 200 |

All task data is temporary and held in an in-memory array.

## Testing with Thunder Client

Use `http://localhost:5000` as the base URL. For POST and PUT requests, choose **Body → JSON** so Thunder Client sends the `Content-Type: application/json` header.

### Create a task

- Method: `POST`
- URL: `http://localhost:5000/tasks`
- Body (JSON):

```json
{
  "title": "Complete Practical 4"
}
```

Expected status: `201 Created`.

### Get all tasks

- Method: `GET`
- URL: `http://localhost:5000/tasks`

### Get one task

- Method: `GET`
- URL: `http://localhost:5000/tasks/1`

### Update a task

- Method: `PUT`
- URL: `http://localhost:5000/tasks/1`
- Body (JSON):

```json
{
  "completed": true
}
```

### Delete a task

- Method: `DELETE`
- URL: `http://localhost:5000/tasks/1`

## Supplementary Requirements

- Middleware rejects POST and PUT requests without `Content-Type: application/json`.
- `validateTaskId` checks the task ID on routes containing `:id` before the route handler runs.
- A structured 404 response is returned for undefined routes, for example:

```json
{
  "error": "Route not found",
  "path": "/unknown"
}
```

- A global error handler is placed after the routes and returns a safe error message.
- A logging middleware prints the HTTP method, URL, and timestamp for each request.

## Middleware Request Flow

```text
Request
  → JSON body parser
  → Request logger
  → Content-Type check
  → Route and task ID validation
  → 404 handler for unknown routes
  → Global error handler
```

## Key Concepts / Viva Questions

**Why is the global error handler placed last?**  
Express processes middleware in order. Placing the error handler after the routes lets it handle errors passed from those routes.

**What is the difference between `app.use()` and route-specific middleware?**  
`app.use()` commonly applies middleware to many matching requests. Route-specific middleware is attached to a particular route, such as `validateTaskId` on `/tasks/:id`.

**Why should stack traces not be sent to API clients?**  
Stack traces can reveal internal code and file paths. Log details on the server and return a safe message to the client.

**Why must middleware call `next()`?**  
Calling `next()` passes control to the next middleware or route. Middleware that neither calls `next()` nor sends a response can leave the request hanging.

## Result

The Task Management REST API was implemented with CRUD routes, request logging, JSON content validation, task ID validation, a structured 404 handler, and global error handling.
