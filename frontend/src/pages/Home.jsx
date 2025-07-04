import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';

const Home = () => 
{
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')

    const [panelOpen, setPanelOpen] = useState(false)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)

    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseButtonRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)

    const submitHandler = (e) => {
        e.preventDefault()
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
                transform: 'translateY(0)'   // If true, come up ; If false, go down
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'  // positive value Moves it down w.r.t Y-axis
            })                                  // negative value Moves it up w.r.t Y-axis
        }
    }, [confirmRidePanel])

//-----------------------------------------------------------------------------------------------------------

useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
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
      //overflow-hidden:	Prevents content from overflowing visually — anything spilling outside won’t be shown
      <div className='h-screen relative overflow-hidden'>


            {/* uber logo */}
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />


            {/* for background Map, takes full  screen size */}
            <div className='h-screen w-screen'>
                {/* Map image for temporary use  */}

                {/* h-full:	Sets height to 100% of its parent element’s height (100%) */}
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
            </div>

             {/* full screen */}
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
                            onClick={() => { setPanelOpen(true) }}
                            value={pickup}
                            onChange={(e) => { setPickup(e.target.value) }}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => { setPanelOpen(true) }}
                            value={destination}
                            onChange={(e) => { setDestination(e.target.value) }}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                </div>

                {/* choose a location panel when above panel comes up  */}
                 {/* refs are added in order to target them in gsap, used as alernative to 'id' here */}
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel} />
                </div>
            </div>

              {/* translate-y-full :- shifts the element downward by 100% of its height. SAME AS: transform: translateY(100%);  z-10: z-index:10 so tht it comes on top of above panel(find a trip panel) */}
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>

            {/* confirm your ride panel */}
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>

            {/* looking for vehicle panel */}
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver setVehicleFound={setVehicleFound} />
            </div>


            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                <WaitingForDriver  waitingForDriver={waitingForDriver} />
            </div>


        </div>
    )
}

export default Home