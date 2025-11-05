import React, { useState } from 'react';
import { MenuCategory, MenuItem } from '../types';

interface InteractiveMenuProps {
    categories: MenuCategory[];
    menu: MenuItem[];
    onAddItem: (menuItemId: number) => void;
}

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ categories, menu, onAddItem }) => {
    const [activeCategory, setActiveCategory] = useState<number>(categories[0]?.id || 0);

    const itemsInCategory = menu.filter(item => item.categoryId === activeCategory);

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4">
                {categories.map(cat => (
                    <button 
                        key={cat.id} 
                        onClick={() => setActiveCategory(cat.id)}
                        className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === cat.id ? 'bg-violet-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
            <div className="flex-grow overflow-y-auto mt-4 pr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {itemsInCategory.map(item => (
                        <div key={item.id} className="bg-gray-800 rounded-lg p-3 flex flex-col text-center shadow-md">
                           <div className="flex-grow">
                             <h4 className="font-bold text-white">{item.name}</h4>
                             {item.description && <p className="text-xs text-gray-400 mt-1">{item.description}</p>}
                           </div>
                           <p className="font-semibold text-violet-400 my-2">{item.price.toFixed(2)}€</p>
                           <button onClick={() => onAddItem(item.id)} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-1 px-2 text-sm rounded-md transition-colors">➕ Añadir</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default InteractiveMenu;