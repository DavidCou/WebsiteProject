var express = require('express');

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

const {check, validationResult} = require('express-validator');

mongoose.connect(
    'mongodb://localhost:27017/SQA_Assignment03',
    {useNewUrlParser:true},
    () => console.log("connected to mongo")
);

const Vehicle = mongoose.model('Vehicle', 
    {
        firstName: String, 
        lastName: String,
        address: String,
        city: String,
        province: String,
        postalCode: String,
        phoneNumber: String,
        email: String,
        make: String,
        model: String,
        year: String,
        webLink: String
    }
);

var myApp = express();

const port = 8080;

myApp.use(bodyParser.urlencoded({extended: false}))

myApp.set('views','views');
myApp.use(express.static('public'))
myApp.set('view engine', 'ejs');

myApp.get('/Assignment3/views/index.ejs', (req,res) => {
    res.render('index')
});

myApp.get('/Assignment3/views/addVehicle.ejs', (req,res) => {
    res.render('addVehicle')
});

myApp.post('/Assignment3/views/addVehicle.ejs',[
        check('firstName', 'Please enter your first name').not().isEmpty(),
        check('lastName', 'Please enter your last name').not().isEmpty(),
        check('address', 'Please enter your address').not().isEmpty(),
        check('city', 'Please enter your city').not().isEmpty(),
        check('province', 'Please enter your province').not().isEmpty(),
        check('province', 'Invalid format, please enter your province in the following format: AA').matches(/^[A-Z][A-Z]$/),
        check('postalCode', 'Please enter a valid postal code').matches(/^[A-Z][0-9][A-Z]\s[0-9][A-Z][0-9]$/), 
        check('phoneNumber', 'Please enter a valid phone number').matches(/^\(?(\d{3})\)?\-?(\d{3})\-(\d{4})$/), 
        check('email', 'Please enter a valid email').isEmail(),
        check('make', 'Please enter the vehicles make').not().isEmpty(),
        check('model', 'Please enter the vehicles model').not().isEmpty(),
        check('year', 'Please enter the vehicles year').not().isEmpty(),
    ], 

    function(req, res){
        const errors = validationResult(req);
        console.log(req.body);
        var  firstName = req.body.firstName;
        var  lastName = req.body.lastName;
        var address = req.body.address;
        var city = req.body.city;
        var province = req.body.province;
        var postalCode = req.body.postalCode;
        var phoneNumber = req.body.phoneNumber;
        var email = req.body.email;
        var make = req.body.make;
        var model = req.body.model;
        var year = req.body.year;

        if (!errors.isEmpty())
        {
            res.render('addVehicle', {
                errors:errors.array(),
            })
        }
        else 
        {
            let webLink = `http://www.jdpower.com/cars/${year}/${make}/${model}` 

            var newVehicle = new Vehicle( 
                {   firstName: firstName,
                    lastName: lastName,
                    address: address,
                    city: city,
                    province: province,
                    postalCode: postalCode,
                    phoneNumber: phoneNumber,
                    email: email,
                    make: make,
                    model: model,
                    year: year,
                    webLink: webLink
                } 
            );

            newVehicle.save().then( () => console.log('new vehicle saved') );

            res.render('viewAddedVehicle', {
                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                province: province,
                postalCode: postalCode,
                phoneNumber: phoneNumber,
                email: email,
                make: make,
                model: model,
                year: year,
                webLink: webLink
            });
        }
    }
);

myApp.get('/Assignment3/views/enteredVehicles.ejs', (req,res) => {
    Vehicle.find({}).exec((err,vehicles) => {
        res.render('enteredVehicles', {vehicles:vehicles})
    });
});
myApp.listen(port, () => {
    console.log(`The website for assignment 3 is running at http://localhost:${port}/Assignment3/views/index.ejs`)
  })

