import React from "react";
import { Link } from "react-router-dom";

const NewsCard = ({ category, title, date, imageUrl, id }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col h-full transform hover:-translate-y-2 transition-all duration-300">

      <div className="relative h-48 md:h-65 overflow-hidden">
        <img
          src={imageUrl || "./assets/home/berita.jpg"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <span className="text-gray-400 text-xs mb-2 uppercase tracking-wider">
          {category}
        </span>

        <h3 className="text-[#2D7A5F] font-bold text-lg leading-snug mb-8 flex-grow">
          {title}
        </h3>

        <div className="text-gray-400 text-sm font-medium">
          {date}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;