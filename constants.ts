import { Table, TableStatus, MenuCategory, MenuItem } from './types';

export const INITIAL_TABLES: Table[] = [
  // Bar Zone
  { id: 1, number: 1, zone: 'bar', capacity: 4, status: 'free', position: { x: 15, y: 20 }, usageCount: 0 },
  { id: 2, number: 2, zone: 'bar', capacity: 4, status: 'free', position: { x: 15, y: 50 }, usageCount: 0 },
  { id: 3, number: 3, zone: 'bar', capacity: 2, status: 'free', position: { x: 15, y: 80 }, usageCount: 0 },
  { id: 4, number: 4, zone: 'bar', capacity: 2, status: 'free', position: { x: 35, y: 20 }, usageCount: 0 },
  { id: 5, number: 5, zone: 'bar', capacity: 4, status: 'free', position: { x: 35, y: 50 }, usageCount: 0 },
  { id: 6, number: 6, zone: 'bar', capacity: 6, status: 'free', position: { x: 35, y: 80 }, usageCount: 0 },
  // Dining Zone
  { id: 7, number: 7, zone: 'dining', capacity: 4, status: 'free', position: { x: 65, y: 25 }, usageCount: 0 },
  { id: 8, number: 8, zone: 'dining', capacity: 4, status: 'free', position: { x: 85, y: 25 }, usageCount: 0 },
  { id: 9, number: 9, zone: 'dining', capacity: 8, status: 'free', position: { x: 65, y: 75 }, usageCount: 0 },
  { id: 10, number: 10, zone: 'dining', capacity: 6, status: 'free', position: { x: 85, y: 75 }, usageCount: 0 },
];

export const INITIAL_MENU_CATEGORIES: MenuCategory[] = [
    { id: 1, name: 'Raciones' },
    { id: 2, name: 'Croquetas' },
    { id: 3, name: 'Carnes' },
    { id: 4, name: 'Ensaladas' },
    { id: 5, name: 'Burgers' },
    { id: 6, name: 'Fast Food' },
    { id: 7, name: 'Tostas' },
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
    // Raciones
    { id: 101, categoryId: 1, name: 'Patatas Bravas', price: 6.50, description: 'Patatas con salsa brava casera.' },
    { id: 102, categoryId: 1, name: 'Calamares a la Romana', price: 12.00, description: 'Anillas de calamar rebozadas.' },
    { id: 103, categoryId: 1, name: 'Pulpo a la Gallega', price: 18.50 },
    // Croquetas
    { id: 201, categoryId: 2, name: 'Croquetas de Jamón', price: 8.00, description: '6 unidades de cremosas croquetas de jamón ibérico.' },
    { id: 202, categoryId: 2, name: 'Croquetas de Boletus', price: 8.50, description: '6 unidades de croquetas caseras de boletus.' },
    // Carnes
    { id: 301, categoryId: 3, name: 'Entrecot de Ternera', price: 22.00, description: '300g de lomo alto de ternera a la parrilla.' },
    { id: 302, categoryId: 3, name: 'Solomillo Ibérico', price: 19.50, description: 'Solomillo de cerdo ibérico con salsa a elegir.' },
    // Ensaladas
    { id: 401, categoryId: 4, name: 'Ensalada César', price: 10.50, description: 'Lechuga, pollo crujiente, parmesano y salsa césar.' },
    // Burgers
    { id: 501, categoryId: 5, name: 'Burger Clásica', price: 12.50, description: '200g de ternera, lechuga, tomate, queso y bacon.' },
    { id: 502, categoryId: 5, name: 'Burger de Pollo', price: 11.50, description: 'Pechuga de pollo crujiente, mayonesa y brotes.'},
    // Fast Food
    { id: 601, categoryId: 6, name: 'Pizza Margarita', price: 9.00 },
    { id: 602, categoryId: 6, name: 'Perrito Caliente', price: 5.50 },
    // Tostas
    { id: 701, categoryId: 7, name: 'Tosta de Jamón con Tomate', price: 7.00 },
];


export const TABLE_STATUS_COLORS: Record<TableStatus, string> = {
  free: 'bg-green-500/20 border-green-500',
  reserved: 'bg-yellow-500/20 border-yellow-500',
  occupied: 'bg-red-500/20 border-red-500',
};

export const TABLE_TEXT_COLORS: Record<TableStatus, string> = {
  free: 'text-green-400',
  reserved: 'text-yellow-400',
  occupied: 'text-red-400',
};