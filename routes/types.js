var router = require('express').Router();

var Type = require('./../models/Type');

router.get('/new', (req, res) => {
    var type = new Type();
    res.render('types/edit.html', { type: type, endpoint: '/types/' });
});

router.get('/edit/:id', (req, res) => {
    Type.findById(req.params.id).then(type => {
      res.render('types/edit.html', { type: type, endpoint: '/types/' + type._id.toString() });
    });
});

router.get('/delete/:id', (req, res) => {
  Type.findOneAndDelete({ _id: req.params.id }).then(() => {
    res.redirect('/');
  },
  err => console.log(err));
});

router.get('/:type', (req,res) => {
  Type.findOne({ name: req.params.type }).populate('pokemons').then(type => {
    if(!type) return res.status(404).send('Type introuvable')

    res.render('types/show.html', {
      type: type,
      pokemons: type.pokemons
    })
  }, err => console.log(err));
});

//? car c'est un paramètre optionnel, edit? on utilise un id, sinon new donc pas d'id
router.post('/:id?', (req,res) => {
  //promise = objet qui représente une opération asynchrone
  new Promise((resolve, reject) => {
    if(req.params.id) {
      Type.findById(req.params.id).then(resolve, reject);
    }
    else {
      resolve(new Type());
    }
  }).then(type => {
      type.name = req.body.name;
      type.color = req.body.color;

      return type.save();
  }).then(() => {
      res.redirect('/');
  }, err => console.log(err));
});

module.exports = router;