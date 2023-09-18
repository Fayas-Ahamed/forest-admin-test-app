let express = require('express');
let cors = require('cors');
let app = express();
let Liana = require('forest-express-sequelize');
const mysql = require('mysql2');

let allowedOrigins = [/\.forestadmin\.com$/, /localhost:\d{4}$/, /host.docker.internal:\d{4}$/ ];

let corsConfig = {
  origin: allowedOrigins,
  credentials: true,
};

let { createAgent } = require('@forestadmin/agent');
let { createSqlDataSource } = require('@forestadmin/datasource-sql');

// Create your Forest Admin agent
// This must be called BEFORE all other middleware on the app
createAgent({
  authSecret: '57fc4cdedbbeda0261c4442fa0dc664430ae26b4aad486a6',
  envSecret: 'c3f14bb722f9e1636fe1c3b375e4c4477b5ca4d1573791676da21d89f68ed006',
})
  // Create your SQL datasource
  .addDataSource(createSqlDataSource({ uri: 'mysql://root@host.docker.internal:3306/nation' }))
  // Replace "myExpressApp" by your Express application
  .mountOnExpress(app)
  .start();

app.use(cors(corsConfig));

app.post('/api/stats/test-data', function (req, res) {
  let x = 10;
  let json = new Liana.StatSerializer({
    value: x
  }).perform();

  res.send(json);
});

app.get('/api/stats/guests', function (req, res) {
  const connection = mysql.createConnection({
    host: 'host.docker.internal',
    user: 'root',
    database: 'nation'
  });
  
  // simple query
  connection.query(
    'SELECT * FROM `guests`',
    function(err, results, fields) {
      console.log(results); // results contains rows returned by server
      console.log(fields); // fields contains extra meta data about results, if available
  res.send(results);
    }
  );
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.listen(3000, function () {
  console.log('app listening on port 3000');
});
