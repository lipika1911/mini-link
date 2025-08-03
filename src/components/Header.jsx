import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LinkIcon, LogOut } from 'lucide-react'

const Header = () => {
    const navigate = useNavigate()
    const user = false
  return (
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
                                <AvatarImage className="rounded-[inherit] object-cover" src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Lipika Arya</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LinkIcon className='mr-2 h-4 w-4'/>
                                My Links
                            </DropdownMenuItem>
                            <DropdownMenuItem className='text-red-400'>
                                <LogOut className='mr-2 h-4 w-4'/>
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        </div>
    </nav>
  )
}

export default Header