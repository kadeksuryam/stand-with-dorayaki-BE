# [Stand with Dorayaki](http://stand-with-dorayaki.eastus.cloudapp.azure.com/) - Backend
### Built With
* [NodeJS](https://nodejs.org/)
* [ExpressJS](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Swagger](https://swagger.io/)

## Features
- `/api/v1/toko-dorayakis` provides CRUD operations for `Toko Dorayaki`
- `/api/v1/stok-dorayakis` provides RU operations for `Stok Toko Dorayaki`
- `/api/v1/dorayaki` provides CRUD operations for `Dorayaki`
- `/api/v1/documentation` provides endpoints for demo and documentation

Visit [API Documentation](http://stand-with-dorayaki.eastus.cloudapp.azure.com/api/v1/documentation) for more informations/demos 

## Getting Started
### Requirements
* Docker Engine - you can follow the installation guide [here](https://docs.docker.com/engine/install/)
* Docker Compose - you can follow the installation guide [here](https://docs.docker.com/compose/install/)

### Installation and Usage
1. Clone the repo
   ```sh
   git clone https://github.com/kadeksuryam/stand-with-dorayaki-BE.git
   ```
2. Build images and run the containers
   ```sh
   docker-compose build && docker-compose up -d
   ```
3. Now, you can access the API's endpoints at `http://localhost/api/v1/`

4. Stopping and Removing the containers
   ```sh
   docker-compose down
   ```

## Contact
Kadek Surya Mahardika - kadeksuryam@gmail.com


