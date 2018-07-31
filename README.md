**Getting started with Node.js (and Express & MongoDB)**

Read [this tutorial](https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd). The project structure is a bit different, but the basic principles are the same.

**Prerequisites**

* [Node.js LTS-version](https://nodejs.org/en/)
* [MongoDB Community version](https://docs.mongodb.com/manual/administration/install-community/)

**Clone the repo**
```
git clone git@github.com:hackjunction/node-gavel.git
 cd node-gavel
```

**Install dependencies**

Run `npm run setup`. Only needs to be run again whenever dependencies change.

**Starting the development server**

Run `yarn dev`, this will start the development server at `localhost:3000`, and the admin panel frontend at `localhost:5000`. Both the API and the frontend will automatically reload whenever code changes are saved.

**Generating fake data**

There are a few scripts to make things a bit easier: 

* Run `npm run create-fake-data` to insert 100 annotators and projects into the DB
* Run `npm run reset-db` to clear the entire database