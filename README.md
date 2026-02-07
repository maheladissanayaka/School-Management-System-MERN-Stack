# 🏫 School Management System (MERN Stack)

A robust and scalable web-based School Management System built using the **MERN Stack** (MongoDB, Express.js, React, Node.js). This application streamlines school administration, academic tracking, and communication between teachers, students, and visitors.

## 🚀 Key Features

### 🔐 Role-Based Access Control (RBAC)
* **Admin:** Full control over users (teachers, students), classes, subjects, and system settings.
* **Teacher:** Manage assignments, view student lists, and upload learning materials.
* **Student:** Access learning materials, submit assignments, and track deadlines.
* **Visitor/Parent:** Read-only access to school announcements and public information.

### 📚 Core Functionalities
* **Assignment Portal:**
    * Teachers can create assignments for specific grades and upload PDF/Word documents.
    * Students can download instructions and submit their work via a secure portal.
    * **Live Deadlines:** Real-time countdown timer for submissions.
    * **Smart Status:** Submission portal locks automatically after the deadline.
    * **Edit/Replace:** Students can replace their submission files before the deadline.
* **Subject & Class Management:** Dynamic linking of subjects to specific teachers.
* **Document Management:** Integrated with **Cloudinary** for secure file storage (PDFs, Images, Docs).
* **Announcements:** Digital notice board for school updates.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Lucide React (Icons), React Toastify.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ODM).
* **Authentication:** JWT (JSON Web Tokens) & Bcrypt.
* **File Storage:** Cloudinary API (Auto-detects PDF/Images).

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/maheladissanayaka/School-Management-System-MERN-Stack.git)
    cd school-management-system
    ```

2.  **Install Dependencies**
    * **Backend:**
        ```bash
        npm install
        ```
    * **Frontend:**
        ```bash
        cd client
        npm install
        ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

    Create a `.env` file in the `client` directory and add:
    ```env
    VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
    VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
    ```

4.  **Run the Application**
    * **Backend:** `npm run dev` (starts server on port 5000)
    * **Frontend:** `npm run dev` (starts Vite server)

