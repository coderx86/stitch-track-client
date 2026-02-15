# StitchTrack - Garment Order & Production Tracker

StitchTrack is a modern, full-stack platform designed to streamline the production workflow in the garment industry. It connects manufacturers (Managers), buyers (Users), and platform administrators (Admins) through a transparent and efficient real-time tracking system.

## 🚀 Key Features

-   **Role-Based Dashboards**: Tailored experiences for Admins, Managers, and Buyers.
-   **Production Tracking**: Real-time status updates (Cutting, Sewing, Finishing, etc.) for garment orders.
-   **Secure Payments**: Integrated Stripe payment gateway for safe and fast transactions.
-   **Product Management**: Comprehensive tools for listing, editing, and managing garment products.
-   **Analytics**: Data-driven insights for Admins leveraging Recharts.
-   **Interactive UI**: Smooth animations using Framer Motion and a responsive, modern design system.
-   **Authentication**: Secure Firebase authentication with Google social login support.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Tailwind CSS, DaisyUI, Framer Motion, React Query, React Router, Recharts.
-   **Backend**: Node.js, Express.js.
-   **Database**: MongoDB.
-   **Authentication**: Firebase.
-   **Payments**: Stripe API.
-   **Image Hosting**: ImgBB.

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
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
