import { useEffect, useState } from "react";

export interface Character {
  id: string;
  name: string;
  image: string;
  species: string;
  gender: string;
}

const fetchGraphQL = async (query: string, variables?: Record<string, unknown>) => {
  const response = await fetch("http://localhost:3001/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const { data, errors } = await response.json();
  if (errors) {
    throw new Error(errors.map((error: { message: string }) => error.message).join(", "));
  }
  return data;
};

export const useCharacters = (filter: Record<string, unknown>) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const filterKey = JSON.stringify(filter);

  // Resetear personajes y página cuando cambian los filtros
  useEffect(() => {
    setCharacters([]);
    setPage(1);
    setHasMore(true);
  }, [filterKey]);

  useEffect(() => {
    let isCancelled = false;
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const limit = 15;
        const data = await fetchGraphQL(
          `
          query GetRMCharacters($page: Int, $name: String, $status: String, $species: String, $gender: String, $limit: Int) {
            rmCharacters(page: $page, name: $name, status: $status, species: $species, gender: $gender, limit: $limit) {
              info { count pages next prev }
              results { id name status species gender image }
            }
          }
          `,
          {
            page,
            name: filter.name || undefined,
            status: filter.status || undefined,
            species: filter.species || undefined,
            gender: filter.gender || undefined,
            limit,
          }
        );
        if (!isCancelled) {
          setCharacters(prev => {
            // Si es la primera página, reinicia la lista; si no, agrega nuevos personajes sin duplicados
            if (page === 1) return data.rmCharacters.results;
            const existingIds = new Set(prev.map(c => c.id));
            const newChars = data.rmCharacters.results.filter((c: Character) => !existingIds.has(c.id));
            return [...prev, ...newChars];
          });
          setHasMore(!!data.rmCharacters.info.next);
        }
      } catch (err) {
        if (!isCancelled) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    fetchCharacters();
    return () => { isCancelled = true; };
  }, [page, filterKey]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return { characters, loading, error, hasMore, loadMore };
};

export const useFavoriteCharacters = (favoriteIds: string[]) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGraphQL(`
          query($ids: [ID!]!) {
            charactersByIds(ids: $ids) {
              id
              name
              image
            }
          }
        `, { ids: favoriteIds });

        setCharacters(data.charactersByIds);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (favoriteIds.length > 0) {
      fetchFavoriteCharacters();
    } else {
      setCharacters([]);
      setLoading(false);
    }
  }, [favoriteIds]);

  return { characters, loading, error };
};