const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const app = express();
const port = 3000;

/* Aplication Level Middleware */
app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});


// Gunakan ejs 
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Third party Middlewere
app.use(expressLayouts);
app.use(morgan('dev'));

// Built in middlewere
app.use(express.static('public'));


/* Berbagai Respon yang dapat diggunakan oleh express */
app.get('/', (req, res) => {

        // res.sendFile('./index.html', {root: __dirname });
        const mahasiswa =  [
            {
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
            title: 'Halaman Home',
            mahasiswa,
        });
    });
           
app.get('/about', (req, res) => {
    // res.sendFile('./about.html', {root: __dirname});
    res.render('about', {
        title: 'Halaman About',
        layout: 'layouts/main-layout', 
    });
});
app.get('/contact', (req, res) => {
    // res.send('This is a contact page!');
    // res.sendFile('/contact.html', {root: __dirname});
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Halaman Contact'});
});


app.get('/product/:id', (req, res) => {
    res.send(`Product ID : ${req.params.id} <br> Category: ${req.query.category}`);
}); 


app.use((req, res) => {
    res.status(404);
    res.send('<h1>404</h1>');
});

app.listen(port, () => {
    console.log(`Example app listening att https://localhost:${port}`);
});

