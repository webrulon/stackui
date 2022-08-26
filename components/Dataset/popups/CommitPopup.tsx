import { useState, useEffect } from "react";
import ItemChange from "../infobar/ItemChange";


function generateButtons(page, max_pages, setPage){
    var listofButtons = []
    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-md p-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(Math.max(page-1,0))}>
                {'<'}
            </button>
        </div>
    )

    listofButtons.push(
        <div>
            Page {page}
        </div>
    )

    listofButtons.push(
        <div  className="flex">
            <button className=" bg-gray-200 rounded-md px-2 shadow-sm dark: text-black hover:bg-gray-300" onClick={() => setPage(Math.min(page+1|0))}>
                {'>'}
            </button>
        </div>
    )

    console.log(listofButtons)

    return listofButtons
}

const CommitPopup = (props) => {

    const [changes, setChanges] = useState([])
    const [page, setPage] = useState(0)
    const [buttons, setButtons] = useState([])
    const max_commits = 8
    const [max_pages, setMaxPages] = useState(0)

    useEffect(() => {
        if (props.popup){
            fetch('http://127.0.0.1:8000/commits_version?n='.concat(props.version).concat('&l=8&page=').concat(page)).then((response) => response.json()).then((data) => setChanges(Object.values(data))).then(() => {
                setMaxPages(Object.keys(changes).length/max_commits)
                setButtons(generateButtons(page, max_pages, setPage))
            });
        }
    }, [])

    console.log(changes)


    if (props.popup == 0) {
        return <div></div>
    } else {
    return (
    
    <div className="text-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md bg-white dark:bg-gray-400 w-[1100px]  h-[700px]">
        <div className="w-full justify-between flex">
            <button onClick={() => props.setPopup(0)} className= 'place-self-center justify-self-start w-[50px] h-[30px] flex-col bg-red-200 hover:bg-red-400 p-2 rounded-br-md'> x </button> 
            <div className="place-self-center py-2 font-bold">
                Commit {props.version}
            </div>
            <div></div>
        </div>
        <ul className="text-xs font-medium rounded-lg border 
                text-gray-900 bg-white border-gray-200
                  dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {changes.filter((item, index) => index < max_commits*(page+1) && index > max_commits*(page)).map((cmit) => <ItemChange author={cmit.source} comment={cmit.comment} date={cmit.date}/>)}
        </ul>
        <div className="flex justify-evenly mt-5">
            {buttons}
        </div>
    </div>)}
}

export default CommitPopup;