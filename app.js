const express = require('express');
const expressLayouts = require('express-ejs-layouts');
/* load to data npm flash */
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


require('./utils/db');
const Contact = require('./model/contact');


const app = express();
const port = 3000;

/* Setup EJS */
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

/* Config to flash */
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: {
            maxAge: 6000
        },
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());



/* Berbagai Respon yang dapat diggunakan oleh express */
app.get('/', (req, res) => {

    // res.sendFile('./index.html', {root: __dirname });
    const mahasiswa = [{
            nama: 'Frans Sebastian',
            email: 'stefanusfranssebastian@gmail.com'
        },
        {
            nama: 'Kurniawan',
            email: 'kurinawancore@gmail.com',
        },
        {
            nama: 'Agung Lesmana',
            email: 'agunglestay@mail.com',
        },

    ];
    res.render('index', {
        nama: 'Frans Sebastian',
        layout: 'layouts/main-layout',
        title: 'Home Page',
        mahasiswa,
    });
});

/* Halaman About */
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Halaman About',
        layout: 'layouts/main-layout',
    });
});


/* Halaman Contact */
app.get('/contact', async (req, res) => {
    /* Contact.find().then((contact) => {
        res.send(contact);
    }); */

    const contacts = await Contact.find();

    res.render('contact', {
        title: 'Contact Page',
        layout: 'layouts/main-layout',
        contacts,
        msg: req.flash('msg'),
    });
});

/* Halaman detail contact */
app.get('/contact/:nama', async (req, res) => {
    // const contact = findContact(req.params.nama);
    const contact = await Contact.findOne({
        nama: req.params.nama
    });

    res.render('detail', {
        title: 'Detail contact page',
        layout: 'layouts/main-layout',
        contact,
    });
});



/* Port to development evironment */
app.listen(port, () => {
    console.log(`Example app listening att https://localhost:${port}`);
});