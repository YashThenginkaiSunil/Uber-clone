import React from 'react'

const LocationSearchPanel = (props) => {


    // sample array for location 
    const locations = [
        " BDA Complex, 4th Block, Jayanagar, Bangalore",
        " Kaapi Katte, BEML Road, RR Nagar, Bangalore ",
        " Jspiders, 6th Block, Rajajinagar, Bangalore ",
        "Forum South, Konankunte Cross, Kanakpura Road, Bangalore",
    ]

    return (
        <div>
            {/* this is just a sample data  */}
            {
                locations.map(function (item, idx) 
                {                                    // vehicle panel will come up TranslateY(0) | panel will become false and go down to 0%
                    return <div key={idx} onClick={() => { props.setVehiclePanel(true) ; props.setPanelOpen(false) }}
                        className='flex gap-4 border-2 p-3 border-gray-200 active:border-black rounded-xl items-center my-2 justify-start'>

                            {/* pin logo */}
                        <h2 className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'><i className="ri-map-pin-fill"></i></h2>

                        {/* display location item */}
                        <h4 className='font-medium'>{item}</h4>
                    </div>
                })
            }

        </div>
    )
}

export default LocationSearchPanel