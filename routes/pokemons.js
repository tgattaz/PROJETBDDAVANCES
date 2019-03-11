//l'ordre des routes a son importance l'artiste!

var router = require('express').Router();

var Pokemon = require('./../models/Pokemon');
var Type = require('./../models/Type');

router.get('/', (req,res) => {
  console.log(req.query.sort);
  console.log(req.query.name);
  if (req.query.sort){
    if (req.query.name) {
      Pokemon.find({ name:{"$regex": '^' + req.query.name, "$options": "i"} }).sort({ name: 1 }).populate('types').then(pokemons => {
        res.render('pokemons/index.html', { pokemons: pokemons });
    })
    }
    else {
      Pokemon.find({}).sort({ name: 1 }).populate('types').then(pokemons => {
        res.render('pokemons/index.html', { pokemons: pokemons });
    })
    }
  }
  else{
    if (req.query.name) {
      Pokemon.find({ name:{"$regex": '^' + req.query.name, "$options": "i"} }).sort({ number: 1 }).populate('types').then(pokemons => {
        res.render('pokemons/index.html', { pokemons: pokemons });
    })
    }
    else {
      Pokemon.find({}).sort({ number: 1 }).populate('types').then(pokemons => {
        res.render('pokemons/index.html', { pokemons: pokemons });
    })
    }
  }
});



router.get('/new', (req, res) => {
  Type.find({}).then(types => {
    var pokemon = new Pokemon();
    res.render('pokemons/edit.html', { pokemon: pokemon, types: types, endpoint: '/' });
  });
});

router.get('/edit/:id', (req, res) => {
  Type.find({}).then(types =>{
    Pokemon.findById(req.params.id).then(pokemon => {
      res.render('pokemons/edit.html', { pokemon: pokemon, types: types, endpoint: '/' + pokemon._id.toString() });
    });
  });
});

router.get('/delete/:id', (req, res) => {
  Pokemon.findOneAndDelete({ _id: req.params.id }).then(() => {
    res.redirect('/');
  },
  err => console.log(err));
});

router.get('/:id', (req,res) => {
  Pokemon.findById(req.params.id).populate('types').then(pokemon => {
    res.render('pokemons/show.html', { pokemon: pokemon });
  },
  err => res.status(500).send(err));
});

//? car c'est un paramètre optionnel, edit? on utilise un id, sinon new donc pas d'id
router.post('/:id?', (req,res) => {
  //promise = objet qui représente une opération asynchrone
  new Promise((resolve, reject) => {
    if(req.params.id) {
      Pokemon.findById(req.params.id).then(resolve, reject);
    }
    else {
      resolve(new Pokemon());
    }
  }).then(pokemon => {
      pokemon.name = req.body.name;
      pokemon.description = req.body.description;
      pokemon.number = req.body.number;
      pokemon.types = req.body.types;

      if(req.file) pokemon.picture = req.file.filename;

      return pokemon.save();
  }).then(() => {
      res.redirect('/');
  }, err => console.log(err));
});



module.exports = router;