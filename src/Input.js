import React, { useState, useRef } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

function Input() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);

    const [random, setRandom] = useState(null);
    const getRandom = (len) => {
        const min = 0;
        const max = len;
        const rand = Math.floor(min + Math.random() * (max - min)); // Ensures an integer
        setRandom(rand); // Update the state with the random number
    };
    
    let allResults = [];
    const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

    const inputref = useRef(null)
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey:googleMapsApiKey,
        libraries : ['places']
      })

    const handleonPlacesChange = () => {
        const place = inputref.current.getPlaces()[0]; // Assuming you have the place from the autocomplete

        if (place && place.geometry && place.geometry.location) {
        const latitude = place.geometry.location.lat();  // Use the lat() function
        const longitude = place.geometry.location.lng(); // Use the lng() function
        nearbySearch(latitude, longitude);
        }
    }

    const nearbySearch = (lat, lng) => {
        setLoading(true);
        const location = new window.google.maps.LatLng(lat, lng);
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));

        const request = {
            location: location,
            radius: 10000, // 10 km search radius
            type: ['restaurant'], // We're only looking for restaurants
        };

        service.nearbySearch(request, (results, status, pagination) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                allResults = [...allResults, ...results]; // Store the current page of results

                if (pagination && pagination.hasNextPage) {
                    // If there are more results, fetch the next page
                    setTimeout(() => {
                        pagination.nextPage(); // Call the next page after a short delay
                    }, 2000);
                   
                } else {
                    // No more pages, update the state with all results
                    setRestaurants(allResults);
                    console.log('All Restaurants:', allResults);
                    setLoading(false);
                }
            }
            else {
                // If there's an error or no results, stop loading
                setLoading(false);
            }
           
        });
    };
    
    
  return (<>

    <div class="w-full max-w-sm min-w-[200px]">
            {isLoaded && 
             <StandaloneSearchBox
             onLoad={(ref) => inputref.current = ref}
             onPlacesChanged={handleonPlacesChange}
             options={{
                types: ['(cities)'], // Restrict autocomplete to cities
              }}
           >
           
          <input class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" placeholder="Type here..."/>
         </StandaloneSearchBox>
        } 
        </div>

        {/* Show loader when loading */}
        {loading && 
<div role="status">
    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div>
}
    <button onClick={() => getRandom(restaurants.length)}>
        Click me
    </button>

    
        {/* Display restaurants */}
        {random !== null && restaurants.length > 0 && (
    <div>Random Restaurant: {restaurants[random]?.name}</div>
)}

  
  </>
  )
}

export default Input