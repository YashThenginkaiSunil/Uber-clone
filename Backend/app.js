const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db.js');
const userRoutes = require('./routes/user.routes.js')
const captainRoutes = require('./routes/captain.routes.js');
const mapRoutes = require('./routes/map.routes.js')
const rideRoutes =  require('./routes/ride.routes.js')

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.get('/', (req, res) => 
    {
        res.send('Hello World');
    });

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapRoutes)
app.use('/rides', rideRoutes)

module.exports = app;