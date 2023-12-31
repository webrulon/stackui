import React, { useRef } from "react";
import posthog from 'posthog-js'
import { useState, useEffect, useCallback } from "react";
import LoadingScreen from "../../LoadingScreen";
import FileHistoryPopUp from "./History/FileHistoryPopUp";
import DropdownFileOptions from "./Components/DropdownFileOptions";
import FileHistoryList from "./History/FileHistoryList";
import path from 'path'
import CloseIcon from '@mui/icons-material/Close';
import MultiSeq2SeqViz from "./MultiSeq2SeqViz";
import md5 from 'md5'

const MultiSeq2SeqPopup = (props) => {

    const [popup, setPopup] = useState<Boolean>(false)

    const [compare, setCompare] = useState<Boolean>(false)
    const [loading, setLoading] = useState<Boolean>(false)
    const [version, setVersions] = useState([{version: 'loading...', date: 'loading...',commit: 'loading...'}])
    const [Nversion, setNVersions] = useState<number>(0)
    const [dataComp, setDataComp] = useState<any>(null)

    const currentKey = useRef<string>('')

    const enableLRshortcut = useRef(true)
    const [submit, setSubmit] = useState<Boolean>(false)
    const [newLabels, setnewLabels] = useState({keyid: props.keyId})

    const handleDelete = async () => {
        setLoading(true)
        await fetch('http://localhost:8000/remove_key?key='.concat(props.keyId))
        window.location.reload();
        return true
    }

    const handleFullDelete = async () => {
        setLoading(true)
        await fetch('http://localhost:8000/full_remove_key?key='.concat(props.keyId))
        window.location.reload();
        return true
    }

    const submitLabels = () => {
        if (submit){
            setLoading(true)
            props.setFiltering('w')
            const data = JSON.stringify(newLabels)
            fetch('http://localhost:8000/set_labels/', {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/json" 
                }, 
                body: data}
            ).then(
                (res) => {
                    setLoading(false)
                    fetch('http://localhost:8000/commit_req?comment='.concat(`fixed annotation on ${newLabels['keyId']}`)).then(
                        () => {
                            setSubmit(false)
                            posthog.capture('Submitted a commit', { property: 'value' })
                            setLoading(false)
                            props.setFiltering('z')
                            props.setKeyId(md5(''.concat(...newLabels['label']['keys'])) as string)
                        }
                    )
                }
            )
        }
    }


    const handleKeyPress = useCallback(async (event) => {
        if(!event.shiftKey && enableLRshortcut.current){
            if (event.key == 'ArrowLeft') {
                fetch('http://localhost:8000/get_prev_key?key='.concat(props.keyId))
                .then((res) => res.json()).then(
                    (res) => props.setKeyId(res.key)
                )
            } else if (event.key == 'ArrowRight') {
                fetch('http://localhost:8000/get_next_key?key='.concat(props.keyId))
                .then((res) => res.json()).then(
                    (res) => props.setKeyId(res.key)
                )
            }
        }

        if(event.ctrlKey){
            if(event.key == 's'){
                submitLabels()
            }
        }
    }, [props, enableLRshortcut])

    useEffect(() => {
        const fetchData = async () => {
            setDataComp([<MultiSeq2SeqViz key={'nervz'} admin={true} enableLRshortcut={enableLRshortcut} setKeyId={props.setKeyId} loading={loading} label_version={'current'} keyId={props.keyId} setnewLabels={setnewLabels} setSubmit={setSubmit}/>])            
        }

        const fetchVersions = () => {
            fetch('http://localhost:8000/key_versions?key='.concat(props.keyId).concat('&l=4&page=0'))
            .then((data) => data.json()).then((res) => {
                setVersions(Object.values(res.commits))
                setNVersions(res.len)
            })
        }

        const fetchStuff = async () => {
            await fetchData()
            fetchVersions()
        }

        if(props.keyId != currentKey.current){
            fetchStuff()
            setSubmit(false)
            currentKey.current = props.keyId
        }


        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        }

    }, [props, props.keyId, handleKeyPress, loading])
    
    const Versionspopup = popup ? [
        <>
            <FileHistoryPopUp schema={props.schema} keyId={props.keyId} setPopup={setPopup} popup={popup}/>
        </>
    ] : [<></>]

    const Diffpopup =  compare ? [
        <>
            {/* <QADiffPopup schema={props.schema} enableLRshortcut={enableLRshortcut} keyId={props.keyId} setPopup={setCompare} popup={compare} dates={version} len={Nversion}/> */}
        </>
    ] : [<></>]

    return (
        <>  
            {
                <button key={'ccb'} onClick={() => {
                    props.shortcuts.current = true
                    props.setPopup(false)
                    }} className="z-[39] bg-black/50 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen  h-screen">
                    click to close
                </button>
            }
            <div className="text-sm z-40 dark:bg-gray-900 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white w-[90%] h-[80%]">
                <div className="w-full justify-between items-center flex h-8">
                    <div className="py-1 px-2">
                        <button onClick={() => {
                            props.shortcuts.current = true
                            props.setPopup(false)
                            }} className='text-xs items-center flex justify-center text-gray-800 w-4 h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'>
                            <CloseIcon className="invisible hover:visible w-3 h-3"/>
                        </button>
                    </div>
                     
                    <div className="place-self-center py-2 font-bold w-full h-8 text-clip overflow-hidden">
                        {'Title: '} {path.basename(props.keyId)}
                    </div>

                    <div>
                    </div>
                </div>
                <div className="text-xs flex flex-col h-full font-body rounded-lg 
                        text-gray-900 bg-white
                        dark:bg-gray-900 dark:text-white px-1">
                    <div className="flex flex-col h-[90%]">
                        {
                            dataComp
                        }
                        {/* <div className="w-[300px]">
                            <div className="flex justify-center">
                                <DropdownFileOptions setHistory={setPopup} handleDelete={handleDelete} handleFullDelete={handleFullDelete}/>
                            </div>
                            {
                                <FileHistoryList key={'FileHist'} keyId={props.keyId}/>  
                            }
                        </div> */}
                    </div>
                    <div className="flex w-full h-[10%]">
                        <div className="flex justify-center mt-4 w-[66%]">
                            <button onClick={() => {setPopup(true); enableLRshortcut.current = false; posthog.capture('Viewed datapoint history popup', { property: 'value' })}} className="h-min text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> 
                                See History 
                            </button>
                            <button onClick={() => {setCompare(true); enableLRshortcut.current = false; posthog.capture('Viewed datapoint compare popup', { property: 'value' })}} className="h-min text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"> 
                                Compare versions
                            </button>

                            {/* <button onClick={()=>{}} className={"h-min focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"}>
                                Auto annotate
                            </button> */}
                        </div>
                        <div className="w-[34%] flex justify-center mt-4"> 
                            {
                                submit ? 
                                <button key={'cmit_button_1'} onClick={() => submitLabels()} className="z-10 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    {(true) ? 'Commit changes' : 'Submit changes'}  
                                </button>
                                : 
                                <button key={'cmit_button_2'} className="z-10 text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:border-gray-700 hover:cursor-not-allowed" disabled={true}>
                                    {(true) ? 'Commit changes' : 'Submit changes'}  
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {Versionspopup}
            {Diffpopup}
            {
                loading ? <LoadingScreen  key={'lscpp'}/> : null
            }
        </>)
}

export default MultiSeq2SeqPopup;