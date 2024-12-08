# Task Management API

This is a simple task management API built with Node.js, Express.js, MongoDB (Mongoose), Joi for validation, and dotenv for environment variables.

## Setup Instructions

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/<your-username>/task-management-api.git
   ```

2. Navigate to the project directory:

   ```bash
   cd task-management-api
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Set up your environment variables by creating a `.env` file in the root of the project. Here is an example:

   ```
   MONGO_URI=mongodb://localhost:27017/taskdb
   PORT=3000
   ```

5. Run the application:

   ```bash
   npm start
   ```

6. Open Postman or cURL and test the API using the following endpoints:
   - `POST /api/tasks` to create a new task.
   - `GET /api/tasks` to retrieve all tasks.
   - `GET /api/tasks/:id` to retrieve a task by ID.
   - `PUT /api/tasks/:id` to update a task.
   - `DELETE /api/tasks/:id` to delete a task.

## Design Decisions

- **Task Model**: The `Task` schema includes fields such as `title`, `description`, `status`, `priority`, and `dueDate`. The `status` field can be `TODO`, `IN_PROGRESS`, or `COMPLETED`, while the `priority` can be `LOW`, `MEDIUM`, or `HIGH`.
- **Validation**: Joi is used to validate incoming data for task creation and updates. It ensures that required fields like `title` are provided and that other fields adhere to the specified formats.
- **Pagination**: The API supports pagination for fetching tasks. The `page` and `limit` query parameters allow you to retrieve a specific number of tasks per request.
- **Error Handling**: Comprehensive error handling is implemented to catch and respond to common issues, such as missing required fields or database errors.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** (using Mongoose)
- **Joi** (validation)
- **dotenv** (for environment variables)
