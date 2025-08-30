import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto flex items-center space-x-4 py-4 px-6">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBC8HPdLgF5_fgcXlGurS9hVbXFh3Dqp4uaLB9C3dRdfowzGsaz3v18M23h57ZyLuELUo&usqp=CAU" alt="Rick & Morty Logo" className="h-10 w-10" />

        <div>
          <h1 className="text-2xl font-bold text-foreground">Rick & Morty</h1>
          <p className="text-sm text-muted-foreground">Character Explorer</p>
        </div>
      </div>
    </header>
  );
};

export default Header;

