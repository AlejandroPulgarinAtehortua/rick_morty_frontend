import Header from "../components/Header";
import CharacterCard from "../components/characters_card/CharactersCard";
import { useCharacters } from "../hooks/useCharacters";
import { useMemo, useState, useEffect } from "react";
import type { Character } from "../interfaces/characters";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import DetailsModal from "../components/DetailsModal";
import CharacterFilters from "../components/CharacterFilters";
import ErrorMessage from "../components/ErrorMessage";
import { useFavoriteCharacters } from "../hooks/useCharacters";


const defaultFilters = {
  name: '',
  status: '',
  species: '',
  gender: '',
};


const Home = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();
  const location = useLocation();
  const [sortOrder, setSortOrder] = useState<'az' | 'za'>('az');

  const getFavoriteIds = () => {
    try {
      const favs = localStorage.getItem('favorites');
      if (favs) return JSON.parse(favs);
    } catch { console.error("Failed to parse favorites from localStorage"); }
    return [];
  };

  const [favUpdate, setFavUpdate] = useState(0);
  const favoriteIds = useMemo(() => getFavoriteIds(), [favUpdate]);
  const {
    characters: favoriteCharacters,
    loading: favLoading,
    error: favError
  } = useFavoriteCharacters(favoriteIds);

  const handleFavoriteChange = () => setFavUpdate(u => u + 1);

  const [retryKey, setRetryKey] = useState(0);
  const { characters, loading, error, hasMore, loadMore } = useCharacters({ ...filters, retryKey });

  const sortedCharacters = useMemo(() => {
    const chars = showFavorites ? [...favoriteCharacters] : [...characters];
    chars.sort((a, b) => {
      if (!a.name || !b.name) return 0;
      if (sortOrder === 'az') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
    return chars;
  }, [characters, favoriteCharacters, sortOrder, showFavorites]);

  const handleRetry = () => setRetryKey(k => k + 1);
  const handleFavRetry = () => handleFavoriteChange();

  useEffect(() => {
    if (routeId) {
      const allChars = showFavorites ? favoriteCharacters : characters;
      const found = allChars.find(character => String(character.id) === routeId);
      if (found) {
        setSelectedCharacter(found);
      } else {
        setSelectedCharacter(null);
      }
    } else {
      setSelectedCharacter(null);
    }
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
              handleFavoriteChange();
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
            <ErrorMessage
              message={
                showFavorites
                  ? favError?.message || "Error loading favorites."
                  : error?.message || "Error loading characters."
              }
              onRetry={showFavorites ? handleFavRetry : handleRetry}
              className="mb-4"
            />
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sortedCharacters.length > 0 && sortedCharacters.map(character => {
              const characterFull: Character = {
                ...character,
                id: typeof character.id === "string" ? Number(character.id) : character.id,
                status: character?.status ?? '',
                origin: character?.origin ?? undefined,
              };
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
            {!showFavorites && hasMore && !loading && !error && (
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
          if (location.state && (location.state).from) {
            navigate((location.state).from.pathname, { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }}
        character={selectedCharacter || { name: '', image: '', status: '', species: '', gender: '' }}
      >
      </DetailsModal>
    </>
  );
};

export default Home;