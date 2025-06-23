
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './AuthModal';
import { MapPin, User, Calendar } from 'lucide-react';

interface HeaderProps {
  currentView: 'map' | 'timeline';
  onViewChange: (view: 'map' | 'timeline') => void;
}

const Header = ({ currentView, onViewChange }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Travel Memories
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {user && (
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => onViewChange('map')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'map' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Map
                </button>
                <button
                  onClick={() => onViewChange('timeline')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'timeline' 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Timeline
                </button>
              </div>
            )}
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {user.email}
                </span>
                <Button onClick={logout} variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setAuthModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                <User className="w-4 h-4 mr-1" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;
