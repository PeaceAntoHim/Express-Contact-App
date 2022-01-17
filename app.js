const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require('./utils/contacts');
const { body, validationResult, check } =require('express-validator');
// Require data for made flash messages
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


const app = express();
const port = 3000;

// Gunakan ejs 
app.set('view engine', 'ejs');
// Third party Middlewere
app.use(expressLayouts);
// Built in middlewere
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

/* Configuration for settings flash message with middlewere*/
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: {maxAge: 6000},
        secret: 'secret',
        reserve: true,
        saveUninitialized: true,
    })
);
app.use(flash());

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
        msg: req.flash('msg'),
    });
});

/* Halaman Form tambah data Contact */
    app.get('/contact/add', (req, res) => {
        res.render('add-contact', {
        title: 'Form Get New Data Contact',
        layout: 'layouts/main-layout',
        });
    });


/* Proses Menangkap Data Contact */
app.post('/contact', [
    body('nama').custom((value) => {
        const duplikat = cekDuplikat(value);
        // Pengecekan data duplikat
        if(duplikat) {
            throw new Error('Name of contact is already in used');
        }
        return true;
    }),
    // Proses Validasi email dan no hp
    check('email', 'Email not valid').isEmail(),
    check('nohp', 'Phone number not valid').isMobilePhone('id-ID')
    ], (req, res) => {
    const errors = validationResult(req);
        // Pengecekan data kosong
    if(!errors.isEmpty()) {
        // return res.status(400).json({errors: errors.array() });
        res.render('add-contact', {
            title: 'Form Get New Data!',
            layout: 'layouts/main-layout',
            errors: errors.array(),
        });
    } else {
        addContact(req.body);
        // Kirimkan flash message
        req.flash('msg', 'New data contact was added!');
        res.redirect('/contact');
    }



    // res.send(req.body);
    // addContact(req.body);
    // res.redirect('/contact');
});


/* Fitur Delete in card contact */
app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama);


    // If contact not found
    if(!contact) {
        res.status(400); 
        res.send('<h1>404</h1>');
    } else {
        // res.send('ok');
        deleteContact(req.params.nama);
        req.flash('msg', 'Data Contact has sucessfully added');
        res.redirect('/contact');
    }
});

/* Form edit contact data */
app.get('/contact/edit/:nama', (req, res) => {
    const contact = findContact(req.params.nama);

    res.render('edit-contact', {
        title: 'Form edit contact data',
        layout: 'layouts/main-layout',
        contact,
    });
});




/* Process edit data */
app.post('/contact/update', 
    [
        body('nama').custom((value, { req }) => {
            const duplikat = cekDuplikat(value);
            // Pengecekan data duplikat
            if(value !== req.body.oldNama && duplikat) {
                throw new Error('Name of contact is already in used');
            }
            return true;
        }),
    // Proses Validasi email dan no hp
    check('email', 'Email not valid').isEmail(),
    check('nohp', 'Phone number not valid').isMobilePhone('id-ID')
    ], (req, res) => {
    const errors = validationResult(req);
        // Pengecekan data kosong
    if(!errors.isEmpty()) {
        // return res.status(400).json({errors: errors.array() });
        res.render('edit-contact', {
            title: 'Form Edit Data!',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body,
        });
    } else {
        // res.send(req.body);
        updateContacts(req.body);
        // Kirimkan flash message
        req.flash('msg', 'Data contact was edited!');
        res.redirect('/contact');
        }
    }
);




/* Halaman detail contact */
app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render('detail', {
        title: 'Halaman Detail Contact',
        layout: 'layouts/main-layout',
        contact,
    });
});



/* Halaman kosong */
app.use((req, res) => {
    res.status(404);
    res.send('<h1>404</h1>');
});


/* Port to development evironment */
app.listen(port, () => {
    console.log(`Example app listening att https://localhost:${port}`);
});

