import React, { useState } from 'react';
import { Table, Zone, MenuItem, MenuCategory } from '../types';

interface AdminPanelProps {
  tables: Table[];
  setTables: React.Dispatch<React.SetStateAction<Table[]>>;
  menu: MenuItem[];
  setMenu: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  categories: MenuCategory[];
  setCategories: React.Dispatch<React.SetStateAction<MenuCategory[]>>;
  addNotification: (message: string, type: 'success' | 'info' | 'warning') => void;
}

type AdminView = 'tables' | 'menu' | 'categories';

const AdminPanel: React.FC<AdminPanelProps> = ({ tables, setTables, menu, setMenu, categories, setCategories, addNotification }) => {
  const [view, setView] = useState<AdminView>('tables');

  // State for Tables
  const [newTableNumber, setNewTableNumber] = useState<number>(Math.max(0, ...tables.map(t => t.number)) + 1);
  const [newTableCapacity, setNewTableCapacity] = useState<number>(2);
  const [newTableZone, setNewTableZone] = useState<Zone>('bar');
  
  // State for Menu Items
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  // State for Categories
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  const handleAddTable = () => {
    if (tables.some(t => t.number === newTableNumber)) {
        addNotification(`La mesa número ${newTableNumber} ya existe.`, 'warning');
        return;
    }
    const newTable: Table = {
      id: Date.now(), number: newTableNumber, capacity: newTableCapacity, zone: newTableZone,
      status: 'free', position: { x: 50, y: 50 }, usageCount: 0,
    };
    setTables(prev => [...prev, newTable]);
    addNotification(`Mesa ${newTableNumber} añadida con éxito.`, 'success');
    setNewTableNumber(Math.max(0, ...tables.map(t => t.number), newTableNumber) + 1);
  };

  const handleUpdateCapacity = (tableId: number, capacity: number) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, capacity: Math.max(1, capacity) } : t));
  };

  const handleDeleteTable = (tableId: number) => {
    const tableToDelete = tables.find(t => t.id === tableId);
    if (tableToDelete && tableToDelete.status !== 'free') {
        addNotification('No se puede eliminar una mesa que está en uso.', 'warning');
        return;
    }
    setTables(prev => prev.filter(t => t.id !== tableId));
    addNotification(`Mesa eliminada.`, 'success');
  };

  const handleSaveMenuItem = (item: MenuItem) => {
    if(item.id === 0) { // New item
        setMenu(prev => [...prev, { ...item, id: Date.now() }]);
        addNotification('Plato añadido con éxito.', 'success');
    } else { // Existing item
        setMenu(prev => prev.map(m => m.id === item.id ? item : m));
        addNotification('Plato actualizado.', 'success');
    }
    setEditingMenuItem(null);
  };
  
  const handleDeleteMenuItem = (itemId: number) => {
      setMenu(prev => prev.filter(m => m.id !== itemId));
      addNotification('Plato eliminado.', 'success');
  }
  
  const handleSaveCategory = (cat: MenuCategory) => {
    if(cat.id === 0) {
        setCategories(prev => [...prev, { ...cat, id: Date.now() }]);
        addNotification('Categoría añadida.', 'success');
    } else {
        setCategories(prev => prev.map(c => c.id === cat.id ? cat : c));
        addNotification('Categoría actualizada.', 'success');
    }
    setEditingCategory(null);
  }

  const handleDeleteCategory = (catId: number) => {
      if(menu.some(m => m.categoryId === catId)) {
          addNotification('No se puede eliminar una categoría con platos asociados.', 'warning');
          return;
      }
      setCategories(prev => prev.filter(c => c.id !== catId));
      addNotification('Categoría eliminada.', 'success');
  }


  const renderView = () => {
      switch(view) {
          case 'tables': return <TablesAdminView />;
          case 'menu': return <MenuAdminView />;
          case 'categories': return <CategoriesAdminView />;
          default: return null;
      }
  }
  
  const TablesAdminView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-white">Añadir Nueva Mesa</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Número de Mesa</label>
            <input type="number" value={newTableNumber} onChange={e => setNewTableNumber(parseInt(e.target.value, 10))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Capacidad</label>
            <input type="number" value={newTableCapacity} onChange={e => setNewTableCapacity(parseInt(e.target.value, 10))} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2" min="1"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Zona</label>
            <select value={newTableZone} onChange={e => setNewTableZone(e.target.value as Zone)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm p-2">
              <option value="bar">Bar</option>
              <option value="dining">Comedor</option>
            </select>
          </div>
          <button onClick={handleAddTable} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Añadir Mesa</button>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-white">Gestionar Mesas Existentes</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {[...tables].sort((a,b) => a.number - b.number).map(table => (
              <div key={table.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                <span className="font-semibold text-gray-200">Mesa {table.number} ({table.zone})</span>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Cap:</label>
                  <input type="number" value={table.capacity} onChange={e => handleUpdateCapacity(table.id, parseInt(e.target.value, 10))} className="w-16 p-1 bg-gray-600 border-gray-500 rounded-md" min="1" />
                  <button onClick={() => handleDeleteTable(table.id)} className="text-red-500 hover:text-red-400 font-bold text-xl">&times;</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const MenuAdminView = () => {
      const [formState, setFormState] = useState<MenuItem>(editingMenuItem || { id: 0, categoryId: categories[0]?.id || 0, name: '', price: 0, description: '' });

      const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
          const { name, value } = e.target;
          setFormState(prev => ({ ...prev, [name]: name === 'price' || name === 'categoryId' ? parseFloat(value) : value }));
      };
      
      const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          handleSaveMenuItem(formState);
          setFormState({ id: 0, categoryId: categories[0]?.id || 0, name: '', price: 0, description: '' });
      };

      return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-white">{editingMenuItem ? 'Editar Plato' : 'Añadir Nuevo Plato'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" name="name" placeholder="Nombre del plato" value={formState.name} onChange={handleFormChange} required className="w-full bg-gray-700 border-gray-600 rounded-md p-2" />
                  <textarea name="description" placeholder="Descripción (opcional)" value={formState.description} onChange={handleFormChange} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 h-24" />
                  <input type="number" name="price" placeholder="Precio" value={formState.price} onChange={handleFormChange} required className="w-full bg-gray-700 border-gray-600 rounded-md p-2" step="0.01" min="0" />
                  <select name="categoryId" value={formState.categoryId} onChange={handleFormChange} required className="w-full bg-gray-700 border-gray-600 rounded-md p-2">
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <div className="flex gap-2">
                      <button type="submit" className="flex-grow bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg">{editingMenuItem ? 'Guardar Cambios' : 'Añadir Plato'}</button>
                      {editingMenuItem && <button onClick={() => setEditingMenuItem(null)} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Cancelar</button>}
                  </div>
              </form>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-white">Lista de Platos</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {menu.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-400">{item.price.toFixed(2)}€ - {categories.find(c=>c.id === item.categoryId)?.name}</p>
                          </div>
                          <div className="flex gap-2">
                              <button onClick={() => { setEditingMenuItem(item); setFormState(item); }} className="text-blue-400 hover:text-blue-300">Editar</button>
                              <button onClick={() => handleDeleteMenuItem(item.id)} className="text-red-500 hover:text-red-400">Eliminar</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      );
  };
  
  const CategoriesAdminView = () => {
    const [catName, setCatName] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            handleSaveCategory({ ...editingCategory, name: catName });
        } else {
            handleSaveCategory({ id: 0, name: catName });
        }
        setCatName('');
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-white">{editingCategory ? 'Editar Categoría' : 'Añadir Categoría'}</h3>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input type="text" placeholder="Nombre de la categoría" value={catName} onChange={e => setCatName(e.target.value)} required className="flex-grow bg-gray-700 border-gray-600 rounded-md p-2" />
                    <button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg">{editingCategory ? 'Guardar' : 'Añadir'}</button>
                    {editingCategory && <button onClick={() => { setEditingCategory(null); setCatName(''); }} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Cancelar</button>}
                </form>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 text-white">Lista de Categorías</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                            <p className="font-semibold">{cat.name}</p>
                            <div className="flex gap-2">
                                <button onClick={() => { setEditingCategory(cat); setCatName(cat.name); }} className="text-blue-400 hover:text-blue-300">Editar</button>
                                <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 hover:text-red-400">Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  const TabButton: React.FC<{ tabView: AdminView; label: string }> = ({ tabView, label }) => (
    <button
        onClick={() => setView(tabView)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${view === tabView ? 'bg-gray-800 text-white border-b-2 border-violet-500' : 'text-gray-400 hover:bg-gray-700'}`}
    >
        {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Panel de Administración</h2>
        <div className="flex border-b border-gray-700 mb-6">
            <TabButton tabView="tables" label="Mesas" />
            <TabButton tabView="menu" label="Platos" />
            <TabButton tabView="categories" label="Categorías" />
        </div>
        {renderView()}
    </div>
  );
};

export default AdminPanel;