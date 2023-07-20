const express    = require('express');
const exphbs     = require('express-handlebars');
const app        = express();
const path       = require('path');
const db         = require('./db/connection');
const bodyParser = require('body-parser');
const Job        = require('./models/Job');
const Sequelize  = require('sequelize');
const Op         = Sequelize.Op;

const PORT = 3000;

app.listen(PORT, function() {
  console.log(`Express is running at door: ${PORT}`);
});

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// static folders

app.use(express.static(path.join(__dirname, 'public')));

// handle bars
app.set('views', path.join(__dirname, 'views'));

// db connection
db
  .authenticate()
  .then(() => {
    console.log("Connected to database successfully")
  })
  .catch(err => {
    console.log("Error to connect", err);
  });

// routes
app.get('/', (req, res) => {

  let search = req.query.job;
  let query = '%'+search+'%'; //PH -> PHP, Word -> Wordpress, press -> Wordpress

  if(!search) {

  Job.findAll({order: [
    ['createdAt', 'DESC']
  ]})
  .then(jobs => {

    res.render('index', {
      jobs
    });

  })
  .catch(err => console.log(err));
  } else {

  Job.findAll({
    where: {title: {[Op.like]: query}},
    order: [
      ['createdAt', 'DESC']
  ]})
  .then(jobs => {

    res.render('index', {
      jobs, search
    });

  })
  .catch(err => console.log(err));
  }

  
});

// jobs routes
app.use('/jobs', require('./routes/jobs'));