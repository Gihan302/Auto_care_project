# Auto Care Project Report

## 1. Introduction

### 1.1. Project Overview

The Auto Care Project is a comprehensive web application designed to streamline the process of buying, selling, and managing vehicles. It provides a platform for different user roles, including regular users, agents, and administrators, each with a specific set of functionalities. The application is built using a modern technology stack, with a Next.js frontend and a Spring Boot backend. This report provides a detailed overview of the system's architecture, with a particular focus on the "Agent role implementation" and "User Management Systems".

### 1.2. Objectives

The primary objectives of the Auto Care Project are as follows:

*   To provide a centralized platform for users to browse, buy, and sell vehicles.
*   To implement a robust user management system with distinct roles and permissions.
*   To empower agents with tools to manage advertisements, packages, and client applications efficiently.
*   To offer a secure and scalable architecture that can handle a growing user base and feature set.

### 1.3. Scope

The scope of this project report is to provide a comprehensive overview of the Auto Care web application, with a specific focus on the implementation of the agent role and the user management system. The report will cover the following aspects:

*   **System Architecture:** An overview of the frontend, backend, and database technologies used in the project.
*   **User Management System:** A detailed description of the user roles, authentication and authorization mechanisms, and the user management dashboard.
*   **Agent Role Implementation:** A breakdown of the functionalities available to agents, including advertisement management, package management, and application handling.

## 2. System Architecture

### 2.1. Frontend (Next.js)

The frontend of the Auto Care application is built using Next.js, a popular React framework that enables server-side rendering and static site generation. This choice of technology provides several advantages, including improved performance, SEO-friendliness, and a better user experience.

The frontend architecture is organized into the following key areas:

*   **Routing:** The application uses the Next.js App Router, which is a new routing system that supports shared layouts, nested routing, and loading states. The application's routes are organized into role-based groups (e.g., `(admin)`, `(agent)`, `(user)`), which allows for clear separation of concerns and easier implementation of role-based access control.
*   **UI Components:** The UI is built using a combination of custom components and components from the `lucide-react` and `react-icons` libraries. The application also uses `tailwindcss` for styling, which provides a highly customizable and utility-first CSS framework.
*   **State Management:** The application uses a combination of React's built-in state management (e.g., `useState`, `useContext`) and custom hooks (e.g., `useLocalStorage`) to manage the application's state.
*   **API Communication:** All communication with the backend API is handled through a centralized `axios` instance. This instance is configured with an interceptor that automatically attaches the authentication token to every outgoing request, simplifying the logic in other components.

### 2.2. Backend (Spring Boot)

The backend of the Auto Care application is a robust and scalable RESTful API built using the Spring Boot framework. Spring Boot simplifies the development of stand-alone, production-grade Spring-based applications.

The backend architecture is structured as follows:

*   **Controllers:** The `controllers` package contains the REST controllers that handle incoming HTTP requests. Each controller is responsible for a specific domain (e.g., `AdController`, `UserController`, `AgentController`).
*   **Models:** The `models` package defines the data models (entities) that represent the application's data structure. These models are mapped to the database tables.
*   **Repositories:** The `repository` package contains the Spring Data JPA repositories that provide an abstraction layer for data access. These repositories offer methods for performing CRUD (Create, Read, Update, Delete) operations on the database.
*   **Services:** The `service` package contains the business logic of the application. The services are responsible for orchestrating the data flow between the controllers and the repositories.
*   **Security:** The application uses Spring Security for authentication and authorization. It implements a JWT (JSON Web Token) based authentication system, where each user is issued a token upon successful login. This token is then used to authenticate subsequent requests.

### 2.3. Database

The application uses a MySQL database to store and manage its data. The database is configured in the `application.properties` file, which contains the database URL, username, and password. Spring Data JPA is used to map the application's data models to the database tables, and the repositories provide a high-level API for interacting with the database.

## 3. User Management System

### 3.1. User Roles (Admin, Agent, User)

The Auto Care application has a role-based access control system that defines the permissions and functionalities available to different types of users. The three primary user roles are:

*   **Admin:** The administrator has the highest level of access and is responsible for managing the entire system. This includes managing users, advertisements, packages, and other system-level configurations.
*   **Agent:** The agent is a registered user who can create and manage advertisements for vehicles. Agents have access to a dedicated dashboard where they can manage their listings, view applications, and interact with potential buyers.
*   **User:** The user is a regular user who can browse and search for vehicles, view advertisements, and apply for leasing or insurance plans.

### 3.2. Authentication and Authorization (JWT)

The Auto Care application uses JSON Web Tokens (JWT) for authentication and authorization. This is a standard and secure method for authenticating users and ensuring that they only have access to the resources they are authorized to view.

The authentication process is as follows:

1.  **Login:** When a user logs in with their credentials, the frontend sends a request to the backend's `/api/auth/signin` endpoint.
2.  **Token Generation:** If the credentials are valid, the backend generates a JWT token that contains the user's ID, username, and roles. This token is then sent back to the frontend.
3.  **Token Storage:** The frontend stores the JWT token in the browser's local storage.
4.  **Authenticated Requests:** For every subsequent request to the backend, the frontend attaches the JWT token to the request's `Authorization` header.
5.  **Token Validation:** The backend uses a custom `AuthTokenFilter` to validate the JWT token on every request. If the token is valid, the user's authentication is set in the Spring Security context, and the request is allowed to proceed.
6.  **Role-Based Authorization:** The backend uses method-level security annotations (e.g., `@PreAuthorize`) to restrict access to certain endpoints based on the user's roles.

