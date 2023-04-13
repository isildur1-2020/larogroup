export const EnvConfiguration = () => ({
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  jwt_secret: process.env.JWT_SECRET,
  root_password: process.env.ROOT_PASSWORD,
});
