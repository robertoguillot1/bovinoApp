import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AnimalDetail from './pages/AnimalDetail';
import Transfers from './pages/Transfers';
import HR from './pages/HR';
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
import FarmsList from './pages/FarmsList';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/farms" element={<FarmsList />} />
        <Route path="/inventory" element={<Inventory />} />
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
        <Route path="/add-weight/:id" element={<AddWeight />} />
        <Route path="/add-health/:id" element={<AddHealthRecord />} />
        <Route path="/add-reproduction/:id" element={<AddReproductionEvent />} />
        <Route path="/create-lot" element={<CreateLot />} />
        <Route path="/veterinary-ai/:id" element={<VeterinaryAI />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </HashRouter>
  );
};

export default App;