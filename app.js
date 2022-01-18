const express = require('express');
const expressLayouts = require('express-ejs-layouts');
/* Load data validation */
const {
    body,
    validationResult,
    check
} = require('express-validator');
/* Load Data Override */
const methodOverride = require('method-override');

/* load to data npm flash */
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


require('./utils/db');
const Contact = require('./model/contact');


const app = express();
const port = 3000;


/* Setup method override */
app.use(methodOverride('_method'));



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

/* Halaman form tambah data contact */
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Form get New Contact Data',
        layout: 'layouts/main-layout',
    });
});

// Proses tambah data contact
app.post(
    '/contact',
    [
        body('nama').custom(async (value) => {
            const duplikat = await Contact.findOne({
                nama: value
            });
            if (duplikat) {
                throw new Error('Name contact already registered!');
            }
            return true;
        }),
        check('email', 'Email not valid!').isEmail(),
        check('nohp', 'No HP tidak valid!').isMobilePhone('id-ID'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('add-contact', {
                title: 'Form add new contact data',
                layout: 'layouts/main-layout',
                errors: errors.array(),
            });
        } else {
            Contact.insertMany(req.body, (error, result) => {
                /* Kirimkan flesh message */
                req.flash('msg', 'Data contact successfully added!');
                res.redirect('/contact');
            });
        }
    }
);

/* Proses delete contact Cara pertama*/
/* app.get('/contact/delete/:nama', async (req, res) => {
        const contact = await Contact.findOne({
            nama: req.params.nama
        });
        if (!contact) {
            res.status(404);
            res.send('<h1>404</h1>');
        } else {
            Contact.deleteOne({
                _id: contact._id
            }).then((result) => {
                req.flash('msg', 'Data contact has been deleted');
                res.redirect('/contact');
            });
        }
    });
 */
/* Proses delete data contact cara kedua */
app.delete('/contact', (req, res) => {
    Contact.deleteOne({
        nama: req.body.nama
    }).then((result) => {
        req.flash('msg', 'Data contact berhasil dihapus');
        res.redirect('/contact');
    });
});

/* Halaman form edit data contact*/
app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({
        nama: req.params.nama
    });
    res.render('edit-contact', {
        title: 'Form edit contact',
        layout: 'layouts/main-layout',
        contact,
    });
});

/* Proses Ubah data */
app.put(
    '/contact',
    [
        body('nama').custom(async (value, {
            req
        }) => {
            const duplikat = await Contact.findOne({
                nama: value
            });
            if (value !== req.body.oldNama && duplikat) {
                throw new Error('Name contact was already registered!');
            }
            return true;
        }),
        check('email', 'Email not valid!').isEmail(),
        check('nohp', 'No Hp not valid').isMobilePhone('id-ID'),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('edit-contact', {
                title: 'Edit form data',
                layout: 'layouts/main-layout',
                errors: errors.array(),
                contact: req.body,
            });
        } else {
            Contact.updateOne({
                _id: req.body._id
            }, {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    nohp: req.body.nohp,
                },
            }).then((result) => {
                // Kirimkan flash message
                req.flash('msg', 'Data Contact Berhasil di ubah');
                res.redirect('/contact');
            });
        }
    }
);



/* Halaman detail contact */
app.get('/contact/:nama', async (req, res) => {
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