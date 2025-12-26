
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, Info, ShoppingBasket, ChevronDown, 
  Calendar, Circle, Scale, Plus, DollarSign, User, Search, Save 
} from 'lucide-react';

const RegisterCheeseSale: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  
  // Logic State
  const [cheeseType, setCheeseType] = useState('Queso Costeño');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [total, setTotal] = useState('$0');
  
  // New State bindings
  const [client, setClient] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Paid'); // 'Paid' | 'Pending' | 'Credit'

  // Auto-calculate Total
  useEffect(() => {
    const q = parseFloat(quantity);
    const p = parseFloat(price);
    
    if (!isNaN(q) && !isNaN(p)) {
        const calculatedTotal = q * p;
        setTotal(new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(calculatedTotal));
    } else {
        setTotal('$0');
    }
  }, [quantity, price]);

  const handleSave = () => {
    if (!quantity || !price || !client) {
        alert('Por favor complete la cantidad, precio y cliente.');
        return;
    }

    setLoading(true);

    const q = parseFloat(quantity);
    const p = parseFloat(price);
    const totalValue = q * p;

    // Construct new sale object
    const newSale = {
        id: Date.now(), // Unique ID
        isoDate: date,
        date: new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        product: cheeseType,
        client: client,
        quantity: q,
        unitPrice: p,
        total: totalValue,
        notes: notes,
        status: paymentStatus === 'Credit' ? 'Pending' : paymentStatus === 'Paid' ? 'Paid' : 'Pending',
        // UI Helpers based on type
        iconType: cheeseType === 'Queso Costeño' ? 'Crown' : cheeseType === 'Queso Mozzarella' ? 'Droplets' : 'Circle',
        color: cheeseType === 'Queso Costeño' ? 'text-orange-400' : 'text-blue-400',
        bg: cheeseType === 'Queso Costeño' ? 'bg-orange-900/20' : 'bg-blue-900/20'
    };

    // Save to LocalStorage
    const existingSales = JSON.parse(localStorage.getItem('cheese_sales_data') || '[]');
    const updatedSales = [newSale, ...existingSales];
    localStorage.setItem('cheese_sales_data', JSON.stringify(updatedSales));

    setTimeout(() => {
        setLoading(false);
        navigate('/cheese-sales');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#102216] font-display text-white selection:bg-[#13ec5b] selection:text-black flex flex-col pb-32">
      <style>{`
        details > summary {
            list-style: none;
        }
        details > summary::-webkit-details-marker {
            display: none;
        }
        details[open] summary ~ * {
            animation: sweep .3s ease-in-out;
        }
        @keyframes sweep {
            0%    {opacity: 0; transform: translateY(-10px)}
            100%  {opacity: 1; transform: translateY(0)}
        }
        .rotate-icon {
            transition: transform 0.3s ease;
        }
        details[open] summary .rotate-icon {
            transform: rotate(180deg);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#102216]/95 backdrop-blur-md border-b border-[#2A3C30]">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#2A3C30] transition-colors text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold leading-tight flex-1 text-center">Registrar Venta</h1>
          <div className="w-10 h-10"></div>
        </div>
      </header>

      <main className="w-full max-w-md mx-auto p-4 space-y-4">
        
        {/* Stock Card */}
        <div className="bg-gradient-to-r from-[#1c2e22] to-[#16291d] p-4 rounded-xl border border-[#2A3C30] shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-10">
                <Package size={64} className="text-[#13ec5b]" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <Info size={14} className="text-[#FFC107]" />
                    <p className="text-xs font-bold text-[#FFC107] uppercase tracking-wider">Stock Disponible</p>
                </div>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-extrabold text-white">124 <span className="text-lg text-gray-400 font-medium">kg</span></h2>
                    <span className="text-sm text-gray-400">de {cheeseType}</span>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#13ec5b] h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
            </div>
        </div>

        {/* Details Accordion */}
        <details className="group bg-[#1c2e22] rounded-xl border border-[#2A3C30] shadow-sm overflow-hidden" open>
            <summary className="flex items-center justify-between p-4 cursor-pointer select-none bg-[#223629]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#13ec5b]/10 flex items-center justify-center text-[#13ec5b]">
                        <ShoppingBasket size={18} />
                    </div>
                    <h3 className="font-bold text-white">Detalles de la Venta</h3>
                </div>
                <ChevronDown size={20} className="text-gray-400 rotate-icon" />
            </summary>
            <div className="p-4 pt-2 space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Fecha de Venta</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={18} className="text-gray-400" />
                        </div>
                        <input 
                            className="w-full bg-[#102216] border border-[#2A3C30] text-white text-sm rounded-lg focus:ring-[#13ec5b] focus:border-[#13ec5b] block pl-10 p-2.5 shadow-sm font-medium transition-colors [color-scheme:dark]" 
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Tipo de Queso</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Circle size={18} className="text-gray-400" />
                        </div>
                        <select 
                            className="w-full bg-[#102216] border border-[#2A3C30] text-white text-sm rounded-lg focus:ring-[#13ec5b] focus:border-[#13ec5b] block pl-10 p-2.5 shadow-sm font-medium transition-colors appearance-none"
                            value={cheeseType}
                            onChange={(e) => setCheeseType(e.target.value)}
                        >
                            <option>Queso Costeño</option>
                            <option>Queso Campesino</option>
                            <option>Queso Mozzarella</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown size={20} className="text-gray-400" />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Cantidad (kg)</label>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Scale size={18} className="text-gray-400" />
                            </div>
                            <input 
                                className="w-full bg-[#102216] border border-[#2A3C30] text-white text-sm rounded-lg focus:ring-[#13ec5b] focus:border-[#13ec5b] block pl-10 p-2.5 shadow-sm font-medium transition-colors placeholder-gray-500" 
                                placeholder="0.0" 
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </details>

        {/* Financial Accordion */}
        <details className="group bg-[#1c2e22] rounded-xl border border-[#2A3C30] shadow-sm overflow-hidden" open>
            <summary className="flex items-center justify-between p-4 cursor-pointer select-none bg-[#223629]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFC107]/10 flex items-center justify-center text-[#FFC107]">
                        <DollarSign size={18} />
                    </div>
                    <h3 className="font-bold text-white">Información Financiera</h3>
                </div>
                <ChevronDown size={20} className="text-gray-400 rotate-icon" />
            </summary>
            <div className="p-4 pt-2 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Precio Unidad</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm">$</span>
                            <input 
                                className="w-full bg-[#102216] border border-[#2A3C30] text-white text-sm rounded-lg focus:ring-[#FFC107] focus:border-[#FFC107] block pl-7 p-2.5 shadow-sm font-medium text-right placeholder-gray-500" 
                                placeholder="0" 
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Total Estimado</label>
                        <div className="relative">
                            <input 
                                className="w-full bg-[#FFC107]/10 border border-[#FFC107]/20 text-[#FFC107] text-sm font-bold rounded-lg block p-2.5 shadow-sm text-right cursor-not-allowed" 
                                readOnly 
                                type="text" 
                                value={total}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-2">Estado de Pago</label>
                    <div className="grid grid-cols-3 gap-2">
                        <label className="cursor-pointer">
                            <input 
                                type="radio" 
                                name="payment_status" 
                                className="peer sr-only" 
                                checked={paymentStatus === 'Paid'}
                                onChange={() => setPaymentStatus('Paid')}
                            />
                            <div className="text-center py-2 rounded-lg border border-[#2A3C30] text-xs font-bold text-gray-400 peer-checked:bg-[#13ec5b] peer-checked:text-black peer-checked:border-[#13ec5b] transition-all">
                                Pagado
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input 
                                type="radio" 
                                name="payment_status" 
                                className="peer sr-only" 
                                checked={paymentStatus === 'Pending'}
                                onChange={() => setPaymentStatus('Pending')}
                            />
                            <div className="text-center py-2 rounded-lg border border-[#2A3C30] text-xs font-bold text-gray-400 peer-checked:bg-[#FFC107] peer-checked:text-black peer-checked:border-[#FFC107] transition-all">
                                Pendiente
                            </div>
                        </label>
                        <label className="cursor-pointer">
                            <input 
                                type="radio" 
                                name="payment_status" 
                                className="peer sr-only" 
                                checked={paymentStatus === 'Credit'}
                                onChange={() => setPaymentStatus('Credit')}
                            />
                            <div className="text-center py-2 rounded-lg border border-[#2A3C30] text-xs font-bold text-gray-400 peer-checked:bg-red-500 peer-checked:text-white peer-checked:border-red-500 transition-all">
                                Fiado
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </details>

        {/* Client Accordion */}
        <details className="group bg-[#1c2e22] rounded-xl border border-[#2A3C30] shadow-sm overflow-hidden" open>
            <summary className="flex items-center justify-between p-4 cursor-pointer select-none bg-[#223629]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <User size={18} />
                    </div>
                    <h3 className="font-bold text-white">Cliente y Notas</h3>
                </div>
                <ChevronDown size={20} className="text-gray-400 rotate-icon" />
            </summary>
            <div className="p-4 pt-2 space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Cliente</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400" />
                        </div>
                        <input 
                            className="w-full bg-[#102216] border border-[#2A3C30] text-white text-sm rounded-lg focus:ring-[#13ec5b] focus:border-[#13ec5b] block pl-10 p-2.5 shadow-sm font-medium transition-colors placeholder-gray-500" 
                            placeholder="Nombre del Cliente..." 
                            type="text"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Notas Adicionales</label>
                    <textarea 
                        className="w-full bg-[#102216] border border-[#2A3C30] text-white text-sm rounded-lg focus:ring-[#13ec5b] focus:border-[#13ec5b] block p-2.5 shadow-sm font-medium transition-colors resize-none placeholder-gray-500" 
                        placeholder="Ej: Pago realizado por Nequi..." 
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </details>

      </main>

      {/* FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-[#13ec5b] hover:bg-[#11d852] text-black font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-[#13ec5b]/25 transition-transform active:scale-95 group disabled:opacity-70 disabled:scale-100"
        >
            {loading ? (
                <span className="animate-pulse">Guardando...</span>
            ) : (
                <>
                    <Save size={24} className="transition-transform group-hover:rotate-12 group-active:scale-110" />
                    <span>Guardar Venta</span>
                </>
            )}
        </button>
      </div>

    </div>
  );
};

export default RegisterCheeseSale;
