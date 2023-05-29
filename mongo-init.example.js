db.createUser({
  user: 'USERNAME',
  pwd: 'USER_PASSWORD',
  roles: [
    {
      role: 'readWrite',
      db: 'DATABASE_NAME',
    },
  ],
});
