export const EnvConfiguration = () => ({
  // environment: process.env.NODE_ENV || 'dev',
  mongodbUri: process.env.MONGODB_URI,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
});
