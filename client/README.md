
TERMINAL -> 

1. npm create vite@latest
2. Project name : client
3. Select a framework: >> React
4. Select a variant: >> Javascript

Files will be created now.

package.json : 

cd client
npm i

react-redux
axios
react-router-dom

FOLLOW THESE STEPS:
https://ui.shadcn.com/docs/installation/vite

npm i  -D tailwindcss postcss autoprefixer 
npx tailwindcss init -p -> tailwind.config.js & postcss.config.js file will be created

// Search backend

1. Add a controller file(.js file) under e-commerce/server/controllers
2. Add a route file(.js file) under e-commerce/server/routes/shop
3. Add the above route to server.js for the app to use it

// Search frontend

1. Create a slice under /client/src/store/shop
2. Add it to store.js -> reducer 
3. Create a search.jsx file for search page under /pages/shopping-view
4. Add a route for it in App.jsx pointing to function name in search.jsx
5. Now if you hit the URL http://localhost:5173/shop/search it will load the content on the search.jsx

Outlines the steps for both the backend and frontend setup in a structured and technical manner. 
	1.	Backend Instructions:
	•	The steps to create a controller and route file are precise and follow a standard structure.
	•	Adding the route to server.js is an essential detail for making the functionality accessible via the server.

	2.	Frontend Instructions:
	•	Specifying where to create the Redux slice and how to integrate it into the store is clear and aligned with standard React/Redux practices.
	•	Mentioning the creation of the Search.jsx component and mapping it via a route in App.jsx is straightforward and easy to follow.
	•	The URL example (http://localhost:5173/shop/search) connects all the steps and provides a clear way to test the functionality.

// AWS deployment

🚀 MERN App Deployment to AWS (Frontend + Backend Separately via Elastic Beanstalk)

This project uses:

Frontend: React (with Vite)

Backend: Node.js + Express

Deployment: AWS Elastic Beanstalk (EB CLI)

Hosting: Frontend & Backend deployed in separate Beanstalk environments

📦 Prerequisites

✅ Install the following tools before proceeding:

1. AWS CLI
brew install awscli  # on macOS
aws configure         # provide AWS access key, secret, region (e.g. us-west-1)

2. EB CLI
pip3 install awsebcli --upgrade --user
# Add to PATH if needed
echo 'export PATH=$HOME/Library/Python/3.9/bin:$PATH' >> ~/.zshrc && source ~/.zshrc

🎨 Frontend Deployment (React + Vite)
Step 1: Navigate to the frontend
cd client

Step 2: Build the frontend
npm install
npm run build

Step 3: Update package.json
Make sure this exists in package.json:

"scripts": {
  "start": "vite preview --host 0.0.0.0 --port $PORT"
}

Step 4: Initialize EB CLI
eb init
# Choose region and Node.js platform again

Step 5: Create frontend environment
eb create my-mern-frontend-env 

Step 6: Deploy frontend
eb deploy

🔥 EB CLI handles everything based on npm run build + npm start.

🛠 Common Post-Deployment Fixes
CORS: On the backend, set allowed origin to your frontend’s deployed URL:

server.js 

app.use(
  cors({
    origin: "http://my-mern-frontend-env.eba-ppfc5c3i.us-west-1.elasticbeanstalk.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors({
  origin: process.env.FRONTEND_HOST_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

Cookie Issues: If using credentials: true, ensure your client makes requests with withCredentials: true.

Now the app is:

Frontend hosted on EB: http://my-mern-frontend-env.eba-ppfc5c3i.us-west-1.elasticbeanstalk.com

Backend hosted on EB: http://mern-backend-env.eba-m9dkjh3p.us-west-1.elasticbeanstalk.com 

