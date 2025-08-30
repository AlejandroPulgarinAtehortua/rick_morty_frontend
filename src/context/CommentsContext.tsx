import React, { createContext, useContext, useEffect, useState } from "react";

export interface CharacterComment {
  characterId: string;
  name: string;
  comment: string;
  date: string;
}

type CommentsContextType = {
  comments: CharacterComment[];
  addComment: (characterId: string, name: string, comment: string) => void;
  getComments: (characterId: string) => CharacterComment[];
  removeComment: (characterId: string, index: number) => void;
};

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export const CommentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<CharacterComment[]>(() => {
    const stored = localStorage.getItem("comments");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const addComment = (characterId: string, name: string, comment: string) => {
    setComments(prev => [
      ...prev,
      {
        characterId,
        name: name.trim() || "Anonymous",
        comment: comment.trim(),
        date: new Date().toISOString(),
      },
    ]);
  };

  const getComments = (characterId: string) =>
    comments.filter(c => c.characterId === characterId);

  const removeComment = (characterId: string, index: number) => {
    setComments(prev => {
      const filtered = prev.filter(c => c.characterId === characterId);
      const others = prev.filter(c => c.characterId !== characterId);
      filtered.splice(index, 1);
      return [...others, ...filtered];
    });
  };

  return (
    <CommentsContext.Provider value={{ comments, addComment, getComments, removeComment }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error("useComments must be used within CommentsProvider");
  return ctx;
};
