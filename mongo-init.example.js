// The first step if you want to run the app
// is create an user to get authentication
// successfully
db.createUser({
  user: 'YOUR_USERNAME',
  pwd: 'YOUR_USER_PASSWORD',
  roles: [
    {
      role: 'readWrite',
      db: 'YOUR_DATABASE_NAME',
    },
  ],
});
