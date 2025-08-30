# Event Platform Backend

## Local Development
1. Copy .env.example to .env
2. Update environment variables in .env file
3. Run `npm install`
4. Run `npm run seed` to seed initial users
5. Run `npm run dev` for development or `npm start` for production

## Environment Variables
Required environment variables:
- `PORT`: Server port (default: 5001)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `REACT_APP_API_BASE_URL`: Frontend URL for CORS
- `ADMIN_SEED`: Admin user credentials (email:password)
- `EVENTMANAGER_SEED`: Event manager credentials (email:password)

## Render Deployment

### Method 1: Using render.yaml (Recommended)
1. Connect your GitHub repository to Render
2. Render will automatically detect the render.yaml file
3. Set the following environment variables in Render dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key
   - `REACT_APP_API_BASE_URL`: Your frontend URL (e.g., https://your-frontend.onrender.com)
   - `ADMIN_SEED`: admin@example.com:adminpassword
   - `EVENTMANAGER_SEED`: manager@example.com:managerpassword

### Method 2: Manual Setup
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Configure environment variables as above

### Health Check Endpoints
- `GET /health` - Server health status
- `GET /` - API information

## Troubleshooting
- If getting 404 errors, check that all environment variables are set correctly
- Verify MongoDB connection string is valid
- Check CORS configuration matches your frontend URL
