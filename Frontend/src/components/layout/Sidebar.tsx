
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  PenSquare, 
  Search, 
  MessageSquare, 
  Plus, 
  Settings, 
  HelpCircle, 
  LogOut,
  BrainCircuit,
  FileText,
  Layers,
  ChevronDown,
  Square
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="h-full w-full bg-sidebar flex flex-col overflow-hidden">
      {/* Sidebar header */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="bg-accent rounded-md p-1.5">
            <BrainCircuit size={20} className="text-accent-foreground" />
          </div>
          <span className="font-semibold text-lg tracking-tight">MindNote</span>
        </div>
      </div>
      
      {/* Sidebar content */}
      <div className="flex-1 overflow-auto px-2 py-2">
        {/* Top section - main navigation */}
        <div className="space-y-1 mb-6">
          <Link to="/" className="sidebar-item active">
            <Home size={18} />
            <span>Home</span>
          </Link>
          <Link to="/chats" className="sidebar-item">
            <MessageSquare size={18} />
            <span>Chats</span>
          </Link>
          <button className="sidebar-item w-full text-left">
            <PenSquare size={18} />
            <span>Notes</span>
          </button>
          <Link to="/whiteboard" className="sidebar-item">
            <Square size={18} />
            <span>Whiteboard</span>
          </Link>
          <button className="sidebar-item w-full text-left">
            <Search size={18} />
            <span>Search</span>
          </button>
        </div>

        {/* Spaces section */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-4 py-2 text-sm text-sidebar-foreground/70">
            <span className="font-medium">SPACES</span>
            <ChevronDown size={14} />
          </div>
          <div className="ml-2 mt-1 space-y-1">
            <button className="sidebar-item w-full text-left">
              <div className="w-5 h-5 rounded bg-emerald-500 flex justify-center items-center">
                <span className="text-xs text-white">1</span>
              </div>
              <span>Research</span>
            </button>
            <button className="sidebar-item w-full text-left">
              <div className="w-5 h-5 rounded bg-sky-500 flex justify-center items-center">
                <span className="text-xs text-white">W</span>
              </div>
              <span>Work</span>
            </button>
            <button className="sidebar-item w-full text-left">
              <div className="w-5 h-5 rounded bg-violet-500 flex justify-center items-center">
                <span className="text-xs text-white">P</span>
              </div>
              <span>Personal</span>
            </button>
          </div>
          
          <button className="mt-2 flex items-center px-6 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">
            <Plus size={14} className="mr-2" />
            <span>New Space</span>
          </button>
        </div>
      </div>

      {/* Sidebar footer */}
      <div className="border-t border-sidebar-muted px-2 py-3 space-y-1">
        <button className="sidebar-item w-full text-left">
          <Settings size={18} />
          <span>Settings</span>
        </button>
        <button className="sidebar-item w-full text-left">
          <HelpCircle size={18} />
          <span>Help</span>
        </button>
        <button className="sidebar-item w-full text-left">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
