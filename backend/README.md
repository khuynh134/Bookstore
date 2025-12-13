# Backend of Bookstore
The backend uses express, cors, mysql2, and dotenv. Use the command npm install when needed.
It is listening to the port 8081 by default, run with npm run dev.

## Authors
Kathy Huynh, 
Ying Huang, 
Valeria Campos

## Set the login information in .env file
1. Copy the .env_example to .env, .env will not be uploaded to github.
2. Change the DB_PASSWORD to your own password.
3. Change the DB_USER if you are using a different user than root, check your mysql workbench
4. Add JWT_KEY = "jwt-secret-key" as a new line
5. Done

## Deal with MySQL server connection issue
One possible problem encountered is that unable to connected to mySQL when start the backend/server.js.
To solve this issue, check whether the server has stopped.
If so, on Window system and when its location is separated from XAMPP:
1. press Win + R
2. search services.msc
3. Locate MySQL80 or other name used by your installation
4. Right click it and click start.

## Installing dependencies for sign up and login 
## in the frontend of the project install these
in the frontend of the project, install dependencies using this command: 
npm install 
## in the backend of the project install these
in the backend/ backend folder, (cd backend) install dependencies using this command:
npm install 

## Running the backend 
I mostly start the backend with line "npm run dev", but npm start should work for login and registering too 

## for the following instruction only follow it if you are using a port that is not 8081 
## Making changes to Register.jsx for login & sign up if you are using a port that is NOT 8081
for the handleSubmit function near the top of the code (it should be around line 20) replace the port number 8081 with the port number your code is using. Only do this step if you are using a port that is not 8081 otherwise ignore this section 
## Make changes to Login.jsx for login and sign up if you are using a port that is NOT 8081
for the handleSubmit function near the top of the code should be around line 21 replace the port number 8081 with the port number your code is using. nly do this step if you are using a port that is not 8081 otherwise ignore this section 
