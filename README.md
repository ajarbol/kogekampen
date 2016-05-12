Kogekampen
=====================
## Intro
Simple event website for the magnificent CrossFit box ["Kogeriet"](https://www.crossfitcopenhagen.dk/gyms/kogeriet) 👊
## Requirements
- [node and NPM](http://nodejs.org/download/) (for building and development)
- [mongodb](https://www.mongodb.org/) (for server development)

## Data
The server runs mongodb, to populate the database locally with a dump file (kk-dump) by running `mongorestore --drop kk-dump`
Backup data by running: `mongodump --db kogekampen --out kk-dump`

## Configuration
You need to create an .env file in the root directory to store your configuration locally, it should contain:
```
COOKIE_SECRET=some_random_string
CLOUDINARY_URL=cloudinary://333779167276662:_8jbSi9FB3sWYrfimcl8VKh34rI@keystone-demo
```

## Installation
1. Navigate into the directory (`cd kogekampen`)
2. Install Node dependencies through NPM by running `npm install`
3. Start the project by running `node keystone`
4. Visit `localhost:3000/keystone` to add data or import a data dump, the default admin user is `admin:demo123`
