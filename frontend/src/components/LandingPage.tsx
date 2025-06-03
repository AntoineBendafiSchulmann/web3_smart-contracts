import { useState, useEffect } from "react";
import { motion, useScroll } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  ArrowRight,
  Sparkles,
  BarChart3,
  Brain,
  Star,
  Award,
  Crown,
  Medal,
  Target,
  Gift,
} from "lucide-react";

interface LandingPageProps {
  onNavigateToVoting: () => void;
}

// Composant pour effet de texte qui se tape
const TypeWriter = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }
    }, delay + currentIndex * 100);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay]);

  return <span>{displayText}</span>;
};

// Composant pour étoiles Pokemon flottantes
const PokemonStars = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 8 + 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        >
          <Star className="w-3 h-3 text-yellow-400/60" />
        </motion.div>
      ))}
    </div>
  );
};

// Composant pour Pokeballs flottantes
const FloatingPokeballs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-6 h-6 rounded-full border-2 border-red-400/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(180deg, #ef4444 50%, #f3f4f6 50%)`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Composant pour lignes d'énergie Pokemon
const EnergyLines = () => {
  return (
    <div className="absolute inset-0 opacity-10">
      <svg width="100%" height="100%" className="w-full h-full">
        <defs>
          <linearGradient id="pokemonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="33%" stopColor="#ef4444" />
            <stop offset="66%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        
        {/* Lignes d'énergie zigzag */}
        <g stroke="url(#pokemonGradient)" strokeWidth="2" fill="none">
          <path d="M 0 100 L 50 50 L 100 100 L 150 50 L 200 100" />
          <path d="M 0 200 L 60 150 L 120 200 L 180 150 L 240 200" />
          <path d="M 0 300 L 40 250 L 80 300 L 120 250 L 160 300" />
          
          {/* Cercles d'énergie */}
          <circle cx="20%" cy="30%" r="5" fill="#fbbf24" opacity="0.6" />
          <circle cx="60%" cy="20%" r="4" fill="#ef4444" opacity="0.6" />
          <circle cx="80%" cy="60%" r="6" fill="#3b82f6" opacity="0.6" />
          <circle cx="40%" cy="80%" r="5" fill="#10b981" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
};

export default function LandingPage({ onNavigateToVoting }: LandingPageProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 relative overflow-hidden">
      {/* Pokemon Background Effects */}
      <div className="fixed inset-0 -z-10">
        <PokemonStars />
        <FloatingPokeballs />
        <EnergyLines />
        
        {/* Pokemon Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Pokemon colored glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <motion.nav 
          className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-yellow-500/30"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="p-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                PokéAwards
              </span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a href="#badges" className="text-gray-300 hover:text-yellow-400 transition-colors">Badges</a>
              <a href="#tournaments" className="text-gray-300 hover:text-red-400 transition-colors">Tournois</a>
              <a href="#leaderboard" className="text-gray-300 hover:text-blue-400 transition-colors">Classement</a>
              <Button 
                variant="outline" 
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                onClick={onNavigateToVoting}
              >
                Jouer
              </Button>
            </motion.div>
          </div>
        </motion.nav>

        {/* Hero Section - Pokemon Bento Grid */}
        <section className="min-h-screen pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Main Pokemon Bento Grid */}
            <div className="grid grid-cols-12 grid-rows-8 gap-4 h-screen">
              
              {/* Hero Title Card - Large */}
              <motion.div
                className="col-span-8 row-span-4 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-yellow-500/30 rounded-2xl p-8 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(251, 191, 36, 0.4)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-red-500/5" />
                <div className="relative z-10">
                  <motion.h1 
                    className="text-6xl md:text-7xl font-bold mb-6"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-blue-400 bg-clip-text text-transparent">
                      <TypeWriter text="PokéAwards" delay={1000} />
                    </span>
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-gray-300 mb-8 max-w-2xl"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    Gagnez • Collectionnez • Dominez
                    <br />
                    <span className="text-yellow-400">Premier Système de Récompenses</span> pour Dresseurs
                  </motion.p>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                  >
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white px-8 py-3"
                      onClick={onNavigateToVoting}
                    >
                      <Trophy className="mr-2 h-5 w-5" />
                      Commencer l'Aventure
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
                
                {/* Pokemon decorative elements */}
                <motion.div
                  className="absolute top-4 right-4 w-20 h-20 border border-yellow-500/40 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute bottom-4 right-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Star className="h-12 w-12 text-yellow-400/50" />
                </motion.div>
              </motion.div>

              {/* Badges Collectionnés */}
              <motion.div
                className="col-span-4 row-span-2 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                <div className="relative z-10">
                  <motion.div
                    className="flex items-center justify-between mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Award className="h-8 w-8 text-blue-400" />
                    </div>
                    <span className="text-2xl font-bold text-gray-400">127</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Badges Collectés</h3>
                  <p className="text-sm text-gray-400">Collection Personnelle</p>
                </div>
              </motion.div>

              {/* Niveau Dresseur */}
              <motion.div
                className="col-span-4 row-span-2 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-green-500/30 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
                <div className="relative z-10">
                  <motion.div
                    className="flex items-center justify-between mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <Crown className="h-8 w-8 text-green-400" />
                    </div>
                    <span className="text-2xl font-bold text-gray-400">Elite</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Rang Dresseur</h3>
                  <p className="text-sm text-gray-400">Niveau Maître Pokemon</p>
                </div>
              </motion.div>

              {/* Système de Récompenses */}
              <motion.div
                className="col-span-4 row-span-4 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 25px rgba(139, 92, 246, 0.3)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <motion.div
                      className="p-4 bg-purple-500/20 rounded-xl mb-6 w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <Gift className="h-12 w-12 text-purple-400" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-200 mb-4">Récompenses Quotidiennes</h3>
                    <p className="text-gray-400 mb-6">
                      Système de récompenses innovant avec NFT Pokemon et tokens.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">Badges NFT uniques</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">Tournois hebdomadaires</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">Récompenses évolutives</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Pokeball */}
                <motion.div
                  className="absolute top-4 right-4 w-8 h-8 rounded-full"
                  style={{
                    background: `linear-gradient(180deg, #ef4444 50%, #f3f4f6 50%)`,
                    border: "2px solid #374151",
                  }}
                  animate={{ 
                    rotate: 360, 
                    scale: [1, 1.2, 1],
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
              </motion.div>

              {/* Victoires Aujourd'hui */}
              <motion.div
                className="col-span-4 row-span-2 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(239, 68, 68, 0.3)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />
                <div className="relative z-10">
                  <motion.div
                    className="flex items-center justify-between mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="p-3 bg-red-500/20 rounded-lg">
                      <Target className="h-8 w-8 text-red-400" />
                    </div>
                    <span className="text-2xl font-bold text-gray-400">24</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Victoires Aujourd'hui</h3>
                  <p className="text-sm text-gray-400">Combats Gagnés</p>
                </div>
              </motion.div>

              {/* Classement Global */}
              <motion.div
                className="col-span-4 row-span-2 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(251, 191, 36, 0.3)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent" />
                <div className="relative z-10">
                  <motion.div
                    className="flex items-center justify-between mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Medal className="h-8 w-8 text-yellow-400" />
                    </div>
                    <span className="text-2xl font-bold text-gray-400">#3</span>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Classement</h3>
                  <p className="text-sm text-gray-400">Position Mondiale</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section - Pokemon Badges */}
        <section className="py-20 px-6" id="badges">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                  Collection de Badges
                </span>
              </h2>
              <p className="text-xl text-gray-400">
                Débloquez des badges uniques et montez dans le classement
              </p>
            </motion.div>

            {/* Badges Bento Grid */}
            <div className="grid grid-cols-6 grid-rows-4 gap-4 h-96">
              
              {/* Badge Champion */}
              <motion.div
                className="col-span-3 row-span-2 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 25px rgba(251, 191, 36, 0.4)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/15 to-transparent" />
                <div className="relative z-10">
                  <motion.div
                    className="p-3 bg-yellow-500/20 rounded-xl mb-4 w-fit"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Trophy className="h-8 w-8 text-yellow-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-200 mb-3">Badge Champion</h3>
                  <p className="text-gray-400">
                    Badge légendaire obtenu après 100 victoires consécutives en tournoi.
                  </p>
                </div>
              </motion.div>

              {/* Badge Collectionneur */}
              <motion.div
                className="col-span-3 row-span-2 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-transparent" />
                <div className="relative z-10">
                  <motion.div
                    className="p-3 bg-blue-500/20 rounded-xl mb-4 w-fit"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Star className="h-8 w-8 text-blue-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-200 mb-3">Badge Collectionneur</h3>
                  <p className="text-gray-400">
                    Récompense pour avoir collectionné plus de 150 Pokemon différents.
                  </p>
                </div>
              </motion.div>

              {/* Badge Stratège */}
              <motion.div
                className="col-span-2 row-span-2 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-green-500/30 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 to-transparent" />
                <div className="relative z-10 text-center">
                  <motion.div
                    className="p-3 bg-green-500/20 rounded-xl mb-4 mx-auto w-fit"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Brain className="h-8 w-8 text-green-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-gray-200 mb-2">Badge Stratège</h3>
                  <p className="text-sm text-gray-400">
                    Maîtrise des stratégies de combat
                  </p>
                </div>
              </motion.div>

              {/* Progression Stats */}
              <motion.div
                className="col-span-4 row-span-2 bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 25px rgba(139, 92, 246, 0.4)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-transparent" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <motion.div
                      className="p-3 bg-purple-500/20 rounded-xl mb-4 w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <BarChart3 className="h-8 w-8 text-purple-400" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-200 mb-2">Progression XP</h3>
                    <p className="text-gray-400">
                      Suivez votre évolution et débloquez de nouveaux niveaux
                    </p>
                  </div>
                  
                  {/* XP Progress bars */}
                  <div className="flex flex-col space-y-2">
                    {[85, 92, 67, 78].map((progress, i) => (
                      <motion.div
                        key={i}
                        className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        whileInView={{ width: 128 }}
                        transition={{ delay: i * 0.2, duration: 1 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className={`h-full rounded-full ${
                            i % 4 === 0 ? 'bg-yellow-400' :
                            i % 4 === 1 ? 'bg-red-400' :
                            i % 4 === 2 ? 'bg-blue-400' : 'bg-green-400'
                          }`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${progress}%` }}
                          transition={{ delay: i * 0.2 + 0.5, duration: 1 }}
                          viewport={{ once: true }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          className="py-20 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-yellow-500/30 rounded-3xl p-12 relative overflow-hidden"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 40px rgba(251, 191, 36, 0.3)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-red-500/10" />
              <div className="relative z-10">
                <motion.h2
                  className="text-4xl md:text-5xl font-bold mb-6"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  Devenez un{" "}
                  <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                    Maître Pokemon
                  </span>
                </motion.h2>
                
                <motion.p
                  className="text-xl text-gray-400 mb-8"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  Collectionnez, combattez et gagnez des récompenses uniques
                </motion.p>
                
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white px-12 py-4 text-lg"
                    onClick={onNavigateToVoting}
                  >
                    <Sparkles className="mr-3 h-6 w-6" />
                    Commencer l'Aventure
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </motion.div>
              </div>
              
              {/* Pokemon decorative stars */}
              <motion.div
                className="absolute top-4 left-4"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Star className="h-6 w-6 text-yellow-400/60" />
              </motion.div>
              <motion.div
                className="absolute bottom-4 right-4"
                animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <Star className="h-8 w-8 text-red-400/60" />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-yellow-500/20">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              className="flex justify-center items-center space-x-4 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="p-2 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                PokéAwards
              </span>
            </motion.div>
            
            <p className="text-gray-400 mb-4">
              🏆 Système de récompenses • ⚡ Combats épiques • 🎯 Badges collectibles
            </p>
            
            <p className="text-sm text-gray-500">
              © 2024 PokéAwards. Attrapez-les tous avec style !
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
