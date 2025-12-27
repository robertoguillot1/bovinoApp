
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AnimalDetail from './pages/AnimalDetail';
import Transfers from './pages/Transfers';
import HR from './pages/HR';
import Market from './pages/Market';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import MyListings from './pages/MyListings';
import ChatDetail from './pages/ChatDetail';
import Inbox from './pages/Inbox'; // Import Inbox
import RegisterFarm from './pages/RegisterFarm';
import RegisterWorker from './pages/RegisterWorker';
import EditWorker from './pages/EditWorker';
import RegisterBovine from './pages/RegisterBovine';
import EditBovine from './pages/EditBovine';
import AddProduction from './pages/AddProduction';
import AddHealthRecord from './pages/AddHealthRecord';
import VeterinaryAI from './pages/VeterinaryAI';
import AddReproductionEvent from './pages/AddReproductionEvent';
import CreateLot from './pages/CreateLot';
import GenealogyTree from './pages/GenealogyTree';
import AddWeight from './pages/AddWeight';
import AddCheese from './pages/AddCheese';
import RegisterCheese from './pages/RegisterCheese'; 
import CheeseSales from './pages/CheeseSales'; // New Import
import RegisterCheeseSale from './pages/RegisterCheeseSale'; // New Import
import CheeseBatchDetail from './pages/CheeseBatchDetail'; // New Import
import FarmsList from './pages/FarmsList';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile'; // New Import
import SecuritySettings from './pages/SecuritySettings'; // New Import

const App: React.FC = () => {
  
  // Apply preferences on startup
  useEffect(() => {
    // 1. Text Size
    const savedSize = localStorage.getItem('app_text_size');
    if (savedSize) {
      document.documentElement.style.fontSize = `${savedSize}px`;
    }

    // 2. Theme (Dark/Light)
    const savedTheme = localStorage.getItem('app_theme');
    // Default to dark if not set (savedTheme is null) or if explicitly 'dark'
    if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/farms" element={<FarmsList />} />
        <Route path="/inventory" element={<Inventory />} />
        
        {/* Marketplace Routes */}
        <Route path="/market" element={<Market />} />
        <Route path="/market/my-listings" element={<MyListings />} />
        <Route path="/market/:id" element={<ListingDetail />} />
        <Route path="/market/create" element={<CreateListing />} />
        <Route path="/chat/:id" element={<ChatDetail />} />
        <Route path="/inbox" element={<Inbox />} />

        <Route path="/animal/:id" element={<AnimalDetail />} />
        <Route path="/genealogy/:id" element={<GenealogyTree />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/hr" element={<HR />} />
        <Route path="/register-farm" element={<RegisterFarm />} />
        <Route path="/register-worker" element={<RegisterWorker />} />
        <Route path="/edit-worker/:id" element={<EditWorker />} />
        <Route path="/register-bovine" element={<RegisterBovine />} />
        <Route path="/edit-bovine/:id" element={<EditBovine />} />
        <Route path="/add-production/:id" element={<AddProduction />} />
        <Route path="/add-cheese" element={<AddCheese />} />
        <Route path="/register-cheese" element={<RegisterCheese />} />
        <Route path="/cheese-sales" element={<CheeseSales />} />
        <Route path="/register-cheese-sale" element={<RegisterCheeseSale />} />
        <Route path="/cheese-batch/:id" element={<CheeseBatchDetail />} /> {/* New Route */}
        <Route path="/add-weight/:id" element={<AddWeight />} />
        <Route path="/add-health/:id" element={<AddHealthRecord />} />
        <Route path="/add-reproduction/:id" element={<AddReproductionEvent />} />
        <Route path="/create-lot" element={<CreateLot />} />
        <Route path="/veterinary-ai/:id" element={<VeterinaryAI />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/security" element={<SecuritySettings />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
