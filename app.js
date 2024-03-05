'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongodb = require('./config/mongodb');
const errorHandler = require('./error_handler')
const outputRenderer = require('./output_renderer');


// routers
const signUpRouter = require('./routes/user/index');
const expenseRouter = require('./routes/expense/index');
const simplificationRouter = require('./routes/simplify/index');
const paymentRouter = require('./routes/payment/index');
const groupRouter = require('./routes/group/index');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));


app.use(signUpRouter);
app.use(expenseRouter);
app.use(simplificationRouter);
app.use(paymentRouter);
app.use(groupRouter);



app.use(errorHandler);
app.use(outputRenderer);


const PORT = process.env.PORT || 3000;

// start the server
app.listen(PORT, async () => {
    let mongooseConnectionString = mongodb.host;

    await mongoose.connect(mongooseConnectionString);

    console.log("Server listening on port 3000");

});
