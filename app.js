let http = require('http');
const path = require('path');
const bodyParser = require('body-parser')
const session = require('express-session');

let express = require('express');
var jsonParser = bodyParser.json();
let app = express();
let http_port = 8080;
let httpServer = http.createServer(app);

httpServer.listen(http_port, () => {
    console.log(`Listenting on Port:${http_port}`);
});

app.use(express.static(`public`));
app.use(express.urlencoded({ extended: true}));

const sessionConfig = {
    secret: `notagoodsecret`,
    resave:false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
        maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(session(sessionConfig));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('form1');
});

app.post('/form', jsonParser, (req, res) => {
    req.session.action = JSON.stringify(req.body.action);
    console.log(`About to redirect to "/form2"`);
    res.redirect(`/form2`);
});

app.get(`/form2`, (req, res) => {
    console.log(`Inside The "/form2" Route`);
    const action = req.session.action
    console.log(`Action:${req.session.action}`);
    res.render(`form2`, {action})
});


