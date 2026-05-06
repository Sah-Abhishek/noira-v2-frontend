const BrandsScroll = () => {
  const brandNames = [
    "OSKIA", "NEOM", "Soho Skin", "VITA LIBERATA",
    "sienna", "tint.", "BIO SCULPTURE", "O·P·I","OSKIA", "NEOM", "Soho Skin", "VITA LIBERATA",
    "sienna", "tint.", "BIO SCULPTURE", "O·P·I","sienna", "tint.", "BIO SCULPTURE", "O·P·I","OSKIA", "NEOM", "Soho Skin",
  ];

  return (
    <div className="bg-[#daa04f] py-8 overflow-hidden relative">
    

      <div className="whitespace-nowrap animate-scroll-horizontal ">
        {brandNames.map((name, index) => (
          <span key={index} className="inline-block mx-8  text-5xl font-medium">
            {name}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes scroll-horizontal {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }

        .animate-scroll-horizontal {
          animation: scroll-horizontal 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BrandsScroll;
