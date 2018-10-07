An expo judging system based on the original Gavel: https://github.com/anishathalye/gavel. **This project is in development and not ready for use.** Junction is currently developing this platform for use in various Junction events, and the project will be properly documented after it has been successfully tested there (beginning of 2019 most likely).

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
