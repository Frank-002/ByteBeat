import { useState, useEffect } from 'react';
import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext'; // Importa il contesto dell'utente

const DashSidebar = ({ onTabChange }) => {
    const { currentUser, signOutSuccess } = useUser(); // Usa il contesto dell'utente
    const location = useLocation();
    const navigate = useNavigate();

    const [tab, setTab] = useState('');

    useEffect(() => {
      const urlParams = new URLSearchParams(location.search);
      const tabFromUrl = urlParams.get('tab');
      if (tabFromUrl) {
        setTab(tabFromUrl);
      }
    }, [location.search]);

    const handleTabClick = (newTab) => {
        setTab(newTab);
        onTabChange(newTab);
    };

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
          navigate('/'); // Reindirizza alla homepage o alla pagina di login
        }
  
      } catch (error) {
        console.log(error.message);
      }
    };

    return (
        <Sidebar className="w-full md:w-56">
            <Sidebar.Items>
                <Sidebar.ItemGroup className="flex flex-col gap-1">
                  <div onClick={() => handleTabClick('profile')}>
                <Sidebar.Item
                  active={tab === 'profile'}
                  icon={HiUser}
                  label={currentUser.isAdmin ? 'Admin' : 'User'}
                  as="div"
                >
                  Profile
                </Sidebar.Item>
              </div>

              {currentUser.isAdmin && (
                <div onClick={() => handleTabClick('posts')}>
                  <Sidebar.Item
                    active={tab === 'posts'}
                    icon={HiDocumentText}
                    as="div"
                  >
                    Posts
                  </Sidebar.Item>
                </div>
              )}

              {currentUser.isAdmin && (
                <>
                <div onClick={() => handleTabClick('users')}>
                  <Sidebar.Item
                    active={tab === 'users'}
                    icon={HiOutlineUserGroup}
                    as="div"
                  >
                    Users
                  </Sidebar.Item>
                </div>

                <div onClick={() => handleTabClick('comments')}>
                  <Sidebar.Item
                    active={tab === 'comments'}
                    icon={HiAnnotation}
                    as="div"
                  >
                    Comments
                  </Sidebar.Item>
                </div>
                </>
              )}

              <Sidebar.Item
                icon={HiArrowSmRight}
                className="cursor-pointer"
                onClick={handleSignOut}
              >
                Sign Out
              </Sidebar.Item>

                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar;
