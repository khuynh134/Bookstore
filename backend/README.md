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

## Deal with MySQL server connection issue
One possible problem encountered is that unable to connected to mySQL when start the backend/server.js.
To solve this issue, check whether the server has stopped.
If so, on Window system and when its location is separated from XAMPP:
1. press Win + R
2. search services.msc
3. Locate MySQL80 or other name used by your installation
4. Right click it and click start.
