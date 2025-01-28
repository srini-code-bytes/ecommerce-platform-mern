
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



