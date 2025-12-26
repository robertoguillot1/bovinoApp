
import { Bovine, Farm, AppNotification, WorkerTask, WorkerEvent, MarketListing } from './types';

export const farmsData: Farm[] = [
  {
    id: '1',
    name: 'Hacienda La Esperanza',
    location: 'Antioquia, COL',
    totalHead: 0, // Calculated dynamically
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2074&auto=format&fit=crop',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Finca El Roble',
    location: 'Córdoba, COL',
    totalHead: 0, // Calculated dynamically
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a72120615613?q=80&w=1780&auto=format&fit=crop',
    status: 'Maintenance'
  },
  {
    id: '3',
    name: 'Rancho Santa Fe',
    location: 'Meta, COL',
    totalHead: 0, // Calculated dynamically
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop',
    status: 'Active'
  }
];

export const allBovines: Bovine[] = [
  // Farm 1 Animals
  {
    id: '1', tag: '5783-2', breed: 'Holstein', age: '3 Años', weight: 450,
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?q=80&w=2500&auto=format&fit=crop',
    status: 'Active', category: 'Cow', gender: 'Female', healthStatus: 'Healthy', reproductiveStatus: 'Pregnant', isLactating: true,
    lastWeighingDate: 'Hoy 06:30', farmId: '1'
  },
  {
      id: '3', tag: '1102-C', breed: 'Angus', age: '2 Años', weight: 380,
      imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1770&auto=format&fit=crop',
      status: 'Active', category: 'Heifer', gender: 'Female', healthStatus: 'Healthy', reproductiveStatus: 'Open', isLactating: false,
      lastWeighingDate: 'Oct 12', farmId: '1'
  },
  {
    id: '5', tag: '8821-B', breed: 'Jersey', age: '4 Años', weight: 410,
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2074&auto=format&fit=crop',
    status: 'Active', category: 'Cow', gender: 'Female', healthStatus: 'Healthy', reproductiveStatus: 'Open', isLactating: true,
    lastWeighingDate: 'Ayer 10:00', farmId: '1'
  },

  // Farm 2 Animals
  {
    id: '2', tag: '9901-A', breed: 'Brahman', age: '4 Años', weight: 520,
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2670&auto=format&fit=crop',
    status: 'Active', category: 'Cow', gender: 'Female', healthStatus: 'Sick', reproductiveStatus: 'Open', isLactating: false,
    lastWeighingDate: 'Ayer 14:00', farmId: '2'
  },
  {
      id: '4', tag: '2205-X', breed: 'Gyr', age: '5 Años', weight: 490,
      imageUrl: 'https://images.unsplash.com/photo-1516467508483-a72120615613?q=80&w=1780&auto=format&fit=crop',
      status: 'Active', category: 'Cow', gender: 'Female', healthStatus: 'Healthy', reproductiveStatus: 'Pregnant', isLactating: true,
      lastWeighingDate: 'Oct 10', farmId: '2'
  },
];

export const mockNotifications: AppNotification[] = [
  {
    id: '1',
    title: 'Vacuna Pendiente',
    message: 'Lote #3 en Hda. La Esperanza requiere refuerzo de Aftosa.',
    time: 'Hace 10 min',
    read: false,
    type: 'alert'
  },
  {
    id: '2',
    title: 'Baja Producción',
    message: 'Caída del 15% de leche en Finca El Roble hoy.',
    time: 'Hace 2 horas',
    read: false,
    type: 'alert'
  },
  {
    id: '3',
    title: 'Tarea Completada',
    message: 'Juan Pérez finalizó el pesaje mensual.',
    time: 'Ayer',
    read: true,
    type: 'success'
  },
  {
    id: '4',
    title: 'Nuevo Bovino',
    message: 'Registro exitoso ID: 5783-2',
    time: 'Ayer',
    read: true,
    type: 'info'
  }
];

