import React, { useState } from "react";

interface CharacterFiltersProps {
  filters: {
    name: string;
    status: string;
    species: string;
    gender: string;
  };
  onChange: (filters: CharacterFiltersProps["filters"]) => void;
  onShowFavorites?: () => void;
}

const defaultFilters = {
  name: '',
  status: '',
  species: '',
  gender: '',
};

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "alive", label: "Alive" },
  { value: "dead", label: "Dead" },
  { value: "unknown", label: "Unknown" },
];

const speciesOptions = [
  { value: "", label: "All species" },
  { value: "human", label: "Human" },
  { value: "alien", label: "Alien" },
  { value: "humanoid", label: "Humanoid" },
  { value: "robot", label: "Robot" },
  { value: "animal", label: "Animal" },
  { value: "cronenberg", label: "Cronenberg" },
  { value: "disease", label: "Disease" },
];

const genderOptions = [
  { value: "", label: "All genders" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "genderless", label: "Genderless" },
  { value: "unknown", label: "Unknown" },
];

const CharacterFilters: React.FC<CharacterFiltersProps> = ({ filters, onChange, onShowFavorites }) => {
  const [localFilters, setLocalFilters] = useState(filters);


  // Para el input de nombre
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setLocalFilters(prev => ({ ...prev, name: value }));
  };

  // Para los selectores, aplicar filtro automáticamente
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...localFilters, [name]: value };
    setLocalFilters(updated);
    onChange(updated);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(localFilters);
  };

  return (
    <aside className="bg-gray-100 rounded-xl p-5 w-full max-w-xs border">
      <form onSubmit={handleSearch}>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-semibold text-gray-700 text-lg">Filters</span>
        </div>
        <input
          type="text"
          name="name"
          value={localFilters.name}
          onChange={handleNameChange}
          placeholder="Search characters..."
          className="w-full mb-2 px-3 py-2 border rounded text-sm focus:outline-none focus:ring"
        />
        <div className="flex gap-2 mb-4">
          <button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
          >
            Search
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded transition border"
            onClick={() => {
              setLocalFilters(defaultFilters);
              onChange(defaultFilters);
            }}
          >
            Clear filters
          </button>
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
          <select
            name="status"
            value={localFilters.status}
            onChange={handleSelectChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Species</label>
          <select
            name="species"
            value={localFilters.species}
            onChange={handleSelectChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {speciesOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
          <select
            name="gender"
            value={localFilters.gender}
            onChange={handleSelectChange}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {genderOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        {onShowFavorites && (
          <button
            type="button"
            onClick={() => {
              // Leer favoritos del localStorage y notificar al padre
              onShowFavorites();
            }}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-2 text-gray-700 hover:bg-gray-200 transition"
          >
            <span role="img" aria-label="heart">♡</span> Show Favorites
          </button>
        )}
      </form>
    </aside>
  );
};

export default CharacterFilters;
