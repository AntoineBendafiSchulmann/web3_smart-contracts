import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'framer-motion';
import VotingArtifact from '../abis/Voting.json';
import { CHAINS } from '../constants';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import {
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Trophy,
  PieChart,
  Award,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Users,
  TrendingUp,
  Filter,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';

const MotionCard = motion(Card);
const MotionButton = motion(Button);

const votingAddress = import.meta.env.VITE_VOTING_ADDRESS as string;
const votingAbi = (VotingArtifact as { abi: any }).abi;

type Score = { label: string; count: number };
type Ballot = {
  id: number;
  scores: Score[];
  tie: boolean;
  title?: string;
  totalVotes?: number;
  winningOption?: string;
  winningCount?: number;
};

export default function Results() {
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [filteredBallots, setFilteredBallots] = useState<Ballot[]>([]);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [resetStatus, setResetStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [hoveredBallot, setHoveredBallot] = useState<number | null>(null);
  const [expandedResults, setExpandedResults] = useState<number[]>([]);

  const loadResults = async () => {
    try {
      setIsLoading(true);
      const prov = new ethers.BrowserProvider((window as any).ethereum);
      const chain = Number(await prov.send('eth_chainId', []));
      if (chain !== CHAINS.SEPOLIA.id) return;

      const voting = new ethers.Contract(votingAddress, votingAbi, prov);
      const nextId = Number(await voting.nextBallotId());
      const arr: Ballot[] = [];

      for (let id = 0; id < nextId; id++) {
        const options: string[] = await voting.getOptions(id);

        // Essayer de récupérer le titre
        let title = `Scrutin #${id}`;
        try {
          title = await voting.getTitle(id);
        } catch {
          // Fallback si la fonction getTitle n'existe pas
        }

        const scores = await Promise.all(
          options.map(async (_, i) => ({
            label: options[i],
            count: Number(await voting.tally(id, i)),
          })),
        );

        const best = Math.max(...scores.map(s => s.count));
        const tie = best > 0 && scores.filter(s => s.count === best).length > 1;
        const totalVotes = scores.reduce((sum, s) => sum + s.count, 0);

        // Déterminer l'option gagnante
        let winningOption = '';
        let winningCount = 0;

        if (!tie && best > 0) {
          const winner = scores.find(s => s.count === best);
          if (winner) {
            winningOption = winner.label;
            winningCount = winner.count;
          }
        }

        arr.push({
          id,
          scores,
          tie,
          title,
          totalVotes,
          winningOption,
          winningCount,
        });
      }

      setBallots(arr);
      applyFilters(arr, activeFilter, searchTerm, sortOption);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (ballotsList: Ballot[], filter: string, search: string, sort: string) => {
    // Filtrer par statut
    let filtered = [...ballotsList];
    if (filter === 'egalite') {
      filtered = filtered.filter(ballot => ballot.tie);
    } else if (filter === 'termine') {
      filtered = filtered.filter(ballot => !ballot.tie);
    }

    // Appliquer la recherche
    if (search.trim() !== '') {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(ballot => {
        return (
          ballot.title?.toLowerCase().includes(searchLower) ||
          String(ballot.id).includes(searchLower) ||
          ballot.scores.some(score => score.label.toLowerCase().includes(searchLower))
        );
      });
    }

    // Trier les résultats
    if (sort === 'recent') {
      filtered.sort((a, b) => b.id - a.id);
    } else if (sort === 'ancien') {
      filtered.sort((a, b) => a.id - b.id);
    } else if (sort === 'participation') {
      filtered.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0));
    }

    setFilteredBallots(filtered);
  };

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    applyFilters(ballots, activeFilter, searchTerm, sortOption);
  }, [activeFilter, searchTerm, sortOption]);

  const resetVote = async (id: number) => {
    try {
      setResettingId(id);
      setResetStatus('Réinitialisation…');
      const prov = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await prov.getSigner();
      await new ethers.Contract(votingAddress, votingAbi, signer).resetIfTie(id);
      setResetStatus('Vote réinitialisé ✓');
      await loadResults();
    } catch (e: any) {
      setResetStatus(`Erreur : ${e?.reason ?? e?.message ?? 'inconnue'}`);
    } finally {
      setResettingId(null);
    }
  };

  // Calcule le pourcentage d'un score par rapport au total
  const calculatePercentage = (score: number, scores: Score[]) => {
    const total = scores.reduce((sum, s) => sum + s.count, 0);
    return total > 0 ? (score / total) * 100 : 0;
  };

  const toggleExpandResults = (id: number) => {
    if (expandedResults.includes(id)) {
      setExpandedResults(expandedResults.filter(item => item !== id));
    } else {
      setExpandedResults([...expandedResults, id]);
    }
  };

  const getBestOptions = (scores: Score[]) => {
    if (scores.length === 0) return [];

    const maxVotes = Math.max(...scores.map(s => s.count));
    return scores
      .filter(score => score.count === maxVotes && maxVotes > 0)
      .map(score => score.label);
  };

  const getResultEmoji = (ballot: Ballot) => {
    if (ballot.tie) return '🤝';
    if (ballot.totalVotes === 0) return '🔄';
    return '🏆';
  };

  const getProgressColor = (ballot: Ballot, score: Score) => {
    if (
      ballot.tie &&
      ballot.scores.find(s => s.count === Math.max(...ballot.scores.map(x => x.count)))?.label ===
        score.label
    ) {
      return 'bg-yellow-500';
    }
    if (!ballot.tie && ballot.winningOption === score.label) {
      return 'bg-green-500';
    }
    return '';
  };

  return (
    <div className="fade-in">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-block rounded-full bg-primary/10 p-3 mb-4"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <PieChart className="h-10 w-10 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-bold mb-2">Résultats des Scrutins</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Consultez les résultats de tous les votes qui ont eu lieu sur la blockchain. Explorez les
          tendances et découvrez les décisions prises par la communauté.
        </p>
      </motion.div>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="w-full md:w-auto">
            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="tous" className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>Tous</span>
                  <Badge variant="secondary" className="ml-1">
                    {ballots.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="termine" className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Terminés</span>
                  <Badge variant="secondary" className="ml-1">
                    {ballots.filter(b => !b.tie).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="egalite" className="flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Égalités</span>
                  {ballots.filter(b => b.tie).length > 0 && (
                    <Badge variant="destructive" className="ml-1">
                      {ballots.filter(b => b.tie).length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un scrutin..."
                className="pl-8 h-10 w-full md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <SelectValue placeholder="Trier par" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récents</SelectItem>
                <SelectItem value="ancien">Plus anciens</SelectItem>
                <SelectItem value="participation">Participation</SelectItem>
              </SelectContent>
            </Select>

            <MotionButton
              variant="outline"
              size="sm"
              onClick={loadResults}
              disabled={isLoading}
              className="h-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </MotionButton>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <Skeleton className="h-[250px] w-full rounded-xl" />
            </div>
          </div>
        ) : filteredBallots.length === 0 ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-center py-16"
            >
              <div className="mx-auto w-fit rounded-full bg-muted p-6 mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchTerm
                  ? "Aucun scrutin ne correspond à votre recherche. Essayez avec d'autres termes."
                  : activeFilter === 'egalite'
                    ? "Aucun scrutin avec une égalité n'a été trouvé."
                    : "Aucun résultat n'est disponible pour le moment."}
              </p>
              {(searchTerm || activeFilter !== 'tous') && (
                <MotionButton
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveFilter('tous');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Réinitialiser les filtres
                </MotionButton>
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="grid-container grid-container-lg">
            <AnimatePresence>
              {filteredBallots.map((ballot, index) => (
                <MotionCard
                  key={ballot.id}
                  className={`overflow-hidden border-2 ${
                    ballot.tie
                      ? 'border-yellow-500/20 hover:border-yellow-500/40'
                      : ballot.totalVotes === 0
                        ? 'border-muted hover:border-muted-foreground/20'
                        : 'border-primary/5 hover:border-primary/20'
                  } transition-all`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 30px -15px rgba(0,0,0,0.2)' }}
                  onHoverStart={() => setHoveredBallot(ballot.id)}
                  onHoverEnd={() => setHoveredBallot(null)}
                >
                  <CardHeader
                    className={`${
                      ballot.tie
                        ? 'bg-yellow-500/10'
                        : ballot.totalVotes === 0
                          ? 'bg-muted/50'
                          : 'bg-primary/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant={
                          ballot.tie
                            ? 'destructive'
                            : ballot.totalVotes === 0
                              ? 'outline'
                              : 'secondary'
                        }
                        className="px-2 py-0"
                      >
                        {ballot.tie
                          ? 'Égalité'
                          : ballot.totalVotes === 0
                            ? 'Aucun vote'
                            : 'Terminé'}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {ballot.totalVotes} votes
                        </Badge>
                        <span className="text-2xl" aria-hidden="true">
                          {getResultEmoji(ballot)}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="flex items-center">
                      <div className="mr-2 bg-background rounded-full p-1">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="truncate">{ballot.title || `Scrutin #${ballot.id}`}</div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent
                    className={`pt-4 ${expandedResults.includes(ballot.id) ? '' : 'pb-0'}`}
                  >
                    {!expandedResults.includes(ballot.id) && ballot.totalVotes! > 0 && (
                      <motion.div
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium text-sm text-muted-foreground">Résultat</h3>
                            {ballot.tie ? (
                              <div className="font-medium">
                                Égalité entre{' '}
                                <span className="text-yellow-500">
                                  {getBestOptions(ballot.scores).join(', ')}
                                </span>
                              </div>
                            ) : (
                              <div className="font-medium">
                                <span className="text-green-500">{ballot.winningOption}</span>{' '}
                                remporte le scrutin
                              </div>
                            )}
                          </div>
                          <motion.div
                            className={`flex items-center gap-1 text-xs ${
                              ballot.tie ? 'text-yellow-500' : 'text-green-500'
                            }`}
                            animate={hoveredBallot === ballot.id ? { scale: [1, 1.1, 1] } : {}}
                            transition={{
                              repeat: hoveredBallot === ballot.id ? Infinity : 0,
                              duration: 1,
                            }}
                          >
                            {ballot.tie ? (
                              <>
                                <AlertTriangle className="h-4 w-4" />
                                <span>
                                  Égalité avec {Math.max(...ballot.scores.map(s => s.count))} voix
                                </span>
                              </>
                            ) : (
                              <>
                                <Trophy className="h-4 w-4" />
                                <span>Gagnant avec {ballot.winningCount} voix</span>
                              </>
                            )}
                          </motion.div>
                        </div>

                        <MotionButton
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs mt-2 bg-muted/30"
                          onClick={() => toggleExpandResults(ballot.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <BarChart3 className="mr-1 h-3 w-3" />
                          Voir le détail des résultats
                        </MotionButton>
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {(expandedResults.includes(ballot.id) || ballot.totalVotes === 0) && (
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {ballot.scores.map((score, idx) => (
                            <motion.div
                              key={score.label}
                              className="space-y-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {!ballot.tie && ballot.winningOption === score.label && (
                                    <motion.div
                                      className="mr-2 text-green-500"
                                      animate={{ rotate: [0, 10, 0] }}
                                      transition={{
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                        duration: 0.5,
                                      }}
                                    >
                                      <Award className="h-4 w-4" />
                                    </motion.div>
                                  )}
                                  <span
                                    className={`font-medium ${
                                      !ballot.tie && ballot.winningOption === score.label
                                        ? 'text-green-500'
                                        : ballot.tie &&
                                            score.count ===
                                              Math.max(...ballot.scores.map(s => s.count)) &&
                                            score.count > 0
                                          ? 'text-yellow-500'
                                          : ''
                                    }`}
                                  >
                                    {score.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      !ballot.tie && ballot.winningOption === score.label
                                        ? 'border-green-500 text-green-500'
                                        : ballot.tie &&
                                            score.count ===
                                              Math.max(...ballot.scores.map(s => s.count)) &&
                                            score.count > 0
                                          ? 'border-yellow-500 text-yellow-500'
                                          : ''
                                    }
                                  >
                                    {score.count}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {calculatePercentage(score.count, ballot.scores).toFixed(1)}%
                                  </Badge>
                                </div>
                              </div>
                              <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/10">
                                <motion.div
                                  className={`h-full ${getProgressColor(ballot, score)}`}
                                  style={{
                                    width: `${calculatePercentage(score.count, ballot.scores)}%`,
                                  }}
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${calculatePercentage(score.count, ballot.scores)}%`,
                                  }}
                                  transition={{ duration: 0.8, ease: 'easeOut' }}
                                />
                              </div>
                            </motion.div>
                          ))}

                          {expandedResults.includes(ballot.id) && ballot.totalVotes! > 0 && (
                            <MotionButton
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs mt-2"
                              onClick={() => toggleExpandResults(ballot.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              Masquer le détail
                            </MotionButton>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>

                  {ballot.tie && (
                    <CardFooter className="flex flex-col items-start border-t bg-yellow-500/5 p-4">
                      {resettingId === ballot.id && resetStatus && (
                        <Alert className="mb-4 w-full">
                          <AlertTitle>
                            {resetStatus.includes('Erreur') ? 'Erreur' : 'Statut'}
                          </AlertTitle>
                          <AlertDescription>{resetStatus}</AlertDescription>
                        </Alert>
                      )}
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center text-yellow-500">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          <span className="text-sm font-medium">Égalité détectée</span>
                        </div>
                        <MotionButton
                          onClick={() => resetVote(ballot.id)}
                          disabled={resettingId !== null}
                          variant="destructive"
                          size="sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {resettingId === ballot.id ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Réinitialisation...
                            </>
                          ) : (
                            'Réinitialiser le vote'
                          )}
                        </MotionButton>
                      </div>
                    </CardFooter>
                  )}
                </MotionCard>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

// Icône de graphique à barres personnalisée
const ChartBarIcon = ({ className }: { className?: string }) => (
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
    <rect x="3" y="12" width="4" height="8" rx="1" />
    <rect x="10" y="8" width="4" height="12" rx="1" />
    <rect x="17" y="4" width="4" height="16" rx="1" />
  </svg>
);
