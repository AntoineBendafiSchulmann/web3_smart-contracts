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
  Wallet,
  Shield,
  Zap,
  Star,
  Trophy,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface LoginPageProps {
  onLogin: (address: string) => void;
  onBack: () => void;
}

// Composant pour Pokeball animée
const AnimatedPokeball = ({ size = 60 }: { size?: number }) => {
  return (
    <motion.div
      className="relative rounded-full border-4 border-gray-700"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(180deg, #ef4444 50%, #f3f4f6 50%)`,
      }}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.1, 1],
        boxShadow: [
          "0 0 0 0 rgba(239, 68, 68, 0.7)",
          "0 0 0 10px rgba(239, 68, 68, 0)",
          "0 0 0 0 rgba(239, 68, 68, 0)",
        ],
      }}
      transition={{
        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
        scale: { duration: 2, repeat: Infinity },
        boxShadow: { duration: 2, repeat: Infinity },
      }}
    >
      {/* Centre de la Pokeball */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
      </div>
      {/* Ligne médiane */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 transform -translate-y-1/2"></div>
    </motion.div>
  );
};

// Composant pour les étoiles Pokemon
const PokemonStarsBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3],
            scale: [0.5, 1, 0.5],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        >
          <Star className="w-4 h-4 text-yellow-400/60" />
        </motion.div>
      ))}
    </div>
  );
};

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  // Vérifier si MetaMask est déjà connecté
  useEffect(() => {
    checkConnection();
    
    // Écouter les changements de compte
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      const ethereum = window.ethereum as any;
      ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        if (window.ethereum) {
          const ethereum = window.ethereum as any;
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la connexion:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask n\'est pas installé ! Veuillez l\'installer pour continuer.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Demander la connexion à MetaMask
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length > 0) {
        const address = accounts[0];
        setAccount(address);
        
        // Petit délai pour l'animation
        setTimeout(() => {
          onLogin(address);
        }, 1500);
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError(error.message || 'Erreur lors de la connexion à MetaMask');
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnecting(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <PokemonStarsBackground />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Pokemon colored glows */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          
          {/* Back Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="outline"
              onClick={onBack}
              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            >
              ← Retour à l'accueil
            </Button>
          </motion.div>

          {/* Main Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-yellow-500/30 overflow-hidden">
              <CardHeader className="text-center pb-2">
                
                {/* Logo Pokemon */}
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
                >
                  <div className="relative">
                    <AnimatedPokeball size={80} />
                    
                    {/* Sparkles autour */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute"
                        style={{
                          left: `${50 + 60 * Math.cos((i * 60) * Math.PI / 180)}px`,
                          top: `${50 + 60 * Math.sin((i * 60) * Math.PI / 180)}px`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <CardTitle className="text-3xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                      PokéAwards
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-lg">
                    Connectez votre Wallet pour commencer l'aventure
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-6">
                
                {/* Connection Status */}
                <AnimatePresence mode="wait">
                  {account ? (
                    <motion.div
                      key="connected"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-green-500/20 border border-green-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                        <div>
                          <p className="text-green-400 font-semibold">Wallet Connecté !</p>
                          <p className="text-sm text-gray-300">
                            {account.slice(0, 6)}...{account.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-red-500/20 border border-red-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-400 font-semibold mb-1">Erreur de Connexion</p>
                          <p className="text-sm text-gray-300">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Benefits */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Avantages du Wallet :</h3>
                  
                  {[
                    { icon: Trophy, text: "Collectionnez des badges NFT uniques", color: "text-yellow-400" },
                    { icon: Zap, text: "Participez aux tournois Pokemon", color: "text-red-400" },
                    { icon: Shield, text: "Sécurité blockchain garantie", color: "text-blue-400" },
                    { icon: Star, text: "Gagnez des récompenses quotidiennes", color: "text-green-400" },
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(51, 65, 85, 0.5)" }}
                    >
                      <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
                      <span className="text-gray-300">{benefit.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Connect Button */}
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  {account ? (
                    <div className="space-y-3">
                      <Button
                        onClick={() => onLogin(account)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3"
                        size="lg"
                      >
                        <Trophy className="mr-2 h-5 w-5" />
                        Accéder aux Awards
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      
                      <Button
                        onClick={disconnectWallet}
                        variant="outline"
                        className="w-full border-gray-600 text-gray-400 hover:bg-gray-700"
                      >
                        Déconnecter
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={connectWallet}
                      disabled={isConnecting}
                      className="w-full bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white py-3"
                      size="lg"
                    >
                      {isConnecting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <AnimatedPokeball size={20} />
                          </motion.div>
                          Connexion en cours...
                        </>
                      ) : (
                        <>
                          <Wallet className="mr-2 h-5 w-5" />
                          Connecter MetaMask
                          <Sparkles className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  )}
                </motion.div>

                {/* MetaMask Info */}
                {typeof window.ethereum === 'undefined' && (
                  <motion.div
                    className="text-center pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6 }}
                  >
                    <p className="text-sm text-gray-400 mb-2">
                      Vous n'avez pas MetaMask ?
                    </p>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:text-yellow-300 underline"
                    >
                      Télécharger MetaMask
                    </a>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            <p className="text-gray-400 text-sm mb-3">
              🔒 Connexion sécurisée • 🎮 100% décentralisé • ⚡ Instant
            </p>
            <div className="bg-slate-800/30 border border-blue-500/20 rounded-lg p-3 text-xs text-gray-400">
              <p className="mb-1">💡 <span className="text-blue-400">Astuce :</span> Une fois connecté, vous aurez deux options de déconnexion :</p>
              <p>• <span className="text-orange-400">Déconnexion App</span> : Garde MetaMask connecté pour un retour rapide</p>
              <p>• <span className="text-red-400">Déconnexion Complète</span> : Déconnecte aussi MetaMask</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 