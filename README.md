## Server starter code with basic auth

### Provided code

This boilerplate has:

- already established connection with database
- user signup: `/api/signup`
- user login: `/api/login`
- user logout: `/api/logout`
- check if user is logged in: `/api/isLoggedIn`
- route guard middleware
- sessions middleware
- CORS middleware

### Using the boilerplate

To use this project as your starter code, follow these steps:

```shell
# clone the project
$ git clone https://github.com/ironhack-labs/server-starter-with-basic-auth.git

# navigate to the project
$ cd https://github.com/ironhack-labs/server-starter-with-basic-auth.git

# remove .git
$ rm -rf .git

# initialize it as a git repo
$ git init

# create a new repository on your own GitHub and add it as remote origin
$ git remote add origin https://github.com/your-username/repo-you-created.git

# push this code as your starter code (follow the usual steps: git add . , git commit...)

# you are ready to start coding

# install dependencies
$ npm i

# run the app
$ npm run dev

# the app will run on the PORT 3001
```
