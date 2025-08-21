import React from 'react'

function SideBar() {
    return (
        <div className='fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-transparent text-black shadow'>
            <i>A</i>
            <i>B</i>
            <i>C</i>
            <i>D</i>
            <i>E</i>
        </div>
    )
}

const SideBarIcon = ({ icon }: string) => {
    return(
        <div className='sidebar-icon'>
            {icon}
        </div>
    )
}

export default SideBar