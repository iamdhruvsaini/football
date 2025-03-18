import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ChartBarBig, LayoutDashboard, LogOutIcon, ShoppingBasket, SwatchBookIcon } from "lucide-react";

const DropDownItems = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const photoURL = currentUser?.photo;
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg bg-gray-300">
        <Avatar className="flex justify-center items-center">
          <AvatarImage
            src={photoURL}
            alt="User Avatar"
          />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link to="/dashboard">
          <DropdownMenuItem className="cursor-pointer">
            <LayoutDashboard className="h-50 w-50" />
            Dashboard
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link to="/stat">
          <DropdownMenuItem className="cursor-pointer"><ChartBarBig className="h-50 w-50" />Stats</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link to="/basket">
          <DropdownMenuItem className="cursor-pointer"><SwatchBookIcon className="h-50 w-50" />Bucket</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link to="/cart">
          <DropdownMenuItem className="cursor-pointer">
            <ShoppingBasket className="h-50 w-50" />
            Cart
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOutIcon className="h-50 w-50" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownItems;
