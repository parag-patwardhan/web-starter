# WebStarter

  A template for a typical web project

## Server
The first time that you are setting up the system, you will have to do the following:
1. Make sure mysql is installed and running on your local machine
2. In mysql create a new schema, username and password. Make sure the username has permissions to modify the created schema.
3. cd server
4. npm install
5. cd developer
6. node initDeveloperDB.js <email> <password> (where email/password will be used to log into the system)

Once the system is set up, you can start the server by
1. cd server
2. Set all required environment variables (These can be found in config/index.js - everything prefixed with a "process.env." needs to be set).
3. node index.js
4. At this point the server should be up and running on the port specified in config/index.js

It is helpful to create a script called runServer.sh that will set all environment variables and start the server. This file has been added to .gitignore and should not be checked in to source control.

## Client
To get started,
1. cd client
2. npm install (only needed the first time)
3. ng serve
4. Browse to http://localhost:4200

The Client project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.
