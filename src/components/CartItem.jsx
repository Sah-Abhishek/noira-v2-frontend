import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  return (
    <div className="bg-[#1e293b] rounded-lg p-6 mb-4 shadow-lg">
      <div className="flex justify-between items-start">
        {/* Left side - Service details */}
        <div className="flex-1 pr-6">
          <h3 className="text-[#C49E5B] text-xl font-semibold mb-2">
            {item.title}
          </h3>
          <p className="text-gray-300 text-sm mb-4">{item.duration}</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Right side - Controls stacked vertically */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          {/* Price */}
          <div className="text-[#C49E5B] text-lg font-bold">
            £{item.price}
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
