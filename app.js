const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const app = express();
const port = 3000;

// Initialize Sequelize: https://sequelize.org/
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

// Define User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

User.hasMany(Task);

// Middleware and view engine: https://expressjs.com/en/guide/using-template-engines.html
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Routes: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/routes
app.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(users)
    res.render('index', { users } ); // { users: users }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/', async (req, res) => {
  const { name, email } = req.body;
  try {
    await User.create({ name, email });
    res.redirect('/');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/:userId', async (req, res) => {
  const id = req.params.userId;
  const user = await User.findByPk(id);
 
  res.render("user", { user })// {user:user}
}
  
  
)

app.post('/:userId/newTask', async (req,res) =>{
  // handle new task here for user


})

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
