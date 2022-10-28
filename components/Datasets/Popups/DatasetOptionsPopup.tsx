import React, { useEffect } from "react";
import { useState } from "react";
import FormData from "form-data";
import DropdownSchema from "../../Dataset/Items/DropdownSchema";
import LoadingScreen from "../../LoadingScreen";
import posthog from 'posthog-js'

const DatasetOptionsPopup = (props) => {

    const [uri , setURI ] = useState(props.dataset.storage)
    const [name, setName] = useState(props.dataset.name)
    
    const [loading, setLoading] = useState(false)
    const [schema, setSchema] = useState('Loading...')
    const [accessKey, setAccessKey] = useState('NoKey')
    const [secretKey, setsecretKey] = useState('NoKey')
    const [region, setRegion] = useState('NoRegion')

    useEffect(()=>{
        setLoading(true)
        fetch('http://localhost:8000/connect/?uri='.concat(encodeURIComponent(props.dataset.storage))).then(
            () => {
                fetch(`http://localhost:8000/schema/`).then((response) => response.json())
                .then((res) => setSchema(res.value)).then(() => setLoading(false))
            }
        )
        
    },[])

    const handleKey1Change = (event) => {
        setAccessKey(event.target.value)
    }

    const handleKey2Change = (event) => {
        setsecretKey(event.target.value)
    }

    const handleKey3Change = (event) => {
        setRegion(event.target.value)
    }
    
    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const handleURIChange = (event) => {
        setURI(event.target.value)
    }

    const handleSubmit = async () => {    
        if (uri.length > 0){
            setLoading(true)
            const data = JSON.stringify({"uri": uri, "name": name,"key1": accessKey, "key2": secretKey, "key3": region, "schema": schema})
            
            await fetch('http://localhost:8000/init_web/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
            )
            
            posthog.capture('Updated a dataset', { property: 'value' })
            setLoading(false)
            window.location.href='/Datasets';

        }
    }

    const handleFileChange = async (e) => {
        const data = new FormData();
        data.append(
            "file",
            e.target.files[0],
            e.target.files[0].name
        )
        await fetch('http://localhost:8000/init_gskey/', 
            {
                method: 'POST',
                body: data
            }
        )
    }

    const CloseComponent = [
        <button key={'ccdo'} onClick={() => props.setPopup(0)} className="bg-transparent backdrop-blur-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
        click to close
        </button>
    ]

    const awsKeys = (props.dataset.storage.includes('s3://')) ? [
        <div key={'awk'}>
            <form className="bg-white shadow-md rounded w-[320px]">
                <label className="block text-gray-700 text-base mt-2"> 
                    <div className="">
                        AWS Access Key Id:
                        <input onChange={handleKey1Change} onInput={handleKey1Change}
                        className= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="***********" type="password" />   
                    </div>
                </label>
            </form>

            <form className="bg-white shadow-md rounded w-[320px] mt-2">
                <label className="block text-gray-700 text-base"> 
                    <div className="">
                        AWS Secret Access Key:
                        <input onChange={handleKey2Change}  onInput={handleKey2Change}
                        className= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="***********" type="password" />   
                    </div>
                </label>
            </form>

            <form className="bg-white shadow-md rounded w-[320px] mt-2">
                <label className="block text-gray-700 text-base"> 
                    <div className="">
                        AWS Region
                        <input onChange={handleKey3Change} onInput={handleKey3Change}
                        className= "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                        placeholder="**********" type="password" />   
                    </div>
                </label>
            </form>
        </div>
    ] : [<></>]

    const gsKeys = (props.dataset.storage.includes('gs://')) ? [
        <div className="w-[400px]" key={'gck'}>
            <form className="flex justify-center p-2">
                    <label className="p-2 flex flex-col justify-center items-center w-full h-[200px] bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                            <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <p className="mb-2 text-base text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> upload key file from GS </p>
                        </div>
                        <input onChange={handleFileChange} onInput={handleFileChange} id="dropzone-file" type="file" className="hidden" />
                    </label>
                </form>
        </div>
    ] : [<></>]

    const LoadingComp = loading ? [<LoadingScreen msg={'Setting up'}  key={'ldcO'}/>] : [<></>]

    return (
        <>
            {CloseComponent}
            <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-900 w-[1100px]  h-[700px]">
                <div className="w-full justify-between flex">
                    <button onClick={() => props.setPopup(false)} className= 'place-self-center justify-self-start w-[50px] h-[30px] flex-col bg-red-400 hover:bg-red-200 p-2 rounded-br-md'> x </button> 
                    <div className="place-self-center py-2 font-bold">
                        Dataset Options
                    </div>
                    <div></div>
                </div>
                
                <div className="flex justify-center "  key={'ip'}>
                    <div className="p-5 mt-5 mb-5 w-[1000px] h-[600px] justify-start flex flex-col">    
                        
                        <div className="text-lg flex justify-center w-full">
                            Dataset name: 
                        </div>
                        
                        <div className="mb-2 flex justify-center w-full">
                            <form className="bg-white flex justify-center shadow-md rounded w-[500px]">
                                <label className="block text-gray-700 text-sm w-[500px]"> 
                                    <div className="w-[500px]">
                                        <input onChange={handleNameChange} onInput={handleNameChange}
                                        className= "shadow appearance-none text-lg border rounded w-[500px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        placeholder={props.dataset.name} type="text" />   
                                    </div>
                                </label>
                            </form>
                        </div>

                        <div className="text-lg mt-5 flex justify-center w-full">
                            Dataset path or URI: 
                        </div>

                        <div className="mb-5 flex justify-center">
                            
                            <form className="bg-white flex justify-self-center shadow-md rounded w-[500px]">
                                <label className="block text-gray-700 text-sm"> 
                                    <div className="">
                                        <input onChange={handleURIChange} onInput={handleURIChange}
                                        className= "shadow appearance-none text-lg  border rounded w-[500px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                        placeholder={props.dataset.storage} type="text" />   
                                    </div>
                                </label>
                            </form>
                        </div>

                        <div className="flex justify-center">
                            {gsKeys}
                            {awsKeys}
                        </div>

                        <div className="flex justify-center gap-5 mt-5">
                            <div className="flex flex-col">
                                <div className="flex justify-center">
                                    <DropdownSchema schema={schema} setSchema={setSchema} />
                                </div>
                                
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => props.setPopup(false)} className="w-[200px] h-[50px] hover:shadow-lg text-center transition p-2 bg-gray-400 font-thin text-white hover:bg-gray-500 hover:text-black">
                                        Cancel
                                    </button>
                                    <button onClick={() => handleSubmit()} className="w-[200px] h-[50px] hover:shadow-lg text-center transition p-2 bg-green-700 font-thin text-white hover:bg-green-800 hover:text-black">
                                        Update
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            {LoadingComp}
        </>
    )
}

export default DatasetOptionsPopup;