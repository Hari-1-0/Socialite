# Socialite
Socialite is a **full-stack social media application** built with *ReactJS* on the frontend and *Django* on the backend, deployed on Render with a PostgreSQL database. The app allows users to register, create profiles, post content, interact with other users' posts, and more.

## Features
- **User Authentication**: Users can register and log in using JWT authentication.
- **User Profiles**: Each user has a profile where they can update their profile picture and bio.
- **Posts and Interactions**: Users can create, update, and delete posts with text and images.

## Installation

### Clone the repository:
```bash
git clone https://github.com/yourusername/Socialite.git
cd Socialite
```

### Set up the backend:
```bash
pip install -r requirements.txt
```

### Set up the database:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Create a .env file for environment variables:
```bash
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost
DATABASE_URL=your_database_url
CLOUDINARY_URL=cloudinary://APIKEY:APISECRET@CLOUDNAME
```

## Set up the frontend:
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```
### Run the app:
In the root directory, run:
```bash
python manage.py runserver
```
In the frontend directory, start the React development server:
```bash
npm run dev
```

#### Access the app:
Open your browser and go to http://localhost:8000











