import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trophy,
  Star,
  Heart,
  Users,
  TrendingUp,
  LogOut,
  Sparkles,
  ThumbsUp,
  Timer,
  Award,
  AlertTriangle,
  X,
  ChevronDown,
  Wallet,
  UserX,
} from "lucide-react";

interface AwardsPageProps {
  userAddress: string;
  onLogout: () => void;
}

interface Pokemon {
  id: number;
  name: string;
  type: string;
  image: string;
  votes: number;
  description: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  hasVoted?: boolean;
}

// Données Pokemon du moment (simulated data)
const pokemonList: Pokemon[] = [
  {
    id: 1,
    name: "Pikachu",
    type: "Électrik",
    image: "⚡",
    votes: 1247,
    description: "Le Pokemon emblématique de la franchise",
    category: "Meilleur Pokemon Classique",
    rarity: "legendary",
  },
  {
    id: 2,
    name: "Charizard",
    type: "Feu/Vol",
    image: "🔥",
    votes: 2156,
    description: "Dragon majestueux aux flammes puissantes",
    category: "Pokemon le Plus Populaire",
    rarity: "legendary",
  },
  {
    id: 3,
    name: "Mew",
    type: "Psy",
    image: "🌟",
    votes: 892,
    description: "Pokemon mythique aux pouvoirs psychiques",
    category: "Pokemon le Plus Mystérieux",
    rarity: "epic",
  },
  {
    id: 4,
    name: "Lucario",
    type: "Combat/Acier",
    image: "⚔️",
    votes: 675,
    description: "Maître des arts martiaux et de l'aura",
    category: "Meilleur Pokemon Combat",
    rarity: "rare",
  },
  {
    id: 5,
    name: "Eevee",
    type: "Normal",
    image: "🦊",
    votes: 1534,
    description: "Pokemon aux évolutions multiples",
    category: "Pokemon le Plus Adorable",
    rarity: "rare",
  },
  {
    id: 6,
    name: "Rayquaza",
    type: "Dragon/Vol",
    image: "🐉",
    votes: 987,
    description: "Gardien légendaire du ciel",
    category: "Pokemon Légendaire Favori",
    rarity: "legendary",
  },
  {
    id: 7,
    name: "Greninja",
    type: "Eau/Ténèbres",
    image: "💧",
    votes: 756,
    description: "Ninja des eaux aux techniques furtives",
    category: "Meilleur Design Pokemon",
    rarity: "epic",
  },
  {
    id: 8,
    name: "Garchomp",
    type: "Dragon/Sol",
    image: "🦈",
    votes: 543,
    description: "Dragon terrestre à la vitesse supersonique",
    category: "Pokemon le Plus Puissant",
    rarity: "epic",
  },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "from-yellow-400 to-orange-500";
    case "epic":
      return "from-purple-400 to-pink-500";
    case "rare":
      return "from-blue-400 to-cyan-500";
    default:
      return "from-gray-400 to-gray-500";
  }
};

const getRarityBorder = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "border-yellow-500/50";
    case "epic":
      return "border-purple-500/50";
    case "rare":
      return "border-blue-500/50";
    default:
      return "border-gray-500/50";
  }
};

// Composant Pokeball flottante
const FloatingPokeball = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      className="absolute w-4 h-4 rounded-full border border-red-400/30"
      style={{
        background: `linear-gradient(180deg, #ef4444 50%, #f3f4f6 50%)`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -30, 0],
        rotate: [0, 360],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
      }}
    />
  );
};

