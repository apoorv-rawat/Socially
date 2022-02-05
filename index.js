const express = require('express');

const cookieParser = require('cookie-parser');

// fire up express server
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');

const db = require('./config/mongoose');

// used for session cookie
const session = require('express-session');

const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup chat server to be used with socket.io
const chatServer = require('http').Server(app);

// initialising the chat server 
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listening on port 5000");

// setting debug false for now
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: false,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));
// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// should be before routes
app.use(expressLayouts);

// extract styles and scripts from subpages into layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//set up view engine
app.set('view engine', 'ejs');    
app.set('views', './views');

// in order - cookie encryption
// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in
    // production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:  MongoStore.create({
            mongoUrl: 'mongodb://localhost/codeial_development',
            autoRemove: 'disabled'    
    },
    function (err) {
        console.log(err || 'connect-mongodb setup ok');
    }
    ) 
}));

app.use(passport.initialize());
app.use(passport.session());

// after session is set
app.use(flash());
app.use(customMware.setFlash);

// sequence
app.use(passport.setAuthenticatedUser);

//use express router (routing path / ) 
//here in require ./routes/index is implicit 
// use after passport initialise
app.use('/', require('./routes'));

app.listen(port, function (err) {
    if(err) {
        // interpolation
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);

    
});