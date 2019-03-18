# PROJETBDDAVANCES

1) Importer dans votre BDD local les fichiers /pokemon-db/types.json & pokemons.json :
mongoimport -d pokedex -c types --file /yourpath/types.json
mongoimport -d pokedex -c pokemons --file /yourpath/pokemons.json

2) Lancer votre serveur MongoDB sur localhost:27017 :
mongo 

3) Lancer l'application de Pokédex en étant à la racine du projet :
node app.js

4) Consulter l'interface web sur : http://localhost:3000/
