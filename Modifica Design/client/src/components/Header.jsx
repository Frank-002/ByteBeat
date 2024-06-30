// Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { useUser } from './UserContext.jsx';

const Header = () => {
  const { currentUser, signOutSuccess } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        signOutSuccess();
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
      <Navbar className="border-b-2">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="d-flex align-items-center text-dark text-decoration-none">
                <span
                    className="px-2 py-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg text-white ml-1 h4 mb-0">
                Byte
                </span>
            <span className="ml-1 h4 mb-0 text-dark">Beat</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex-grow mx-4 max-w-lg w-full">
            <TextInput
                type="text"
                placeholder="Search..."
                rightIcon={AiOutlineSearch}
                className="w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* Links and User Menu */}
          <div className="flex items-center gap-4">
            <Link
                to="/"
                className={`text-sm ${location.pathname === '/' ? 'text-blue-600 border-b-2 border-blue-600 hover:no-underline' : 'text-gray-700 hover:no-underline'}`}
            >
              Home
            </Link>
            <Link
                to="/about"
                className={`text-sm ${location.pathname === '/about' ? 'text-blue-600 border-b-2 border-blue-600 hover:no-underline' : 'text-gray-700  hover:no-underline' }`}
            >
              Chi siamo?
            </Link>
            {currentUser ? (
                <Dropdown arrowIcon={false} inline label={<Avatar alt="user" img={currentUser.profilePicture} rounded />}>
                  <Dropdown.Header>
                    <span className="block text-sm" style={{ color: 'black' }}>@{currentUser.username}</span>
                    <span className="block text-sm font-medium truncate" style={{ color: 'black' }}>{currentUser.email}</span>
                  </Dropdown.Header>
                  <Link to="/dashboard?tab=profile" style={{textDecoration: 'none'}}>
                    <Dropdown.Item style={{ color: 'black'}}>Profilo</Dropdown.Item>
                  </Link>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleSignOut} style={{ color: 'black' }}>Esci</Dropdown.Item>
                </Dropdown>
            ) : (
                <Link to="/sign-in" style={{textDecoration: 'none'}}>
                  <Button gradientDuoTone="purpleToBlue" >
                    Accedi
                  </Button>
                </Link>
            )}
          </div>
        </div>
      </Navbar>
  );
};

export default Header;




