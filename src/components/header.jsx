import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent,DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Avatar,AvatarFallback,AvatarImage} from './ui/avatar';
import { LibraryIcon, LinkIcon, LogOut } from 'lucide-react';

const Header = () => {
    const navigate=useNavigate();
    const user=true;

  return <nav className='py-4 flex justify-between items-center'>
    <Link to="/">
    <img src="/logo.png" className='h-14' alt='mini-link logo'/>
    </Link>
    <div>
      {!user?
      <Button onClick={()=>navigate("/auth")}>Login</Button>
      :(
        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
            <Avatar className="w-10 h-10 flex justify-between items-center">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="text-lg">LA</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Lipika Arya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LinkIcon className='mr-2 h-4 w-4'/>
              <span>Links</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400 hover:text-red-400">
              <LogOut className="text-red-400 mr-2 h-4 w-4" />
              <span className='hover: text-red-400'>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
      }
    </div>
  </nav>
}

export default Header