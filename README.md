# Oracle Chess Engine

**Note:** This project is a fork of the original `andy-landy/chess-llm-oracle` repository. This file has been adapted to reflect the current project structure and conventions.

## Introduction

Oracle is the first chess engine that plays like a human, from amateur to super GM. She can play like a 2800-rated player in classical or an 800-rated player in blitz, or at any other level, in any time control.

## Features

- **Human-like Play:** Oracle adapts her predictions to any rating level from amateur to super GM.
- **Time Control Flexibility:** Oracle adapts her predictions to 4 different time controls: bullet, blitz, rapid, or classical.
- **Expected Score Evaluations:** Instead of using centipawns, Oracle evaluates positions by giving White's expected score out of 100 games. This expected score takes into account the position, the likeliest next moves, the rating of both players and the time control.
- **Two Modes:**
  - **Oracle_one_move:** Takes a PGN game as input and predicts the likeliest next moves.
  - **Oracle_pgn_file:** Takes a PGN file with multiple games and predicts every move of every game, useful for creating data to test Oracle.

## Usage

- **Oracle_one_move:** Set your Hugging Face token (if required by the model) and the path to your Stockfish at the top of the file then run the file. Past the PGN up to the move you want to predict into the console, type END and press Enter
- **Oracle_pgn_file:** Set your Hugging Face token, the path to your Stockfish, your input pgn file, and your output csv file, and then run the file. Oracle will write her predictions for every move of every game of the PGN into the csv file.
- **Web interface:** Export your Hugging Face token as `HUGGINGFACEHUB_API_TOKEN` (optional, models supporting anonymous access do not require a token) and the Stockfish binary path as `STOCKFISH_PATH`, then launch `uvicorn src.oracle.web.app:app --reload` to access a browser-based PGN form.

## Documentation de l’interface web

### Aperçu

L’application web d’Oracle s’appuie sur FastAPI et Jinja2 : la page d’accueil accessible sur `/` affiche un formulaire de saisie de PGN tandis que l’endpoint `/analyze` exécute l’analyse avant de renvoyer la page de résultats avec les coups probables et les métriques associées. L’interface adopte Bootstrap et un thème inspiré de GitHub pour offrir une expérience utilisateur claire et soignée.

### Modes disponibles

- **Analyse** : mode historique de l’application, il exploite les métadonnées présentes dans votre PGN (Elo, cadence) ou celles fournies dans le formulaire pour ajuster les recommandations.
- **Jouer contre l’ordinateur** : un second onglet « jouer » démarre une partie interactive contre Oracle. Le niveau Elo sélectionné module toujours la force de l’adversaire, mais la cadence est verrouillée à 10 minutes (`600+0`). Le serveur enrichit automatiquement le PGN transmis avec cet en-tête `TimeControl` afin que la détection du type de partie et l’ajustement des évaluations reflètent bien ce format rapide.

### Prérequis

1. **Moteur Stockfish** : installez Stockfish localement et exportez son chemin absolu dans la variable d’environnement `STOCKFISH_PATH`. Sans cette variable, l’interface affiche un message d’erreur détaillé permettant de corriger la configuration.
2. **Modèle Hugging Face** : par défaut, Oracle appelle `mistralai/Mistral-7B-Instruct-v0.2`. Vous pouvez remplacer ce modèle en définissant `HUGGINGFACE_MODEL_ID` et fournir un jeton via `HUGGINGFACEHUB_API_TOKEN` si l’endpoint choisi n’accepte pas les requêtes anonymes. Ajustez éventuellement `HUGGINGFACE_TOP_K` (et `HUGGINGFACE_TOP_N_TOKENS`) pour contrôler le nombre de candidats retournés par l’API d’inférence.
3. **Paramètres par défaut** : sans variables d’environnement, Oracle s’appuie sur la configuration définie par `OracleConfig` (profondeur d’analyse, temps limite, etc.), que vous pouvez adapter dans le code si nécessaire.

### Démarrage du serveur

1. Exportez les variables d’environnement nécessaires :

   ```bash
   export STOCKFISH_PATH=/chemin/vers/stockfish
   export HUGGINGFACEHUB_API_TOKEN=...        # optionnel
   export HUGGINGFACE_MODEL_ID=...            # optionnel
   export HUGGINGFACE_TOP_K=20                # optionnel, nombre de candidats LLM
   ```

2. Lancez le serveur local avec Uvicorn :

   ```bash
   uvicorn src.oracle.web.app:app --reload
   ```

   Le serveur écoute alors (par défaut) sur <http://127.0.0.1:8000/> et recharge automatiquement lors de modifications en mode développement.

### Construire le front-end TypeScript

