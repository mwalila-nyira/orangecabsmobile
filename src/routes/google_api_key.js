const apiKey = "AIzaSyB-1SZLcvFN_cxb2HXrmtf7EhfA2O94SUs";

module.exports = apiKey;

// module.exports = {
//     // google maps api key
//     Key: "AIzaSyB-1SZLcvFN_cxb2HXrmtf7EhfA2O94SUs",
    
//    //google place autocomplete apiKey
//    googlePlaceAutocompleteApi: (lat, lng, destination,apiKey) => {
//        return `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${destination}&location=${lat},${lng}&radius=2000`
//    },
   
//    // google direction api
//    googleDirectionApi: (lat, lng, destinationPlaceId,apiKey) => {
//        return `https://maps.googleapis.com/maps/api/directions/json?origin=${lat},${lng}&destination=place_id:${destinationPlaceId}&key=${apiKey}`
//    }
// };