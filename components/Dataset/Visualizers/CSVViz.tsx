import { usePapaParse } from 'react-papaparse';
import React from 'react';

const CsvViz = (props) => {
    const {readString} = usePapaParse()
    const array: Array<any> = readString(props.data).data
    array.pop()

    return (
        <div className="h-[500px] overflow-scroll dark:text-white">
            <div className="p-1 flex border border-gray-500 gap-2">
                <button className="p-1 w-7 h-7 rounded-full bg-gray-300" onClick={() => props.setRow(Math.max(0,props.row-1))}> {' U '} </button>
                <div className="p-1"> row {props.row+1}-{Math.round(props.csv_metadata.rows)+1} </div>
                <button className="p-1 w-7 h-7 rounded-full bg-gray-300" onClick={() => props.setRow(Math.min(Math.round(props.csv_metadata.rows),props.row+1))}> {' D '} </button>
                
                <button className="p-1 w-7 h-7 rounded-full bg-gray-300" onClick={() => props.setCol(Math.max(0,props.col-1))}> {' L '} </button>
                <div className="p-1"> col {props.col+1}-{Math.round(props.csv_metadata.cols)+1} </div>
                <button className="p-1 w-7 h-7 rounded-full bg-gray-300" onClick={() => props.setCol(Math.min(Math.round(props.csv_metadata.cols),props.col+1))}> {' R '} </button>
            </div>
            <div className="overflow-scroll">
                {
                    array.map( (row) =>
                        <tr key={`rw-${row}`} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'> 
                            {
                                row.map(
                                    (val) =>
                                    <td key={`rw-${row}-cl-${val}`} className='py-4 px-6'>
                                        <div className='overflow-scroll h-[35px] w-[68.5px]'>
                                            {val}
                                        </div>   
                                    </td>
                                )
                            }            
                        </tr>
                    )
                }
            </div>
        </div>
    )
}

export default CsvViz