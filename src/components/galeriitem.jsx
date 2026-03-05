const GaleriItem = ({ imageUrl, altText }) => {
  return (
    <div className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 w-85 h-85">
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
};

export default GaleriItem;
