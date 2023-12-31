import { data } from "autoprefixer";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import DropdownVersion from "../Components/DropdownVersion";

const stringToColour = (str: string) => {
    var hash = 0;

    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }

    return colour;
}

const fetchData = async (keyId, setD, setSelected, setSentence) => {
    fetch(`http://localhost:8000/get_text?key=${keyId}`)
    .then((res) => res.json())
    .then((res) => {setSentence(res['text'])})
    
    fetch(`http://localhost:8000/get_label_per_user?key=${keyId}`)
    .then((res) => res.json())
    .then((res) => {
        setD(res);
        setSelected(Array(res.length).fill(false))
    })
}

const approveLabel = async (keyId,label, setLoading) => {
    setLoading(true)
    const newLabels = {'keyId': keyId, 'label': label}
    const data = JSON.stringify(newLabels)
    await fetch('http://localhost:8000/set_labels/', {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json" 
        }, 
        body: data}
    ).then((res) => {
        fetch(`http://localhost:8000/reset_label_per_user?key=${keyId}`)
    })
    setLoading(false)
    setLoading(true)
    await fetch('http://localhost:8000/commit_req?comment='.concat(`Approved annotation on ${newLabels['keyId']}`))
    setLoading(false)
}

const NERAnnotators = (props) => {

    const [d, setD] = useState<any>(null)
    const [selected, setSelected] = useState<any>(null)
    const [label, setLabel] = useState<any>(null)
    const [sentence, setSentence] = useState<String>('');

    console.log(d)

    useEffect( () => {

        const fetchStuff = async (keyId, setD, setSelected, setSentence) => {
            await fetchData(keyId, setD, setSelected, setSentence)
        }
        fetchStuff(props.keyId, setD, setSelected, setSentence)
    },[props.keyId, props.popup])

    return (
        <div className="text-sm z-[200] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-[0.5px] border-gray-500 rounded-lg bg-white dark:bg-gray-900 w-[1100px] h-[600px]">
            <div className="w-full justify-between h-8 flex p-2">
                <button onClick={() => {
                    props.setPopup(false)
                    }} className='text-xs items-center flex justify-center text-gray-800 w-4 h-4 flex-col bg-red-400 hover:bg-red-200 rounded-full'>
                    {/* <CloseIcon className="invisible hover:visible w-3 h-3"/> */}
                </button>
                <div className="place-self-center py-2 font-bold">
                    File: {props.keyId}
                </div>
                <div></div>
            </div>
            <div className="w-full h-[500px] flex flex-col justify-between items-center">
                <div className=" font-medium mt-2">
                    {'Submitted labels:'}
                </div>
                <div className="justify-center items-center w-1/2 h-[400px] border border-gray-300 rounded-md flex flex-col gap-2 overflow-y-scroll">
                    {
                        (d) ? 
                        d.map(
                            (datapoint, idx) => {
                                
                                
                                var updated_labels = datapoint.label.label

                                console.log(datapoint)
                                
                                var order: Array<any> = []
                                var array_spans: Array<any> = []

                                updated_labels = updated_labels.sort((a, b) => {
                                    if(a.start > b.start){
                                        return 1;
                                    } else {
                                        return -1;
                                    }
                                })
                                
                                var start = 0

                                var x: Array<any> = Array(0)
                                for (var j = 0; j < updated_labels.length; j++){
                                    if (updated_labels[j].start <= 1 && updated_labels[j].end > 0){
                                        x.push(j)
                                    }
                                }

                                var entities_per_index: Array<any> = [x]
                                var chars: Array<any> = [sentence[0]]
                        
                                for(var i = 1; i < sentence.length; i++){
                                    if (updated_labels.map((val) => (val.end == i)).includes(true)) {
                                        order.push(sentence.slice(start, i).replace(/ /g,'\u00A0'));
                                        start = i;
                                    } else if (updated_labels.map((val) => (val.start == i+1)).includes(true)){
                                        order.push(sentence.slice(start, i).replace(/ /g,'\u00A0'));
                                        start = i;
                                    } else if (i == sentence.length - 1){
                                        order.push(sentence.slice(start, i+1).replace(/ /g,'\u00A0'));
                                    }
                        
                                    var x: Array<any> = Array(0)
                                    for (var j = 0; j < updated_labels.length; j++){
                                        if (updated_labels[j].start <= i + 1 && updated_labels[j].end > i){
                                            x.push(j)
                                        }
                                    }
                                    entities_per_index.push(x)
                                    chars.push(sentence[i])
                                }
                                
                                start = 0
                                for(var i = 0; i < order.length; i++){
                                    const idx_1 = i
                                    var child: any = [<span key={`child${idx_1}--1`} className="w-max flex justify-start items-center h-min text-base cursor-text"> {order[idx_1].replace(/ /g,'\u00A0')} </span>]
                                    
                                    start = (start >= entities_per_index.length) ? entities_per_index.length - 1 : start
                        
                                    for(var j = 0; j < entities_per_index[start].length; j++){
                                        const idx_2 = j
                                        const entity_type = updated_labels[entities_per_index[start][idx_2]]['type']
                        
                                        child = [
                                            <button key={`child${idx_1}-${idx_2}`}  className="w-max relative bg-white flex justify-start" style={{ backgroundColor: `${stringToColour(entity_type)}22`, border: `1px solid ${stringToColour(entity_type)}AA`}}>
                                                {child}
                                            </button>
                                        ]
                                    }
                                    start = start + order[i].length
                                    array_spans.push(child)
                                }
                                
                                return (
                                    <div key={`res ${datapoint['user']}`} className={selected[idx] ? "w-full justify-center items-center flex flex-col bg-blue-100" : "w-full justify-center items-center flex flex-col"}>
                                        <div className="p-2 h-[10%] mb-2 items-center justify-center flex w-full font-semibold">
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">New</span>
                                        </div>
                                        <div className="w-[500px] h-12 rounded-md dark:text-black text-center flex gap-2 justify-center">
                                            <div className="inline-flex items-center justify-center w-16 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                                <span className="font-medium text-gray-600 dark:text-gray-300">{datapoint['user'].slice(0, 2)}</span>
                                            </div>
                                            <div className="border-gray-300 border dark:text-white bg-gray-50 dark:bg-gray-800 rounded-md p-2 h-fit overflow-scroll items-center justify-start flex w-full font-normal">
                                                {array_spans}
                                            </div>
                                            <button type="button" onClick={() => {
                                                setLabel(datapoint['label']['label']); 
                                                var arr = Array(d.length).fill(false)
                                                arr[idx] = true
                                                setSelected(arr)
                                                }} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Select</button>
                                        </div>
                                    </div>
                                )
                            }
                        )
                        : null
                    }
                </div>
                <button type="button" onClick={() => {approveLabel(props.keyId, label, props.setLoading); props.setPopup(false); window.location.reload()}} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Approve</button>
            </div>
        </div>
    )
}

export default NERAnnotators;