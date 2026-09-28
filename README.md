# Chai aur Backend Series

A production-ready video hosting backend API built with Node.js, Express, MongoDB, and Mongoose. This project covers industry-standard backend design patterns, authentication, complex aggregations, file uploads, and modular architecture.

- **Data Models / Schema Diagram**: [Eraser.io Model Link](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

---

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based access and refresh token workflow with cookie storage and Argon2 password hashing.
- **User Management**: Profile registration, avatar/cover photo upload to Cloudinary, password updates, watch history tracking, and channel subscriber stats.
- **Video & Playlist Management**: Create, update, and manage playlists and video references with nested aggregation pipelines.
- **Social Interactions**:
  - **Comments**: Paginated video comments with user profiles and dynamic like tracking.
  - **Tweets**: User status updates/tweets with like counters.
  - **Likes**: Polymorphic toggle like system for videos, comments, and tweets, plus liked videos retrieval.
- **Standardized Utilities**: Consistent `ApiResponse` and `ApiError` formats, global error handling middleware, and async handler wrapper.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (v5)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `argon2`
- **File Storage**: Cloudinary & Multer
- **Aggregation & Pagination**: `mongoose-aggregate-paginate-v2`

---

## 📁 Project Structure

```text
src/
├── app.js                  # Express app setup and middleware configuration
├── constants.js            # App-level constants and env variables
├── index.js                # Server entry point and DB connection runner
├── controllers/            # Request handlers / business logic
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── playlist.controller.js
│   ├── tweet.controller.js
│   └── user.controller.js
├── db/                     # MongoDB connection logic
├── middlewares/            # Custom middlewares (auth, error-handler, multer)
│   ├── auth.middleware.js
│   ├── error-handler.middleware.js
│   └── multer.middleware.js
├── models/                 # Mongoose schemas and data models
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   ├── subscription.model.js
│   ├── tweet.model.js
│   ├── user.model.js
│   └── video.model.js
├── routes/                 # Express API routes
│   ├── comment.routes.js
│   ├── like.routes.js
│   ├── playlist.routes.js
│   ├── tweet.routes.js
│   └── user.routes.js
└── utils/                  # Reusable utilities (ApiError, ApiResponse, asyncHandler, cloudinary)
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory following `.env.sample`:

```env
PORT=8000
MONGODB_URI="<YOUR_MONGODB_URI>"
CORS_ORIGINS="http://localhost:5173"

ACCESS_TOKEN_SECRET="<YOUR_ACCESS_TOKEN_SECRET>"
REFRESH_TOKEN_SECRET="<YOUR_REFRESH_TOKEN_SECRET>"

CLOUDINARY_CLOUD_NAME="<YOUR_CLOUDINARY_CLOUD_NAME>"
CLOUDINARY_API_KEY="<YOUR_CLOUDINARY_API_KEY>"
CLOUDINARY_API_SECRET="<YOUR_CLOUDINARY_API_SECRET>"
```

---

## 🚦 Getting Started

1. **Clone the repository and install dependencies**:
   ```bash
   git clone <repository-url>
   cd chai-backend
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.sample .env
   # Update the values in .env
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

---

## 📌 API Endpoints Overview

### Users (`/api/v1/users`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user with avatar & cover image | No |
| `POST` | `/login` | Log in user and receive JWT cookies | No |
| `POST` | `/logout` | Log out user and clear refresh token | Yes |
| `POST` | `/refresh-token` | Regenerate access token using refresh token | No |
| `POST` | `/change-password` | Change current user password | Yes |
| `GET` | `/current-user` | Fetch current logged-in user profile | Yes |
| `PATCH` | `/update-account` | Update account details (name, email) | Yes |
| `PATCH` | `/avatar` | Update user avatar image | Yes |
| `PATCH` | `/cover-image` | Update user cover image | Yes |
| `GET` | `/c/:username` | Get channel profile and subscriber metrics | Yes |
| `GET` | `/history` | Get user's video watch history | Yes |

### Playlists (`/api/v1/playlist`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Create a new playlist | Yes |
| `GET` | `/:playlistId` | Get playlist details with videos | Yes |
| `PATCH` | `/:playlistId` | Update playlist name and description | Yes |
| `DELETE` | `/:playlistId` | Delete a playlist | Yes |
| `PATCH` | `/add/:videoId/:playlistId` | Add a video to a playlist | Yes |
| `PATCH` | `/remove/:videoId/:playlistId` | Remove a video from a playlist | Yes |
| `GET` | `/user/:userId` | Get all playlists of a user | Yes |

### Comments (`/api/v1/comments`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/:videoId` | Get paginated comments for a video | Yes |
| `POST` | `/:videoId` | Add a comment to a video | Yes |
| `PATCH` | `/c/:commentId` | Update a comment | Yes |
| `DELETE` | `/c/:commentId` | Delete a comment | Yes |

### Tweets (`/api/v1/tweets`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Create a new tweet | Yes |
| `GET` | `/user/:userId` | Get all tweets created by a user | Yes |
| `PATCH` | `/:tweetId` | Update a tweet | Yes |
| `DELETE` | `/:tweetId` | Delete a tweet | Yes |

### Likes (`/api/v1/likes`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/toggle/v/:videoId` | Toggle like on a video | Yes |
| `POST` | `/toggle/c/:commentId` | Toggle like on a comment | Yes |
| `POST` | `/toggle/t/:tweetId` | Toggle like on a tweet | Yes |
| `GET` | `/videos` | Get all videos liked by the user | Yes |