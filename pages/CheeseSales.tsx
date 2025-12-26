
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BarChart3, Calendar, Edit2, 
  ChevronDown, ChevronUp, X, Crown, Droplets, Circle, Plus,
  LayoutGrid, Cookie, Store, Check, FileText, DollarSign, User,
  Trash2, Share2, Save, Loader2, Download, Maximize2, Minimize2
} from 'lucide-react';
import html2canvas from 'html2canvas';

const CheeseSales: React.FC = () => {
  const navigate = useNavigate();

  // --- MOCK INITIAL DATA ---
  const initialSales = [
    { 
        id: 1, 
        isoDate: '2023-03-12', 
        product: 'Doble Crema', 
        client: 'Juan Pérez', 
        date: '12 Mar', 
        quantity: 50, 
        total: 600000, 
        unitPrice: 12000,
        notes: 'Pago en efectivo contra entrega.',
        icon: Crown, 
        color: 'text-orange-400', 
        bg: 'bg-orange-900/20', 
        status: 'Paid' 
    },
    { 
        id: 2, 
        isoDate: '2023-03-11', 
        product: 'Queso Fresco', 
        client: 'Supermercado El Sol', 
        date: '11 Mar', 
        quantity: 120, 
        total: 1400000, 
        unitPrice: 11666,
        notes: 'Factura #FE-00293. Transferencia Bancolombia.',
        icon: Droplets, 
        color: 'text-blue-400', 
        bg: 'bg-blue-900/20', 
        status: 'Paid' 
    },
    { 
        id: 3, 
        isoDate: '2023-03-10', 
        product: 'Costeño', 
        client: 'Restaurante La Plaza', 
        date: '10 Mar', 
        quantity: 80, 
        total: 950000, 
        unitPrice: 11875,
        notes: 'Pendiente de pago. Vence en 15 días.',
        icon: Circle, 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-900/20', 
        status: 'Pending' 
    },
    { 
        id: 4, 
        isoDate: '2023-03-09', 
        product: 'Doble Crema', 
        client: 'Venta Directa', 
        date: '09 Mar', 
        quantity: 15, 
        total: 180000, 
        unitPrice: 12000,
        notes: 'Venta en puerta de finca.',
        icon: Crown, 
        color: 'text-orange-400', 
        bg: 'bg-orange-900/20', 
        status: 'Pending' 
    },
    { 
        id: 5, 
        isoDate: '2023-03-08', 
        product: 'Queso Fresco', 
        client: 'Juan Pérez', 
        date: '08 Mar', 
        quantity: 30, 
        total: 350000, 
        unitPrice: 11666,
        notes: 'Pago parcial recibido.',
        icon: Droplets, 
        color: 'text-blue-400', 
        bg: 'bg-blue-900/20', 
        status: 'Paid' 
    },
    { 
        id: 6, 
        isoDate: '2023-02-28', 
        product: 'Costeño', 
        client: 'Juan Pérez', 
        date: '28 Feb', 
        quantity: 20, 
        total: 240000, 
        unitPrice: 12000,
        notes: 'Saldo anterior.',
        icon: Circle, 
        color: 'text-yellow-400', 
        bg: 'bg-yellow-900/20', 
        status: 'Paid' 
    },
  ];

  // Helper to resolve icon from string type
  const getIconComponent = (type: string) => {
      switch (type) {
          case 'Crown': return Crown;
          case 'Droplets': return Droplets;
          default: return Circle;
      }
  };

  // --- STATE ---
  const [salesList, setSalesList] = useState(() => {
      // Initialize from LocalStorage + Mock Data
      const saved = localStorage.getItem('cheese_sales_data');
      let localData: any[] = [];
      
      if (saved) {
          try {
              const parsed = JSON.parse(saved);
              // Hydrate icons
              localData = parsed.map((item: any) => ({
                  ...item,
                  icon: getIconComponent(item.iconType)
              }));
          } catch (e) {
              console.error("Error parsing sales data", e);
          }
      }
      return [...localData, ...initialSales];
  });
  
  // Update persistence when salesList changes
  useEffect(() => {
      const userSales = salesList.filter(s => s.id > 1000).map(s => ({
          ...s,
          icon: undefined, // Don't save component
          iconType: s.product.includes('Costeño') ? 'Crown' : s.product.includes('Mozzarella') ? 'Droplets' : 'Circle'
      }));
      
      if (userSales.length > 0) {
          localStorage.setItem('cheese_sales_data', JSON.stringify(userSales));
      }
  }, [salesList]);

  // Filters
  const [productFilter, setProductFilter] = useState('Todos');
  const [clientFilter, setClientFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '2023-01-01', end: new Date().toISOString().split('T')[0] });
  const [openFilter, setOpenFilter] = useState<'product' | 'client' | 'status' | null>(null);

  // Chart View State
  const [chartView, setChartView] = useState<'half' | 'full'>('half'); // 'half' = 6 months, 'full' = 12 months

  // UI Interactions
  const [expandedSaleId, setExpandedSaleId] = useState<number | null>(null);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [editingSale, setEditingSale] = useState<any | null>(null); // For Edit Modal
  
  // Sharing
  const [isSharing, setIsSharing] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  // --- DYNAMIC CHART DATA GENERATION ---
  const chartData = useMemo(() => {
      // 1. Determine anchor date (latest sale date) to ensure chart looks populated even with mock data
      const latestSaleDate = salesList.reduce((max, sale) => {
          const d = new Date(sale.isoDate);
          return d > max ? d : max;
      }, new Date()); // Default to today if no sales

      const anchorDate = new Date(latestSaleDate);
      anchorDate.setDate(1); // Start from beginning of the month for calculation clarity
      
      const monthsToShow = chartView === 'half' ? 6 : 12;
      const data = [];
      const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

      // 2. Loop backwards from anchor date
      for (let i = monthsToShow - 1; i >= 0; i--) {
          const d = new Date(anchorDate.getFullYear(), anchorDate.getMonth() - i, 1);
          const monthIndex = d.getMonth();
          const year = d.getFullYear();
          
          // 3. Sum sales for this specific month/year
          const monthTotal = salesList.reduce((sum, sale) => {
              const saleDate = new Date(sale.isoDate);
              // Simple check ignoring timezones for this demo
              if (saleDate.getMonth() === monthIndex && saleDate.getFullYear() === year) {
                  return sum + sale.total;
              }
              return sum;
          }, 0);

          data.push({
              label: monthNames[monthIndex],
              fullYear: year,
              monthIndex: monthIndex,
              value: monthTotal, 
              displayValue: monthTotal >= 1000000 ? `$${(monthTotal / 1000000).toFixed(1)}M` : (monthTotal > 0 ? `$${(monthTotal/1000).toFixed(0)}k` : ''),
              // Check if currently selected date range matches this month (to highlight bar)
              isActive: dateRange.start.startsWith(`${year}-${String(monthIndex+1).padStart(2,'0')}`) && dateRange.end.startsWith(`${year}-${String(monthIndex+1).padStart(2,'0')}`)
          });
      }

      // 4. Calculate relative height for bars
      const maxVal = Math.max(...data.map(d => d.value), 100000); // Minimum base to avoid 100% height on 0

      return data.map(d => ({
          ...d,
          height: `${Math.max(Math.round((d.value / maxVal) * 100), 5)}%`, // Minimum 5% height for visual clickability
          isRealData: d.value > 0
      }));
  }, [salesList, chartView, dateRange]);

  // --- FORMATTERS ---
  const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  }

  const formatCompactCurrency = (val: number) => {
      if (val >= 1000000) {
          return `$${(val / 1000000).toFixed(1)}M`;
      }
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val).replace('COP', '').trim();
  };

  // --- ACTIONS ---
  
  const handleChartBarClick = (monthIndex: number, year: number) => {
      // Calculate Start and End of the clicked month
      const start = new Date(year, monthIndex, 1);
      const end = new Date(year, monthIndex + 1, 0); // Last day of month
      
      // Format to YYYY-MM-DD for the filter
      // Use local time string parts to avoid timezone shift issues in simple date inputs
      const format = (d: Date) => {
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${y}-${m}-${day}`;
      };
      
      setDateRange({
          start: format(start),
          end: format(end)
      });
      
      // Reset text filters to show all for that month
      setProductFilter('Todos');
      setClientFilter('Todos');
      setStatusFilter('Todos');
  };

  const handleMarkPaid = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      setSalesList(prev => prev.map(s => s.id === id ? { ...s, status: 'Paid' } : s));
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      if (window.confirm('¿Estás seguro de eliminar esta venta? Esta acción no se puede deshacer.')) {
          setSalesList(prev => prev.filter(s => s.id !== id));
          if (expandedSaleId === id) setExpandedSaleId(null);
      }
  };

  const handleEdit = (e: React.MouseEvent, sale: any) => {
      e.stopPropagation();
      setEditingSale({ ...sale });
  };

  const saveEdit = () => {
      if (!editingSale) return;
      const newTotal = editingSale.quantity * editingSale.unitPrice;
      
      setSalesList(prev => prev.map(s => s.id === editingSale.id ? { 
          ...s, 
          quantity: editingSale.quantity, 
          unitPrice: editingSale.unitPrice, 
          total: newTotal,
          client: editingSale.client,
          notes: editingSale.notes
      } : s));
      
      setEditingSale(null);
  };

  const handleViewReceipt = (e: React.MouseEvent, sale: any) => {
      e.stopPropagation();
      setReceiptData(sale);
  }

  // --- GENERATE BLOB HELPER ---
  const generateReceiptBlob = async (): Promise<Blob | null> => {
      if (!receiptRef.current) return null;
      try {
          const canvas = await html2canvas(receiptRef.current, {
              backgroundColor: '#ffffff',
              scale: 2,
              useCORS: true,
              logging: false
          });
          return new Promise(resolve => {
              canvas.toBlob(blob => resolve(blob), 'image/png');
          });
      } catch (err) {
          console.error(err);
          return null;
      }
  };

  const handleShareReceipt = async () => {
      setIsSharing(true);
      const blob = await generateReceiptBlob();
      if (!blob) {
          setIsSharing(false);
          alert("Error al generar imagen");
          return;
      }
      const file = new File([blob], `Recibo-${receiptData.id}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
              await navigator.share({
                  files: [file],
                  title: 'Recibo BovineGuard',
              });
          } catch (err) {
              console.error('Error sharing:', err);
          }
      } else {
          const link = document.createElement('a');
          link.download = `Recibo-${receiptData.id}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          alert('Imagen guardada en descargas (Compartir no soportado)');
      }
      setIsSharing(false);
  };

  const handleDownloadReceipt = async () => {
      setIsSharing(true);
      const blob = await generateReceiptBlob();
      if (blob) {
          const link = document.createElement('a');
          link.download = `Recibo-${receiptData.id}.png`;
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } else {
          alert("Error al descargar");
      }
      setIsSharing(false);
  };

  // --- FILTERING LOGIC ---
  const uniqueProducts = useMemo(() => ['Todos', ...Array.from(new Set(salesList.map(s => s.product)))], [salesList]);
  const uniqueClients = useMemo(() => ['Todos', ...Array.from(new Set(salesList.map(s => s.client)))], [salesList]);
  const uniqueStatuses = ['Todos', 'Paid', 'Pending'];

  const toggleFilterMenu = (type: 'product' | 'client' | 'status') => {
      if (openFilter === type) setOpenFilter(null);
      else {
          setOpenFilter(type);
          setShowDateMenu(false);
      }
  };

  const handleSelect = (type: 'product' | 'client' | 'status', value: string) => {
      if (type === 'product') setProductFilter(value);
      if (type === 'client') setClientFilter(value);
      if (type === 'status') setStatusFilter(value);
      setOpenFilter(null);
  };

  const toggleExpand = (id: number) => {
      setExpandedSaleId(expandedSaleId === id ? null : id);
  };

  const formatDateRangeDisplay = () => {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
      return `${start.toLocaleDateString('es-ES', options)} - ${end.toLocaleDateString('es-ES', options)}, ${end.getFullYear()}`;
  };

  const filteredSales = salesList.filter(item => {
    const matchProduct = productFilter === 'Todos' || item.product === productFilter;
    const matchClient = clientFilter === 'Todos' || item.client === clientFilter;
    const matchStatus = statusFilter === 'Todos' || item.status === statusFilter;
    
    const itemDate = new Date(item.isoDate);
    // Be inclusive with time
    const startDate = new Date(dateRange.start); startDate.setHours(0,0,0,0);
    const endDate = new Date(dateRange.end); endDate.setHours(23,59,59,999);
    
    const matchDate = itemDate >= startDate && itemDate <= endDate;

    return matchProduct && matchClient && matchStatus && matchDate;
  });

  // --- KPI CALCULATIONS ---
  const totalIncome = filteredSales.reduce((acc, sale) => acc + sale.total, 0);
  const totalVolume = filteredSales.reduce((acc, sale) => acc + sale.quantity, 0);

  const getStatusLabel = (status: string) => {
      if (status === 'Paid') return 'Pagado';
      if (status === 'Pending') return 'Pendiente';
      return 'Estado: Todos';
  };

  return (
    <div className="min-h-screen bg-[#102216] text-white font-display flex flex-col pb-24">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#102216]/95 backdrop-blur-md border-b border-[#2A3C30]">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={() => navigate('/add-cheese')} 
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold leading-tight flex-1 text-center">Ventas de Queso</h1>
          <div className="w-10 h-10"></div>
        </div>
      </header>

      <main className="w-full max-w-md mx-auto flex-1 overflow-y-auto no-scrollbar">
        
        {/* Summary Cards (KPIs) */}
        <div className="px-4 py-4 grid grid-cols-2 gap-3">
          <div className="bg-[#1E2923] p-4 rounded-xl border border-[#2A3C30] shadow-sm">
            <p className="text-xs font-medium text-[#9db9a6] mb-1">Total Ingresos</p>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-bold text-white">{formatCompactCurrency(totalIncome)}</p>
            </div>
          </div>
          <div className="bg-[#1E2923] p-4 rounded-xl border border-[#2A3C30] shadow-sm">
            <p className="text-xs font-medium text-[#9db9a6] mb-1">Volumen Total</p>
            <div className="flex items-baseline gap-1">
              <p className="text-xl font-bold text-white">{totalVolume.toLocaleString('es-CO')} <span className="text-sm font-normal text-gray-400">kg</span></p>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Section */}
        <section className="px-4 mb-6">
          <div className="bg-[#1E2923] rounded-xl p-5 border border-[#2A3C30] shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-white">Ventas Mensuales</h2>
                <p className="text-xs text-[#9db9a6]">
                    {chartView === 'half' ? 'Último Semestre' : 'Año Completo'}
                </p>
              </div>
              <button 
                onClick={() => setChartView(chartView === 'half' ? 'full' : 'half')}
                className="p-2 rounded-lg bg-[#2A3C30] hover:bg-[#344a3c] transition-colors active:scale-95"
                title={chartView === 'half' ? 'Ver 12 meses' : 'Ver 6 meses'}
              >
                {chartView === 'half' ? <Maximize2 size={18} className="text-[#9db9a6]" /> : <Minimize2 size={18} className="text-[#9db9a6]" />}
              </button>
            </div>
            
            {/* Dynamic Bars */}
            <div className={`grid gap-2 h-40 items-end transition-all duration-300 ${chartView === 'full' ? 'grid-cols-12' : 'grid-cols-6'}`}>
              {chartData.map((data, index) => (
                <div 
                    key={index} 
                    onClick={() => handleChartBarClick(data.monthIndex, data.fullYear)}
                    className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative"
                >
                  <div 
                    className={`relative w-full rounded-t-sm transition-all duration-500 ease-out group-hover:opacity-90 ${data.isRealData ? 'bg-[#13ec5b]/20 hover:bg-[#13ec5b]/40' : 'bg-[#2A3C30]/50'}`}
                    style={{ height: data.height }}
                  >
                    <div 
                        className={`absolute bottom-0 left-0 right-0 h-full rounded-t-sm transition-all duration-300 ${
                            data.isActive 
                            ? 'bg-[#13ec5b] opacity-100 shadow-[0_0_15px_rgba(19,236,91,0.3)]' 
                            : data.isRealData ? 'bg-[#13ec5b] opacity-60' : 'bg-[#2A3C30] opacity-30'
                        }`}
                    ></div>
                    
                    {/* Tooltip on Hover */}
                    {data.isRealData && (
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] py-1 px-1.5 rounded whitespace-nowrap z-10 transition-opacity pointer-events-none border border-white/10 shadow-lg">
                            {data.displayValue}
                        </div>
                    )}
                  </div>
                  <span className={`text-[9px] font-bold uppercase transition-colors ${data.isActive ? 'text-white' : 'text-gray-500'}`}>{data.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="mb-2 relative z-20">
          <div className="px-4 mb-3">
            <h3 className="text-sm font-bold text-white mb-3">Filtros Activos</h3>
            
            {/* Date Range Display (Clickable) */}
            <div className="relative mb-3">
              <div 
                onClick={() => { setShowDateMenu(!showDateMenu); setOpenFilter(null); }}
                className={`relative w-full bg-[#1E2923] border ${showDateMenu ? 'border-[#13ec5b]' : 'border-[#2A3C30]'} rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors active:scale-[0.99]`}
              >
                  <div className="flex items-center gap-3">
                    <Calendar size={20} className="text-gray-400" />
                    <span className="text-sm font-medium text-white">{formatDateRangeDisplay()}</span>
                  </div>
                  <div className={`p-1 rounded-full ${showDateMenu ? 'bg-[#13ec5b] text-black' : 'text-[#13ec5b]'}`}>
                    {showDateMenu ? <ChevronUp size={16} /> : <Edit2 size={16} />}
                  </div>
              </div>

              {/* Date Menu Dropdown */}
              {showDateMenu && (
                  <div className="mt-2 p-4 bg-[#1E2923] border border-[#2A3C30] rounded-xl shadow-xl animate-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-4 border-b border-[#2A3C30] pb-2">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rango de Fechas</span>
                          <button onClick={(e) => { e.stopPropagation(); setShowDateMenu(false); }} className="text-gray-500 hover:text-white"><X size={16}/></button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[10px] text-gray-400 font-bold mb-1">Desde</label>
                              <input 
                                  type="date" 
                                  value={dateRange.start}
                                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                  className="w-full bg-[#102216] border border-[#2A3C30] rounded-lg p-2 text-xs text-white focus:border-[#13ec5b] outline-none [color-scheme:dark]"
                              />
                          </div>
                          <div>
                              <label className="block text-[10px] text-gray-400 font-bold mb-1">Hasta</label>
                              <input 
                                  type="date" 
                                  value={dateRange.end}
                                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                  className="w-full bg-[#102216] border border-[#2A3C30] rounded-lg p-2 text-xs text-white focus:border-[#13ec5b] outline-none [color-scheme:dark]"
                              />
                          </div>
                      </div>
                      <button 
                        onClick={() => setShowDateMenu(false)}
                        className="w-full mt-4 bg-[#13ec5b] text-black font-bold text-xs py-2.5 rounded-lg active:scale-95 transition-transform"
                      >
                          Aplicar Rango
                      </button>
                  </div>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 no-scrollbar">
              
              <button 
                onClick={() => toggleFilterMenu('product')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all ${
                    productFilter !== 'Todos' 
                    ? 'bg-[#13ec5b] text-black shadow-[#13ec5b]/20' 
                    : 'bg-[#2A3C30] border border-transparent text-gray-300 hover:bg-[#344a3c]'
                }`}
              >
                <span>{productFilter === 'Todos' ? 'Todo el Queso' : productFilter}</span>
                {productFilter !== 'Todos' ? (
                    <div onClick={(e) => { e.stopPropagation(); setProductFilter('Todos'); }} className="p-0.5 rounded-full hover:bg-black/10">
                        <X size={14} />
                    </div>
                ) : (
                    openFilter === 'product' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </button>

              <button 
                onClick={() => toggleFilterMenu('client')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all ${
                    clientFilter !== 'Todos' 
                    ? 'bg-[#13ec5b] text-black shadow-[#13ec5b]/20' 
                    : 'bg-[#2A3C30] border border-transparent text-gray-300 hover:bg-[#344a3c]'
                }`}
              >
                <span>{clientFilter === 'Todos' ? 'Por Cliente' : clientFilter}</span>
                {clientFilter !== 'Todos' ? (
                    <div onClick={(e) => { e.stopPropagation(); setClientFilter('Todos'); }} className="p-0.5 rounded-full hover:bg-black/10">
                        <X size={14} />
                    </div>
                ) : (
                    openFilter === 'client' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </button>

              <button 
                onClick={() => toggleFilterMenu('status')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all ${
                    statusFilter !== 'Todos' 
                    ? 'bg-[#13ec5b] text-black shadow-[#13ec5b]/20' 
                    : 'bg-[#2A3C30] border border-transparent text-gray-300 hover:bg-[#344a3c]'
                }`}
              >
                <span>{getStatusLabel(statusFilter)}</span>
                {statusFilter !== 'Todos' ? (
                    <div onClick={(e) => { e.stopPropagation(); setStatusFilter('Todos'); }} className="p-0.5 rounded-full hover:bg-black/10">
                        <X size={14} />
                    </div>
                ) : (
                    openFilter === 'status' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                )}
              </button>
            </div>

            {openFilter && (
                <div className="mt-3 bg-[#1E2923] p-3 rounded-xl border border-[#2A3C30] animate-in slide-in-from-top-2 shadow-xl">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#2A3C30]">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Seleccionar {openFilter === 'product' ? 'Producto' : openFilter === 'client' ? 'Cliente' : 'Estado'}
                        </span>
                        <button onClick={() => setOpenFilter(null)}><X size={16} className="text-gray-500 hover:text-white"/></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(openFilter === 'product' ? uniqueProducts : openFilter === 'client' ? uniqueClients : uniqueStatuses).map(opt => {
                            const isSelected = 
                                (openFilter === 'product' && productFilter === opt) ||
                                (openFilter === 'client' && clientFilter === opt) ||
                                (openFilter === 'status' && statusFilter === opt);
                            
                            return (
                                <button
                                    key={opt}
                                    onClick={() => handleSelect(openFilter, opt)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
                                        isSelected
                                        ? 'bg-[#13ec5b]/20 border-[#13ec5b] text-[#13ec5b]'
                                        : 'border-[#2A3C30] text-gray-300 hover:bg-white/5 hover:border-gray-500'
                                    }`}
                                >
                                    {opt === 'Paid' ? 'Pagado' : opt === 'Pending' ? 'Pendiente' : opt}
                                    {isSelected && <Check size={14} strokeWidth={3} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

          </div>
        </section>

        {/* List Section */}
        <section className="bg-[#102216] min-h-[400px]">
          <div className="px-4 py-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Detalles de Venta ({filteredSales.length})</h3>
            {(productFilter !== 'Todos' || clientFilter !== 'Todos' || statusFilter !== 'Todos' || dateRange.start !== '2023-01-01' ) && (
                <button 
                    onClick={() => { 
                        setProductFilter('Todos'); 
                        setClientFilter('Todos'); 
                        setStatusFilter('Todos'); 
                        setOpenFilter(null);
                        setDateRange({ start: '2023-01-01', end: new Date().toISOString().split('T')[0] }); 
                    }}
                    className="text-xs text-[#13ec5b] font-bold hover:underline"
                >
                    Borrar Filtros
                </button>
            )}
          </div>
          
          <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-6">Producto & Cliente</div>
            <div className="col-span-3 text-right">Cant.</div>
            <div className="col-span-3 text-right">Total</div>
          </div>

          <div className="flex flex-col gap-2 px-4 pb-4">
            {filteredSales.length === 0 ? (
                <div className="py-10 text-center opacity-50">
                    <p className="text-sm font-bold text-gray-400">No se encontraron ventas</p>
                    <p className="text-xs text-gray-500">Intenta cambiar los filtros o el rango de fechas</p>
                </div>
            ) : (
                filteredSales.map((sale) => {
                    const isExpanded = expandedSaleId === sale.id;
                    return (
                        <div 
                            key={sale.id} 
                            onClick={() => toggleExpand(sale.id)}
                            className={`group bg-[#1E2923] border border-[#2A3C30] rounded-xl shadow-sm flex flex-col relative overflow-hidden transition-all cursor-pointer ${isExpanded ? 'ring-1 ring-[#13ec5b]/50' : 'active:scale-[0.99]'}`}
                        >
                            {/* Card Main Content */}
                            <div className="p-3">
                                <div className="grid grid-cols-12 items-center gap-2">
                                    <div className="col-span-7 flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${sale.bg} ${sale.color}`}>
                                            <sale.icon size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-bold text-white truncate">{sale.product}</h4>
                                            <p className="text-xs text-gray-400 truncate">{sale.client} • <span className="text-[10px]">{sale.date}</span></p>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="text-xs font-medium text-gray-300">{sale.quantity}kg</span>
                                    </div>
                                    <div className="col-span-3 text-right flex flex-col items-end">
                                        <span className={`text-sm font-bold ${sale.status === 'Paid' ? 'text-[#13ec5b]' : 'text-yellow-500'}`}>
                                            {formatCurrency(sale.total).replace('COP', '').trim()}
                                        </span>
                                        {isExpanded ? <ChevronUp size={12} className="text-gray-500 mt-1" /> : <ChevronDown size={12} className="text-gray-500 mt-1" />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="border-t border-[#2A3C30] bg-black/20 p-4 animate-in slide-in-from-top-1">
                                    
                                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={(e) => handleEdit(e, sale)}
                                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-blue-400 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(e, sale.id)}
                                                className="p-2 bg-white/5 hover:bg-red-500/20 rounded-full text-red-500 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs mb-4">
                                        <div>
                                            <span className="text-gray-500 block font-bold mb-0.5">Precio Unitario</span>
                                            <span className="text-white font-medium flex items-center gap-1">
                                                <DollarSign size={12} className="text-[#13ec5b]"/> {formatCurrency(sale.unitPrice)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block font-bold mb-0.5">ID Transacción</span>
                                            <span className="text-white font-mono tracking-wide">#TX-{sale.id}992</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500 block font-bold mb-0.5">Notas / Observaciones</span>
                                            <span className="text-gray-300 leading-relaxed block p-2 bg-white/5 rounded-lg border border-white/5">
                                                {sale.notes || 'Sin notas adicionales.'}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block font-bold mb-0.5">Comprador</span>
                                            <span className="text-white font-medium flex items-center gap-1">
                                                <User size={12} className="text-gray-400"/> {sale.client}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block font-bold mb-0.5">Estado Pago</span>
                                            <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded w-fit block ${sale.status === 'Paid' ? 'bg-[#13ec5b]/10 text-[#13ec5b]' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {sale.status === 'Paid' ? 'Completado' : 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => handleViewReceipt(e, sale)}
                                            className="flex-1 bg-[#2A3C30] hover:bg-[#344a3c] py-2.5 rounded-lg text-xs font-bold text-gray-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <FileText size={14} /> Ver Recibo
                                        </button>
                                        {sale.status === 'Pending' && (
                                            <button 
                                                onClick={(e) => handleMarkPaid(e, sale.id)}
                                                className="flex-1 bg-[#13ec5b] hover:bg-[#11d852] py-2.5 rounded-lg text-xs font-bold text-black transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Check size={14} /> Marcar Pagado
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
          </div>
        </section>

      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-30">
        <button 
          onClick={() => navigate('/register-cheese-sale')}
          className="flex items-center gap-2 bg-[#13ec5b] hover:bg-[#11d852] text-black font-bold py-3.5 px-5 rounded-2xl shadow-lg shadow-[#13ec5b]/25 transition-transform active:scale-95"
        >
          <Plus size={24} />
          <span>Nueva Venta</span>
        </button>
      </div>

      {/* Custom Bottom Nav (From AddCheese Context) */}
      <nav className="fixed bottom-0 left-0 flex h-16 w-full items-center justify-around border-t border-[#3b5443] bg-[#111813] px-2 shadow-lg z-30 shrink-0">
        <button onClick={() => navigate('/add-cheese')} className="flex flex-col items-center justify-center gap-1 p-2 text-gray-400 hover:text-[#13ec5b] transition-colors">
            <LayoutGrid size={24} />
            <span className="text-[10px] font-medium">Resumen</span>
        </button>
        <button onClick={() => navigate('/add-cheese')} className="flex flex-col items-center justify-center gap-1 p-2 text-gray-400 hover:text-[#13ec5b] transition-colors">
            <Cookie size={24} />
            <span className="text-[10px] font-medium">Quesos</span>
        </button>
        <button className="flex flex-col items-center justify-center gap-1 p-2 text-[#13ec5b]">
            <Store size={24} />
            <span className="text-[10px] font-medium">Ventas</span>
        </button>
      </nav>

      {/* Receipt Modal & Edit Modal remain unchanged ... */}
      {receiptData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setReceiptData(null)}>
              {/* Receipt Content */}
              <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                  <div ref={receiptRef} className="bg-white rounded-xl overflow-hidden shadow-2xl">
                      <div className="bg-[#102216] p-4 flex justify-center items-center text-white border-b border-[#3b5443]">
                          <h3 className="font-bold text-lg tracking-wide uppercase">BovineGuard</h3>
                      </div>
                      <div className="p-6 text-black font-mono text-sm leading-relaxed bg-white">
                          <div className="text-center mb-6 border-b pb-4 border-dashed border-gray-300">
                              <p className="text-gray-500 text-xs">Nit: 900.123.456-1</p>
                              <p className="text-gray-500 text-xs uppercase font-bold mt-1">Venta de Derivados Lácteos</p>
                          </div>
                          
                          <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Fecha:</span>
                              <span className="font-bold text-black">{receiptData.date}, 2023</span>
                          </div>
                          <div className="flex justify-between mb-4">
                              <span className="text-gray-600">Cliente:</span>
                              <span className="font-bold text-black">{receiptData.client}</span>
                          </div>

                          <table className="w-full mb-6">
                              <thead>
                                  <tr className="border-b border-black">
                                      <th className="text-left py-2 font-bold">Prod</th>
                                      <th className="text-right py-2 font-bold">Cant</th>
                                      <th className="text-right py-2 font-bold">Total</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                      <td className="py-2 text-black font-medium">{receiptData.product}</td>
                                      <td className="text-right py-2 text-black">{receiptData.quantity} Kg</td>
                                      <td className="text-right py-2 text-black font-bold">{formatCurrency(receiptData.total)}</td>
                                  </tr>
                              </tbody>
                          </table>

                          <div className="border-t-2 border-black border-dashed pt-4 flex justify-between text-xl font-bold text-black items-center">
                              <span>TOTAL</span>
                              <span>{formatCurrency(receiptData.total)}</span>
                          </div>
                          
                          <div className="mt-8 text-center">
                              <p className="text-xs text-gray-400 mb-1">Gracias por su compra.</p>
                              <p className="text-[10px] text-gray-300">Generado por BovineGuard App</p>
                          </div>
                      </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                      <button onClick={() => setReceiptData(null)} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 text-white transition-colors"><X size={20}/></button>
                      <button onClick={handleDownloadReceipt} disabled={isSharing} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 text-white transition-colors">
                          {isSharing ? <Loader2 size={20} className="animate-spin"/> : <Download size={20}/>}
                      </button>
                      <button onClick={handleShareReceipt} disabled={isSharing} className="flex-1 py-3 bg-[#13ec5b] text-black border border-[#13ec5b] rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#11d852] shadow-lg disabled:opacity-70 disabled:cursor-wait">
                          {isSharing ? 'Generando...' : <><Share2 size={18} /> Compartir Imagen</>}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {editingSale && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-[#1E2923] w-full max-w-sm rounded-t-2xl sm:rounded-2xl border border-[#2A3C30] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
                  <div className="p-4 border-b border-[#2A3C30] flex justify-between items-center">
                      <h3 className="font-bold text-white">Editar Venta</h3>
                      <button onClick={() => setEditingSale(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cantidad (kg)</label>
                          <input type="number" value={editingSale.quantity} onChange={(e) => setEditingSale({...editingSale, quantity: Number(e.target.value)})} className="w-full bg-[#102216] border border-[#2A3C30] rounded-xl p-3 text-white focus:border-[#13ec5b] outline-none font-bold"/>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Precio Unitario</label>
                          <input type="number" value={editingSale.unitPrice} onChange={(e) => setEditingSale({...editingSale, unitPrice: Number(e.target.value)})} className="w-full bg-[#102216] border border-[#2A3C30] rounded-xl p-3 text-white focus:border-[#13ec5b] outline-none font-bold"/>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Cliente</label>
                          <input type="text" value={editingSale.client} onChange={(e) => setEditingSale({...editingSale, client: e.target.value})} className="w-full bg-[#102216] border border-[#2A3C30] rounded-xl p-3 text-white focus:border-[#13ec5b] outline-none"/>
                      </div>
                      <div className="pt-2">
                          <button onClick={saveEdit} className="w-full bg-[#13ec5b] hover:bg-[#11d852] text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2"><Save size={18} /> Guardar Cambios</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default CheeseSales;
