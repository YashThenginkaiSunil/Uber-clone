import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';

const Home = () => 
{

    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')

    const [panelOpen, setPanelOpen] = useState(false)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)

    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseButtonRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)


    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => 
        {
            // sent to socket.js in backend
            socket.emit("join", { userType: "user", userId: user._id })

        }, [ user ])

    socket.on('ride-confirmed', (ride) => 
        {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
        })
    

    const vehicleImage={
        'car':"https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
        "moto":"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
        "auto":"https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

//-----------------------------------------------------------
    // onChange handler for Pickup Field 
    const handlePickupChange = async (e) => 
    {
        setPickup(e.target.value)

        try 
        {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, 
                {
                    params: { input: e.target.value },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })

            console.log(response.data);
            
            setPickupSuggestions(response.data)
        } 
        catch(err)
        {
            console.log(err);
        }
    }

//-----------------------------------------------------------
    // onChange handler for Destination Field
    const handleDestinationChange = async (e) => 
    {
        setDestination(e.target.value)

        try 
        {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, 
                {
                    params: { input: e.target.value },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })

            setDestinationSuggestions(response.data)
        } 
        catch(err)
        {
           console.log(err);
           
        }
    }

//-----------------------------------------------------------

    async function findTrip() 
    {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, 
            {
                params: { pickup, destination },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })

    // {'car':xxx,'moto':yyy,'auto':zzz}
        console.log(response.data)
        setFare(response.data)
    }

//-----------------------------------------------------------

    async function createRide() 
    {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, 
            {
                pickup,
                destination,
                vehicleType
            }, 
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })

        console.log(response.data)
    }

    //---------------------------------------------------------------------------------------------

    useGSAP(function () {
        if (panelOpen) {  //when panelOpen state is true
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseButtonRef.current, {
                opacity: 1 // arrow icon will be visible
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%', // goes back to its default height
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseButtonRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])

  //--------------------------------------------------------------------------------------------------------

    // transform: translateY(...)	: Moves the panel up or down vertically using CSS transforms
    // If true, animates the panel into view by moving it up to its original position (translateY(0)).
    // If false, slides the panel out of view vertically (translateY(100%)).
    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'  // If true, come up ; If false, go down
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)' // positive value Moves it down w.r.t Y-axis
            })                                // negative value Moves it up w.r.t Y-axis
        }
    }, [vehiclePanel])

  //---------------------------------------------------------------------------------------------------------

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)' , // // If true, come up ; If false, go down
                 
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)', // positive value Moves it down w.r.t Y-axis
                                    // negative value Moves it up w.r.t Y-axis
            })                                  
        }
    }, [confirmRidePanel])

//-----------------------------------------------------------------------------------------------------------

useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)',
                
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)',
               
            })
        }
    }, [vehicleFound])

//----------------------------------------------------------------------------------------------------

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
                
            })
        }
    }, [waitingForDriver])

//---------------------------------------------------------------------------------------------------

    return(
      //h-screen:	Sets height to 100% of the viewport height (100vh)
      //overflow-hidden: Prevents content from overflowing visually — anything spilling outside won’t be shown
      <div className='h-screen relative overflow-hidden'>


            {/* uber logo */}
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />


            {/* for background Map, takes full  screen size */}
            <div className='h-screen w-screen'>
                {/* Map image for temporary use  */}

                {/* h-full:	Sets height to 100% of its parent element’s height (100%) */}
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
            </div>

             {/* search panel in home screen*/}
            <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>

                {/* find a trip, add loc, dest */}
                <div className='h-[30%] p-6 bg-white relative'>

                    {/* for down arrow PANEL CLOSE BUTTON */}
                    {/* refs are added in order to target them in gsap, used as alernative to 'id' here */}
                    <h5 ref={panelCloseButtonRef} onClick={() => { setPanelOpen(false) }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-line"></i>
                    </h5>

                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => { submitHandler(e) }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => { setPanelOpen(true); setActiveField('pickup') }}
                            value={pickup}
                            onChange={ handlePickupChange } 
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => { setPanelOpen(true); setActiveField('destination') }}
                            value={destination}
                            onChange={handleDestinationChange } 
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>

                    {/* 'find trip' button, gets the fare prices of each vehicle */}
                    {/* Inside findTrip() setVehiclePanel(true)  setPanelOpen(false) */}
                    <button onClick={findTrip} className='bg-black text-white px-4 py-2 rounded-lg mt-5 w-full'>
                        Find Trip
                    </button>

                </div>

                {/* choose a location panel when above panel comes up  */}
                 {/* refs are added in order to target them in gsap, used as alernative to 'id' here */}
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions} 
                        setPanelOpen={setPanelOpen} 
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>

              {/* translate-y-full :- shifts the element downward by 100% of its height. SAME AS: transform: translateY(100%);  z-10: z-index:10 so tht it comes on top of above panel(find a trip panel) */}
            <div ref={vehiclePanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel 
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehiclePanel={setVehiclePanel} 
                    setVehicleType={setVehicleType}
                    fare={fare}
                    vehicleImage={vehicleImage}
                />
            </div>

            {/* confirm your ride panel */}
            <div ref={confirmRidePanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide 
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehicleFound={setVehicleFound}
                    setVehiclePanel={setVehiclePanel}
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType} 
                    vehicleImage={vehicleImage}
                />
            </div>

            {/* looking for vehicle panel */}
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver 
                    setVehicleFound={setVehicleFound}
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    vehicleImage={vehicleImage} 
                />
            </div>


            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                <WaitingForDriver  
                    waitingForDriver={waitingForDriver}
                    setWaitingForDriver={setWaitingForDriver} 
                    setVehicleFound={setVehicleFound}
                    ride={ride}
                />
            </div>


        </div>
    )
}

export default Home