L’intégration du plateau interactif repose sur un bundle Vite situé dans `src/oracle/web/frontend`. Après toute modification des fichiers TypeScript ou CSS, exécutez les commandes suivantes pour régénérer les ressources servies par FastAPI :

```bash
cd src/oracle/web/frontend
npm install          # première installation ou mise à jour des dépendances
npm run build        # génère src/oracle/web/static/oracle-board.{js,css}
```

La bibliothèque `magicolala/Neo-Chess-Board-Ts-Library` est déclarée dans `package.json` et packagée dans ce bundle. Le répertoire `src/oracle/web/static/` est monté via `fastapi.staticfiles.StaticFiles`, ce qui permet de servir directement les assets générés par Vite.

### Plateau interactif Neo Chess Board

- **Page d’accueil** : le bouton « Synchroniser le plateau » charge le contenu de la zone de texte sur le plateau, tandis que « Réinitialiser » remet la position initiale. Chaque coup joué sur le plateau met automatiquement à jour le PGN du formulaire.
- **Page de résultats** : le PGN analysé est chargé automatiquement dans le plateau. Jouer de nouveaux coups met à jour le bloc PGN affiché pour explorer des variantes à partir du résultat obtenu.
- Les scripts front-end dispatchent un événement `oracle-board:ready` et exposent une API globale `window.oracleBoard` (méthodes `loadPgn`, `reset`, `getPgn`, etc.) si vous souhaitez connecter d’autres composants personnalisés.

### Saisir un PGN

Sur la page d’accueil :

1. Collez dans la zone de texte le PGN complet jusqu’au coup que vous souhaitez analyser (en incluant les en-têtes si disponibles).
2. Cliquez sur **Analyser** pour envoyer la requête vers `/analyze` en méthode POST.

### Lire les résultats

La page de résultats affiche :

- Le pourcentage de gain estimé pour les blancs dans la position actuelle.
- Un tableau classé des coups probables, avec pour chacun la probabilité, l’évaluation et un indicateur si le coup est considéré comme « best ».
  Chaque ligne propose également un volet « Évaluations Elo » détaillant les pourcentages calculés pour chaque palier configuré.
- Une visualisation interactive superpose les probabilités (barres) et le score attendu (courbe) pour comparer rapidement l’impact des coups proposés.
- Les métriques de consommation du modèle (tokens entrants/sortants et coût estimé) présentées sous forme de cartes.
- Le PGN analysé pour vérification rapide.

Un bouton permet de revenir au formulaire pour une nouvelle analyse.

### Gestion des erreurs

- **Stockfish non configuré** : un message d’alerte s’affiche avec des indications pour définir correctement `STOCKFISH_PATH` lorsque le binaire est manquant, inexistant ou non exécutable.
- **PGN invalide** : les erreurs de parsing ou de validation côté service se traduisent par une alerte détaillée sur la page, invitant à corriger la notation SAN et la numérotation des coups.
- **Autres erreurs** : un message générique rappelle de consulter les logs serveur pour obtenir davantage de détails.

### Personnalisation avancée

- Ajustez les paramètres d’analyse (temps limite, profondeur, threads) ou les valeurs par défaut des Elo et contrôles de temps en modifiant `OracleConfig`. Cela peut être utile pour adapter l’application à des contextes particuliers (par exemple des parties blitz).
  Utilisez notamment le champ `rating_buckets` pour suivre l’évaluation d’un coup selon plusieurs paliers Elo en parallèle.
  Les champs `top_k` et `top_n_tokens` permettent de calibrer le nombre de candidats demandés au modèle Hugging Face.
- Surcharger `HUGGINGFACE_MODEL_ID` et `HUGGINGFACEHUB_API_TOKEN` à l’exécution permet d’expérimenter avec d’autres modèles hébergés sur Hugging Face sans toucher au code.

### Dépannage rapide

1. **Erreur 500 au démarrage ou à la première requête** : assurez-vous que `STOCKFISH_PATH` pointe vers un binaire exécutable et accessible par l’utilisateur qui lance Uvicorn.
2. **Pas de prédictions** : vérifiez la validité du PGN (balises, numérotation des coups, format SAN). Les messages d’erreur retournés par l’interface donnent des indices sur la cause exacte.
3. **Coût ou latence élevés** : choisissez un modèle Hugging Face plus léger ou hébergez votre propre endpoint, et réduisez éventuellement la profondeur/temps d’analyse dans `OracleConfig`.

## Hugging Face model access

Oracle now defaults to the free [`mistralai/Mistral-7B-Instruct-v0.2`](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2) text-generation model served through the Hugging Face Inference API. The hosted endpoint accepts anonymous requests for light usage; create a free Hugging Face account and provide a token if you need higher throughput or want to use a different hosted model.

