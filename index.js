require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

app.set( 'view engine', 'pug' );
app.use(express.static(__dirname + '/public')); //no esta funcionando

app.use(express.urlencoded({ extended: true }))
app.use(express.json());


//Variables
const private_app_token = process.env.TOKEN;


app.get('/contacts', async (req, res) => {
    console.log(__dirname);
    const contacts = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${private_app_token}`,
        'Content-Type': 'application/json'
    }
    try {
        
    const response = await axios.get(contacts, { headers });
    const data = response.data.results;
    res.render('contacts', { title: 'Contacts | HubSpot APIs', data   });
    } catch (error) {
        console.log(error);        
    }

})

app.get('/update', async (req, res) => {
    //http://localhost:3000/update?email=ejemplo@gmail.com
    const email = req.query.email;


    const getContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email&properties=email,favorite_book`;
    const headers = {
        Authorization: `Bearer ${private_app_token}`,
        'Content-Type': 'application/json'
    }

    try {

        const response = await axios.get( getContact, { headers } );
        const data = response.data;

        res.render('update', { userEmail: data.properties.email, favoriteBook: data.properties.favorite_book })

    } catch (error) {
        console.log(error);
    }
});

app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }
    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${private_app_token}`,
        'Content-Type': 'application/json'
    }

    try {
        await axios.patch(updateContact, update, { headers })
        res.redirect('back');
    } catch (error) {
        console.log(error);
    }


})

app.listen(3000, () => console.log('Listening on http://localhost:3000'));