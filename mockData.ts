import { Bovine, Farm, AppNotification, WorkerTask, WorkerEvent } from './types';

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
    status: 'Active', category: 'Cow', healthStatus: 'Healthy', reproductiveStatus: 'Pregnant', isLactating: true,
    lastWeighingDate: 'Hoy 06:30', farmId: '1'
  },
  {
      id: '3', tag: '1102-C', breed: 'Angus', age: '2 Años', weight: 380,
      imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1770&auto=format&fit=crop',
      status: 'Active', category: 'Heifer', healthStatus: 'Healthy', reproductiveStatus: 'Open', isLactating: false,
      lastWeighingDate: 'Oct 12', farmId: '1'
  },
  {
    id: '5', tag: '8821-B', breed: 'Jersey', age: '4 Años', weight: 410,
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=2074&auto=format&fit=crop',
    status: 'Active', category: 'Cow', healthStatus: 'Healthy', reproductiveStatus: 'Open', isLactating: true,
    lastWeighingDate: 'Ayer 10:00', farmId: '1'
  },

  // Farm 2 Animals
  {
    id: '2', tag: '9901-A', breed: 'Brahman', age: '4 Años', weight: 520,
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=2670&auto=format&fit=crop',
    status: 'Active', category: 'Cow', healthStatus: 'Sick', reproductiveStatus: 'Open', isLactating: false,
    lastWeighingDate: 'Ayer 14:00', farmId: '2'
  },
  {
      id: '4', tag: '2205-X', breed: 'Gyr', age: '5 Años', weight: 490,
      imageUrl: 'https://images.unsplash.com/photo-1516467508483-a72120615613?q=80&w=1780&auto=format&fit=crop',
      status: 'Active', category: 'Cow', healthStatus: 'Healthy', reproductiveStatus: 'Pregnant', isLactating: true,
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