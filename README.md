# Employee Assessment Web Application

A web application built with Next.js to facilitate employee assessments, including features for managing questions, submitting answers, viewing results, and secure authentication.

## 🚀 Live Demo
You can try the deployed app here: [https://app-assessment-employe.vercel.app/](https://app-assessment-employe.vercel.app/)

## 📦 Features
- Employee login and authentication
- Admin dashboard for managing assessments
- Take and submit assessments
- View assessment results
- Responsive UI with Tailwind CSS

## 🛠️ Getting Started (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/your-repo/app-assessment-employe.git
```

### 2. Navigate to the project directory
```bash
cd app-assessment-employe
```

### 3. Install dependencies
```bash
npm install
```

### 4. Set up environment variables
- Copy `.env.local.example` to `.env.local` (if available) and fill in the required values (e.g., MongoDB connection string).

### 5. Initialize the database (optional)
- If you need to seed the database, run:
```bash
npm run init-db
```

### 6. Run the development server
```bash
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

## 👤 Default Accounts

#### Admin
- **NIK:** 3275110708020015
- **Password:** admin123

#### User
- **NIK:** 3201051601234569
- **Password:** Dimas123

## 📚 Folder Structure
```
src/pages/        # Next.js pages (routes)
src/components/   # Reusable React components
src/context/      # React context for authentication
src/data/         # Static data (e.g., questions)
src/models/       # Database models (MongoDB)
src/lib/          # Utility libraries (e.g., MongoDB connection)
public/           # Static assets (images, icons)
```

## 📝 Technologies Used
- Next.js
- React
- MongoDB
- Tailwind CSS

## 📄 License
This project is licensed under the MIT License.

## 🙏 Contributions
Feel free to open issues or submit pull requests to improve this project!
