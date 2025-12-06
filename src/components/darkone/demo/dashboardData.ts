// Dashboard Demo Data
// Centralized demo data for Darkone admin dashboard
// These values match the original Darkone HTML template exactly

export interface KpiCard {
  id: string;
  title: string;
  value: string;
  icon: string;
  sparklineData: number[];
}

export interface SalesCategoryRow {
  category: string;
  orders: string;
  percentage: string;
  trend: 'up' | 'down';
  trendValue: string;
}

export interface NewAccountRow {
  id: string;
  date: string;
  name: string;
  avatar: string;
  status: 'Verified' | 'Pending' | 'Blocked';
  username: string;
}

export interface TransactionRow {
  id: string;
  date: string;
  amount: string;
  type: 'Cr' | 'Dr';
  description: string;
}

// KPI Cards Data
export const kpiCards: KpiCard[] = [
  {
    id: 'total-income',
    title: 'Total Income',
    value: '$78.8k',
    icon: 'solar:globus-outline',
    sparklineData: [25, 28, 32, 38, 43, 55, 60, 48, 42, 51, 35],
  },
  {
    id: 'new-users',
    title: 'New Users',
    value: '2,150',
    icon: 'solar:users-group-two-rounded-broken',
    sparklineData: [87, 54, 4, 76, 31, 95, 70, 92, 53, 9, 6],
  },
  {
    id: 'orders',
    title: 'Orders',
    value: '1,784',
    icon: 'solar:cart-5-broken',
    sparklineData: [41, 42, 35, 42, 6, 12, 13, 22, 42, 94, 95],
  },
  {
    id: 'conversion-rate',
    title: 'Conversion Rate',
    value: '12.3%',
    icon: 'solar:pie-chart-2-broken',
    sparklineData: [8, 41, 40, 48, 77, 35, 0, 77, 63, 100, 71],
  },
];

// Sales by Category Table Data
export const salesCategories: SalesCategoryRow[] = [
  {
    category: 'Grocery',
    orders: '187,232',
    percentage: '48.63%',
    trend: 'up',
    trendValue: '2.5% Up',
  },
  {
    category: 'Electronics',
    orders: '126,874',
    percentage: '36.08%',
    trend: 'up',
    trendValue: '8.5% Up',
  },
  {
    category: 'Other',
    orders: '90,127',
    percentage: '23.41%',
    trend: 'down',
    trendValue: '10.98% Down',
  },
];

// New Accounts Table Data
export const newAccounts: NewAccountRow[] = [
  {
    id: '#US523',
    date: '24 April, 2024',
    name: 'Dan Adrick',
    avatar: '/darkone/images/users/avatar-2.jpg',
    status: 'Verified',
    username: '@omions',
  },
  {
    id: '#US652',
    date: '24 April, 2024',
    name: 'Daniel Olsen',
    avatar: '/darkone/images/users/avatar-3.jpg',
    status: 'Verified',
    username: '@alliates',
  },
  {
    id: '#US862',
    date: '20 April, 2024',
    name: 'Jack Roldan',
    avatar: '/darkone/images/users/avatar-4.jpg',
    status: 'Pending',
    username: '@griys',
  },
  {
    id: '#US756',
    date: '18 April, 2024',
    name: 'Betty Cox',
    avatar: '/darkone/images/users/avatar-5.jpg',
    status: 'Verified',
    username: '@reffon',
  },
  {
    id: '#US420',
    date: '18 April, 2024',
    name: 'Carlos Johnson',
    avatar: '/darkone/images/users/avatar-6.jpg',
    status: 'Blocked',
    username: '@bebo',
  },
];

// Recent Transactions Table Data
export const recentTransactions: TransactionRow[] = [
  {
    id: '#98521',
    date: '24 April, 2024',
    amount: '$120.55',
    type: 'Cr',
    description: 'Commissions',
  },
  {
    id: '#20158',
    date: '24 April, 2024',
    amount: '$9.68',
    type: 'Cr',
    description: 'Affiliates',
  },
  {
    id: '#36589',
    date: '20 April, 2024',
    amount: '$105.22',
    type: 'Dr',
    description: 'Grocery',
  },
  {
    id: '#95362',
    date: '18 April, 2024',
    amount: '$80.59',
    type: 'Cr',
    description: 'Refunds',
  },
  {
    id: '#75214',
    date: '18 April, 2024',
    amount: '$750.95',
    type: 'Dr',
    description: 'Bill Payments',
  },
];

// Status badge class mapping
export const statusBadgeClass: Record<NewAccountRow['status'], string> = {
  Verified: 'badge-soft-success',
  Pending: 'badge-soft-warning',
  Blocked: 'badge-soft-danger',
};

// Transaction type badge class mapping
export const transactionBadgeClass: Record<TransactionRow['type'], string> = {
  Cr: 'bg-success',
  Dr: 'bg-danger',
};
