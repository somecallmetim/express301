const path = require('path');

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

const helmet = require('helmet');
app.use(helmet());

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res, next)=>{
   res.send("<h1>Blitzcrank loves you</h1>");
});

app.use((req, res, next)=>{
    if(req.query.msg === 'fail'){
        res.locals.msg = `Sorry, this username and password combination does not exist...`
    }else {
        res.locals.msg = ``;
    }
    next();
});

app.get('/login', (req, res, next)=>{

    res.render('login');
});

app.post('/process_login', (req, res, next)=>{
    const username = req.body.username;
    const password = req.body.password;

    // check db to see if credentials are valid...
    if(password === "x"){
        // res.cookie() takes two args, name of the cookie and the value
        res.cookie('username', username);
        res.redirect('welcome');
    }else {
        // ? is a special character where everthing after the ? is a query string
            // using & let's you have more than one key value pair
            // the query string is where you put insecure data
        res.redirect('/login?msg=fail&test=hello');
    }
    // req.body, recall, is put together by express.urlencoded and express.json
    // res.json(req.body);
});

app.get('/welcome', (req, res, next)=>{
   res.render('welcome', {
       // req.cookies object will have a property for every named cookie
       username: req.cookies.username
   });
   //  res.send('<h1>Welcome!</h1>');
});

app.param('id', (req, res, next, id)=>{
    console.log("Params called", id);
    next();
});

app.get('/story/:id', (req, res, next)=>{
    // req.params object keeps track of wild cards in a URL
    res.send(`<h1>Story ${req.params.id}</h1>`);
});

app.get('/story/:storyId/:link', (req, res, next)=>{
    // req.params object keeps track of wild cards in a URL
    res.send(`<h1>Story ${req.params.storyId} - ${req.params.link}</h1>`);
});

app.get('/statement', (req, res, next)=>{
    res.download(path.join(__dirname, 'userStatements/BankStatementChequing.png'), 'BankStatement.png', ()=>{
        if(error){
            console.log(error);
            if(!res.headersSent){
                res.redirect('download/error');
            }
        }
    })
});

app.get('/logout', (req, res, next)=>{
    res.clearCookie('username');
    res.redirect('/login');
});

app.listen(3000, ()=>{
    console.log('Server is listening on port 3000');
});