import Header from "../components/Header";
import CharacterCard from "../components/characters_card/CharactersCard";
import { useCharacters } from "../hooks/useCharacters";
import type { Character } from "../hooks/useCharacters";
import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import DetailsModal from "../components/DetailsModal";
import CharacterFilters from "../components/CharacterFilters";
import { useFavoriteCharacters } from "../hooks/useCharacters";


const defaultFilters = {
  name: '',
  status: '',
  species: '',
  gender: '',
};

// Extiende Character para incluir status y origin (opcional)
type CharacterFull = Character & {
  status?: string;
  origin?: { name?: string };
};

const Home = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterFull | null>(null);
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();
  const location = useLocation();
  const [sortOrder, setSortOrder] = useState<'az' | 'za'>('az');

  // Obtener ids favoritos del localStorage
  // import { useMemo } from "react";
  const getFavoriteIds = () => {
    try {
      const favs = localStorage.getItem('favorites');
      if (favs) return JSON.parse(favs);
    } catch { }
    return [];
  };

  // Estado para forzar actualización de favoritos
  const [favUpdate, setFavUpdate] = useState(0);
  // Siempre lee los ids actuales del localStorage
  const favoriteIds = useMemo(() => getFavoriteIds(), [favUpdate]);
  const {
    characters: favoriteCharacters,
    loading: favLoading,
    error: favError
  } = useFavoriteCharacters(favoriteIds);

  // Función para actualizar favoritos tras eliminar
  const handleFavoriteChange = () => setFavUpdate(u => u + 1);

  const { characters, loading, error, hasMore, loadMore } = useCharacters(filters);

  const sortedCharacters = useMemo(() => {
    const chars = showFavorites ? [...favoriteCharacters] : [...characters];
    chars.sort((a, b) => {
      if (!a.name || !b.name) return 0;
      if (sortOrder === 'az') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
    return chars;
  }, [characters, favoriteCharacters, sortOrder, showFavorites]);

  // Sincroniza el modal con la URL
  useEffect(() => {
    if (routeId) {
      // Busca el personaje por id en la lista actual
      const allChars = showFavorites ? favoriteCharacters : characters;
      const found = allChars.find(c => String(c.id) === routeId);
      if (found) {
        setSelectedCharacter(found);
      } else {
        setSelectedCharacter(null);
      }
    } else {
      setSelectedCharacter(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId, characters, favoriteCharacters, showFavorites]);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
          <CharacterFilters
            filters={filters}
            onChange={filter => {
              setFilters(filter);
              setShowFavorites(false);
            }}
            onShowFavorites={() => {
              setShowFavorites(true);
              handleFavoriteChange(); // fuerza actualización al mostrar favoritos
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2 mt-4">
            <div className="text-sm text-gray-500">
              {showFavorites
                ? `Showing ${favoriteCharacters.length} favorite characters`
                : `Showing ${characters.length} characters`}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-600 font-medium">Sort by name:</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as 'az' | 'za')}
                className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring"
              >
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
              </select>
            </div>
          </div>
          {(showFavorites ? favLoading : loading) && <Loader />}
          {(showFavorites ? favError : error) && (
            <div className="mb-4 text-red-500">Error: {(showFavorites ? favError : error)?.message}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sortedCharacters.length > 0 && sortedCharacters.map(character => {
              const characterFull: CharacterFull = {
                ...character,
                status: (character as any).status ?? '',
                origin: (character as any).origin ?? undefined,
              };
              // Cuando se elimina un favorito, forzar actualización
              const handleSelect = () => {
                navigate(`/character/${character.id}`, { state: { from: location } });
                if (showFavorites) handleFavoriteChange();
              };
              return (
                <button
                  key={character.id}
                  className="text-left focus:outline-none"
                  onClick={handleSelect}
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <CharacterCard character={characterFull} />
                </button>
              );
            })}
          </div>
          {!showFavorites && hasMore && !loading && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                className="bg-green-500 hover:bg-green-600 mb-10 text-white font-semibold px-6 py-2 rounded shadow cursor-pointer"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
      <DetailsModal
        open={!!selectedCharacter}
        onClose={() => {
          // Cierra el modal navegando a la ruta anterior o raíz
          if (location.state && (location.state as any).from) {
            navigate((location.state as any).from.pathname, { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }}
        character={selectedCharacter || { name: '', image: '', status: '', species: '', gender: '' }}
      >
        {/* Aquí puedes agregar los comentarios u otros children si lo deseas */}
      </DetailsModal>
    </>
  );
};

export default Home;