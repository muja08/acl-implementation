nvm use 8
npm i

nodemon index.js

refer below postman link for API endpoints
https://www.getpostman.com/collections/c28a6aab7d2f49ddf2e9


POST /login
POST /signup


['*'] will apply roles & rights for all the roles

POST /product ['admin', 'seller']
PUT /product ['admin', 'seller']
PATCH /product/:id ['admin', 'seller']
DELETE /product/:id ['admin', 'supporter']
GET /product ['admin', 'seller', 'supporter', 'customer']