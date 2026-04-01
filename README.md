# Vintage Car Showcase and Restoration Hub

## Overview

This project is a full-stack web application that allows users to browse vintage cars, create restoration projects, and interact through comments. The system supports multiple user roles with different permissions and includes administrative tools for managing content.

The application is built using Node.js, Express, EJS, and PostgreSQL following an MVC architecture and is deployed on Render.

---

## Features

### Public Features

* Browse vintage cars by category
* View detailed car pages with images and descriptions
* View user comments on each car

### User Features (Logged In)

* Create restoration projects linked to cars
* Track project status through stages:

  * submitted → approved → in progress → completed
* Edit and delete their own projects
* Add, edit, and delete their own comments

### Moderator Features

* Manage all comments (delete inappropriate content)
* Manage project workflow and update project statuses

### Admin Features

* Full access to all features
* Add, edit, and delete cars
* Add, edit, and delete categories
* Access all moderation tools

---

## User Roles

| Role      | Permissions                               |
| --------- | ----------------------------------------- |
| User      | Manage own projects and comments          |
| Moderator | Manage projects and all comments          |
| Admin     | Full access including cars and categories |

---

## Test Accounts

Use the following accounts to test the application:

* [admin@test.com](mailto:admin@test.com)
* [mod@test.com](mailto:mod@test.com)
* [user@test.com](mailto:user@test.com)

---

## Tech Stack

* Node.js
* Express.js
* EJS (server-side rendering)
* PostgreSQL
* express-session (authentication)
* bcrypt (password hashing)

---

## Database Design

The database includes the following tables:

* users
* roles
* categories
* cars
* car_images
* restoration_projects
* project_status_history
* comments
* session

---

## ERD (Entity Relationship Diagram)

![ERD](./ERD.png)

---

## Installation / Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
DB_URL=your_database_url
SESSION_SECRET=your_secret
DB_SSL=true
```

4. Run the server:

```bash
npm start
```

5. Open in browser:

```
http://localhost:3000
```

---

## Deployment

The application is deployed on Render using a PostgreSQL database with SSL enabled.

---

## Known Limitations

* Image uploads use URLs instead of file uploads
* Limited validation on some forms
* No pagination for large datasets
* Category deletion may leave cars uncategorized

---

## Future Improvements

* Image upload system
* Search and filtering
* Improved UI/UX
* Notifications for project updates
* Pagination for large datasets

---

## Author

Blaise Palombo
BYU–Idaho Web Design & Development
