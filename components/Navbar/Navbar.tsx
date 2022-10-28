import Link from "next/link";
import Image from "next/image";
import React from "react";

const Navbar = () => {
    return (
        <div className='flex'>
            <div className="w-full relative">
                <div className="absolute inset-y-0 left-0 items-center pl-3 pointer-events-none flex flex-col align-middle justify-center">
                <Image src={'/../public/Icons/search-normal.png'} width={'20'} height={'20'} objectFit={'contain'} alt=''/>
                </div>
                <input type="search" id="search" className="block p-4 pl-10 w-full text-sm text-gray-900 
                    bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500
                    dark:focus:border-green-500" placeholder="Search datasets" required>
                    </input>
                <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-green-700
                    hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium
                    rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700
                    dark:focus:ring-green-800">
                    Search
                </button>
            </div>
            
            <div className='py-2 px-10 w-full justify-between'> 
                <button type="submit" onClick={(e) => {e.preventDefault();window.location.href='/NewDataset';}} className="relative text-white bg-green-700 hover:bg-green-800 
                    focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg 
                    text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    New Dataset
                </button>
            </div>

            <Link href='/'  passHref> 
                <button disabled={true} className='justify-self-end cursor-not-allowed px-20 w-[350px] flex gap-2'>
                    <div className="h-max relative top-3">
                        <Image src={"/Icons/profile.png"} width={'30px'} height={'30px'} objectFit={'contain'} alt=''/>
                    </div>
                    <div className="h-max relative top-3.5"> User </div>
                </button>
            </Link>
        </div>
    )
}

export default Navbar;