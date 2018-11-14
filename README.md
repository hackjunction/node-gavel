An expo judging system based on the original Gavel: https://github.com/anishathalye/gavel. **This project is in development and not ready for use.** Junction is currently developing this platform for use in various Junction events, and the project will be properly documented after it has been successfully tested there (beginning of 2019 most likely).

**Prerequisites**

-   [Node.js LTS-version](https://nodejs.org/en/)
-   [MongoDB Community version](https://docs.mongodb.com/manual/administration/install-community/)

**Clone the repo**

```
git clone git@github.com:hackjunction/node-gavel.git
 cd node-gavel
```

**Install dependencies**

Run `npm run setup`. Only needs to be run again whenever dependencies change.

**Add ENV files** You need to add two .env files:

First, check out the configuration options in `/api/settings.js`

If you want to override some of the default configuration options, place an `.env` file at the root of the project with your overrides.

Then, at the root of `client` add an `.env` file with the contents:

```
PORT=5000
```

**Starting the development server**

Run `yarn dev`, this will start the development server at `localhost:3000`, and the admin panel frontend at `localhost:5000`. Both the API and the frontend will automatically reload whenever code changes are saved.

**Others**

VSCode Settings Sync Gist ID: 5afa14f85102f6000f96ba682cfda51d (if you wish to use my VSCode theme and settings)
