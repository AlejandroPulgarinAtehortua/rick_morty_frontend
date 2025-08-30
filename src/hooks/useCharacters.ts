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

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGraphQL(
          `
          query($filter: CharacterFilter) {
            characters(filter: $filter) {
              id
              name
              image
              species
              gender
            }
          }
        `,
          { filter }
        );
        setCharacters(data.characters);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [filter]);

  return { characters, loading, error };
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