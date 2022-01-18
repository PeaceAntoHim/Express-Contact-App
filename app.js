const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

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
app.get('/contact', (req, res) => {
    const contacts = loadContact();

    res.render('contact', {
        title: 'Contact Page',
        layout: 'layouts/main-layout',
        contacts,
        msg: req.flsah('msg'),
    });
});




/* Port to development evironment */
app.listen(port, () => {
    console.log(`Example app listening att https://localhost:${port}`);
});