1. Sign in (or create an account) at [huggingface.co](https://huggingface.co/).
2. Generate a read token from **Settings → Access Tokens** and copy its value.
3. Export it as `HUGGINGFACEHUB_API_TOKEN` or paste it into the prompts shown by `oracle_one_move.py` and `oracle_pgn_file.py`.
4. Optionally set `HUGGINGFACE_MODEL_ID` to override the default model if you want to experiment with another free endpoint.

## Examples

![Ding vs. Nepo, round 14 after 58...a3](docs/static/ding_vs_nepo_chesscom.png)

Position after 58...a3 in the last tie-break of the [2023 World Championship.](https://www.chess.com/events/2023-fide-world-chess-championship/18/Nepomniachtchi_Ian-Ding_Liren) Stockfish shows 0.00, but considering it's rapid, Oracle only gives white a 18.50% expected score. Nepo ended up blundering with 59. Qc7??, which was the likeliest move according to Oracle.

![Ding vs. Nepo, Input and Ouput](docs/static/ding_vs_nepo.png)

![Dubov vs. Nepo, position after 11... Nc6](docs/static/dubov_vs_nepo_lichess.png)

Position after 11...Nc6 in the infamous "Danse of the Knights" pre-arranged draw between [Daniil Dubov and Ian Nepomniachtchi](https://lichess.org/broadcast/2023-fide-world-blitz-championship--boards-1-30/round-11/yem1lgfo/ESRRgphO) at the 2023 World Blitz Championship. Despite it being an obviously bad move, Oracle predicts 12. Nb1 that was actually played by Nepo and gives it a high 72% likelihood.

![Dubov vs. Nepo - Input and Ouput](docs/static/dubov_vs_nepo.png)

## Requirements

Oracle uses Hugging Face Inference models and Stockfish to deliver human-like chess moves. Users need access to a suitable text-generation model on [huggingface.co](https://huggingface.co/models) (set the `HUGGINGFACEHUB_API_TOKEN` environment variable if authentication is required) and a version of Stockfish, which can be downloaded [here](https://stockfishchess.org/download/).

- **Python packages:** Install the Poetry-managed dependencies (`huggingface-hub`, `chess`, `python-dotenv`, `fastapi`, `uvicorn`, `jinja2`, `python-multipart`) plus the new [`tabulate`](https://pypi.org/project/tabulate/) helper that formats CLI predictions.
- **Stockfish Engine:** Make sure you have Stockfish installed and properly set up.
- **PGN Input:** Prepare your PGN input files for analysis.

## Configuration

By default, Stockfish is set to a time limit of 1.3 seconds, a depth limit of 20 plies, uses 8 threads and 512 MB of hash. You can change these settings in the analyze_moves function.

## Time

On my computer, Oracle takes on average about 2 seconds per move. This duration could be reduced with an optimized code and better hardware.

## Cost

Because Oracle uses hosted Hugging Face inference for her prediction, usage costs depend on the selected model and hosting plan. Expect throughput and pricing to vary with provider limits and prompt length (shorter headers allow far more predictions per credit).

## Author's Note

I am a FIDE Master and Woman International Master with no previous coding experience, so the code might contains mistakes or improper formulations.

## Oracle's name

![The Oracle from The Matrix](docs/static/logo.jpg)

I've decided to name my chess engine Oracle because just like the Oracle from The Matrix, her predictions feel magical even though they are just pure calculations performed by a program. For that reason, Oracle should be referred to as she/her.

## Contributions and Future of Oracle

Because I'm new to coding, Oracle's code should be improvable.
The next significant step for Oracle would be the creation of an open-source LLM trained on full PGNs with headers to eliminate reliance on third-party hosted instruct models, keeping Oracle completely free to run.
Following this, Oracle could be turned into a user-friendly executable file and used on a large scale for broadcasts, training, opening preparation, anti-cheating, bots creation, and so on.

## Support and Donation

I have dedicated several hundred hours to this project and invested a significant amount of money. As a professional chess player and coach, my resources are limited. While I am happy to offer Oracle to the chess and scientific communities for free, any donation would be greatly appreciated.

If you value my work and wish to support Oracle and me, please consider [making a donation.](https://www.paypal.com/donate/?hosted_button_id=6WTAEDBXAPTLC)
<p align="center">
  <a href="https://www.paypal.com/donate/?hosted_button_id=6WTAEDBXAPTLC">
    <img src="docs/static/paypal.png" alt="Donate via Paypal" />
  </a>
</p>

I would be very thankful. 🙏

## Read More

I've written an [extensive article](https://yoshachess.com/article/oracle/) on my personnal website

## License

This project is licensed under the MIT License. See the MIT License file for details.

## Copyright

© 2024 Yosha Iglesias. All rights reserved.
