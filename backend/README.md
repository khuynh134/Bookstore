# Backend of Bookstore
The backend uses express, cors, mysql2, and dotenv. Use the command npm install when needed.
To start the backend, use the command npm start.
It is listening to the port 8081

## Set the login information in .env file
1. Copy the .env_example to .env, .env will not be uploaded to github.
2. Change the DB_PASSWORD to your own password.
3. Change the DB_USER if you are using a different user than root, check your mysql workbench
4. Done

## Seed.js
seed.js will recreate the Book table in our database and insert a few books inside for testing.
To run the script, use the command node seed.js
