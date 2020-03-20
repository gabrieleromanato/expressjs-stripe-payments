'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 3000;
const { secretKey } = require('./config');
const stripe = require('stripe')(secretKey);

app.disable('x-powered-by');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(helmet());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/checkout', async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: 'eur',
            metadata: {integration_check: 'accept_a_payment'},
        });
        res.json({ clientSecret:  paymentIntent.client_secret });
    } catch(err) {
        res.json(err);
    }
});


app.listen(port);