import { useEffect, useState } from 'react';
import { useProvider } from '../providers/ProviderContext';
import { useVoting } from '../hooks/useVoting';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'framer-motion';
import {
  Vote,
  Check,
  Lock,
  Loader2,
  ClipboardList,
  UserPlus,
  AlertTriangle,
  ChevronRight,
  HelpCircle,
  BarChart3,
  PieChart,
  PartyPopper,
} from 'lucide-react';

const MotionCard = motion(Card);
const MotionButton = motion(Button);

// Interface pour les scrutins/ballots
interface Ballot {
  id: number;
  title: string;
  options: string[];
  open: boolean;
  registered: boolean;
  hasVoted: boolean;
  total: number;
}

export default function Voting() {
  const { provider, account, chainId, connect } = useProvider();
  const { ballots, loadBallots, register, vote } = useVoting(provider, account, chainId);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('en-cours');
  const [activeAction, setActiveAction] = useState<{
    type: string;
    id: number;
    option?: number;
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<{ id: number; option: number } | null>(null);

  useEffect(() => {
    if (provider && account) {
      setLoading(true);
      loadBallots().finally(() => setLoading(false));
    }
  }, [loadBallots, provider, account]);

  const handleRegister = async (id: number) => {
    setActiveAction({ type: 'register', id });
    try {
      await register(id);
    } finally {
      setActiveAction(null);
    }
  };

  const handleVote = async (id: number, option: number) => {
    setActiveAction({ type: 'vote', id, option });
    try {
      await vote(id, option);
      // Célébration après le vote
      if (document) {
        showConfetti();
      }
    } finally {
      setActiveAction(null);
      setSelectedOption(null);
    }
  };

  const showConfetti = () => {
    // Animation de confetti simple
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);

    // Créer 50 confettis
    for (let i = 0; i < 50; i++) {
      createConfetti(confettiContainer);
    }

    // Nettoyer après l'animation
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 3000);
  };

  const createConfetti = (container: HTMLDivElement) => {
    const colors = ['#ff718d', '#fdbb2d', '#22c55e', '#0ea5e9', '#a855f7'];
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = `${Math.random() * 10 + 5}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.top = '-10px';
    confetti.style.left = `${Math.random() * 100}vw`;

    container.appendChild(confetti);

    // Animation pour faire tomber le confetti
    const animation = confetti.animate(
      [
        { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
        {
          transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: Math.random() * 1000 + 2000,
        easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)',
      },
    );

    animation.onfinish = () => container.removeChild(confetti);
  };

  const filterBallots = (status: string) => {
    if (status === 'en-cours') {
      return ballots.filter(ballot => ballot.open);
    } else if (status === 'terminés') {
      return ballots.filter(ballot => !ballot.open);
    }
    return ballots;
  };

  const selectOption = (id: number, option: number) => {
    if (selectedOption?.id === id && selectedOption?.option === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption({ id, option });
    }
  };

  if (!provider) {
    return (
      <div className="fade-in">
        <h1 className="section-title">Scrutins en cours</h1>
        <p className="mb-6 text-muted-foreground">
          Participez aux votes de la communauté et faites entendre votre voix.
        </p>

        <MotionCard
          className="mx-auto max-w-md border-2 border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              >
                <Vote className="h-5 w-5 text-primary" />
              </motion.div>
              Connectez votre wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div
                className="rounded-full bg-primary/10 p-5"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <Vote className="h-12 w-12 text-primary" />
              </motion.div>
              <div>
                <p className="mb-2 text-lg font-medium">Participez aux scrutins</p>
                <p className="text-sm text-muted-foreground">
                  Connectez votre portefeuille MetaMask pour participer aux scrutins et voter.
                </p>
              </div>
              <MotionButton
                onClick={connect}
                className="mt-4 w-full"
                size="lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Vote className="mr-2 h-4 w-4" />
                Connecter MetaMask
              </MotionButton>
            </div>
          </CardContent>
        </MotionCard>
      </div>
    );
  }

  const filteredBallots = filterBallots(activeTab);

  return (
    <div className="fade-in">
      <div className="mb-6">
        <motion.h1
          className="section-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PieChart className="inline-block mr-2 h-7 w-7 text-primary" />
          Scrutins de gouvernance
        </motion.h1>
        <motion.p
          className="text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Participez aux votes de la communauté et faites entendre votre voix sur la blockchain.
        </motion.p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </div>
        </div>
      ) : ballots.length === 0 ? (
        <MotionCard
          className="border-2 border-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Aucun scrutin disponible
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center py-8">
            <div className="bg-muted rounded-full p-5 mb-4">
              <AlertTriangle className="h-10 w-10 text-muted-foreground/70" />
            </div>
            <h3 className="text-lg font-medium mb-2">Pas de scrutins actifs</h3>
            <p className="text-muted-foreground max-w-md">
              Il n'y a actuellement aucun scrutin actif ou programmé. Revenez plus tard pour
              participer aux prochains votes.
            </p>
          </CardContent>
        </MotionCard>
      ) : (
        <>
          <Tabs
            defaultValue="en-cours"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="en-cours" className="flex items-center gap-1">
                  <Vote className="h-4 w-4" />
                  <span>En cours</span>
                  {ballots.filter(b => b.open).length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {ballots.filter(b => b.open).length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="terminés" className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  <span>Terminés</span>
                </TabsTrigger>
                <TabsTrigger value="tous" className="flex items-center gap-1">
                  <ClipboardList className="h-4 w-4" />
                  <span>Tous</span>
                </TabsTrigger>
              </TabsList>

              <Button
                variant="outline"
                size="sm"
                className="text-xs hidden md:flex"
                onClick={() => {
                  setLoading(true);
                  loadBallots().finally(() => setLoading(false));
                }}
              >
                <RefreshIcon className="mr-1 h-3 w-3" /> Actualiser
              </Button>
            </div>

            <TabsContent value="en-cours" className="mt-0">
              {filteredBallots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="bg-muted/50 rounded-full p-4 mb-3">
                    <HelpCircle className="h-8 w-8 text-muted-foreground/70" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Aucun scrutin en cours</h3>
                  <p className="text-muted-foreground max-w-md">
                    Il n'y a pas de scrutins en cours actuellement. Consultez les scrutins terminés
                    pour voir les résultats précédents.
                  </p>
                </div>
              ) : (
                <div className="grid-container grid-container-lg">
                  {renderBallotCards(filteredBallots)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="terminés" className="mt-0">
              {filteredBallots.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="bg-muted/50 rounded-full p-4 mb-3">
                    <BarChart3 className="h-8 w-8 text-muted-foreground/70" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Aucun scrutin terminé</h3>
                  <p className="text-muted-foreground max-w-md">
                    Les scrutins terminés apparaîtront ici. Vous pourrez consulter l'historique des
                    votes.
                  </p>
                </div>
              ) : (
                <div className="grid-container grid-container-lg">
                  {renderBallotCards(filteredBallots)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="tous" className="mt-0">
              <div className="grid-container grid-container-lg">
                {renderBallotCards(filteredBallots)}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );

  function renderBallotCards(ballots: Ballot[]) {
    return ballots.map((ballot, index) => (
      <MotionCard
        key={ballot.id}
        className={`overflow-hidden border-2 ${
          selectedOption?.id === ballot.id
            ? 'border-primary/40 shadow-lg'
            : 'border-primary/5 hover:border-primary/20'
        } transition-all`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
      >
        <CardHeader className={`${ballot.open ? 'bg-primary/5' : 'bg-muted/50'} pb-3`}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Vote
                className={`h-5 w-5 ${ballot.open ? 'text-primary' : 'text-muted-foreground'}`}
              />
              <span className="truncate">{ballot.title}</span>
            </CardTitle>
            <Badge
              variant={ballot.open ? 'default' : 'secondary'}
              className={`${ballot.open ? 'bg-primary/20 text-primary hover:bg-primary/30' : ''}`}
            >
              {ballot.open ? 'En cours' : 'Terminé'}
            </Badge>
          </div>
          <div className="mt-1 text-xs text-muted-foreground flex items-center">
            <span>Scrutin #{ballot.id}</span>
            {ballot.total > 0 && (
              <span className="ml-2 flex items-center">
                • <UserPlus className="ml-1 mr-1 h-3 w-3" /> {ballot.total} participants
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {!ballot.registered && ballot.open && (
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <MotionButton
                onClick={() => handleRegister(ballot.id)}
                disabled={!!activeAction}
                variant="outline"
                className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeAction?.type === 'register' && activeAction.id === ballot.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    S'inscrire au scrutin
                  </>
                )}
              </MotionButton>
            </motion.div>
          )}

          <div className="space-y-3">
            {ballot.options.map((option: string, i: number) => (
              <motion.div
                key={i}
                className={`flex items-center justify-between rounded-md border p-3 ${
                  selectedOption?.id === ballot.id && selectedOption?.option === i
                    ? 'border-primary bg-primary/5'
                    : ballot.hasVoted
                      ? 'bg-muted/30'
                      : 'hover:border-primary/30 hover:bg-muted/10'
                }`}
                whileHover={
                  !ballot.hasVoted && ballot.registered && ballot.open && !activeAction
                    ? { scale: 1.02 }
                    : {}
                }
                whileTap={
                  !ballot.hasVoted && ballot.registered && ballot.open && !activeAction
                    ? { scale: 0.98 }
                    : {}
                }
                onClick={() => {
                  if (!ballot.hasVoted && ballot.registered && ballot.open && !activeAction) {
                    selectOption(ballot.id, i);
                  }
                }}
                style={{
                  cursor:
                    !ballot.hasVoted && ballot.registered && ballot.open && !activeAction
                      ? 'pointer'
                      : 'default',
                }}
              >
                <div className="flex items-center gap-2">
                  {selectedOption?.id === ballot.id && selectedOption?.option === i && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <span
                    className={`font-medium ${selectedOption?.id === ballot.id && selectedOption?.option === i ? 'text-primary' : ''}`}
                  >
                    {option}
                  </span>
                </div>
                {!ballot.hasVoted && ballot.registered && ballot.open && (
                  <MotionButton
                    size="sm"
                    disabled={
                      !ballot.open ||
                      !ballot.registered ||
                      ballot.hasVoted ||
                      !!activeAction ||
                      !selectedOption ||
                      selectedOption.id !== ballot.id ||
                      selectedOption.option !== i
                    }
                    variant={
                      selectedOption?.id === ballot.id && selectedOption?.option === i
                        ? 'default'
                        : 'ghost'
                    }
                    onClick={e => {
                      e.stopPropagation();
                      if (selectedOption) {
                        handleVote(ballot.id, i);
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={
                      selectedOption?.id === ballot.id && selectedOption?.option === i
                        ? ''
                        : 'opacity-0 group-hover:opacity-100'
                    }
                  >
                    {activeAction?.type === 'vote' &&
                    activeAction.id === ballot.id &&
                    activeAction.option === i ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Vote...
                      </>
                    ) : (
                      <>
                        <ChevronRight className="mr-1 h-3 w-3" />
                        Voter
                      </>
                    )}
                  </MotionButton>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex-col items-start border-t p-4 bg-muted/20">
          {ballot.hasVoted && (
            <div className="mb-2 flex w-full items-center text-green-500">
              <PartyPopper className="mr-2 h-4 w-4" />
              <span className="text-sm font-medium">Vote enregistré avec succès !</span>
            </div>
          )}
          {!ballot.open && (
            <div className="mb-2 flex w-full items-center text-muted-foreground">
              <Lock className="mr-2 h-4 w-4" />
              <span className="text-sm">Scrutin clôturé ({ballot.total} votes)</span>
            </div>
          )}
          {ballot.registered && !ballot.hasVoted && ballot.open && (
            <div className="flex w-full items-center text-muted-foreground">
              {selectedOption?.id === ballot.id ? (
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm">Option sélectionnée</span>
                  <MotionButton
                    size="sm"
                    variant="default"
                    onClick={() => {
                      if (selectedOption) {
                        handleVote(ballot.id, selectedOption.option);
                      }
                    }}
                    disabled={!!activeAction}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {activeAction?.type === 'vote' && activeAction.id === ballot.id ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Vote en cours...
                      </>
                    ) : (
                      <>
                        <Vote className="mr-2 h-3 w-3" />
                        Confirmer mon vote
                      </>
                    )}
                  </MotionButton>
                </div>
              ) : (
                <>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span className="text-sm">Sélectionnez une option pour voter</span>
                </>
              )}
            </div>
          )}
        </CardFooter>
      </MotionCard>
    ));
  }
}

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
    <path d="M16 21h5v-5"></path>
  </svg>
);
