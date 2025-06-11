
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="absolute inset-0 bg-grid-slate-100/30 [mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))] -z-10"></div>
      <div className="absolute h-96 w-96 rounded-full bg-indigo-500/8 blur-3xl top-20 left-20 -z-10"></div>
      <div className="absolute h-96 w-96 rounded-full bg-purple-600/8 blur-3xl bottom-20 right-20 -z-10"></div>
      
      <div className="text-center bg-white/95 backdrop-blur-sm p-12 rounded-3xl border border-slate-200/60 shadow-2xl max-w-md mx-4">
        <h1 className="text-7xl font-bold mb-6 text-slate-900 font-montserrat">404</h1>
        <p className="text-2xl text-slate-800 mb-4 font-semibold font-montserrat">Oops! Page not found</p>
        <p className="text-slate-600 mb-8 text-lg">The page you're looking for doesn't exist or has been moved.</p>
        <a 
          href="/" 
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-montserrat"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
