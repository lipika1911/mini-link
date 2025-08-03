import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkIcon, LogOut } from 'lucide-react'
import { UrlState } from '@/Context'
import UseFetch from '@/hooks/UseFetch'
import { logout } from '@/db/apiAuth'
import { BarLoader } from 'react-spinners'

const Header = () => {
    const navigate = useNavigate()
    const {user, fetchUser} = UrlState()

    const {loading, fn:fnLogout} = UseFetch(logout);

  return (
    <>
    <nav className='mx-16 py-6 flex justify-between items-center'>
        <Link to='/'>
            <img src="/logo.png" className='h-12 cursor-pointer' alt="mini-link logo" />
        </Link>
        <div>
            {!user ?
                <Button onClick={()=>navigate("/auth")} >Login</Button>
                :(
                    <DropdownMenu>
                        <DropdownMenuTrigger className="h-12 rounded-full overflow-hidden focus:outline-none focus:ring-0 focus-visible:ring-0">
                            <Avatar>
                                <AvatarImage className="h-12 rounded-[inherit] object-cover" src={user?.user_metadata?.profile_pic}/>
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LinkIcon className='mr-2 h-4 w-4'/>
                                My Links
                            </DropdownMenuItem>
                            <DropdownMenuItem className='text-red-400'>
                                <LogOut className='mr-2 h-4 w-4'/>
                                <span onClick={()=>{
                                    fnLogout().then(()=>{
                                        fetchUser();
                                        navigate("/");
                                    })
                                }}>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        </div>
        {loading && <BarLoader className='mb-4' width={"100%"} color="#36d7b7" />}
    </nav>
    </>
  )
}

export default Header