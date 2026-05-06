import { useState, useMemo } from "react";
import useBookingStore from "../store/bookingStore.jsx"; // ✅ Zustand store
import { Minus, Plus, Trash2 } from "lucide-react";

/**
 * Build a stable id for a cart line from service + option.
 */
const lineId = (serviceId, optionIdOrIdx) =>
  `${serviceId}:${optionIdOrIdx ?? 0}`;

const CartPage = () => {
  const { cart, setCart, services = [] } = useBookingStore();
  const [promoCode, setPromoCode] = useState("");

  // Normalize cart
  const baseItems = Array.isArray(cart) ? cart : cart ? [cart] : [];

  const viewCart = useMemo(() => {
    return baseItems.map((ci) => {
      const serviceId =
        ci.serviceId || ci.service?._id || ci.id || ci._id || null;

      const service =
        services.find((s) => s._id === serviceId) || null;

      const optIdx =
        Number.isInteger(ci.optionIndex) ? ci.optionIndex : 0;

      const option = service?.options?.[optIdx] || null;

      const id =
        ci.id ||
        lineId(service?._id ?? serviceId ?? "unknown", option?._id ?? optIdx);

      return {
        id,
        serviceId: service?._id ?? serviceId ?? null,
        optionIndex: optIdx,
        name: service?.name || ci.name || "Selected Service",
        durationMinutes:
          option?.durationMinutes ?? ci.durationMinutes ?? 0,
        description: service?.description || ci.description || "",
        price: option?.price?.amount ?? ci.price ?? 0,
        quantity: ci.quantity ?? 1,
      };
    });
  }, [baseItems, services]);

  const writeBack = (expandedItems) => {
    const normalized = expandedItems.map((v) => ({
      id: v.id,
      serviceId: v.serviceId,
      optionIndex: v.optionIndex,
      quantity: v.quantity,
    }));
    setCart(normalized);
  };

  const handleIncrement = (id) => {
    writeBack(
      viewCart.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const handleDecrement = (id) => {
    writeBack(
      viewCart.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  };

  const handleRemove = (id) => {
    writeBack(viewCart.filter((i) => i.id !== id));
  };

  const subtotal = viewCart.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const serviceFee = 15;
  const total = subtotal + serviceFee;
  //
  if (viewCart.length === 0) {
    return null;
  }


  return (
    <div className="bg-black text-white min-h-screen py-12 px-4 md:px-8">
      <div className="text-center">
        {/* <h1 className="text-4xl font-bold mt-20 mb-2">NOIRA Massage Menu</h1> */}
        {/* <p className="text-gray-400 mb-10">Luxury Made Accessible</p> */}
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center">Your Cart</h2>

      <div className="max-w-2xl mx-auto space-y-4">
        {(
          viewCart.map((item) => (
            <div
              key={item.id}
              className="bg-[#0f172a] flex-col gap-5 rounded-lg p-5 flex justify-between items-center shadow-md"
            >
              {/* Left */}
              <div>
                <h3 className="text-lg font-semibold text-[#C49E5B]">{item.name}</h3>
                <p className="text-gray-300 text-sm">{item.durationMinutes} minutes</p>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {/* <button */}
                  {/*   onClick={() => handleDecrement(item.id)} */}
                  {/*   className="bg-gray-800 hover:bg-gray-700 rounded-full p-2" */}
                  {/* > */}
                  {/*   <Minus size={14} /> */}
                  {/* </button> */}
                  {/* <span className="text-lg">{item.quantity}</span> */}
                  {/* <button */}
                  {/*   onClick={() => handleIncrement(item.id)} */}
                  {/*   className="bg-gray-800 hover:bg-gray-700 rounded-full p-2" */}
                  {/* > */}
                  {/*   <Plus size={14} /> */}
                  {/* </button> */}
                </div>

                <span className="font-bold text-lg">£{item.price}</span>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Totals */}
        {viewCart.length > 0 && (
          <div className="bg-[#0f172a] rounded-lg p-6 shadow-md mt-6">
            <div className="flex justify-between mb-2 text-gray-300">
              <span>Subtotal</span>
              <span>£{subtotal}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-300">
              <span>Service Fee</span>
              <span>£{serviceFee}</span>
            </div>
            <div className="flex justify-between text-[#C49E5B] font-bold text-lg mt-4 border-t border-gray-700 pt-4">
              <span>Total</span>
              <span>£{total}</span>
            </div>

            {/* <button className="w-full mt-6 bg-[#C49E5B] hover:bg-yellow-400 text-black font-semibold py-3 px-4 rounded-md transition"> */}
            {/*   Proceed to Checkout */}
            {/* </button> */}
            {/**/}
            {/* <button className="w-full mt-2 border border-[#C49E5B] hover:bg-[#C49E5B] hover:text-black text-[#C49E5B] py-3 px-4 rounded-md transition"> */}
            {/*   Continue Shopping */}
            {/* </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
