import { Link, useNavigate } from 'react-router-dom';
import { useVoting } from '@/contexts/VotingContext';
import { Button } from '@/components/ui/button';
import schoolLogo from '@/assets/school-logo.jpg';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { user, isLoggedIn, logout } = useVoting();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={schoolLogo} 
            alt="CPMNHS Logo" 
            className="h-10 w-10 rounded-full object-cover shadow-md"
          />
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-foreground leading-tight">CPMNHS</h1>
            <p className="text-xs text-muted-foreground">Voting System</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/candidates" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Candidates
          </Link>
          <Link to="/results" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Results
          </Link>
          {isLoggedIn && user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                <User className="h-4 w-4 text-secondary-foreground" />
                <span className="text-sm font-medium text-secondary-foreground">
                  {user?.name}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Student Login
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate('/admin-login')}>
                Admin
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link to="/" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/candidates" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Candidates
            </Link>
            <Link to="/results" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Results
            </Link>
            {isLoggedIn && user?.role === 'admin' && (
              <Link to="/admin" className="text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
                Admin Panel
              </Link>
            )}
            <div className="border-t border-border pt-3 mt-2">
              {isLoggedIn ? (
                <Button variant="ghost" className="w-full justify-start" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                    Student Login
                  </Button>
                  <Button onClick={() => { navigate('/admin-login'); setMobileMenuOpen(false); }}>
                    Admin Login
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
