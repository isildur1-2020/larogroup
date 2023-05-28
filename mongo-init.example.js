db.createUser({
  user: 'your-user',
  pwd: 'your-user-password',
  roles: [
    {
      role: 'root',
      db: 'your-database',
    },
  ],
});
