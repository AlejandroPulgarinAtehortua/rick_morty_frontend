import Header from "../components/Header";
import CharacterCard from "../components/characters_card/CharactersCard";
import { useCharacters } from "../hooks/useCharacters";
import type { Character } from "../hooks/useCharacters";
import { useMemo, useState } from "react";
import Loader from "../components/Loader";
import DetailsModal from "../components/DetailsModal";
import CharacterFilters from "../components/CharacterFilters";


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
  const { characters, loading, error, hasMore, loadMore } = useCharacters(filters);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterFull | null>(null);
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
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4 mb-6 md:mb-0">
          <CharacterFilters filters={filters} onChange={setFilters} />
        </div>
        <div className="flex-1">
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
            {sortedCharacters.length > 0 && sortedCharacters.map(character => {
              // Asegura que el objeto tenga las props requeridas
              const characterFull: CharacterFull = {
                ...character,
                status: (character as any).status ?? '',
                origin: (character as any).origin ?? undefined,
              };
              return (
                <button
                  key={character.id}
                  className="text-left focus:outline-none"
                  onClick={() => setSelectedCharacter(characterFull)}
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <CharacterCard character={characterFull} />
                </button>
              );
            })}
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