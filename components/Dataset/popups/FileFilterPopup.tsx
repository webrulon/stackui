import React, { useEffect, useRef, useState } from "react"
import BranchPopup from "./BranchPopup"
import posthog from 'posthog-js'
import LoadingScreen from "../../LoadingScreen"

const FileFilterPopup = (props) => {

    const [branch, setBranch] = useState(false)

    const [filtering, setFiltering] = useState(false)

    const [time, setTime] = useState(true)

    // weird hack to make the checkboxes actually change state, otherwise state remains the same
    // TODO
    const [nullStr, setnullStr] = useState('')

    useEffect( () => {
        if (time){
            setTime(false)
        } else {
        }
    }, [nullStr])


    const handleApplyFilter = async () => {
        props.setFiltering('y')

        var filters = {}
        var idx = 0

        filters[idx] = {
            'name': props.txt
        }

        const data = JSON.stringify(filters)

        await fetch('http://localhost:8000/set_filter/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
        )

        
        posthog.capture('Applied filter', { property: 'value' })
    
        props.setFiltering('z')
    }

    const handleResetFilter = async () => {
        await fetch('http://localhost:8000/reset_filter/')
        .then(() => props.setFiltering('w')).then(
            () =>{
                setnullStr('b')
            }
        )
    }

    const wait = filtering ? [<LoadingScreen key={'lds_fpp'}/>] : [<></>]
    const branch_popup = branch ? [<BranchPopup key={'brpp'} setPopup={setBranch}/>] : [<></>]

    return (
        <>
            {wait}
            {branch_popup}
            <div key={"flterpp"} className="bg-whites rounded-lg dark:bg-slate-900 w-full h-[100px] border-[0.5px] border-gray-500">
                <div className="w-full justify-between flex h-[30px]">
                <div className="py-1 px-2">
                        <button onClick={() => props.setPopup(0)} className='text-xs px-1 w-[15px] h-[15px] flex-col bg-red-400 hover:bg-red-200 rounded-full'></button>
                    </div>
                </div>

                <div className="flex justify-around">
                    <div className="px-5 py-4 justify-start">
                        <button onClick={() => setBranch(true)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Branch
                        </button>
                    </div>
                    <div className="px-5 py-4 flex justify-end gap-2">
                        <button onClick={() => handleResetFilter()} className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                            Reset
                        </button>
                        <button onClick={() => handleApplyFilter()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FileFilterPopup