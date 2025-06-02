# Sample Hardhat Project



# lancer le projet en local


## dans un premier terminal pour lancer la blockchain locale

```
 npx hardhat node 
 
```


## dans un second terminal pour déployer le contrat
```
npx hardhat run scripts/deploy.ts --network localhost

```

##  puis exécuter la transaction , antoine achète le coffre à deployer
```
npx hardhat run scripts/transactions.ts --network localhost
```


## fonctionnement de l'achat du coffre
1. ÉTAT INITIAL
coffre = 0,05 ETH — c’est le dépôt du déployeur au moment du déploiement.

2. APRÈS DÉPÔT (coffre plein)
coffre = 0,06 ETH — Antoine vient d’y ajouter 0,01 ETH
Antoine passe de 10000 → 9999,99 ETH (– 0,01 ETH)
Déployeur reste inchangé.

3. APRÈS RETRAIT
coffre = 0 ETH — le déployeur retire tout.
Déployeur grimpe de ≈ +0,06 ETH (0,06 ETH reçus – gas).
Antoine ne bouge plus (il a déjà payé).



# frontend , ajouter de l'ether au coffre avec MetaMask

## lancer le frontend
```
cd frontend
```

```
npm run dev
```