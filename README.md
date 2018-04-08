# BookLove  

![Screenshot of profile](/static/images/screenshot2.png?)  

## Introduction  

BookLove is a dating website that matches people according to their read books. The more books you have in common, the better the match. As users you can:  
* Create a profile  
* Upload images  
* Update your profile  
* Add read books to your profile  
* Look at matches and their profiles  
* Send emails to get in touch  

## Used technology  

* [express](https://www.npmjs.com/package/express)  
* [argon2](https://www.npmjs.com/package/argon2)  
* [body-parser](https://www.npmjs.com/package/body-parser)  
* [mysql](https://www.npmjs.com/package/mysql)  
* [express-session](https://www.npmjs.com/package/express-session)  
* [method-override](https://www.npmjs.com/package/method-override)  
* [multer](https://www.npmjs.com/package/multer)  
* [fs](https://www.npmjs.com/package/fs)  
* [nodemon](https://www.npmjs.com/package/nodemon)  

## Structure of the database  

![MYSQL tables](/static/images/MySQLtabellen.png) 

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

```txt
server/ - web server  
server/index.js - express server  
server/matching.js - matching system  
static/ - static files used in the website  
static/images - static images created for the website  
static/upload - static images uploaded by the users  
static/java.js - cient-side javascript that handles the login and register  
static/javaprofielstap2.js - client-side javascript that handles the adding of books  
static/main.css - unprocessed styles  
view/ - different used templates  
view/aanmelden.ejs - ejs template for registering  
view/aanpassen.ejs - ejs template for updating profile  
view/berichten.ejs - ejs template for messages (static)  
view/berichtendetail.ejs - ejs template for messages (static)  
view/eigenprofiel.ejs - ejs template for current user profile  
view/error.ejs - ejs template for errors  
view/index.ejs - ejs template for onboarding  
view/ingelogd.ejs - ejs template for logged in users  
view/kandidaadprofiel.ejs - ejs template for other users  
view/nietIngelogd.ejs - ejs template for not logged in users  
static/ - output of `src` after processing (these are sent to the browser)
view/detail.ejs - ejs template for one animal
view/list.ejs - ejs template for all animals
view/error.ejs - ejs template for errors
```  

## To do list  (If I had more time)

- [ ] Get rid of all the client-side javascript that is not necessary, so progressive disclosure is fully used  
- [ ] Create a real, working,  message besed system that works inside the application  
- [ ] Finnish the work started in CSS  
- [ ] Deploy the website  
- [ ] Show the user the books people have read in the 'ingelogd' page  
- [ ] Connect a book API to the website  


## License

[MIT][] © [Jim van de Ven][author]

[mit]: license

