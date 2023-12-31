import React, { useEffect, useReducer } from "react"
import { useRef } from "react"
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ImageError } from "next/dist/server/image-optimizer"
import { Tooltip } from "@mui/material"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DropdownVersionCoupled = (props) => {
    var options: Array<any> = []

    const renderButton = (version, len) => {
      if (version == len){
        return (
          <Menu.Button className="z-50 text-white h-10 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-body rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
            {props.label} {version}
          </Menu.Button>
        )
      } else {
        return (
          <Menu.Button className="z-50 py-2.5 px-5 mr-2 mb-2 h-10 text-sm font-body text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
            {props.label} {version}
          </Menu.Button>
        )
      }
    }

    const handleClick = async (v_new, setV) => {
        setV(v_new)
    }

    const imageDate = props.imageDate.map((el,idx)=>{return {type: 'image', v: props.imageDate.length-idx, date: new Date(el)}})
    const labelDate = props.labelDate.map((el,idx)=>{return {type: 'label', v: props.labelDate.length-idx, date: new Date(el)}})

    const versions = Array().concat(imageDate, labelDate).sort(function(a,b){return b.date - a.date});

    function getAllIndexes(arr, condition) {
        var indexes: Array<number> = [];
        for(var i: number = 0; i < arr.length; i++){
            const m = i
            if(condition(arr[m])){
                indexes.push(m);
            }
        }
        return indexes;
    }
    
    const x_min = Math.min(...getAllIndexes(versions, (el) => {
      if (el.v == props.vD && el.type == 'image'){
         return true; 
      } else if (el.v == props.vL && el.type == 'label'){ 
        return true;
      } else { 
        return false;
      }
    }))

    const x_max = Math.max(...getAllIndexes(versions, (el) => {
      if (el.v == props.vD && el.type == 'image'){ 
        return true; 
      } else if (el.v == props.vL && el.type == 'label'){ 
        return true; 
      } else { 
        return false;
      }
    }))

    if (x_min  == 0){
      var version = versions.length
    } else if (x_max == versions.length - 1 && x_min == versions.length - 1){
      var version = versions.length - x_max
    }
    else {
      var version = versions.length - x_min
    }
    
    for(var i = 0; i < versions.length; i++){
        const x = i
        options.push(
            <Menu.Item>
            {({ active }) => (
            <Tooltip placement="right" title={`${versions[x].type} version ${versions[x].v}`}>
              <button
                className={classNames(
                  active ? 'z-50 bg-gray-100 text-gray-900' : 'z-50 text-gray-700',
                  'z-50 block px-4 py-2 text-sm w-full'
                )}
                onClick={()=>{
                  if((x < versions.length -1)){
                    for (var j = versions.length; j > x; j--){
                      const y = j - 1
                      versions[y].type == 'image' ? handleClick(versions[y].v,props.setD) : handleClick(versions[y].v,props.setL)
                    }
                  } else if (versions.length == 1) {
                    versions[0].type == 'image' ? handleClick(versions[0].v,props.setD) : null
                  }
                }}
              >
                  Version {versions.length - x}
              </button>
            </Tooltip>
            )}
          </Menu.Item>
        )
    }

    return (
        <Menu as="div" className="z-50 relative inline-block text-left">
          <div>
            {renderButton(version, versions.length)}
          </div>
    
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 h-[150px] overflow-scroll">
                    {options}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )
}

export default DropdownVersionCoupled