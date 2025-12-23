
export interface Farm {
  id: string;
  name: string;
  location: string;
  totalHead: number;
  imageUrl: string;
  status: 'Active' | 'Maintenance';
}

export interface Bovine {
  id: string;
  tag: string;
  breed: string;
  age: string; // e.g., "3 Yrs"
  weight: number;
  imageUrl: string;
  status: 'Active' | 'Sold' | 'Deceased';
  category: 'Cow' | 'Heifer' | 'Calf' | 'Bull';
  healthStatus: 'Healthy' | 'Sick';
  reproductiveStatus: 'Open' | 'Pregnant';
  isLactating: boolean;
  lastWeighingDate: string;
  farmId: string;
}

export interface Worker {
  id: string;
  name: string;
  role: 'Manager' | 'Cowboy' | 'Vet';
  imageUrl: string;
  status: 'Present' | 'Absent';
  balance: number;
}

export interface WorkerTask {
    id: string;
    workerId: string;
    title: string;
    description?: string;
    location: string;
    isCompleted: boolean;
    priority: 'High' | 'Normal';
    dueDate?: string;
}

export interface WorkerEvent {
    id: string;
    workerId: string;
    date: string; // ISO YYYY-MM-DD
    type: 'Attendance' | 'Reminder' | 'OffDay';
    title?: string; // For reminders
    status?: 'Present' | 'Absent'; // For attendance
}

export interface ProductionData {
  day: number;
  yield: number;
}

export interface Lot {
  id: string;
  name: string;
  type: 'Production' | 'Fattening' | 'Weaning' | 'Quarantine';
  animalCount: number;
  avgWeight: number;
  location?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'info' | 'success';
}

export interface MarketListing {
  id: string;
  title: string;
  price: number;
  currency: 'COP' | 'USD';
  location: string;
  description: string;
  imageUrl: string;
  sellerName: string;
  verified: boolean;
  stats: {
    age: string;
    weight: string;
    gender: 'Macho' | 'Hembra';
    breed: string;
  };
  type: 'Individual' | 'Lote';
  createdAt: string;
}
