# BookLove

## Installation

1 Open terminal  
2 cd to the map where you will save the project  
3 git clone https://github.com/JimvandeVen/be-assessment-2.git  
4 cd /be-assessment-2  
5 Run ```npm install``` Install dependencies  
6 Run ```npm run build``` build and minify static files  
7 Run ```npm run watch``` runs server on `localhost:8000`  
6 have fun :)    

## Getting the database working  
In the root of my repo is a file called ```booklovedb.sql```.  
This file can be used to upload an existing database.   
To do so, create a mysql database and connect with it.  
In your command line use the following code:  
```mysql -u <username> -p <databasename> < booklovedb.sql```  
It will ask your username and password, after you entered it correctly you will have a working database for the repo.  


## Connect with the server  
To connect with the server you have to use your own mysql information in the index.js (By choice i would recommend using [dotenv](https://www.npmjs.com/package/dotenv) for this).  

The code that has to be changed:

```javascript
var connection = mysql.createConnection({
  host: //your database host,
  user://your mysql username,
  password: //your mysql password,
  database: //your database name
})
```

## Brief description of code
