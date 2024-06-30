import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
;
import { useUser } from '../components/UserContext';
import Cookies from "js-cookie"; // Importa il contesto dell'utente

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAdmin, loading } = useUser(); // Usa il contesto dell'utente

  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    const tabFromCookies = Cookies.get('currentTab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else if (tabFromCookies) {
      setTab(tabFromCookies);
    } else {
      setTab('dash'); // Imposta un valore di default
    }
  }, [location.search]);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/'); // Reindirizza alla pagina di login se l'utente non è autenticato
    }
  }, [currentUser, loading, navigate]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    Cookies.set('currentTab', newTab, { expires: 7 }); // Imposta il cookie con scadenza di 7 giorni
    navigate(`?tab=${newTab}`);
  };

  if (loading) {
    return <div>Loading...</div>; // Mostra un indicatore di caricamento finché l'utente non è caricato
  }

  if (!currentUser) {
    return null; // Mostra nulla se l'utente non è autenticato
  }

  return (
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-56">
          {/* Sidebar */}
          <DashSidebar onTabChange={handleTabChange} />
        </div>

        <div className="flex-1 p-4">
          {/* Condiziona il rendering in base al tab selezionato e se l'utente è admin */}
          {tab === 'profile' && <DashProfile />}
          {tab === 'posts' && isAdmin && <DashPosts />}
          {tab === 'users' && isAdmin && <DashUsers />}
          {tab === 'comments' && isAdmin && <DashComments />}          
        </div>
      </div>
  );
};

export default Dashboard;



