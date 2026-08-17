import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { Home, Calendar, ImageIcon, CreditCard, Users, Settings, LogOut, Newspaper, UserPlus, LogIn } from "lucide-react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inicio from "./pages/Inicio";
import Noticias from "./pages/Noticias";
import Calendario from "./pages/Calendario";
import Galeria from "./pages/Galeria";
import CheckIn from "./pages/CheckIn";
import Pagamentos from "./pages/Pagamentos";
import Socios from "./pages/Socios";
import Admin from "./pages/Admin";
import base44 from "./api/base44Client";

const LOGO_URL = "https://media.base44.com/images/public/6a7ce15ca66c6e3ed58f020a/5f0bb2871_LOGOOFICIAL.jpg";

// Componente de Navegação
function BottomNav() {
  const { pathname } = useLocation();

  const links = [
    { to="/inicio", label: "Início", icon: Home },
    { to="/noticias", label: "Notícias", icon: Newspaper },
    { to="/calendario", label: "Calendário", icon: Calendar },
    { to="/galeria", label: "Galeria", icon: ImageIcon },
    { to="/pagamentos", label: "Associe-se", icon: CreditCard },
    { to="/socios", label: "Sócios", icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#005A20] border-t border-[#2E8B57]/40 z-50">
      <div className="max-w-lg mx-auto flex justify-around py-2 px-1">
        {links.map(({ to, label, icon: Icon }) => {
          const ativo = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg transition ${
                ativo ? "bg-[#2E8B57] text-white" : "text-white/70 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Cabeçalho
function Header({ user, onLogout }) {
  return (
    <header className="bg-[#005A20] border-b border-[#2E8B57]/40 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <img src={LOGO_URL} alt="Guerreiros da Tribo" className="w-10 h-10 rounded-full object-cover border border-white/20" />
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">Guerreiros da Tribo</h1>
          <p className="text-white/60 text-xs">Guarani F.C.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            {user.role === "admin" && (
              <Link to="/admin" className="p-2 text-white/70 hover:text-white">
                <Settings className="w-5 h-5" />
              </Link>
            )}
            <button onClick={onLogout} className="p-2 text-white/70 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="p-2 text-white/70 hover:text-white flex items-center gap-1">
              <LogIn className="w-4 h-4" />
              <span className="text-xs">Entrar</span>
            </Link>
            <Link to="/register" className="p-2 text-white/70 hover:text-white flex items-center gap-1">
              <UserPlus className="w-4 h-4" />
              <span className="text-xs">Cadastrar</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

// Layout com navegação
function Layout({ children, user, onLogout }) {
  const { pathname } = useLocation();
  const semNav = ["/login", "/register"].includes(pathname);

  return (
    <div className="min-h-screen bg-[#004A1A] text-white">
      <Header user={user} onLogout={onLogout} />
      <main className={`max-w-lg mx-auto px-4 py-4 ${semNav ? "" : "pb-24"}`}>
        {children}
      </main>
      {!semNav && <BottomNav />}
    </div>
  );
}

// Rota protegida
function ProtectedRoute({ children, user }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCarregando(false));
  }, []);

  const handleLogout = () => {
    base44.auth.logout();
    setUser(null);
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#004A1A] flex items-center justify-center">
        <p className="text-white/70">Carregando...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <Layout user={user} onLogout={handleLogout}>
            <Login onLogin={setUser} />
          </Layout>
        } />
        <Route path="/register" element={
          <Layout user={user} onLogout={handleLogout}>
            <Register />
          </Layout>
        } />
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        <Route path="/inicio" element={
          <Layout user={user} onLogout={handleLogout}><Inicio /></Layout>
        } />
        <Route path="/noticias" element={
          <Layout user={user} onLogout={handleLogout}><Noticias /></Layout>
        } />
        <Route path="/calendario" element={
          <Layout user={user} onLogout={handleLogout}><Calendario /></Layout>
        } />
        <Route path="/galeria" element={
          <Layout user={user} onLogout={handleLogout}><Galeria /></Layout>
        } />
        <Route path="/check-in" element={
          <Layout user={user} onLogout={handleLogout}>
            <ProtectedRoute user={user}><CheckIn /></ProtectedRoute>
          </Layout>
        } />
        <Route path="/pagamentos" element={
          <Layout user={user} onLogout={handleLogout}><Pagamentos /></Layout>
        } />
        <Route path="/socios" element={
          <Layout user={user} onLogout={handleLogout}><Socios /></Layout>
        } />
        <Route path="/admin" element={
          <Layout user={user} onLogout={handleLogout}>
            <ProtectedRoute user={user}><Admin /></ProtectedRoute>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
