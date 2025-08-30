import React, { useState } from "react";
import { useComments } from "../context/CommentsContext";

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  character: {
    name: string;
    image: string;
    status: string;
    species: string;
    gender: string;
  };
  children?: React.ReactNode;
}


import { FaRegCommentDots, FaMars, FaVenus, FaGenderless, FaTrashAlt } from "react-icons/fa";

const getGenderBadge = (gender: string) => {
  if (gender === "Male") return <span className="inline-flex items-center gap-1 bg-gray-100 text-xl px-2 py-0.5 rounded"><FaMars className="text-blue-500" />Male</span>;
  if (gender === "Female") return <span className="inline-flex items-center gap-1 bg-gray-100 text-xl px-2 py-0.5 rounded"><FaVenus className="text-pink-500" />Female</span>;
  return <span className="inline-flex items-center gap-1 bg-gray-100 text-xl px-2 py-0.5 rounded"><FaGenderless className="text-gray-400" />{gender}</span>;
};

const getStatusBadge = (status: string) => {
  let color = "bg-gray-400";
  if (status === "Alive") color = "bg-green-500";
  if (status === "Dead") color = "bg-red-500";
  if (status === "unknown") color = "bg-gray-300";
  return <span className={`inline-block text-xl px-2 py-0.5 rounded text-white font-semibold ${color}`}>{status}</span>;
};



const DetailsModal: React.FC<DetailsModalProps> = ({ open, onClose, character, children }) => {
  const { addComment, getComments, removeComment } = useComments();
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  if (!open) return null;
  const characterId = String((character as any).id || character.name);
  const comments = getComments(characterId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    addComment(characterId, name, comment);
    setName("");
    setComment("");
    setError("");
  };

  return (
    <div
      className={`fixed overflow-y-scroll inset-0 z-50 flex items-center justify-center transition-colors duration-300 bg-black/0 ${open ? "bg-black/70" : ""}`}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl max-w-lg w-full h-auto p-0 relative transform transition-all duration-300 ${
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}`}
        style={{ maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="p-6 pb-0">
          <h2 className="text-3xl text-gray-700 font-bold mb-3">{character.name}</h2>
          <div className="flex flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={character.image}
                alt={character.name}
                className="w-50 h-50 object-cover rounded-full "
              />
            </div>
            <div className="flex flex-col gap-2 mt-10 flex-1 mt-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-xl text-gray-600">Status: </span>
                {getStatusBadge(character.status)}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-xl text-gray-600">Species: </span>
                <span className="inline-block text-xl px-2 py-0.5 rounded bg-gray-100 font-medium text-gray-700">{character.species}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-xl text-gray-600">Gender: </span>
                {getGenderBadge(character.gender)}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 px-6 pb-6 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <FaRegCommentDots className="text-green-600" />
            <span className="font-semibold text-xl text-gray-700">Comments</span>
          </div>
          <form className="mb-3" onSubmit={handleSubmit}>
            <input
              className="w-full mb-2 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring"
              placeholder="Your name (optional)"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={32}
            />
            <textarea
              className="w-full mb-2 px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring"
              placeholder="Add a comment about this character..."
              rows={2}
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={300}
            />
            {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
            <button
              type="submit"
              className="bg-green-400 text-white px-4 py-1.5 rounded font-medium text-sm hover:bg-green-500 disabled:opacity-60"
              disabled={!comment.trim()}
            >
              Add Comment
            </button>
          </form>
          {comments.length === 0 ? (
            <div className="text-center text-gray-400 text-sm mt-2">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <ul className="space-y-2 mt-10">
              {comments.map((c, idx) => (
                <li key={idx} className="bg-gray-50 rounded p-2 border border-gray-200 flex flex-col gap-1 relative group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-xs text-gray-700">{c.name}</span>
                    <span className="text-xs text-gray-400">{new Date(c.date).toLocaleString()}</span>
                    <button
                      className="ml-auto text-gray-300 hover:text-red-500 p-1 rounded transition-opacity opacity-60 group-hover:opacity-100"
                      title="Eliminar comentario"
                      onClick={() => removeComment(characterId, idx)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                  <div className="text-sm text-gray-700">{c.comment}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default DetailsModal;
