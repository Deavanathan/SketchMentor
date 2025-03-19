import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code, Paintbrush } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="flex items-center h-14 bg-[#1A1A1A] border-b border-[#333] px-4">
      <div className="flex space-x-2">
        <Link to="/whiteboard">
          <div className={`flex items-center px-4 py-2 ${location.pathname === '/whiteboard' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-white'}`}>
            <Paintbrush className="h-5 w-5 mr-2" />
            Whiteboard
          </div>
        </Link>
        <Link to="/code">
          <div className={`flex items-center px-4 py-2 ${location.pathname === '/code' ? 'border-b-2 border-primary text-primary' : 'text-gray-400 hover:text-white'}`}>
            <Code className="h-5 w-5 mr-2" />
            Code
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Navigation;
