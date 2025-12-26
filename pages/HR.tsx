
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Plus, MapPin, Calendar, Wallet, X, Check, DollarSign, History, Clock, Edit2, ChevronLeft, ChevronRight, AlignLeft, Trash2, Save } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { Worker, WorkerTask, WorkerEvent } from '../types';
import { mockTasks, mockEvents } from '../mockData';

const roleMap: Record<string, string> = {
  'Manager': 'Mayordomo',
  'Cowboy': 'Vaquero',
  'Vet': 'Veterinario'
};

interface Transaction {
    id: string;
    type: 'salary' | 'advance' | 'bonus';
    amount: number;
    date: string;
    description: string;
}

const HR: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'Directory' | 'Profile'>('Directory');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  
  // --- SEARCH STATE ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- DATA STATE (PERSISTED) ---
  const [workers, setWorkers] = useState<Worker[]>(() => {
      const saved = localStorage.getItem('hr_workers');
      if (saved) return JSON.parse(saved);
      return [
        { id: '1', name: 'Juan Pérez', role: 'Manager', imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150', status: 'Present', balance: 1250000 },
        { id: '2', name: 'Carlos Ruiz', role: 'Cowboy', imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150', status: 'Present', balance: 800000 },
        { id: '3', name: 'Ana Silva', role: 'Vet', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150', status: 'Absent', balance: 0 },
      ];
  });

  // Save workers whenever they change
  useEffect(() => {
      localStorage.setItem('hr_workers', JSON.stringify(workers));
  }, [workers]);

  // --- WORKER PROFILE STATE ---
  const [currentBalance, setCurrentBalance] = useState(0);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [events, setEvents] = useState<WorkerEvent[]>([]);

  // --- MODAL STATES ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'salary' | 'advance'>('salary');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // --- EDIT TRANSACTION STATE ---
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDate, setEditDate] = useState('');

  // Task Creation
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskLoc, setNewTaskLoc] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Calendar Event Creation
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(''); // YYYY-MM-DD
  const [eventType, setEventType] = useState<'Attendance' | 'Reminder'>('Attendance');
  const [eventTitle, setEventTitle] = useState(''); // For reminder

  // Calendar Navigation
  const [currentDate, setCurrentDate] = useState(new Date());

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Filter Workers Logic
  const filteredWorkers = workers.filter(w => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      const roleName = roleMap[w.role]?.toLowerCase() || '';
      return w.name.toLowerCase().includes(query) || roleName.includes(query);
  });

  // Initialize data when selecting a worker
  const handleWorkerClick = (w: Worker) => {
    setSelectedWorker(w);
    setCurrentBalance(w.balance);
    setCustomAmount('');
    setPaymentDescription('');
    setPaymentSuccess(false);
    setIsSearchOpen(false); // Close search when entering profile
    setSearchQuery('');
    
    // Load Transactions from LS
    const allTransactions = JSON.parse(localStorage.getItem('hr_transactions') || '{}');
    const workerTransactions = allTransactions[w.id];
    
    if (workerTransactions) {
        setTransactionHistory(workerTransactions);
    } else {
        // Init Mock if empty
        const mockHistory: Transaction[] = w.id === '1' ? [
            { id: 't1', type: 'advance', amount: 200000, date: '2023-10-15', description: 'Adelanto Efectivo' },
            { id: 't2', type: 'salary', amount: 1100000, date: '2023-09-30', description: 'Nómina Quincenal' },
        ] : [];
        setTransactionHistory(mockHistory);
    }
    
    setTasks(mockTasks.filter(t => t.workerId === w.id));
    setEvents(mockEvents.filter(e => e.workerId === w.id));

    setView('Profile');
  };

  // Helper to persist transactions
  const saveTransactionsToLS = (workerId: string, txs: Transaction[]) => {
      const all = JSON.parse(localStorage.getItem('hr_transactions') || '{}');
      all[workerId] = txs;
      localStorage.setItem('hr_transactions', JSON.stringify(all));
  };

  // Helper to update worker balance in global list
  const updateWorkerBalance = (workerId: string, newBalance: number) => {
      setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, balance: newBalance } : w));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  // --- TASK LOGIC ---
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  };

  const addNewTask = () => {
    if (!newTaskTitle) return;
    const newTask: WorkerTask = {
        id: Date.now().toString(),
        workerId: selectedWorker?.id || '',
        title: newTaskTitle,
        description: newTaskDesc,
        location: newTaskLoc || 'General',
        priority: 'Normal',
        isCompleted: false,
        dueDate: newTaskDueDate
    };
    setTasks([newTask, ...tasks]);
    
    // Reset Form
    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskLoc('');
    setNewTaskDueDate(new Date().toISOString().split('T')[0]);
    setShowTaskModal(false);
  };

  // --- CALENDAR LOGIC ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    return { daysInMonth, firstDay };
  };

  const { daysInMonth, firstDay } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleDateClick = (day: number) => {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDate(dateStr);
      setEventType('Attendance'); // Reset default
      setEventTitle('');
      setShowEventModal(true);
  };

  const addEvent = () => {
    let newEvents = events;
    if (eventType === 'Attendance') {
        newEvents = events.filter(e => e.date !== selectedDate || e.type !== 'Attendance');
    }

    const newEvent: WorkerEvent = {
        id: Date.now().toString(),
        workerId: selectedWorker?.id || '',
        date: selectedDate,
        type: eventType,
        status: eventType === 'Attendance' ? 'Present' : undefined,
        title: eventType === 'Reminder' ? eventTitle : undefined
    };

    setEvents([...newEvents, newEvent]);
    setShowEventModal(false);
  };

  const getEventForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  // --- PAYMENT LOGIC ---
  const handlePayment = () => {
     const amountToPay = paymentType === 'advance' ? parseInt(customAmount) : 850000;
     const desc = paymentType === 'advance' 
        ? (paymentDescription || 'Adelanto General') 
        : 'Liquidación Nómina';
     
     if(amountToPay > 0 && selectedWorker) {
        setPaymentSuccess(true);
        setTimeout(() => {
            const newTx: Transaction = { 
                id: Date.now().toString(), 
                type: paymentType, 
                amount: amountToPay, 
                date: new Date().toISOString().split('T')[0], 
                description: desc 
            };
            
            const updatedHistory = [newTx, ...transactionHistory];
            const newBalance = currentBalance - amountToPay;

            setTransactionHistory(updatedHistory);
            setCurrentBalance(newBalance);
            
            // Persist
            saveTransactionsToLS(selectedWorker.id, updatedHistory);
            updateWorkerBalance(selectedWorker.id, newBalance);

            setShowPaymentModal(false);
            setPaymentSuccess(false);
        }, 1000);
     }
  };

  // --- EDIT & DELETE TRANSACTIONS ---
  const deleteTransaction = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (!selectedWorker) return;

      if (window.confirm("¿Estás seguro de eliminar este pago? El saldo se ajustará automáticamente.")) {
          const txToDelete = transactionHistory.find(t => t.id === id);
          if (txToDelete) {
              const updatedHistory = transactionHistory.filter(t => t.id !== id);
              const newBalance = currentBalance + txToDelete.amount;

              setTransactionHistory(updatedHistory);
              setCurrentBalance(newBalance);

              // Persist
              saveTransactionsToLS(selectedWorker.id, updatedHistory);
              updateWorkerBalance(selectedWorker.id, newBalance);
          }
      }
  };

  const startEditTransaction = (e: React.MouseEvent, tx: Transaction) => {
      e.stopPropagation();
      setEditingTx(tx);
      setEditAmount(tx.amount.toString());
      setEditDesc(tx.description);
      setEditDate(tx.date); 
  };

  const saveTransactionEdit = () => {
      if (!editingTx || !selectedWorker) return;
      const newAmount = parseInt(editAmount);
      if (isNaN(newAmount) || newAmount <= 0) return;

      const oldAmount = editingTx.amount;
      const difference = oldAmount - newAmount; // Positive if we paid less now (owe more)

      const updatedHistory = transactionHistory.map(t => 
          t.id === editingTx.id ? { ...t, amount: newAmount, description: editDesc, date: editDate } : t
      );
      
      const newBalance = currentBalance + difference;

      setTransactionHistory(updatedHistory);
      setCurrentBalance(newBalance);

      // Persist
      saveTransactionsToLS(selectedWorker.id, updatedHistory);
      updateWorkerBalance(selectedWorker.id, newBalance);

      setEditingTx(null);
  };


  if (view === 'Profile' && selectedWorker) {
    return (
        <div className="min-h-screen bg-background-dark text-white font-display flex flex-col relative">
             <div className="p-4 flex items-center justify-between sticky top-0 bg-background-dark/95 backdrop-blur-md border-b border-white/5 z-20">
                 <button onClick={() => setView('Directory')} className="p-2 rounded-full hover:bg-white/10"><ArrowLeft size={20} /></button>
                 <h1 className="font-bold text-lg">Perfil del Trabajador</h1>
                 <button 
                    onClick={() => navigate(`/edit-worker/${selectedWorker.id}`)}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-primary transition-colors"
                 >
                    <Edit2 size={20} />
                 </button>
             </div>

             <main className="flex-1 p-4 pb-32 space-y-6 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img src={selectedWorker.imageUrl} className="w-20 h-20 rounded-full border-2 border-primary object-cover" />
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background-dark font-bold text-xs ${selectedWorker.status === 'Present' ? 'bg-primary text-background-dark' : 'bg-gray-500 text-white'}`}>
                            {selectedWorker.status === 'Present' ? '✓' : 'X'}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{selectedWorker.name}</h2>
                        <p className="text-sm text-primary font-bold uppercase tracking-wider">{roleMap[selectedWorker.role]}</p>
                        <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                            <MapPin size={14} /> Finca La Esperanza
                        </div>
                    </div>
                </div>

                {/* Financial Card */}
                <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 relative overflow-hidden group transition-all shadow-lg">
                     <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 blur-2xl rounded-full"></div>
                     <div className="relative z-10">
                         <div className="flex justify-between items-start mb-2">
                             <p className="text-gray-400 text-sm font-medium">Saldo Pendiente</p>
                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${currentBalance > 0 ? 'bg-accent-amber/20 text-accent-amber' : 'bg-green-500/20 text-green-500'}`}>
                                 {currentBalance > 0 ? 'Pendiente' : 'Al Día'}
                             </span>
                         </div>
                         <div className="flex items-baseline gap-1">
                             <span className="text-4xl font-extrabold tracking-tight transition-all duration-500">
                                 {formatCurrency(currentBalance)}
                             </span>
                         </div>
                     </div>
                </div>

                {/* Transaction History */}
                <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                        <History size={20} className="text-gray-400" />
                        Historial de Pagos
                    </h3>
                    <div className="space-y-3">
                         {transactionHistory.length === 0 ? (
                             <p className="text-sm text-gray-500 italic text-center py-4">No hay pagos registrados.</p>
                         ) : (
                             transactionHistory.map((tx) => (
                                <div key={tx.id} className="bg-surface-dark border border-white/5 p-4 rounded-xl relative group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'salary' ? 'bg-primary/20 text-primary' : 'bg-accent-amber/20 text-accent-amber'}`}>
                                                {tx.type === 'salary' ? <Check size={16} /> : <Clock size={16} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white">{tx.description}</p>
                                                <p className="text-[10px] text-gray-500">{tx.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-white text-sm">-{formatCurrency(tx.amount)}</p>
                                            <p className="text-[10px] text-gray-400 uppercase">Pagado</p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-2">
                                        <button 
                                            onClick={(e) => startEditTransaction(e, tx)}
                                            className="flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-white/5 rounded-lg"
                                        >
                                            <Edit2 size={12} /> Editar
                                        </button>
                                        <button 
                                            onClick={(e) => deleteTransaction(e, tx.id)}
                                            className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-white/5 rounded-lg"
                                        >
                                            <Trash2 size={12} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                         )}
                    </div>
                </div>

                {/* Tasks Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">Tareas Vinculadas</h3>
                        <button 
                            onClick={() => setShowTaskModal(true)}
                            className="flex items-center gap-1 bg-surface-dark rounded-lg px-3 py-1.5 border border-white/10 text-xs font-bold text-primary hover:bg-white/5"
                        >
                            <Plus size={14} /> Nueva Tarea
                        </button>
                    </div>
                    {/* ... Tasks List code ... */}
                    <div className="space-y-3">
                        {tasks.length === 0 ? (
                            <div className="text-center p-6 border-2 border-dashed border-white/5 rounded-xl text-gray-500 text-sm">
                                No hay tareas asignadas.
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div 
                                    key={task.id} 
                                    className={`group flex items-start gap-4 p-4 rounded-xl border transition-all shadow-sm cursor-pointer ${
                                        task.isCompleted 
                                        ? 'bg-surface-dark border-green-500/20 opacity-75' 
                                        : 'bg-surface-dark border-white/5 hover:border-primary/30'
                                    }`}
                                    onClick={() => toggleTaskCompletion(task.id)}
                                >
                                    <div className="mt-1">
                                        <div className={`h-6 w-6 rounded border flex items-center justify-center transition-colors ${
                                            task.isCompleted 
                                            ? 'bg-green-500 border-green-500 text-background-dark' 
                                            : 'border-gray-600 bg-white/5 hover:border-primary'
                                        }`}>
                                            {task.isCompleted && <Check size={16} strokeWidth={4} />}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-base font-bold leading-tight transition-all ${task.isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>
                                                {task.title}
                                            </h4>
                                            {task.priority === 'High' && !task.isCompleted && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-accent-amber/20 text-accent-amber border border-accent-amber/20">Urgente</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2 line-clamp-1">{task.description}</p>
                                        <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
                                            <MapPin size={12} />
                                            <span>{task.location}</span>
                                            {task.dueDate && (
                                                <>
                                                    <span className="mx-1">•</span>
                                                    <Calendar size={12} />
                                                    <span>{task.dueDate}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Calendar / Attendance Section */}
                <div className="bg-surface-dark border border-white/5 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 font-bold"><Calendar size={18} className="text-primary" /> Asistencia & Eventos</div>
                    </div>
                    {/* Calendar Header Controls */}
                    <div className="flex items-center justify-between mb-4 bg-surface-darker rounded-lg p-1">
                        <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white"><ChevronLeft size={20}/></button>
                        <span className="font-bold text-sm">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                        <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-md text-gray-400 hover:text-white"><ChevronRight size={20}/></button>
                    </div>
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['D','L','M','M','J','V','S'].map(d => <span key={d} className="text-[10px] text-gray-500 font-bold">{d}</span>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {emptyDays.map(i => <div key={`empty-${i}`} className="aspect-square"></div>)}
                        {days.map(day => {
                            const dayEvents = getEventForDate(day);
                            const hasAttendance = dayEvents.find(e => e.type === 'Attendance');
                            const hasReminder = dayEvents.find(e => e.type === 'Reminder');
                            
                            let bgClass = 'bg-surface-darker text-gray-300';
                            let borderClass = 'border-transparent';
                            
                            if (hasAttendance) {
                                if (hasAttendance.status === 'Present') {
                                    bgClass = 'bg-primary/20 text-white';
                                    borderClass = 'border-primary/30';
                                } else {
                                    bgClass = 'bg-red-500/10 text-white';
                                    borderClass = 'border-red-500/20';
                                }
                            }
                            
                            return (
                                <button 
                                    key={day} 
                                    onClick={() => handleDateClick(day)}
                                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold border relative active:scale-90 transition-transform ${bgClass} ${borderClass}`}
                                >
                                    {day}
                                    {hasReminder && (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent-amber rounded-full shadow-sm"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
             </main>

             <div className="fixed bottom-0 w-full p-4 bg-background-dark/95 backdrop-blur-md border-t border-white/5 z-20">
                 <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full h-14 bg-primary hover:bg-primary-dark text-background-dark font-bold text-lg rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                 >
                     <Wallet size={20} />
                     Pagar Nómina / Abonar
                 </button>
             </div>

             {/* ... MODALS ... */}
             
             {/* Edit Transaction Modal */}
             {editingTx && (
                 <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
                     <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingTx(null)}></div>
                     <div className="relative w-full max-w-md bg-surface-dark rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 shadow-2xl p-6 animate-in slide-in-from-bottom-5">
                         <div className="flex justify-between items-center mb-6">
                             <h3 className="text-xl font-bold">Editar Pago</h3>
                             <button onClick={() => setEditingTx(null)}><X className="text-gray-400"/></button>
                         </div>
                         <div className="space-y-4">
                             <div>
                                <label className="text-xs font-bold text-gray-400 block mb-1">Monto</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-surface-darker p-3 rounded-xl text-white font-bold border border-white/5 focus:border-primary outline-none"
                                    value={editAmount}
                                    onChange={(e) => setEditAmount(e.target.value)}
                                />
                             </div>
                             <div>
                                <label className="text-xs font-bold text-gray-400 block mb-1">Fecha</label>
                                <input 
                                    type="date" 
                                    className="w-full bg-surface-darker p-3 rounded-xl text-white border border-white/5 focus:border-primary outline-none"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                />
                             </div>
                             <div>
                                <label className="text-xs font-bold text-gray-400 block mb-1">Descripción</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-surface-darker p-3 rounded-xl text-white border border-white/5 focus:border-primary outline-none"
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                />
                             </div>
                             <button 
                                onClick={saveTransactionEdit}
                                className="w-full bg-primary text-black font-bold py-3 rounded-xl mt-2 flex items-center justify-center gap-2"
                             >
                                 <Save size={18} /> Guardar Cambios
                             </button>
                         </div>
                     </div>
                 </div>
             )}

             {showTaskModal && (/* ... Task Modal Code ... */
                 <div className="fixed inset-0 z-50 bg-background-dark flex flex-col animate-in slide-in-from-bottom-5">
                     <div className="p-4 flex items-center justify-between border-b border-white/5">
                         <button onClick={() => setShowTaskModal(false)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                             <ArrowLeft size={24} />
                         </button>
                         <h2 className="text-lg font-bold">Asignar Tarea</h2>
                         <div className="w-10"></div>
                     </div>
                     <main className="flex-1 overflow-y-auto p-6">
                         <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); addNewTask(); }}>
                             <div>
                                 <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
                                     <div className="w-1 h-4 bg-primary rounded-full"></div>
                                     Nombre de la Actividad
                                 </label>
                                 <input
                                     type="text"
                                     value={newTaskTitle}
                                     onChange={(e) => setNewTaskTitle(e.target.value)}
                                     placeholder="Ej: Vacunación Lote 5"
                                     className="w-full bg-surface-dark border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-primary outline-none transition-all font-bold text-lg"
                                     autoFocus
                                 />
                             </div>
                             <div>
                                 <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
                                     <AlignLeft size={18} className="text-primary" />
                                     Descripción
                                 </label>
                                 <textarea
                                     value={newTaskDesc}
                                     onChange={(e) => setNewTaskDesc(e.target.value)}
                                     placeholder="Describa la tarea detalladamente."
                                     rows={4}
                                     className="w-full bg-surface-dark border border-white/10 rounded-2xl p-4 text-gray-300 placeholder-gray-600 focus:border-primary outline-none transition-all resize-none text-sm leading-relaxed"
                                 />
                             </div>
                             <div>
                                 <label className="flex items-center gap-2 text-sm font-bold text-gray-300 mb-3">
                                     <MapPin size={18} className="text-primary" />
                                     Ubicación
                                 </label>
                                 <input
                                     type="text"
                                     value={newTaskLoc}
                                     onChange={(e) => setNewTaskLoc(e.target.value)}
                                     placeholder="Ej: Potrero Norte"
                                     className="w-full bg-surface-dark border border-white/10 rounded-2xl p-4 text-white placeholder-gray-600 focus:border-primary outline-none transition-all"
                                 />
                             </div>
                             <div>
                                 <label className="block text-sm font-bold text-gray-300 mb-3">Fecha de vencimiento</label>
                                 <div className="bg-surface-dark border border-white/10 rounded-2xl p-4 flex items-center justify-between relative">
                                     <div className="flex items-center gap-4">
                                         <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                             <Calendar size={24} />
                                         </div>
                                         <p className="font-bold text-white text-base">{newTaskDueDate}</p>
                                     </div>
                                     <input 
                                        type="date" 
                                        value={newTaskDueDate}
                                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                     />
                                 </div>
                             </div>
                         </form>
                     </main>
                     <div className="p-6 border-t border-white/5 bg-background-dark/95 backdrop-blur-sm">
                         <button onClick={addNewTask} className="w-full h-14 bg-primary hover:bg-primary-dark text-background-dark font-bold text-lg rounded-full shadow-lg shadow-primary/20">Asignar Tarea</button>
                     </div>
                 </div>
             )}
             
             {showPaymentModal && (
                 <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                     <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}></div>
                     <div className="relative w-full max-w-md bg-surface-dark rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10 shadow-2xl overflow-hidden p-6 animate-in slide-in-from-bottom-5">
                        {paymentSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-black"><Check size={32}/></div>
                                <h3 className="text-xl font-bold">Pago Exitoso</h3>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold mb-4">Realizar Pago</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <button onClick={() => setPaymentType('salary')} className={`flex-1 py-3 rounded-xl font-bold ${paymentType === 'salary' ? 'bg-white text-black' : 'bg-white/5'}`}>Nómina</button>
                                        <button onClick={() => setPaymentType('advance')} className={`flex-1 py-3 rounded-xl font-bold ${paymentType === 'advance' ? 'bg-white text-black' : 'bg-white/5'}`}>Adelanto</button>
                                    </div>
                                    {paymentType === 'advance' && (
                                        <div className="space-y-3 animate-in fade-in">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 ml-1 mb-1 block">Monto a Descontar</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</div>
                                                    <input 
                                                        type="number" 
                                                        placeholder="0" 
                                                        className="w-full bg-surface-darker p-4 pl-8 rounded-xl text-white text-xl font-bold outline-none border border-white/5 focus:border-primary transition-colors" 
                                                        value={customAmount} 
                                                        onChange={e => setCustomAmount(e.target.value)} 
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 ml-1 mb-1 block">Observación</label>
                                                <textarea
                                                    rows={2}
                                                    placeholder="Motivo..."
                                                    className="w-full bg-surface-darker p-3 rounded-xl text-white text-sm outline-none border border-white/5 focus:border-primary transition-colors resize-none"
                                                    value={paymentDescription}
                                                    onChange={e => setPaymentDescription(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <button onClick={handlePayment} className="w-full bg-primary text-black py-4 rounded-xl font-bold text-lg">Confirmar</button>
                                </div>
                            </>
                        )}
                     </div>
                 </div>
             )}
        </div>
    )
  }

  // --- DIRECTORY VIEW ---
  return (
    <div className="min-h-screen bg-background-dark text-white font-display flex flex-col">
       {/* HR Directory Header */}
       <header className="px-4 pt-4 pb-2 sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 border-b border-white/5">
           <div className="flex justify-between items-center mb-4 h-10">
               {isSearchOpen ? (
                   <div className="flex-1 flex items-center bg-white/10 rounded-xl px-3 py-1 animate-in fade-in zoom-in-95 duration-200">
                       <Search size={18} className="text-gray-400 mr-2 shrink-0"/>
                       <input
                           ref={searchInputRef}
                           type="text"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="Buscar nombre o cargo..."
                           className="bg-transparent border-none outline-none text-white w-full text-base placeholder-gray-400 h-9"
                       />
                       {searchQuery && (
                           <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-white mr-1"><X size={14} className="bg-gray-600 rounded-full p-0.5" /></button>
                       )}
                       <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="ml-2 text-sm font-bold text-gray-400 hover:text-white whitespace-nowrap">Cancelar</button>
                   </div>
               ) : (
                   <>
                       <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                           <button onClick={() => navigate(-1)} className="p-1"><ArrowLeft size={20} /></button>
                           <h1 className="text-xl font-extrabold">Directorio de Equipo</h1>
                       </div>
                       <div className="flex gap-2 animate-in fade-in slide-in-from-right-2">
                           <button onClick={() => setIsSearchOpen(true)} className="w-10 h-10 bg-surface-dark rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"><Search size={18} /></button>
                           <button onClick={() => navigate('/register-worker')} className="w-10 h-10 bg-primary text-background-dark rounded-full flex items-center justify-center active:scale-95 transition-transform"><Plus size={20} /></button>
                       </div>
                   </>
               )}
           </div>
           
           {!isSearchOpen && (
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 animate-in fade-in slide-in-from-top-1">
                   <button className="px-4 py-1.5 rounded-full bg-primary text-background-dark text-sm font-bold">Todos</button>
                   <button className="px-4 py-1.5 rounded-full bg-surface-dark border border-white/10 text-sm hover:bg-white/5">Presente</button>
                   <button className="px-4 py-1.5 rounded-full bg-surface-dark border border-white/10 text-sm hover:bg-white/5">Ausente</button>
               </div>
           )}
       </header>

       <main className="flex-1 p-4 pb-24 grid grid-cols-2 gap-3 content-start">
            {filteredWorkers.length === 0 ? (
                <div className="col-span-2 text-center py-10 opacity-50">
                    <Search size={32} className="mx-auto mb-2 text-gray-600"/>
                    <p className="text-sm font-bold">No se encontraron resultados</p>
                </div>
            ) : (
                filteredWorkers.map(w => (
                    <div key={w.id} onClick={() => handleWorkerClick(w)} className="bg-surface-dark rounded-xl p-4 flex flex-col items-center text-center border border-white/5 hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden active:scale-[0.98]">
                        <div className="relative mb-3">
                            <img src={w.imageUrl} className="w-20 h-20 rounded-full object-cover" />
                            <div className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-surface-dark ${w.status === 'Present' ? 'bg-primary' : 'bg-gray-500'}`}></div>
                        </div>
                        <h3 className="font-bold">{w.name}</h3>
                        <p className="text-xs text-accent-amber font-bold uppercase tracking-wider mb-2">{roleMap[w.role]}</p>
                        <div className="mt-auto flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                            <div className={`w-1.5 h-1.5 rounded-full ${w.status === 'Present' ? 'bg-primary animate-pulse' : 'bg-gray-500'}`}></div>
                            <span className="text-[10px] text-gray-300 font-medium">{w.status === 'Present' ? 'En Campo' : 'Fuera'}</span>
                        </div>
                    </div>
                ))
            )}
       </main>

       <BottomNav />
    </div>
  );
};

export default HR;
