import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, Plus, Minus, Scan, X, ArrowRight, Dna } from 'lucide-react';

const GenealogyTree: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedAnimal, setSelectedAnimal] = useState<any | null>(null);

  // Mock Data for the Sheet
  const animalDetails = {
      name: 'Miss JD 334',
      reg: '#MX-8821-B',
      type: 'Madre',
      gender: 'Hembra',
      status: 'Activa',
      birth: '12 Feb 2018',
      offspring: '4 Reg.',
      location: 'En Finca',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBawXMlJkUKafCslR62xJrFMQ45djtK5V21Hpmjw7sPgMSXoSCDkipcO7tR4D-9rGDBpQghviKsbSm6GK91S_XyuiNOc4Il_bElvMuJs7zX6SoNL_q7R-Bh1lGR0LRI58t3NQ-UiQCeZXgo9BWrIfAUpZG4n4bx46I0b9uoX0OYRHbxnPXE7wjcH50pDg3CALzpyLbVv4HCGiRaguf1VIqBuT5bcinmATP2jsG2JtGcm_p33Psk2TljZjUc2L_jeOYVdBttJxDuGhQ'
  };

  const handleSelect = (animal: any) => {
      setSelectedAnimal(animal);
  };

  return (
    <div className="bg-background-dark font-display text-white overflow-hidden h-screen flex flex-col relative">
      
      {/* TopAppBar */}
      <div className="z-20 flex items-center bg-background-dark/95 backdrop-blur-sm p-4 pb-2 justify-between sticky top-0 border-b border-white/5">
        <button 
            onClick={() => navigate(-1)}
            className="text-white flex size-12 shrink-0 items-center justify-center hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Genealogía</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex size-12 cursor-pointer items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      {/* Main Content Area: Scrollable Tree Canvas */}
      <div className="flex-1 overflow-auto bg-background-dark relative cursor-grab active:cursor-grabbing no-scrollbar">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        
        {/* Tree Container */}
        <div className="min-w-full min-h-full flex flex-col items-center pt-8 pb-40 px-8 scale-90 sm:scale-100 origin-top">
          
          {/* GENERATION 0: PROBAND (Child/Self) */}
          <div className="flex flex-col items-center z-10">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent-amber to-primary rounded-full opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
              
              <div className="relative flex flex-col items-center bg-surface-dark border-2 border-primary rounded-xl p-4 w-64 shadow-2xl">
                <div 
                    className="bg-center bg-no-repeat bg-cover rounded-full size-24 border-4 border-[#102212] mb-3 shadow-lg" 
                    style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB49djJwwFOBTvymMLXgUtJF3O-W7QRwWEXC3ALXChY6uuxokOwt0K85mXm1nd3SoKKVhg87tMOpEmtc_8uldWK9-Hg9no0SNVQ2nGr-o__qc-0n_JCgNN4GEDUJwPJjpCY3gSODKQGU65-NPe54ZKlE-LiG-p9LP3H_65DTbsjp23G5f4gnFg9HMOxQQx3RXdRivM9t8OJ9z3Qvj5Z3lwj8SMzgwIgoBOCvhgJOjh6nqYz_yRYJfJl3qDOmDq8bu-WvzzQfJD72lI")'}}
                ></div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xl font-bold text-white">Toro Campeón 505</span>
                    <Dna className="text-accent-amber" size={16} />
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-[#28392a] text-[#9db99f] text-xs font-mono tracking-wide mb-1">#MX-9928</span>
                  <p className="text-white/60 text-xs font-medium">Brahman • Macho • 850kg</p>
                </div>
                {/* Connector Dot Bottom */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-3 bg-primary rounded-full border-2 border-[#102212]"></div>
              </div>
            </div>
          </div>

          {/* CONNECTOR: Gen 0 to Gen 1 */}
          <div className="h-12 w-px bg-gradient-to-b from-primary to-white/20"></div>

          {/* GENERATION 1: PARENTS */}
          <div className="flex items-start gap-16 relative">
            
            {/* Horizontal Bridge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-10rem)] h-px bg-white/20 border-t-2 border-white/20 rounded-full"></div>
            
            {/* LEFT BRANCH: SIRE (Father) */}
            <div className="flex flex-col items-center relative pt-8">
              {/* Vertical connector from bridge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-white/20"></div>
              
              {/* Card */}
              <div className="flex flex-col items-center bg-surface-dark border border-white/10 hover:border-accent-amber/50 rounded-lg p-3 w-40 transition-all cursor-pointer shadow-lg active:scale-95 group">
                <div className="relative">
                  <div className="bg-center bg-no-repeat bg-cover rounded-full size-16 mb-2 border-2 border-surface-dark bg-gray-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuACNyynu8tn8jRTKHUCYy24ehF31b_Vp_kRZFAziQFJ_nH2cZjeT79ucKI8wT6Y0EpbfHcrwAl2TuSzawTxQAZtqEugDzSw9spj8aeTo8_bBMriwBdFQG5oO4Ab7LiQfWSZp6iAzg4lCz7D1F5ImrTcDfVIhn6da0Mb6Fnv6UAHUhSmFAZKzHGX3jnbExDlsx-HT6nSQHTj3d2m_9IWap3ZJZuyOIkuzxpOkkdKSLvxhleBGDMpszI64KH9yJ47UNFLTvDNKlBqgDs")'}}></div>
                  <div className="absolute -bottom-1 -right-1 bg-blue-900 rounded-full p-0.5 border border-surface-dark flex items-center justify-center size-5">
                    <span className="text-[10px] text-blue-200 font-bold">♂</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-white text-center leading-tight">Mr. V8 458/7</p>
                <p className="text-[10px] text-accent-amber font-medium mt-0.5">"El Noble"</p>
              </div>

              {/* Connector down to Gen 2 */}
              <div className="h-8 w-0.5 bg-white/20"></div>

              {/* GENERATION 2 (Grandparents - Paternal) */}
              <div className="flex items-start gap-6 relative pt-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] h-px bg-white/20 border-t border-white/20"></div>
                
                {/* Paternal Grandfather */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-px bg-white/20"></div>
                  <div className="flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 mb-1 border border-white/20 bg-gray-800" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBmwVmVxUXOAKrTDMXBihmgdWQ4REO79Ohu96nTdh-LKbZcRxNEAUG6-HZhgSfktm0_S0H2y0WtAtqxqdqZ_Wx-s_-FdVe6unZ0az_0cVEw4w6LTTUmo6JTCDqz39eZcS_xh0wBvC6GRxbo5MU8kCiKGA3d5QMYwuOxZk1m_BZcVFUY9EBFIMGlomuoDpzG4dX-7WzlahmEwTiJvBoie5TdkNiRaNE86hGRc_9duUVBg1jhy38YS8zP1g7oA-tfnYXhM0LDpUsq5p0")'}}></div>
                    <p className="text-xs font-semibold text-white/90 text-center max-w-[80px] truncate">JDH Karu 800</p>
                  </div>
                </div>

                {/* Paternal Grandmother */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-px bg-white/20"></div>
                  <div className="flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 mb-1 border border-white/20 bg-gray-800" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBCWjGcaiSeF2lfaFbvstwsCMQdWx87-xMTKOCcGPqAqimuglAGXt7_R0rQL9ogCj2K4oGoGEXkgmK-CjoS8cKrhaCMIeTfEiOdA3Sep9z-zuV80GUoIyKUP7xS3nHDUdLoWsbiBdPXobD370z-xjFCAVbyotmNffM78GmNOdChienQkTXJDyYDw2n4-gE_gg68d4rYWtIHLOBGzQkwZfjp8CHjm8brEoPMuieKwLBzvskeLtUcnUh1vI9ajw944TkcWODnc8uA_pw")'}}></div>
                    <p className="text-xs font-semibold text-white/90 text-center max-w-[80px] truncate">Miss V8 464/6</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT BRANCH: DAM (Mother) */}
            <div className="flex flex-col items-center relative pt-8">
              {/* Vertical connector from bridge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-0.5 bg-white/20"></div>
              
              {/* Card - ACTIVE/SELECTED */}
              <div 
                onClick={() => handleSelect(animalDetails)}
                className={`flex flex-col items-center bg-surface-dark border-2 rounded-lg p-3 w-40 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-105 relative z-10 ${selectedAnimal ? 'border-accent-amber' : 'border-white/20'}`}
              >
                {selectedAnimal && (
                    <div className="absolute -top-2 -right-2 bg-accent-amber text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">INFO</div>
                )}
                <div className="relative">
                  <div className="bg-center bg-no-repeat bg-cover rounded-full size-16 mb-2 border-2 border-surface-dark bg-gray-700" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBawXMlJkUKafCslR62xJrFMQ45djtK5V21Hpmjw7sPgMSXoSCDkipcO7tR4D-9rGDBpQghviKsbSm6GK91S_XyuiNOc4Il_bElvMuJs7zX6SoNL_q7R-Bh1lGR0LRI58t3NQ-UiQCeZXgo9BWrIfAUpZG4n4bx46I0b9uoX0OYRHbxnPXE7wjcH50pDg3CALzpyLbVv4HCGiRaguf1VIqBuT5bcinmATP2jsG2JtGcm_p33Psk2TljZjUc2L_jeOYVdBttJxDuGhQ")'}}></div>
                  <div className="absolute -bottom-1 -right-1 bg-pink-900 rounded-full p-0.5 border border-surface-dark flex items-center justify-center size-5">
                    <span className="text-[10px] text-pink-200 font-bold">♀</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-white text-center leading-tight">Miss JD 334</p>
                <p className="text-[10px] text-[#9db99f] font-medium mt-0.5">Reg: #8821</p>
              </div>

              {/* Connector down to Gen 2 */}
              <div className="h-8 w-0.5 bg-white/20"></div>

              {/* GENERATION 2 (Grandparents - Maternal) */}
              <div className="flex items-start gap-6 relative pt-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] h-px bg-white/20 border-t border-white/20"></div>
                
                {/* Maternal Grandfather */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-px bg-white/20"></div>
                  <div className="flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 mb-1 border border-white/20 bg-gray-800" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDrXRmFd6uWxsUbo1D06uFyEmcrYvhoTpIw3flWS-coWXGvk6p0LrYuLeJjI4iMYiXo1beZ9oQqdFcWFJcgF8xpTnIhQx5hFezIm9rPB-RqgVEdf5c4GS7NR3MFBxbzP9UEex9O7nLl6EYjqsl-uoKYCRKx2EO7ADdFUbuxiluMTTL7Lc-BfbzfzAwkHtYB1oq-xszleGfYgTIZV2_qH7-lLkBKK3HYg_5duAbcY3nS7P7fqZFiEdFkckoNHFbDYHmp3Z1KufGB3-lU")'}}></div>
                    <p className="text-xs font-semibold text-white/90 text-center max-w-[80px] truncate">JDH Mr. Echo</p>
                  </div>
                </div>

                {/* Maternal Grandmother (Unknown) */}
                <div className="flex flex-col items-center relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-4 w-px bg-white/20"></div>
                  <div className="flex flex-col items-center opacity-60 grayscale">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 mb-1 border border-dashed border-gray-600 bg-transparent flex items-center justify-center">
                        <span className="text-gray-500 font-bold">?</span>
                    </div>
                    <p className="text-xs font-medium text-gray-500 text-center italic">Desconocido</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-20">
        <button className="bg-surface-dark border border-white/20 rounded-full size-10 flex items-center justify-center text-white shadow-lg active:bg-white/10">
          <Plus size={20} />
        </button>
        <button className="bg-surface-dark border border-white/20 rounded-full size-10 flex items-center justify-center text-white shadow-lg active:bg-white/10">
          <Minus size={20} />
        </button>
        <button className="bg-primary hover:bg-primary-dark text-black rounded-full size-12 flex items-center justify-center shadow-xl shadow-primary/20 transition-colors mt-2">
          <Scan size={24} />
        </button>
      </div>

      {/* Bottom Sheet */}
      {selectedAnimal && (
          <div className="absolute bottom-0 left-0 w-full z-30">
            {/* Backdrop */}
            <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
            
            {/* Content */}
            <div className="bg-background-dark rounded-t-2xl border-t border-white/20 shadow-[0_-8px_30px_rgba(0,0,0,0.5)] flex flex-col max-h-[50vh] animate-in slide-in-from-bottom-10">
                
                {/* Handle */}
                <div className="flex w-full justify-center pt-3 pb-1 cursor-grab">
                    <div className="h-1 w-12 rounded-full bg-gray-600"></div>
                </div>

                <div className="p-5 pt-2 flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                            <img src={selectedAnimal.img} className="rounded-lg size-20 border border-gray-700 bg-gray-800 object-cover" />
                            <div className="absolute -top-2 -right-2 bg-accent-amber text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-black/20 uppercase">{selectedAnimal.type}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white text-lg font-bold leading-tight truncate">{selectedAnimal.name}</h3>
                            <p className="text-[#9db99f] text-sm mt-0.5">Registro: {selectedAnimal.reg}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="inline-flex items-center gap-1 rounded bg-[#28392a] px-2 py-0.5 text-xs font-medium text-white">
                                    <span className="text-pink-300 font-bold">♀</span> {selectedAnimal.gender}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded bg-[#28392a] px-2 py-0.5 text-xs font-medium text-white">
                                    <span className="text-primary font-bold">✓</span> {selectedAnimal.status}
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setSelectedAnimal(null)} className="text-gray-400 p-1 rounded-full hover:bg-white/5">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="h-px bg-white/10 w-full"></div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-[#1a2c1e] p-3 rounded-lg flex flex-col items-center justify-center border border-white/5">
                            <span className="text-[#9db99f] text-[10px] uppercase font-bold tracking-wider">Nacimiento</span>
                            <span className="text-white font-medium text-sm">{selectedAnimal.birth}</span>
                        </div>
                        <div className="bg-[#1a2c1e] p-3 rounded-lg flex flex-col items-center justify-center border border-white/5">
                            <span className="text-[#9db99f] text-[10px] uppercase font-bold tracking-wider">Crías</span>
                            <span className="text-white font-medium text-sm">{selectedAnimal.offspring}</span>
                        </div>
                        <div className="bg-[#1a2c1e] p-3 rounded-lg flex flex-col items-center justify-center border border-white/5">
                            <span className="text-[#9db99f] text-[10px] uppercase font-bold tracking-wider">Estado</span>
                            <span className="text-primary font-medium text-sm">{selectedAnimal.location}</span>
                        </div>
                    </div>

                    {/* Action */}
                    <button className="w-full mt-1 bg-white hover:bg-gray-100 text-[#102212] font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors active:scale-95">
                        <span>Ver Perfil Completo</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
          </div>
      )}

    </div>
  );
};

export default GenealogyTree;