
 "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.5.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.7.2",
    "multer": "^1.4.5-lts.1",
    "nodemon": "^3.1.7"
  }
  
Contains packages for backend development:
	•	bcryptjs: For hashing passwords.
	•	cloudinary: For managing cloud-based image storage.
	•	cookie-parser: For parsing cookies.
	•	cors: For handling cross-origin requests.
	•	dotenv: For managing environment variables.
	•	express: A web framework for Node.js.
	•	jsonwebtoken: For creating and verifying JSON Web Tokens.
	•	mongoose: For MongoDB object modeling.
	•	multer: For handling file uploads.
	•	nodemon: For development workflow improvements.

  TERMINAL SETUP : 

  npm init

  -> package name: server (imp)
  -> 1.0.0(as it is)
  -> description
  -> entry point(index.js) 
  -> test command
  -> git repo
  -> author -> my name (imp)

  package.json will be created on the backend(server) now

  TERMINAL -> server -> INSTALL the above PACKAGES.

  1. CREATE ACCOUNT ON MONGODB
  2. NAME YOUR PROJECT -> CREATE PROJECT
  3. CREATE CLUSTER -> FREE VERSION -> GIVE NAME, PROVIDER, REGION
  4. CREATE DEPLOYMENT
  5. CONNECT TO CLUSTER -> ADD A CONNECTION IP ADDRESS & CREATE A DB USER
  6. CHOOSE CONNECTION -> MONGODB FOR VSCODE
  7. NETWORK ACCESS -> CHECK IF IP ADDRESS IS WHITELISTED; just for now ALLOW ACCESS FROM ANYWHERE

  CLICK ON CONNECT -> MONGODB FOR VSCODE

  TAKE THE URL ending with .net/ 

  Go to server.js - Set up mongodb connection & run the server 

  Go to package.json and include the following script:

"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "server.js", -----> ENTRY POINT
    "dev": "nodemon server.js" ----> RUN THE SERVER AUTOMATICALLY(to get updated data); say which file to run
  },

🌐 Backend Deployment (Node.js + Express)

Step 1: Navigate to the backend
cd server

Step 2: Initialize Elastic Beanstalk
eb init
# Select region (e.g. us-west-1)
# Choose platform: Node.js
# Set up SSH if needed (optional)

Step 3: Create the environment
eb create mern-backend-env

Step 4: Deploy
eb deploy

Step 5: After deployment
Verify the live backend URL on POSTMAN.

Update your frontend .env to use this backend URL.
