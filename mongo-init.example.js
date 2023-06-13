// The first step if you want to run the app
// is create an user to get authentication
// successfully
db.createUser({
  user: 'ROOT_USERNAME',
  pwd: 'ROOT_PASSWORD',
  roles: [
    {
      role: 'readWrite',
      db: 'MONGO_DATABASE',
    },
  ],
});