### 3.3. User Registration

New users can register for an account through the `SignUpForm.jsx` component. This form collects the user's username, email, and password. Upon submission, the form sends a POST request to the `/api/auth/signup` endpoint. The backend then creates a new user with the "User" role and an initial status of "Pending". The user's account will need to be approved by an administrator before they can log in.

### 3.4. Admin User Management Dashboard

The administrator has access to a comprehensive user management dashboard, which is implemented in the `src/app/(admin)/admin/manageUsers/page.jsx` component. This dashboard provides the administrator with the following functionalities:

*   **View Users:** The administrator can view a list of all registered users, along with their roles and status.
*   **Search and Filter:** The administrator can search for specific users and filter the user list based on their roles and status.
*   **Edit Users:** The administrator can edit the details of a user, including their username, email, and roles.
*   **Approve/Reject Users:** The administrator can approve or reject new user registrations.
*   **Delete Users:** The administrator can delete user accounts from the system.

## 4. Agent Role Implementation

### 4.1. Agent Dashboard

The agent dashboard is the central hub for agents to manage their activities on the Auto Care platform. It is implemented in the `src/app/(agent)/agent/dashboard/page.jsx` component and provides the following key features:

*   **Overview:** The dashboard provides a summary of the agent's key metrics, such as the number of active ads, sold ads, and total applications.
*   **Recent Activity:** A feed of recent activities, such as new applications and messages.
*   **Navigation:** A sidebar with links to other agent-specific pages, such as "My Ads", "Create Ad", and "Applications".

### 4.2. Advertisement Management

Agents have the ability to create, manage, and view their advertisements.

*   **Create Advertisement:** Agents can create new advertisements by providing details about the vehicle, such as the make, model, year, price, and images. This is handled by the `src/app/(agent)/agent/create-ad/page.jsx` component.
*   **My Advertisements:** Agents can view a list of all the advertisements they have created in the `src/app/(agent)/agent/my-ads/page.jsx` component.
*   **Edit Advertisement:** Agents can edit their existing advertisements through the `src/app/(agent)/agent/edit-ad/[adId]/page.jsx` component.
*   **Sold Advertisements:** Agents can view a list of their sold advertisements in the `src/app/(agent)/agent/sold-ads/page.jsx` component.
*   **All Advertisements:** Agents can also view all advertisements on the platform from the `src/app/(agent)/agent/all-ads/page.jsx` component.

### 4.3. Package Management

Agents can purchase packages to enhance their advertisement visibility and reach. The package management system includes the following features:

*   **View Packages:** Agents can view the available packages in the `src/app/(agent)/agent/plans/page.jsx` component.
*   **Buy Packages:** Agents can purchase packages through the `src/app/(agent)/agent/buy-packages/page.jsx` component.
*   **Package Usage:** Agents can monitor their package usage and remaining benefits in the `src/app/(agent)/agent/package-usage/page.jsx` component.

### 4.4. Application Handling

Agents can view and manage the applications submitted by users for their vehicle advertisements. This is handled by the `src/app/(agent)/agent/applications/page.jsx` component, which provides the following functionalities:

*   **View Applications:** Agents can view a list of all applications for their advertisements.
*   **Application Details:** Agents can view the details of each application, including the applicant's information and message.
*   **Accept/Reject Applications:** Agents can accept or reject applications.

## 5. Conclusion

### 5.1. Summary

This report has provided a detailed overview of the Auto Care project, with a focus on the user management system and the agent role implementation. The project utilizes a modern and robust technology stack, including Next.js for the frontend and Spring Boot for the backend. The role-based access control system, implemented using JWT, ensures that users have access only to the functionalities and data that are relevant to their roles.

### 5.2. Future Improvements

While the current implementation provides a solid foundation, there are several areas for future improvement:

*   **Real-time Notifications:** Implement real-time notifications to alert users and agents about new messages, application status updates, and other important events.
*   **Bidding System:** Introduce a bidding system to allow users to bid on vehicles, creating a more dynamic and competitive marketplace.
*   **Third-Party Integrations:** Integrate with third-party services, such as payment gateways and vehicle history report providers, to enhance the platform's functionality.
*   **Mobile Application:** Develop a native mobile application for iOS and Android to provide a better user experience for mobile users.

## 6. References

*   [Next.js Documentation](https://nextjs.org/docs)
*   [Spring Boot Documentation](https://spring.io/projects/spring-boot)
*   [React Documentation](https://react.dev/)
*   [JSON Web Tokens](https://jwt.io/)
*   [Axios Documentation](https://axios-http.com/docs/intro)
*   [Tailwind CSS Documentation](https://tailwindcss.com/docs)
*   [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
*   [React Icons](https://react-icons.github.io/react-icons/)
*   [MySQL Documentation](https://dev.mysql.com/doc/)

## 7. Appendix

This section contains additional information, such as code snippets and database schemas, that may be useful for understanding the project in more detail.

