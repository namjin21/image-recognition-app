import { useState } from "react";
import { useUser } from "../context/UserContext";

interface NavbarProps {
  onSignOut: () => Promise<void>;
}

const Navbar: React.FC<NavbarProps> = ({ onSignOut }) => {
  const { username } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-white shadow-md px-6 py-4">
      <h2 className="header text-black font-black">Image Tagger</h2>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          className="w-10 h-10 rounded-full bg-cyan-700 flex items-center justify-center cursor-pointer"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {username ? username[0].toUpperCase() : 'A'}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-0.5 w-40 bg-white border border-gray-200 shadow-lg rounded-md">
            <span className="text-black bg-stone-200 block w-full text-left px-4 py-1 rounded-t-md">Hello, {username}!</span>
            <button
              className="block w-full text-left px-4 py-2 bg-white hover:bg-gray-100 text-black cursor-pointer rounded-b-md"
              onClick={onSignOut}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
