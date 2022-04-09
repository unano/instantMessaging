# Instant Messaging  Vchat

This is an web application built with MERN, the application is deployed at https://instant-messaging-socket.herokuapp.com.

## Client Side

        - npm install (in the public folder)
        - npm start
Client side now connects to heroku backend, if you want to run on local server, please go to public/utils/APIRoutes and replace
"export const host = "https://instant-messaging-socket.herokuapp.com";" with "export const host = "http://localhost:8080"

## Server Side

        - npm install (in the root folder)
        - npm start

However, since .env is not provided here, you still need a mongoURL.