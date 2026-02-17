import { useState, useEffect } from 'react';
import InsuranceFormComponent from './components/InsuranceFormComponent';
import FormList from './components/FormList';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { Button } from './components/ui/button';
import { FileText, ClipboardList, LogOut } from 'lucide-react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useIsCallerAdmin } from './hooks/useQueries';

export default function App() {
  const { clear, identity } = useInternetIdentity();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const [view, setView] = useState<'form' | 'admin'>('form');
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  const isAuthenticated = !!identity;

  // Detect if we're on the admin route
  useEffect(() => {
    const path = window.location.pathname;
    const isAdmin = path === '/admin' || path === '/admin/';
    setIsAdminRoute(isAdmin);
    
    // Set initial view based on route
    if (isAdmin) {
      setView('admin');
    } else {
      setView('form');
    }
  }, []);

  useEffect(() => {
    // If user logs out on admin route, stay on admin login
    if (!isAuthenticated && isAdminRoute) {
      setView('admin');
    }
  }, [isAuthenticated, isAdminRoute]);

  const handleLogout = async () => {
    await clear();
    // Stay on admin route after logout
    if (isAdminRoute) {
      setView('admin');
    }
  };

  // Admin route - show login if not authenticated, dashboard if authenticated
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-red-950 to-red-900 relative overflow-x-hidden">
            {/* Decorative background patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full pointer-events-none" style={{ filter: 'blur(100px)' }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-800/10 rounded-full pointer-events-none" style={{ filter: 'blur(100px)' }} />
            
            <main className="flex-1 relative z-10 flex items-center justify-center">
              <AdminLogin onCancel={() => {
                window.location.href = '/';
              }} />
            </main>
            <Footer />
            <Toaster />
          </div>
        </ThemeProvider>
      );
    }

    // Authenticated admin view
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-red-950 to-red-900 relative overflow-x-hidden">
          {/* Decorative background patterns */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full pointer-events-none" style={{ filter: 'blur(100px)' }} />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-800/10 rounded-full pointer-events-none" style={{ filter: 'blur(100px)' }} />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-red-700/5 rounded-full pointer-events-none" style={{ filter: 'blur(100px)', transform: 'translate(-50%, -50%)' }} />
          
          {/* Navigation bar for admin */}
          {isAuthenticated && isAdmin && (
            <div className="relative z-10 border-b border-red-800/30 bg-black/20">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setView('form')}
                        variant={view === 'form' ? 'default' : 'outline'}
                        className={view === 'form' 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'border-red-300 text-white hover:bg-red-900/30'
                        }
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Formulář
                      </Button>
                      <Button
                        onClick={() => setView('admin')}
                        variant={view === 'admin' ? 'default' : 'outline'}
                        className={view === 'admin' 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'border-red-300 text-white hover:bg-red-900/30'
                        }
                      >
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Správa formulářů
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="border-red-300 text-white hover:bg-red-900/30"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Odhlásit se
                  </Button>
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 relative z-10">
            {view === 'form' ? (
              <div className="container mx-auto px-4 py-8">
                <InsuranceFormComponent />
              </div>
            ) : (
              <FormList />
            )}
          </main>
          <Footer />
          <Toaster />
        </div>
      </ThemeProvider>
    );
  }

  // Client route - show public form without header
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-red-950 to-red-900 relative overflow-x-hidden">
        {/* Decorative background patterns */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(220, 38, 38, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full pointer-events-none" style={{ filter: 'blur(100px)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-800/10 rounded-full pointer-events-none" style={{ filter: 'blur(100px)' }} />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-red-700/5 rounded-full pointer-events-none" style={{ filter: 'blur(100px)', transform: 'translate(-50%, -50%)' }} />

        <main className="flex-1 relative z-10 py-8">
          <div className="container mx-auto px-4">
            <InsuranceFormComponent />
          </div>
        </main>
        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
