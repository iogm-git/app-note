const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();
const data = require('./controller/conn');

app.use(methodOverride('_method'));
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
app.use(flash());
app.listen(3000, () => {
    console.log(`Mongo Book App | Listen 3000`);
});

app.get('/', async (req, res) => {
    // app.get('/', (req, res) => {
    const contact = await data.find();
    res.render('index', {
        layout: 'layout',
        data: contact,
        message: req.flash('message')
    })
})

// Create Method
app.post('/contact', [
    body('name').custom(async value => {
        const dbl = await data.findOne({ name: value })
        if (dbl) {
            throw new Error('The name is already in use')
        }
        return true;
    }),
    check('email', 'Invalid Email').isEmail()
], (req, res) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        req.flash('message', err.array()[0].msg)
        res.redirect('/#data')
    } else {
        data.insertMany(req.body)
            .then(() => {
                req.flash('message', 'Data added successfully')
                res.redirect('/#data')
            })
            .catch((err) => {
                console.log(err);
            })

    }
})

// Update Method
app.put('/contact', [
    body('name').custom(async (value, { req }) => {
        const duplikat = await data.findOne({ name: value })
        if (value !== req.body.name && duplikat) {
            throw new Error('The name is already in use')
        }
        return true;
    }),
    check('email', 'Invalid Email').isEmail()
], (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        req.flash('message', err.array()[0].msg)
        res.redirect('/#data')
    } else {
        data.updateOne({ _id: req.body._id }, {
            $set: {
                name: req.body.name,
                address: req.body.address,
                number: req.body.number,
                email: req.body.email,
            }
        }).then(result => {
            req.flash('message', 'Data update successfully')
            res.redirect('/#data')
        })
    }
})

// Delete Method
app.delete('/contact', (req, res) => {
    data.deleteOne({ name: req.body.name }).then(result => {
        req.flash('message', 'Data deleted successfully');
        res.redirect('/#data')
    })
})