export const mockTasks: WorkerTask[] = [
    { id: 't1', workerId: '1', title: 'Vacunación Lote 4', location: 'Potrero Norte', priority: 'High', isCompleted: false, description: 'Refuerzo aftosa.' },
    { id: 't2', workerId: '1', title: 'Reparar Cerca', location: 'Lindero Sur', priority: 'Normal', isCompleted: true },
    { id: 't3', workerId: '2', title: 'Ordeño Matutino', location: 'Sala 1', priority: 'High', isCompleted: false },
];

export const mockEvents: WorkerEvent[] = [
    { id: 'e1', workerId: '1', date: '2023-10-25', type: 'Attendance', status: 'Present' },
    { id: 'e2', workerId: '1', date: '2023-10-26', type: 'Attendance', status: 'Present' },
    { id: 'e3', workerId: '1', date: '2023-10-27', type: 'Attendance', status: 'Absent' },
    { id: 'e4', workerId: '1', date: '2023-10-30', type: 'Reminder', title: 'Salida Vacaciones' },
];

export const marketListings: MarketListing[] = [
  {
    id: 'm1',
    title: 'Toro Brahman Rojo',
    price: 12500000,
    currency: 'COP',
    location: 'La Dorada, Caldas',
    description: 'Excelente reproductor Brahman Rojo con registro. Manso, de buena genética y listo para monta.',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1770&auto=format&fit=crop',
    sellerName: 'Ganadería San Jorge',
    verified: true,
    stats: { age: '36 Meses', weight: '850 kg', gender: 'Macho', breed: 'Brahman' },
    type: 'Individual',
    createdAt: 'Hace 2 horas',
    isFavorite: false
  },
  {
    id: 'm2',
    title: 'Lote 10 Vacas Holstein',
    price: 45000000,
    currency: 'COP',
    location: 'San Pedro, Antioquia',
    description: 'Lote de vacas de segundo parto, producción promedio 22L/día. Sanidad al día.',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2670&auto=format&fit=crop',
    sellerName: 'Finca La Nube',
    verified: true,
    stats: { age: '4 Años (Prom)', weight: '480 kg', gender: 'Hembra', breed: 'Holstein' },
    type: 'Lote',
    createdAt: 'Hace 5 horas',
    isFavorite: true
  },
  {
    id: 'm3',
    title: 'Caballo Cuarto de Milla',
    price: 18000000,
    currency: 'COP',
    location: 'Villavicencio, Meta',
    description: 'Caballo de trabajo y vaquería, muy noble. Entrenado para manejo de ganado.',
    imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071&auto=format&fit=crop',
    sellerName: 'Hacienda El Palmar',
    verified: false,
    stats: { age: '5 Años', weight: '420 kg', gender: 'Macho', breed: 'Cuarto de Milla' },
    type: 'Individual',
    createdAt: 'Ayer',
    isFavorite: false
  }
];

// NEW MOCK DATA FOR MARKET INBOX & ALERTS
export const marketMessages = [
    {
        id: 'msg1',
        sender: 'Pedro Gómez',
        item: 'Toro Brahman Rojo',
        message: 'Buenas tardes, le ofrezco 11 millones en efectivo.',
        time: '10:30 AM',
        unread: true,
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&h=100'
    },
    {
        id: 'msg2',
        sender: 'Agropecuaria La Cima',
        item: 'Lote 10 Vacas',
        message: '¿Tiene certificado de preñez de todas?',
        time: 'Ayer',
        unread: false,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100'
    }
];

export const marketLikes = [
    {
        id: 'like1',
        user: 'Carlos Ruiz',
        item: 'Toro Brahman Rojo',
        time: 'Hace 5 min',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100'
    },
    {
        id: 'like2',
        user: 'Maria Lopez',
        item: 'Caballo Cuarto de Milla',
        time: 'Hace 1 hora',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100'
    },
    {
        id: 'like3',
        user: 'Finca El Porvenir',
        item: 'Toro Brahman Rojo',
        time: 'Hace 3 horas',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=100&h=100'
    }
];
