import React from "react";

const Loader: React.FC = () => (
  <div className="flex justify-center items-center py-8">
    <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-3 text-blue-600 font-medium">Loading...</span>
  </div>
);

export default Loader;
