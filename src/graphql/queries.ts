export const GET_CHARACTERS = `
  query GetCharacters($filter: CharacterFilter) {
    characters(filter: $filter) {
      id
      name
      status
      species
      gender
      origin
    }
  }
`;

export const GET_CHARACTER_BY_ID = `
  query GetCharacterById($id: ID!) {
    character(id: $id) {
      id
      name
      status
      origin
    }
  }
`;

export const GET_RM_CHARACTERS = `
  query GetRMCharacters($page: Int) {
    rmCharacters(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        gender
        image
      }
    }
  }
`;

export const GET_RM_CHARACTER_BY_ID = `
  query GetRMCharacterById($id: ID!) {
    rmCharacter(id: $id) {
      id
      name
      status
      species
    }
  }
`;

export const GET_RM_CHARACTER_BY_NAME_STATUS = `
  query GetRMCharacterByNameStatus($name: String, $status: String) {
    rmCharacters(name: $name, status: $status) {
      results {
        id
        name
        status
      }
    }
  }
`;
