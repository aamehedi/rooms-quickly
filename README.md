# RoomsQuickly
## Documentation
### REST endpoint documentation
Documentation for all the REST endpoints will be found in the **apidoc** direcotry.
The live version of this documentation can be viewed [here](https://abdullahallmehedi.github.io/rooms-quickly/apidoc/).

To generate these documentation in your local - ```npm run apidoc```
### Source code documentation
Documentation for all the source code will be found in the **docs** direcotry.

To generate these documentation in your local - ```npm run sourcedoc```
## Architecture Overview
This is a RESTful web service. So it includes only back-end parts.

 As the scenario required that there will be multiple type of client agent like website, mobile application, offline, etc, this web service will be solely responsible to accepts their requests and reply them with appropriate responds and data.

This RESTful API have been developed keeping two things in mind:
1. horizontal scalibility
2. optimum usage of resource.

The application have been designed arround **microservices**. Each microservice is isolated and independent. In this scenario it's works almost like rest endpoints, with a few exceptions. All the microservices will be found in the **src/service** directory. Each **service** has its own directory, which includes the necessary files for the service like (**model** or **service**).

There are some resources like **logger** or **database** that is usefull for many parts of the applicaion. They have been kept in a common directory **src/util**.
## language/platform used
1. Node.js
2. Typescript
3. Tslint
4. Express.js
5. Cote.js
6. MongoDB
7. Mongoose
8. Pm2
9. Config
10. Winston
11. Faker
12. Kue
13. Typedoc
14. Apidoc
15. Mocha
16. Chai
## Installation
To install the project:
1. Clone the repository by running:
```
git clone https://github.com/abdullahallmehedi/rooms-quickly.git
```
2. Set env variable **PORT**.
3. Set env variable **DATABASE_URL**.
4. Set env variable **REDIS_URL**.
5. Run - ```yarn install```
6. Run - ```npm run start```

You can change the env variable/configuration from editing corresponding configuration files in the **config** directory.

## Seeding the database
To see the features of the application, the database needs to be seeded and some rooms needs to be activated.
### Seed
Run - ```npm run seed``` to seed the database. It will create some rooms and partners in the datbase. After saving those data it will print those information in the console. Information like id of rooms and partners are required to run features of the application.
### Activating room
Run - ```npm run activate <your_room_id>``` to activate a room for auction. Replace ```<your_room_id>``` with the id of the room you wanna activate.
## Tests
Run - ```npm test```

The application doesn't have 100% test coverage now. More tests will be added later
