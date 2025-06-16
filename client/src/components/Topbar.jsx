import React, { useState } from 'react'
import logo from '@/assets/images/logo-white.png'
import { Button } from './ui/button'
import { MdOutlineLogin } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import Searchbox from './Searchbox';
import { RouteBlogAdd, RouteIndex, RouteProfile, RouteSignIn } from '@/helpers/RouteName';
import { useDispatch, useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import usericon from '@/assets/images/user.png'
import { FaUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { removeUser } from '@/redux/user/user.slice';
import { showToast } from '@/helpers/showToast';
import { getEnv } from '@/helpers/getEnv';
import { IoSearchOutline } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { useSidebar } from './ui/sidebar';

const Topbar = () => {
  const { toggleSidebar } = useSidebar()
  const [showSearch, setShowSearch ] = useState(false)
  const user = useSelector((state)=>state.user || {})
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleLogout = async () =>{
    try{
          const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/auth/logout`,{
            method: 'get',
            credentials:'include'
          })
          const data = await response.json()
          if(!response.ok){
            return showToast('error',data.message)
          }
    
          dispatch(removeUser())
          navigate(RouteIndex)
          showToast("success",data.message)
        }catch(error){
          showToast("error", error.message)
        }
      }

      
      const toggleSearch = () => {
        setShowSearch(!showSearch)
      }
  

  return (
    <div className='flex justify-between items-center h-16 fixed w-full z-20 bg-white px-5 border-b'>
        <div className='flex justify-center items-center gap-2'>
          <button onClick={toggleSidebar} type='button' className='md:hidden'>
            <IoMdMenu />
          </button>
          <Link to={RouteIndex}>
          <img src={logo} className='md:w-auto w-48'/>
          </Link>
          
        </div>
        <div className='w-[500px]'>
          <div className={`md:relative md:block absolute bg-white left-0 w-full md:top-0 top-16  md:p-0 p-5 ${showSearch ? 'block': 'hidden'}`}>
            <Searchbox/>
          </div>
        </div>
        <div className='flex items-center gap-5'>

          <button onClick={toggleSearch} type='button' className='md:hidden block'>
            <IoSearchOutline size={25} />
          </button>
          {!user.isLoggedIn ? 
            <Button className="rounded-full" asChild>
            <Link to={RouteSignIn} >
            <MdOutlineLogin />
              Sign In
              </Link>
            </Button>
            :
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.user.avatar || usericon }/>
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <p>{user.user.name}</p>
                  <p className='text-sm'>{user.user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={RouteProfile}>
                  <FaUser/>
                  Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={RouteBlogAdd}>
                  <FaPlus/>
                  Create Blog
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <FiLogOut color='red'/>
                      LogOut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          }
        </div>
    </div>
  )
}

export default Topbar
