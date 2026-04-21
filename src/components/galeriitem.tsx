type GaleriItemProps = {
  imageUrl: string;
  altText: string;
  caption: string;
};

const GaleriItem = ({ imageUrl, altText, caption }: GaleriItemProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group w-full aspect-square">
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/40 h-20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
        <div className="text-white text-sm px-4 text-center translate-y-3 group-hover:translate-y-0 transition duration-300">
          {caption}
        </div>
      </div>
    </div>
  );
};

export default GaleriItem;