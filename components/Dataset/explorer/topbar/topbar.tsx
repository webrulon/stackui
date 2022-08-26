import { useState } from "react";

function commit(comment: string){
    fetch('http://127.0.0.1:8000/commit_req?comment='.concat(comment))
    return refresh()
}

function refresh(){
    window.location.reload(false);
    return true
}

const TopBar = (props) => {

    const [txt, setText] = useState('')

    const handleChange = (event) => {
        setText(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        props.fcn(txt)
    }
    
    return (    
        <div className="flex w-full justify-between ">
            <div className="pr-10 py-2 w-min">
                <div className="px-2 py-2 text-lg text-bolder"> {props.props.dataset} </div>
                <div className="px-2 py-2 text-sm underline"> 
                    <a href={props.props.URI}> {props.props.URI} </a>
                </div>
            </div>
            <div className="flex">
                <div className="flex grid-cols-3 gap-2 mt-6">
                    <button onClick={()=>refresh()} className="h-10 flex flex-col justify-center bg-gray-200 text-sm px-2 rounded-md hover:bg-gray-400" > refresh
                    </button>

                    <button onClick={()=>commit('')} className="h-10 flex flex-col justify-center bg-gray-200 text-sm px-2 rounded-md hover:bg-gray-400" > commit
                    </button>
                    
                    <button className="h-10 flex flex-col justify-center bg-gray-200 text-sm px-2 rounded-md hover:bg-gray-400" > add
                    </button>
                </div>
                <div className="w-full py-6 text-black inline-block align-middle">
                    <form className="px-5" onSubmit={handleSubmit}>
                        <label className="flex justify-end gap-2"> 
                            <div className="">
                                <input onChange={handleChange}
                                className= "p-2 shadow-inner border rounded-dm border-gray-200 outline-2 bg-white dark:bg-gray-500" 
                                placeholder="Filter" type="text" />   
                            </div>
                            <input className="bg-gray-200 text-sm px-2 rounded-md hover:bg-gray-400" type="submit"/>
                        </label> 
                    </form> 
                </div>
            </div>
        </div>
    )
}

export default TopBar;