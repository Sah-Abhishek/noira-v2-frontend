import { useState } from "react";

const MassageServiceCard = ({ service, cart, addToCart, removeFromCart }) => {
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleAdd = (service, index) => {
    setClickedIndex(index);
    addToCart(service, index);

    // Remove the animation class after a short delay
    setTimeout(() => setClickedIndex(null), 300);
  };

  return (
    <div className="bg-[#0f172a] rounded-lg p-6 mb-6">
      <h3 className="text-white text-2xl font-bold mb-4">{service.name}</h3>
      <p className="text-gray-300 text-base mb-6 leading-relaxed">
        {service.description}
      </p>

      {/* Multiple durations layout (grid) */}
      <div className="grid grid-cols-2 gap-3">
        {service.options.map((option, index) => {
          const inCart = cart.some(
            (item) =>
              item.serviceId === service._id && item.optionIndex === index
          );

          return (
            <div
              key={index}
              className={`flex items-center justify-between bg-black rounded-lg p-4 transition-transform duration-300 ${clickedIndex === index ? "scale-105" : ""
                }`}
            >
              <span className="text-[#C49E5B] font-semibold">
                {option.durationMinutes} mins – £{option.price.amount}
              </span>

              {inCart ? (
                <button
                  onClick={() => removeFromCart()}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => handleAdd(service, index)}
                  className="bg-[#C49E5B] hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition-all duration-200 text-sm"
                >
                  Add
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MassageServiceCard;
