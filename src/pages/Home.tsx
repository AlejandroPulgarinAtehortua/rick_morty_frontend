import Header from "../components/Header";
import CharacterCard from "../components/characters_card/CharactersCard";
import { useCharacters } from "../hooks/useCharacters";
import { useMemo, useState } from "react";
import Loader from "../components/Loader";
import DetailsModal from "../components/DetailsModal";

const Home = () => {
  // Si tienes filtros dinámicos, ponlos aquí. Por ahora es un objeto vacío.

  const filter = useMemo(() => ({}), []);
  const { characters, loading, error, hasMore, loadMore } = useCharacters(filter);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [sortOrder, setSortOrder] = useState<'az' | 'za'>('az');

  const sortedCharacters = useMemo(() => {
    const chars = [...characters];
    chars.sort((a, b) => {
      if (!a.name || !b.name) return 0;
      if (sortOrder === 'az') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });
    return chars;
  }, [characters, sortOrder]);

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-2 mt-4">
          <div className="text-sm text-gray-500">Showing {characters.length} characters</div>
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
        {loading && <Loader />}
        {error && <div className="mb-4 text-red-500">Error: {error && error.message}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedCharacters.length > 0 && sortedCharacters.map(character => (
            <button
              key={character.id}
              className="text-left focus:outline-none"
              onClick={() => setSelectedCharacter(character)}
              style={{ background: "none", border: "none", padding: 0 }}
            >
              <CharacterCard character={character} />
            </button>
          ))}
        </div>
        {hasMore && !loading && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded shadow"
            >
              Load more
            </button>
          </div>
        )}
      </div>
      <DetailsModal
        open={!!selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
        character={selectedCharacter || { name: '', image: '', status: '', species: '', gender: '' }}
      >
        {/* Aquí puedes agregar los comentarios u otros children si lo deseas */}
      </DetailsModal>
    </>
  );
};

export default Home;