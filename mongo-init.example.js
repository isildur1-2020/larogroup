// ** CREATE USERS IN DATABASE
// ONLY IF YOUR SYSTEM IS A NEW SYSTEM
// YOU SHOULD CREATE TWO USERS,
// ** ADMIN USER
// THIS USER IS ABLE TO ALL POSIBILITIES
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
// ** READ USER
// THIS USER IS ABLE TO READ THE DATABASE
db.createUser({
  user: 'reportsUser',
  pwd: 'REPORTS_PASSWORD',
  roles: [
    {
      role: 'read',
      db: 'MONGO_DATABASE',
    },
  ],
});
