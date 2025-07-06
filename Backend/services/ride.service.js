const rideModel = require('../models/ride.model');
const mapService = require('./map.service.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function getFare(pickup, destination) 
{
    if (!pickup || !destination) 
    {
        throw new Error('Pickup and destination are required');
    }
    
    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    // O/P: returns an object of below data:
    // {"distance":{"text":"147 km","value":147237},"duration":{"text":"2 hours 30 mins","value":9014},"status":"OK"}
    console.log(distanceTime);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };


    const fare = {
        auto: baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto),
        car: baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car),
        moto: baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto)
    };

    return fare;
}


function getOtp(num) 
{
    function generateOtp(num) 
    {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


module.exports.createRide = async ({ userId, pickup, destination, vehicleType }) => 
{
    if (!userId || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    // returns an object of fares of each vehicle type
    const fare = await getFare(pickup, destination);

    console.log(fare);

    const ride = rideModel.create({
        user: userId,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[ vehicleType ]
    })

    return ride;
}