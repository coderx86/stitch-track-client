# <img src="public/Logo.png" alt="StitchTrack Icon" width="30px" height="30px"/>StitchTrack - Garment Order & Production Tracker

StitchTrack is a modern, full-stack platform designed to streamline the production workflow in the garment industry. It connects manufacturers (Managers), buyers (Users), and platform administrators (Admins) through a transparent and efficient real-time tracking system.

## 🔗 Live & Source Links

| Resource | Link |
|---|---|
| 🌐 Live Website | [stichtrack-sdx86.netlify.app](https://stichtrack-sdx86.netlify.app/) |
| 💻 Frontend Repo | [stitch-track-client](https://github.com/coderx86/stitch-track-client.git) |
| ⚙️ Backend Repo | [stitch-track-server](https://github.com/coderx86/stitch-track-server.git) |

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **User / Buyer** | buyer@buyer.com | Buyer123 |
| **Admin** | admin@admin.com | Admin123 |


## 🚀 Key Features

-   **Role-Based Dashboards**: Tailored experiences for Admins, Managers, and Buyers.
-   **Production Tracking**: Real-time status updates (Cutting, Sewing, Finishing, etc.) for garment orders.
-   **Secure Payments**: Integrated Stripe payment gateway for safe and fast transactions.
-   **Product Management**: Comprehensive tools for listing, editing, and managing garment products.
-   **Search, Filter & Pagination**: Buyers can search and filter products, with paginated results for smooth browsing.
-   **Analytics**: Data-driven insights for Admins leveraging Recharts.
-   **Interactive UI**: Smooth animations using Framer Motion and Lottie with a responsive, modern design system.
-   **Authentication**: Secure Firebase authentication with Google social login and JWT-protected API routes.

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite, Tailwind CSS v4, DaisyUI, Framer Motion, React Lottie, React Query, React Router, Recharts, Swiper, React Hook Form, SweetAlert2.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB.
-   **Authentication**: Firebase (with Google social login) + JWT.
-   **Payments**: Stripe API.
-   **Image Hosting**: ImgBB.

## 📦 Installation

### Frontend

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/coderx86/stitch-track-client.git
    cd stitch-track-client
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the root directory and add:
    ```env
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_FIREBASE_STORAGE_BUCKET=...
    VITE_FIREBASE_MESSAGING_SENDER_ID=...
    VITE_FIREBASE_APP_ID=...
    VITE_IMGBB_API_KEY=...
    VITE_STRIPE_PUBLISHABLE_KEY=...
    VITE_API_URL=http://localhost:3000
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```

---

### Backend

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/coderx86/stitch-track-server.git
    cd stitch-track-server
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file in the root directory and add:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    STRIPE_SECRET_KEY=your_stripe_secret_key
    SITE_DOMAIN=http://localhost:5173
    PORT=3000
    FIREBASE_SERVICE_ACCOUNT_KEY=Firebase Service Account Key (Base64 encoded)
    ```
4.  **Start the server**:
    ```bash
    nodemon index.js
    ```
