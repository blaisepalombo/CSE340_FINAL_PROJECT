Project Overview

For my final project, I’m building a Vintage Car Showcase and Restoration Hub. The idea is to create a site where people can browse classic cars, check out detailed pages for each one, and create their own restoration projects connected to those cars. I’ll be building it with Node.js, Express, EJS for server-side rendering, and PostgreSQL, using an MVC structure and deploying it on Render.

Core Features

Anyone visiting the site can browse cars by category and view individual car pages. Once logged in, users can create and manage restoration projects, leave comments, and track their progress through stages like submitted, approved, in progress, and completed. Admins and moderators will have dashboards where they can manage cars, categories, users, and moderate content.

Authentication and Roles

The app will use session-based authentication with express-session and bcrypt for password hashing. There will be three roles: admin (full access), moderator (content and workflow management), and standard user (create and manage their own projects and comments). Certain routes will be protected so users only access what their role allows.

Database Design

The database will include multiple related tables such as users, roles, cars, categories, restoration projects, status history, comments, and images. Everything will be connected with proper foreign keys and normalized so the structure makes sense and supports the project workflow.

Documentation and Planning

I’ll be documenting the ERD, routes, folder structure, and major decisions directly in this repository. That way I can get early feedback during the Unit 4 Code Review and make improvements before the final deployment.
