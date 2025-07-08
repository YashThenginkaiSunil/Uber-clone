const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) =>
{
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // BASE_URL: https://maps.googleapis.com/maps/api/geocode/json

    // encodeURIComponent(address): is a built-in JavaScript function that safely encodes a string so it can be used in a URL query parameter.
    // Certain characters like spaces, commas, ampersands (&), and question marks (?) have special meaning in URLs. If you don’t encode them, your URL might break or behave unexpectedly. 
    // So encodeURIComponent() replaces those characters with percent-encoded representations to keep the string intact and safe for transport.

     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    //  This also works:
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

    try 
    {
        const response = await axios.get(url);

        if (response.data.status === 'OK') 
        {
            
            console.log(response.data);
            console.log("--------------------------");
            console.log(response.data.results[0]);
            console.log("--------------------------");
            console.log(response.data.formatted_address);
            
            const location = response.data.results[ 0 ].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } 
        else 
        {
            throw new Error('Unable to fetch coordinates');
        }
    } 
    catch (error) 
    {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => 
{
    if (!origin || !destination) 
    {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // BASE URL: https://maps.googleapis.com/maps/api/distancematrix/json
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {


        const response = await axios.get(url);
        if (response.data.status === 'OK') 
        {
            console.log(response.data.rows[0]); //elements:[{distance:[Object],duration:[Object], status: 'OK'}]
            
            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') 
            {
                throw new Error('No routes found');
            }

            return response.data.rows[ 0 ].elements[ 0 ];
        } 
        else 
        {
            throw new Error('Unable to fetch distance and time');
        }

    } 
    catch (err) 
    {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => 
{
    if (!input) 
    {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // BASE URL: https://maps.googleapis.com/maps/api/place/autocomplete/json
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try 
    {
        const response = await axios.get(url);

        if (response.data.status === 'OK') 
        {
            console.log(response.data);
            
            return response.data.predictions  // array of autocomplete suggestions returned by the API.
                .map( (prediction) => prediction.description)
                .filter((value) => value); // Filters out any undefined, null, or empty string values.
                                            //Ensures the final array only contains valid descriptions.

            // return response.data.predictions.map( (prediction) => prediction.description)
        } 
        else 
        {
            throw new Error('Unable to fetch suggestions');
        }
    } 
    catch (err)
    {
        console.error(err);
        throw err;
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => 
{
    // radius in km
    // This line uses MongoDB’s geospatial query capabilities to find all captains within a certain radius of a point
    const captains = await captainModel.find({
        location: {
            $geoWithin: { // $geoWithin -->	Finds documents where location lies inside a defined area
                $centerSphere: [ [ ltd, lng ], radius / 6371 ] // $centerSphere -->	Defines a spherical area — takes center [lng, lat] and radius
            }
        }
    });

    // This will return a list of captain documents where their location falls inside that radius from the center point
    return captains;


}