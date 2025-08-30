import React from "react";
import type { Character as CharacterType } from "../../interfaces/characters";
import { FaHeart, FaRegHeart, FaVenus, FaMars, FaGenderless } from "react-icons/fa";
import { useFavorites } from "../../context/FavoritesContext";

interface CharacterCardProps {
  character: CharacterType & {
    gender?: string | undefined;
    origin?: { name?: string | undefined };
  };
}

const getGenderIcon = (gender: string | undefined) => {
  if (gender === "Female") return <FaVenus className="inline mr-1 text-pink-500" title="Female" />;
  if (gender === "Male") return <FaMars className="inline mr-1 text-blue-500" title="Male" />;
  return <FaGenderless className="inline mr-1 text-gray-400" title="Genderless" />;
};

const getStatusBadge = (status: string) => {
  let color = "bg-gray-400";
  if (status === "Alive") color = "bg-green-500";
  if (status === "Dead") color = "bg-red-500";
  return (
    <span className={`absolute left-2 top-2 px-2 py-1 text-xs rounded text-white font-semibold ${color}`}>{status}</span>
  );
};


const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <article className="bg-[#f9f8ec] border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-w-[220px] max-w-xs h-[480px] cursor-pointer transition-all transform hover:scale-105 hover:shadow-lg duration-400 ease-in-out">
      <div className="relative w-full bg-gray-100 flex-shrink-0" style={{ height: 300 }}>
        <img src={character.image} alt={character.name} className="w-full h-full object-cover" style={{ height: 300, width: '100%' }} />
        {getStatusBadge(character.status)}
        <button
          className="absolute right-2 top-2 bg-white/80 rounded-full p-1 hover:bg-white shadow"
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(String(character.id));
          }}
          aria-label={isFavorite(String(character.id)) ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {isFavorite(String(character.id)) ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-gray-400" />}
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <h3 className="text-2xl font-semibold mb-1 truncate" title={character.name}>{character.name}</h3>
          <div className="flex items-center gap-2 mb-1">
            
            <span className="text-lg bg-gray-100 rounded px-2 py-0.5 text-gray-700">{character.species}</span>
          </div>
          <div className="flex items-center flex-wrap gap-2 mt-2">
            <span className="text-lg border border-gray-300 rounded px-2 py-0.5 text-gray-600">{character.gender}</span>
            {getGenderIcon(character.gender || '')}
            {character.origin?.name && (
              <span className="text-xs border border-gray-300 rounded px-2 py-0.5 text-gray-600">{character.origin.name}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default CharacterCard;