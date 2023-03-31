export const EnvConfiguration = () => ({
  // environment: process.env.NODE_ENV || 'dev',
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  jwt_secret: process.env.JWT_SECRET,
});