export default function AwardsPage({ userAddress, onLogout }: AwardsPageProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>(pokemonList);
  const [totalVotes, setTotalVotes] = useState(0);
  const [userVotes, setUserVotes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(86400); // 24h en secondes
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [votedPokemonId, setVotedPokemonId] = useState<number | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  // Clé pour le localStorage basée sur l'adresse du wallet
  const getStorageKey = (address: string) =>
    `pokeawards_votes_${address.toLowerCase()}`;
  const getGlobalVotesKey = () => "pokeawards_global_votes";

  // Charger les votes depuis le localStorage
  useEffect(() => {
    loadUserVotes();
    loadGlobalVotes();
  }, [userAddress]);

  const loadUserVotes = () => {
    try {
      const storageKey = getStorageKey(userAddress);
      const savedUserData = localStorage.getItem(storageKey);

      if (savedUserData) {
        const userData = JSON.parse(savedUserData);
        setHasUserVoted(userData.hasVoted);
        setVotedPokemonId(userData.votedPokemonId);
        setUserVotes(userData.hasVoted ? 1 : 0);

        // Marquer le Pokemon voté dans la liste
        if (userData.hasVoted && userData.votedPokemonId) {
          setPokemon((prev) =>
            prev.map((p) => ({
              ...p,
              hasVoted: p.id === userData.votedPokemonId,
            }))
          );
        }
      } else {
        // Réinitialiser pour un nouveau compte
        setHasUserVoted(false);
        setVotedPokemonId(null);
        setUserVotes(0);
        setPokemon((prev) => prev.map((p) => ({ ...p, hasVoted: false })));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des votes utilisateur:", error);
    }
  };

  const loadGlobalVotes = () => {
    try {
      const globalVotes = localStorage.getItem(getGlobalVotesKey());

      if (globalVotes) {
        const votesData = JSON.parse(globalVotes);
        setPokemon((prev) =>
          prev.map((p) => ({
            ...p,
            votes: votesData[p.id] || p.votes,
          }))
        );
      }
    } catch (error) {
      console.error("Erreur lors du chargement des votes globaux:", error);
    }
  };

  const saveUserVote = (pokemonId: number) => {
    try {
      const storageKey = getStorageKey(userAddress);
      const userData = {
        hasVoted: true,
        votedPokemonId: pokemonId,
        timestamp: Date.now(),
        walletAddress: userAddress,
      };
      localStorage.setItem(storageKey, JSON.stringify(userData));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du vote utilisateur:", error);
    }
  };

  const saveGlobalVotes = (updatedPokemon: Pokemon[]) => {
    try {
      const globalVotes: { [key: number]: number } = {};
      updatedPokemon.forEach((p) => {
        globalVotes[p.id] = p.votes;
      });
      localStorage.setItem(getGlobalVotesKey(), JSON.stringify(globalVotes));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des votes globaux:", error);
    }
  };

  useEffect(() => {
    // Calculer le total des votes
    const total = pokemon.reduce((sum, p) => sum + p.votes, 0);
    setTotalVotes(total);
  }, [pokemon]);

  useEffect(() => {
    // Timer pour le temps restant
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVote = (pokemonId: number) => {
    // Vérifier si l'utilisateur a déjà voté
    if (hasUserVoted) {
      setErrorMessage(
        "Vous avez déjà voté ! Vous ne pouvez voter qu'une seule fois par compte."
      );
      setShowError(true);

      // Cacher l'erreur après 4 secondes
      setTimeout(() => {
        setShowError(false);
      }, 4000);

      return;
    }

    // Effectuer le vote
    const updatedPokemon = pokemon.map((p) =>
      p.id === pokemonId ? { ...p, votes: p.votes + 1, hasVoted: true } : p
    );

    setPokemon(updatedPokemon);
    setUserVotes(1);
    setHasUserVoted(true);
    setVotedPokemonId(pokemonId);

    // Sauvegarder le vote
    saveUserVote(pokemonId);
    saveGlobalVotes(updatedPokemon);
  };

  const categories = [
    "all",
    "Meilleur Pokemon Classique",
    "Pokemon le Plus Populaire",
    "Pokemon le Plus Mystérieux",
    "Meilleur Pokemon Combat",
    "Pokemon le Plus Adorable",
    "Pokemon Légendaire Favori",
    "Meilleur Design Pokemon",
    "Pokemon le Plus Puissant",
  ];

  const filteredPokemon =
    selectedCategory === "all"
      ? pokemon
      : pokemon.filter((p) => p.category === selectedCategory);

  const handleAppLogout = () => {
    setShowLogoutMenu(false);
    onLogout();
  };

  const handleFullLogout = async () => {
    setShowLogoutMenu(false);
    
    try {
      // Tenter de déconnecter MetaMask (si possible)
      if (typeof window.ethereum !== "undefined") {
        const ethereum = window.ethereum as any;
        if (ethereum.disconnect) {
          await ethereum.disconnect();
        }
      }
      
      // Effacer les permissions MetaMask (méthode alternative)
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
          });
        } catch (error) {
          // Cette méthode peut échouer, c'est normal
          console.log("Méthode de déconnexion alternative utilisée");
        }
      }
    } catch (error) {
      console.log("Déconnexion MetaMask non supportée par cette version");
    }
    
    // Déconnexion de l'application
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        {/* Pokeballs flottantes */}
        {[...Array(15)].map((_, i) => (
          <FloatingPokeball key={i} delay={i * 0.5} />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

        {/* Pokemon colored glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-yellow-500/20"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="p-2 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Trophy className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                  PokéAwards
                </h1>
                <p className="text-sm text-gray-400">
                  Votez pour vos Pokemon favoris
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* User Stats */}
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="h-4 w-4 text-green-400" />
                  <span>{userVotes} votes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span>{totalVotes.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Timer className="h-4 w-4 text-orange-400" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Vote Status */}
              {hasUserVoted && votedPokemonId && (
                <motion.div
                  className="bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-1 flex items-center space-x-2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">
                      {pokemon.find((p) => p.id === votedPokemonId)?.image}
                    </span>
                    <span className="text-sm font-medium text-green-400">
                      Voté pour{" "}
                      {pokemon.find((p) => p.id === votedPokemonId)?.name}
                    </span>
                  </div>
                  <ThumbsUp className="h-4 w-4 text-green-400" />
                </motion.div>
              )}

              {/* User Address */}
              <div className="text-sm bg-slate-800/50 px-3 py-1 rounded-lg">
                {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </div>

              {/* Logout Menu */}
              <div className="relative">
                <Button
                  onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      showLogoutMenu ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showLogoutMenu && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 min-w-[200px]"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2 space-y-1">
                        {/* App Logout */}
                        <button
                          onClick={handleAppLogout}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 rounded-md transition-colors"
                        >
                          <UserX className="h-4 w-4 text-orange-400" />
                          <div className="text-left">
                            <div className="font-medium">Déconnexion App</div>
                            <div className="text-xs text-gray-400">
                              Garder MetaMask connecté
                            </div>
                          </div>
                        </button>

                        {/* Full Logout */}
                        <button
                          onClick={handleFullLogout}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-slate-700 rounded-md transition-colors"
                        >
                          <Wallet className="h-4 w-4 text-red-400" />
                          <div className="text-left">
                            <div className="font-medium">
                              Déconnexion Complète
                            </div>
                            <div className="text-xs text-gray-400">
                              Déconnecter MetaMask aussi
                            </div>
                          </div>
                        </button>
                      </div>

                      <div className="border-t border-slate-700 p-2">
                        <div className="text-xs text-gray-500 px-3 py-1">
                          💡 La déconnexion complète peut nécessiter une
                          confirmation dans MetaMask
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Overlay to close menu */}
                {showLogoutMenu && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLogoutMenu(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.section
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
              Pokemon Awards 2024
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            Votez pour vos Pokemon favoris dans différentes catégories
          </p>

          {/* Timer Card */}
          <motion.div
            className="inline-block bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-orange-500/30 rounded-2xl p-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-3">
              <Timer className="h-8 w-8 text-orange-400" />
              <div>
                <p className="text-lg font-semibold text-orange-400">
                  Temps restant
                </p>
                <p className="text-2xl font-bold text-white">
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Category Filter */}
        <motion.section
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-yellow-500 to-red-500 text-white"
                    : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category === "all" ? "Toutes les catégories" : category}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Error Modal */}
        <AnimatePresence>
          {showError && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowError(false)}
            >
              <motion.div
                className="bg-gradient-to-br from-slate-800 to-slate-700 border border-red-500/50 rounded-2xl p-6 max-w-md w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-red-500/20 rounded-full p-3">
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-400 mb-2">
                      Vote déjà effectué
                    </h3>
                    <p className="text-gray-300 mb-4">{errorMessage}</p>

                    {votedPokemonId && (
                      <div className="bg-slate-700/50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-400 mb-1">
                          Votre vote :
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">
                            {
                              pokemon.find((p) => p.id === votedPokemonId)
                                ?.image
                            }
                          </span>
                          <span className="font-medium text-white">
                            {pokemon.find((p) => p.id === votedPokemonId)?.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setShowError(false)}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    onClick={() => setShowError(false)}
                    className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                  >
                    Compris
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pokemon Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPokemon.map((poke, index) => (
              <motion.div
                key={poke.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card
                  className={`h-full bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border ${getRarityBorder(
                    poke.rarity
                  )} overflow-hidden relative`}
                >
                  {/* Rarity Badge */}
                  <div
                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(
                      poke.rarity
                    )} text-white z-10`}
                  >
                    {poke.rarity.toUpperCase()}
                  </div>

                  {/* Voted Badge */}
                  {poke.hasVoted && (
                    <motion.div
                      className="absolute top-3 left-3 bg-green-500 rounded-full p-1 z-10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.6 }}
                    >
                      <ThumbsUp className="h-4 w-4 text-white" />
                    </motion.div>
                  )}

                  <CardHeader className="text-center pb-2">
                    {/* Pokemon Image/Emoji */}
                    <motion.div
                      className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                    >
                      {poke.image}
                    </motion.div>

                    <CardTitle className="text-xl font-bold text-gray-100">
                      {poke.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-400">
                      Type: {poke.type}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Category */}
                    <div className="text-center">
                      <p className="text-sm font-medium text-yellow-400">
                        {poke.category}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-300 text-center">
                      {poke.description}
                    </p>

                    {/* Votes Display */}
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span className="text-lg font-bold">
                        {poke.votes.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400">votes</span>
                    </div>

                    {/* Vote Button */}
                    <motion.div
                      whileHover={{
                        scale: hasUserVoted && !poke.hasVoted ? 1 : 1.05,
                      }}
                      whileTap={{
                        scale: hasUserVoted && !poke.hasVoted ? 1 : 0.95,
                      }}
                    >
                      <Button
                        onClick={() => handleVote(poke.id)}
                        disabled={hasUserVoted && !poke.hasVoted}
                        className={`w-full ${
                          poke.hasVoted
                            ? "bg-green-600 hover:bg-green-600 cursor-not-allowed"
                            : hasUserVoted && !poke.hasVoted
                            ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed opacity-50"
                            : "bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600"
                        } text-white`}
                      >
                        {poke.hasVoted ? (
                          <>
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            Voté !
                          </>
                        ) : hasUserVoted ? (
                          <>
                            <X className="mr-2 h-4 w-4" />
                            Déjà voté
                          </>
                        ) : (
                          <>
                            <Heart className="mr-2 h-4 w-4" />
                            Voter
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </CardContent>

                  {/* Card Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${getRarityColor(
                      poke.rarity
                    )} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`}
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Footer */}
        <motion.section
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Total Votes */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-6"
              whileHover={{ scale: 1.05 }}
            >
              <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-blue-400">
                {totalVotes.toLocaleString()}
              </h3>
              <p className="text-gray-300">Total des votes</p>
            </motion.div>

            {/* Your Votes */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-green-500/30 rounded-2xl p-6"
              whileHover={{ scale: 1.05 }}
            >
              <Award className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-green-400">{userVotes}</h3>
              <p className="text-gray-300">Vos votes</p>
            </motion.div>

            {/* Pokemon Count */}
            <motion.div
              className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-purple-400">
                {pokemon.length}
              </h3>
              <p className="text-gray-300">Pokemon en compétition</p>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
