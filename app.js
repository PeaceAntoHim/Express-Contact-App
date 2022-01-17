const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact } = require('./utils/contacts');

const app = express();
const port = 3000;

// Gunakan ejs 
app.set('view engine', 'ejs');
// Third party Middlewere
app.use(expressLayouts);
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
/* Membuat page about */         
app.get('/about', (req, res) => {
    // res.sendFile('./about.html', {root: __dirname});
    res.render('about', {
        title: 'Halaman About',
        layout: 'layouts/main-layout', 
    });
});

/* Membuat page Contact */
app.get('/contact', (req, res) => {
    const contacts = loadContact();
    res.render('contact', {
        title: 'Halaman Contact',
        layout: 'layouts/main-layout',
        contacts,
    });
});

app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render('detail', {
        title: 'Halaman Detail Contact',
        layout: 'layouts/main-layout',
        contact,
    });
});


app.use((req, res) => {
    res.status(404);
    res.send('<h1>404</h1>');
});

app.listen(port, () => {
    console.log(`Example app listening att https://localhost:${port}`);
});

