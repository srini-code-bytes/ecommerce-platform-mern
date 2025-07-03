# MERN E-Commerce Platform

A full-stack e-commerce platform built with the MERN stack featuring dynamic product management, user authentication, and responsive design.

---

## Tech Stack

### Frontend:
- **Framework**: React 18, React Router DOM
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS, Radix UI, TailwindCSS Animate, Tailwind Merge
- **HTTP Requests**: Axios
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Code Quality**: ESLint, PostCSS, Autoprefixer

### Backend:
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication & Security**: bcryptjs, JSON Web Tokens (JWT), Cookie Parser
- **File Management**: Multer
- **Cloud Integration**: Cloudinary
- **Environment Management**: dotenv
- **Cross-Origin Requests**: CORS
- **Development Tool**: Nodemon

---

## Project Structure

### Frontend (Client)
Located in the `client/` folder, the frontend is built with React.js and Vite.

#### Key Files & Folders:
- `src/`: Main React application code.
- `public/`: Static assets like images and icons.
- `index.html`: Main HTML file for the React app.
- `package.json`: Dependencies and scripts for the frontend.
- `vite.config.js`: Vite bundler configuration.
- `tailwind.config.js` & `postcss.config.js`: Tailwind CSS configuration.

#### Key Features:
- **State Management**: Redux Toolkit.
- **API Calls**: Axios for HTTP requests.
- **Routing**: React Router for navigation.
- **Styling**: TailwindCSS for responsive design.

---

### Backend (Server)
Located in the `server/` folder, the backend is built with Node.js and Express.js.

#### Key Files & Folders:
- `server.js`: Main entry point for the backend.
- `routes/`: Defines API endpoints.
- `controllers/`: Handles logic for API requests.
- `models/`: Defines MongoDB schemas using Mongoose.
- `helpers/`: Utility functions for backend logic.
- `package.json`: Backend dependencies.

#### Key Features:
- **Authentication**: JWT-based secure login.
- **Database Management**: MongoDB with Mongoose.
- **File Uploads**: Cloudinary integration for image storage.
- **Payment Processing**: PayPal integration.

---

## End-to-End Flow

1. **User Interaction (Frontend)**:
	- Users browse products, add items to the cart, and proceed to checkout.
	- Authentication and profile management.

2. **API Calls (Frontend → Backend)**:
	- Axios is used to interact with backend APIs for products, authentication, and orders.

3. **Backend Processing**:
	- Express.js handles API requests and interacts with MongoDB.
	- Authentication and authorization are managed using JWT.

4. **Database Storage (MongoDB)**:
	- Stores user accounts, products, orders, and reviews.

---

## Functionalities

1. **User Authentication**:
	- Secure registration and login using JWT.

2. **Product Management**:
	- Dynamic product listings with images, descriptions, and prices.

3. **Shopping Cart**:
	- Add, update, or remove items from the cart.

4. **Order Placement & Tracking**:
	- Place orders and track their status.

5. **Payment Processing**:
	- Secure transactions using PayPal.

6. **Admin Panel**:
	- Manage users, products, and orders.

7. **Reviews & Ratings**:
	- Customers can post reviews and ratings for products.

8. **Search & Filtering**:
	- Search products using API endpoints.

9. **Image Uploads**:
	- Cloudinary integration for product images.

---

## API Endpoints

### Admin Routes:
- **Order Management**: View, update, delete orders.
- **Product Management**: CRUD operations for products.

### Authentication Routes:
- **User Authentication**: Register, login, and JWT-based authentication.

### Shop Routes:
- **Cart Management**: Add, update, remove items.
- **Order Management**: Place and track orders.
- **Product Listings**: Fetch product details.
- **Reviews**: Manage customer reviews and ratings.

---

## Database Schema

1. **User Schema**:
	- Stores user details (name, email, password, role, address).

2. **Product Schema**:
	- Defines product structure (name, description, price, category, stock).

3. **Cart Schema**:
	- Stores user-selected items.

4. **Order Schema**:
	- Manages order history and payment status.

5. **Review Schema**:
	- Handles customer reviews and ratings.

6. **Address Schema**:
	- Manages user shipping addresses.

---

## How to Run the Project

1. **Clone the Repository**:
	```bash
	git clone <repository-url>
	cd e-commerce
	```

2. **Install Dependencies**:
	- Frontend:
	  ```bash
	  cd client
	  npm install
	  ```
	- Backend:
	  ```bash
	  cd server
	  npm install
	  ```

3. **Set Up Environment Variables**:
	- Create a `.env` file in the `server/` folder with the required variables.

4. **Run the Application**:
	- Start the backend:
	  ```bash
	  cd server
	  npm run dev
	  ```
	- Start the frontend:
	  ```bash
	  cd client
	  npm run dev
	  ```

5. **Access the Application**:
	- Open your browser and navigate to `http://localhost:5173`.

### Future Enhancements

1. **Wishlist Functionality**:
	- Allow users to save products to a wishlist for future purchases.

2. **Product Recommendations** (AI Integration Needed):
	- Implement a recommendation engine based on user behavior and purchase history using machine learning algorithms.

3. **Multi-Currency Support**:
	- Enable users to view prices and pay in their preferred currency.

4. **Discount Coupons**:
	- Add support for promotional codes and discounts during checkout.

5. **Order Notifications**:
	- Notify users via email or SMS about order status updates.

6. **Inventory Management**:
	- Provide real-time stock updates and low-stock alerts for admins.

7. **Advanced Search** (AI Integration Optional):
	- Add filters for price range, categories, and ratings to improve product discovery. AI can be used for semantic search or personalized results.

8. **Guest Checkout**:
	- Allow users to place orders without creating an account.

9. **Analytics Dashboard** (AI Integration Optional):
	- Provide admins with insights into sales, user activity, and product performance. AI can enhance this with predictive analytics and trend forecasting.

10. **Live Chat Support** (AI Integration Optional):
	- Integrate a live chat feature for customer support and inquiries. AI-powered chatbots can be used for automated responses.

---


