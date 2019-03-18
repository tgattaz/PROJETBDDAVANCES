var express = require('express');
var mongoose = require('mongoose');
var nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
var multer = require('multer');

var upload = multer ({
    dest: __dirname + '/uploads'
})

mongoose.connect('mongodb+srv://user:user@cluster0-zt25f.mongodb.net/pokedex', { useNewUrlParser: true });
//mongoose.connect('mongodb://localhost/pokedex', { useNewUrlParser: true });

require('./models/Pokemon');
require('./models/Type');


var app = express();

//ici bodyparser ne sert à rien car notre formulaire est encodé en multiparse/form-data et décoder par du multer
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//quand tu as un champ file tu l'enregistres dans le dossier upload
app.use(upload.single('file'));

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/images', express.static(__dirname + '/images'));

app.use('/types', require('./routes/types'));
app.use('/', require('./routes/pokemons'));


app.use('/uploads', express.static(__dirname + '/uploads'));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });