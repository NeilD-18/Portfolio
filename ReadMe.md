

# Portfolio

A full-stack developer portfolio built to showcase projects, experiences, and skills — complete with a secure backend portal for dynamic content management. Built using **React**, **TailwindCSS**, **Node.js/Express**, **MongoDB**, and **AWS S3**. Take a look at: https://neildaterao.com. 

## 🚀 Features

### ✨ Frontend
- Built with **React** + **Vite** for fast development and performance.
- Styled using **TailwindCSS** for a clean, responsive UI.
- Dynamic routing and smooth animations.
- Mobile-friendly, with a dark-themed design (black/purple/obsidian palette).
- Section breakdown:
  - **Landing Page**
  - **About Me**
  - **Experiences**
  - **Projects**
  - **Contact**

### 🔒 Backend
- **Node.js** with **Express** provides RESTful API endpoints.
- **MongoDB Atlas** handles dynamic data such as experience entries and the bio.
- Authentication using a secure login system (bcrypt + JWT).
- Admin-only portal allows updates to the portfolio in real-time.
- **AWS S3 integration** for managing images (e.g., company logos for experience section).

### 📸 Admin Portal
- Login required for access.
- Add, edit, or delete:
  - Experiences (with roles, dates, logos)
  - About section bio
  - Projects (if configured)
- Image upload handled via AWS S3, with publicId references stored in MongoDB.

## 🧪 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/NeilD-18/portfolio.git
cd portfolio
```

### 2. Set up environment variables

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=<your MongoDB URI>
JWT_SECRET=<your JWT secret>
AWS_ACCESS_KEY_ID=<your AWS key>
AWS_SECRET_ACCESS_KEY=<your AWS secret>
AWS_REGION=<your AWS region>
S3_BUCKET_NAME=<your bucket name>
```

### 3. Install Dependencies

```bash
cd client 
npm install

cd server 
npm install 
```

### 4. Start the Frontend + Backend

```bash
cd client
npm run dev
```

## 🛠️ Technologies Used

| Tech       | Description                          |
|------------|--------------------------------------|
| React      | Frontend framework                   |
| TailwindCSS| Utility-first styling                |
| Node.js    | Backend runtime                      |
| Express.js | API development                      |
| MongoDB    | NoSQL database for content           |
| AWS S3     | Media storage for uploaded files     |
| Vite       | Frontend build tool                  |
| JWT + bcrypt | Auth system for admin portal       |

## 🧑‍💻 Future Plans

- Add CI/CD pipeline (e.g., GitHub Actions).
- Migrate backend to Docker & deploy using ECS.
- Add a blog section with MDX support.
- Optimize SEO and Lighthouse scores.
- Add analytics (e.g., Plausible or Google Analytics).

## ☁️ Deployment

This portfolio is deployed on an **Amazon EC2 instance** and uses a lightweight, production-grade setup:

- The **domain** was purchased via **Namecheap**, with DNS routing handled through **Amazon Route 53**, which points to the EC2 instance's public IP address.
- The **frontend**, built using Vite, is hosted from a static directory and served over HTTPS using **Caddy**, which also automatically manages SSL certificates via **Let’s Encrypt**.
- The **backend** is a Node.js + Express server connected to MongoDB Atlas and AWS S3. It runs persistently on the EC2 instance as a **systemd service**, ensuring it restarts automatically on reboot or failure.
- Caddy is also used to **reverse proxy API requests** from the frontend to the backend, allowing seamless communication between the two layers under a single domain.

This setup provides a simple yet robust production environment with secure, performant delivery of both the frontend and backend services.

---

rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.env' \
-e "ssh -i ~/.ssh/ne-hypernova.pem" \
. ubuntu@ec2-34-203-243-196.compute-1.amazonaws.com:~/app

ssh -i "ne-hypernova.pem" ubuntu@ec2-34-203-243-196.compute-1.amazonaws.com