# Sample Hardhat Project

# Lancer le projet en local

## Étape 1 : Installation et lancement de la blockchain locale

### Dans un premier terminal, installer les dépendances et lancer la blockchain

```bash
cd backend
npm install
npx hardhat node 
```

**Important :** Récupérez l'URL du serveur qui s'affiche dans le terminal :
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
```

### Configuration MetaMask

1. Ouvrir MetaMask
2. Aller dans **Paramètres** > **Réseaux** > **Ajouter un réseau personnalisé**
3. Remplir les informations :
   - **Nom du réseau** : Hardhat Local (ou le nom de votre choix)
   - **URL RPC** : `http://127.0.0.1:8545` (l'URL récupérée à l'étape précédente)
   - **ID de chaîne** : `31337`
   - **Symbole de devise** : `ETH`
4. Cliquer sur **Enregistrer**

### Ajouter un compte avec des ETH

1. Dans MetaMask, cliquer sur **Importer un compte**
2. Utiliser une des clés privées fournies par Hardhat (exemple) :
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
3. Ce compte aura automatiquement 10000 ETH disponibles

**Comptes disponibles (exemple) :**
```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## Étape 2 : Déploiement du contrat

### Dans un second terminal, déployer le contrat du token

```bash
cd backend
npx hardhat run scripts/deploy.ts --network localhost
```

## Étape 3 : Exécuter les transactions

### Puis exécuter la transaction (Antoine achète le token qui a été déployé)

```bash
npx hardhat run scripts/transactions.ts --network localhost
```

## Fonctionnement de l'achat du token avec l'ETH qui transite par le coffre

1. **ÉTAT INITIAL**
   - coffre = 0,05 ETH — c'est le dépôt du déployeur au moment du déploiement.

2. **APRÈS DÉPÔT (coffre plein)**
   - coffre = 0,06 ETH — Antoine vient d'y ajouter 0,01 ETH
   - Antoine passe de 10000 → 9999,99 ETH (– 0,01 ETH)
   - Déployeur reste inchangé.

3. **APRÈS RETRAIT**
   - coffre = 0 ETH — le déployeur retire tout.
   - Déployeur grimpe de ≈ +0,06 ETH (0,06 ETH reçus – gas).
   - Antoine ne bouge plus (il a déjà payé).

# Frontend - Ajouter de l'ether au coffre avec MetaMask

## Lancer le frontend

```bash
cd frontend
npm run dev
```
