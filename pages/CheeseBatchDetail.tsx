
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, User, Droplets, Scale, Percent, 
  QrCode, Printer, Trash2, Edit2, CheckCircle2, 
  Clock, AlertCircle, TrendingUp, DollarSign, X, Save, Download, Share2, Loader2
} from 'lucide-react';
import html2canvas from 'html2canvas';

const CheeseBatchDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [batch, setBatch] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // --- MODAL STATES ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate fetching data (or load from localStorage)
    const savedBatches = JSON.parse(localStorage.getItem('cheese_production_batches') || '[]');
    const found = savedBatches.find((b: any) => b.id === id);
    
    // Fallback for demo mock data if not in LS
    if (found) {
        // Ensure unitPrice exists for older records
        if (!found.unitPrice) {
            found.unitPrice = found.name.includes('Costeño') ? 12000 : 14500;
        }
        setBatch(found);
    } else {
        if(id === 'lot1' || id === 'lot2') {
             const isLot1 = id === 'lot1';
             setBatch({
                id: id,
                name: isLot1 ? 'Queso Costeño' : 'Queso Mozzarella',
                date: isLot1 ? 'Hoy' : 'Ayer',
                code: isLot1 ? '#QC-001' : '#QM-203',
                weight: isLot1 ? 1250 : 45,
                milk: isLot1 ? '12000 Litros' : '450 Litros',
                yieldDisplay: isLot1 ? '10.4%' : '10%',
                operator: isLot1 ? 'Carlos M.' : 'Juan P.',
                status: isLot1 ? 'Finalizado' : 'En Cava',
                badgeColor: isLot1 ? 'text-[#13ec5b]' : 'text-gray-400',
                unitPrice: isLot1 ? 12000 : 14500
             });
        }
    }
    setLoading(false);
  }, [id]);

  // --- EDIT LOGIC ---
  const openEditModal = () => {
      setEditForm({ ...batch });
      setShowEditModal(true);
  };

  const saveEdit = () => {
      const updatedBatch = { ...batch, ...editForm };
      setBatch(updatedBatch);
      
      // Update LocalStorage
      const savedBatches = JSON.parse(localStorage.getItem('cheese_production_batches') || '[]');
      // If batch exists in LS, update it. If it was mock data only in memory, we add it to LS now.
      const index = savedBatches.findIndex((b: any) => b.id === batch.id);
      
      let newBatches = [];
      if (index >= 0) {
          newBatches = savedBatches.map((b: any) => b.id === batch.id ? updatedBatch : b);
      } else {
          // If editing a mock batch, add it to storage so edits persist
          newBatches = [updatedBatch, ...savedBatches];
      }
      
      localStorage.setItem('cheese_production_batches', JSON.stringify(newBatches));
      setShowEditModal(false);
  };

  // --- LABEL PRINTING LOGIC ---
  const generateLabelBlob = async (): Promise<Blob | null> => {
      if (!labelRef.current) return null;
      try {
          const canvas = await html2canvas(labelRef.current, {
              backgroundColor: '#ffffff',
              scale: 3, // High quality for printing
              useCORS: true,
              logging: false
          });
          return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      } catch (e) {
          console.error("Label generation failed", e);
          return null;
      }
  };

  const handleDownloadLabel = async () => {
      setIsSharing(true);
      const blob = await generateLabelBlob();
      if (blob) {
          const link = document.createElement('a');
          link.download = `Label_${batch.code}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
      }
      setIsSharing(false);
  };

  const handleShareLabel = async () => {
      setIsSharing(true);
      const blob = await generateLabelBlob();
      if (blob) {
          const file = new File([blob], `Label_${batch.code}.png`, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                  await navigator.share({
                      files: [file],
                      title: `Etiqueta Lote ${batch.code}`,
                      text: `Etiqueta de trazabilidad para ${batch.name}`
                  });
              } catch (e) {
                  console.error('Share failed', e);
              }
          } else {
              alert('Compartir no soportado en este dispositivo/navegador.');
          }
      }
      setIsSharing(false);
  };


  if (loading) return <div className="min-h-screen bg-[#102216] flex items-center justify-center text-white">Cargando ficha...</div>;
  if (!batch) return <div className="min-h-screen bg-[#102216] flex items-center justify-center text-white">Lote no encontrado</div>;

  // Calculate estimated value based on dynamic unit price
  const estimatedValue = batch.weight * (batch.unitPrice || 0);

  return (
    <div className="min-h-screen bg-[#102216] text-white font-display flex flex-col relative">
      
      {/* Header */}
      <header className="flex items-center justify-between p-4 pt-6 bg-[#102216]/95 backdrop-blur-md sticky top-0 z-20 border-b border-[#3b5443]">
        <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Ficha de Lote</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        
        {/* ID Card */}
        <div className="bg-[#1E2923] border border-[#3b5443] rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <QrCode size={120} />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className={`bg-[#13ec5b]/10 text-[#13ec5b] border border-[#13ec5b]/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-2 inline-block ${batch.status === 'En Cava' ? 'text-accent-amber bg-accent-amber/10 border-accent-amber/20' : ''}`}>
                            {batch.status}
                        </span>
                        <h2 className="text-2xl font-bold text-white leading-tight">{batch.name}</h2>
                        <p className="text-gray-400 font-mono text-xs mt-1">ID: {batch.code}</p>
                    </div>
                    <div className="bg-white p-1 rounded-lg">
                        <QrCode size={40} className="text-black" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Fecha Producción</span>
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                            <Calendar size={14} className="text-primary"/>
                            {batch.date}
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Responsable</span>
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                            <User size={14} className="text-accent-amber"/>
                            {batch.operator}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Efficiency Metrics */}
        <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Métricas de Eficiencia</h3>
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#28392e] p-3 rounded-xl border border-[#3b5443] flex flex-col items-center justify-center text-center">
                    <Droplets size={20} className="text-blue-400 mb-1" />
                    <span className="text-xs text-gray-400 font-medium">Leche</span>
                    <span className="text-sm font-bold text-white">{batch.milk.replace(' Litros', '')}L</span>
                </div>
                <div className="bg-[#28392e] p-3 rounded-xl border border-[#3b5443] flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#13ec5b]/5"></div>
                    <Scale size={20} className="text-[#13ec5b] mb-1" />
                    <span className="text-xs text-gray-400 font-medium">Queso</span>
                    <span className="text-lg font-bold text-white">{batch.weight}kg</span>
                </div>
                <div className="bg-[#28392e] p-3 rounded-xl border border-[#3b5443] flex flex-col items-center justify-center text-center">
                    <Percent size={20} className="text-accent-amber mb-1" />
                    <span className="text-xs text-gray-400 font-medium">Rend.</span>
                    <span className="text-sm font-bold text-white">{batch.yieldDisplay}</span>
                </div>
            </div>
        </section>

        {/* Process Timeline */}
        <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Estado del Proceso</h3>
            <div className="bg-[#1E2923] border border-[#3b5443] rounded-2xl p-5">
                <div className="relative pl-4 space-y-6 border-l-2 border-[#3b5443] ml-2">
                    {/* Step 1 */}
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-0 size-4 rounded-full bg-[#13ec5b] border-2 border-[#102216] shadow-[0_0_10px_rgba(19,236,91,0.5)]"></div>
                        <h4 className="text-sm font-bold text-white">Producción & Cuajado</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Completado el {batch.date}</p>
                    </div>
                    {/* Step 2 */}
                    <div className="relative pl-6">
                        <div className={`absolute -left-[9px] top-0 size-4 rounded-full border-2 border-[#102216] ${batch.status !== 'Producción' ? 'bg-[#13ec5b]' : 'bg-gray-600'}`}></div>
                        <h4 className={`text-sm font-bold ${batch.status !== 'Producción' ? 'text-white' : 'text-gray-500'}`}>Prensado & Salado</h4>
                        <p className="text-xs text-gray-500 mt-0.5">24 horas de reposo</p>
                    </div>
                    {/* Step 3 */}
                    <div className="relative pl-6">
                        <div className={`absolute -left-[9px] top-0 size-4 rounded-full border-2 border-[#102216] ${batch.status === 'Finalizado' || batch.status === 'En Cava' ? 'bg-accent-amber' : 'bg-gray-600'}`}></div>
                        <h4 className={`text-sm font-bold ${batch.status === 'Finalizado' || batch.status === 'En Cava' ? 'text-white' : 'text-gray-500'}`}>Maduración en Cava</h4>
                        {batch.status === 'En Cava' && (
                            <div className="mt-1 inline-flex items-center gap-1 bg-accent-amber/10 text-accent-amber px-2 py-0.5 rounded text-[10px] font-bold">
                                <Clock size={10} /> En Progreso
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>

        {/* Financial Estimates */}
        <section>
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Valoración Estimada</h3>
             <div className="bg-gradient-to-br from-[#1E2923] to-[#132018] border border-[#3b5443] rounded-2xl p-4 flex items-center justify-between">
                <div>
                    <span className="text-xs text-gray-400 block mb-1">Precio Mercado / Kg</span>
                    <span className="text-lg font-bold text-white">${batch.unitPrice?.toLocaleString()}</span>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-400 block mb-1">Valor Total Lote</span>
                    <div className="flex items-center gap-1 text-[#13ec5b]">
                        <DollarSign size={18} />
                        <span className="text-2xl font-extrabold">{estimatedValue.toLocaleString()}</span>
                    </div>
                </div>
             </div>
        </section>

      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-[#102216]/95 backdrop-blur-lg border-t border-[#3b5443] z-30 flex gap-3">
          <button 
            onClick={() => setShowLabelModal(true)}
            className="flex-1 h-12 bg-[#28392e] hover:bg-[#344a3c] text-white font-bold rounded-xl border border-[#3b5443] flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
              <Printer size={18} /> Imprimir Etiqueta
          </button>
          <button 
            onClick={openEditModal}
            className="flex-1 h-12 bg-primary hover:bg-primary-dark text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg active:scale-95"
          >
              <Edit2 size={18} /> Editar Lote
          </button>
      </div>

      {/* --- EDIT MODAL --- */}
      {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-[#1E2923] w-full max-w-sm rounded-2xl border border-[#3b5443] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
                  <div className="p-4 border-b border-[#3b5443] flex justify-between items-center">
                      <h3 className="font-bold text-white">Editar Lote {batch.code}</h3>
                      <button onClick={() => setShowEditModal(false)}><X className="text-gray-400 hover:text-white" size={20}/></button>
                  </div>
                  <div className="p-5 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Estado</label>
                          <select 
                            value={editForm.status} 
                            onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                            className="w-full bg-[#102216] border border-[#3b5443] rounded-xl p-3 text-white focus:border-[#13ec5b] outline-none"
                          >
                              <option>Producción</option>
                              <option>En Cava</option>
                              <option>Finalizado</option>
                              <option>Vendido</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Peso Final (kg)</label>
                          <input 
                            type="number"
                            value={editForm.weight}
                            onChange={(e) => setEditForm({...editForm, weight: Number(e.target.value)})}
                            className="w-full bg-[#102216] border border-[#3b5443] rounded-xl p-3 text-white focus:border-[#13ec5b] outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Precio Mercado (COP/kg)</label>
                          <input 
                            type="number"
                            value={editForm.unitPrice}
                            onChange={(e) => setEditForm({...editForm, unitPrice: Number(e.target.value)})}
                            className="w-full bg-[#102216] border border-[#3b5443] rounded-xl p-3 text-white focus:border-[#13ec5b] outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Notas / Observaciones</label>
                          <textarea 
                            rows={3}
                            value={editForm.notes || ''}
                            onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                            placeholder="Notas de calidad..."
                            className="w-full bg-[#102216] border border-[#3b5443] rounded-xl p-3 text-white focus:border-[#13ec5b] outline-none resize-none"
                          />
                      </div>
                      <button onClick={saveEdit} className="w-full bg-[#13ec5b] hover:bg-[#11d852] text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-2">
                          <Save size={18} /> Guardar Cambios
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- LABEL MODAL (PREVIEW) --- */}
      {showLabelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
              <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                  
                  {/* Label Container (To Capture) */}
                  <div ref={labelRef} className="bg-white text-black p-6 rounded-lg w-full shadow-2xl relative overflow-hidden">
                      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                          <div>
                              <h2 className="text-2xl font-extrabold uppercase tracking-tight">{batch.name}</h2>
                              <p className="text-sm font-mono mt-1 font-bold">LOTE: {batch.code}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">BOVINE GUARD</p>
                              <p className="text-xs font-bold">{batch.date}</p>
                          </div>
                      </div>
                      
                      <div className="flex gap-4 items-center mb-4">
                          <div className="border-2 border-black p-1 rounded shrink-0">
                              <QrCode size={80} className="text-black" />
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-2">
                              <div>
                                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Peso Neto</span>
                                  <span className="text-2xl font-extrabold leading-none">{batch.weight} KG</span>
                              </div>
                              <div>
                                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Rendimiento</span>
                                  <span className="text-sm font-bold">{batch.yieldDisplay}</span>
                              </div>
                              <div className="col-span-2 border-t border-dashed border-gray-300 pt-2 mt-1">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase block">Leche Usada</span>
                                  <span className="text-sm font-bold flex items-center gap-1">
                                      <Droplets size={12} className="text-black"/> {batch.milk}
                                  </span>
                              </div>
                          </div>
                      </div>

                      <div className="bg-black text-white p-2 text-center rounded text-xs font-bold uppercase tracking-widest">
                          Calidad Garantizada
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 w-full">
                      <button onClick={() => setShowLabelModal(false)} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 text-white"><X size={24}/></button>
                      <button onClick={handleDownloadLabel} disabled={isSharing} className="flex-1 flex items-center justify-center gap-2 bg-[#28392e] text-white font-bold py-3 rounded-xl border border-white/10 hover:bg-[#344a3c] transition-colors">
                          {isSharing ? <Loader2 size={20} className="animate-spin"/> : <><Download size={20} /> Descargar PNG</>}
                      </button>
                      <button onClick={handleShareLabel} disabled={isSharing} className="flex-1 flex items-center justify-center gap-2 bg-[#13ec5b] text-black font-bold py-3 rounded-xl hover:bg-[#11d852] transition-colors">
                          <Share2 size={20} /> Compartir
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default CheeseBatchDetail;
