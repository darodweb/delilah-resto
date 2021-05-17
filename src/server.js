const express = require('express');
const server = express();
var actions = require('./actions');
// const { request } = require('express');

const bodyParser = require('body-parser');
var authentication = require('./authentication');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./swaggerDefinition');

const usuarios = require('./routes/usuarios')
const productos = require('./routes/productos')

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


//Para limitar el intento de peticion al servidor
const apiLimiterLogin = rateLimit({
  max: 10000
});


const port = 3001;

const options = {
  ...swaggerDefinition,
  apis: ['./src/routes/*.js']
}

const swaggerSpec = swaggerJsDoc(options);

//Middlewares
server.use(helmet());
// server.use(express.json());
server.use(bodyParser());
server.use('/', apiLimiterLogin);
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
server.use('/', usuarios,);
server.use('/', productos);

//Client login
server.post('/login', async (req, res) => {
  var arg = req.body;
  var user = arg.username;
  var password = arg.password;
  const usuarios = await actions.get('SELECT * FROM usuarios WHERE username = :user AND password = :password', { user, password })
  // var isAutenticated = usuarios.filter(user => user.username === user && user.password === password);
  if (usuarios.length > 0) {
    var data = { user, password };
    var token = authentication.generateToken(data);
    res.send({
      result: 'OK',
      token
    });
  } else {
    res.send({
      result: 'ERROR'
    });
  }
});

// server.post('/cliente/', (req, res) => {
//   let userverified = authentication.verifyUser(req, res, clientes);
//   if (userverified) {
//     res.send(clientes);
//   } else {
//     res.send('Error: Ha ocurrido un problema con el token');
//   }
//   res.send('cliente');
// });


// server.put('/cliente', (req, res) => {
//   let userverified = authentication.verifyUser(req, res, clientes);
//   if (userverified) {
//     res.send(clientes);
//   } else {
//     res.send('Error: Ha ocurrido un problema con el token');
//   }
//   res.status(201).send();
// });

// server.delete('/cliente/', (req, res) => {
//   let userverified = authentication.verifyUser(req, res, clientes);
//   if (userverified) {
//     res.send(clientes);
//   } else {
//     res.send('Error: Ha ocurrido un problema con el token');
//   }
//   res.status(201).send();
//   res.send('cliente');
// });


//-------------- PEDIDOS Endpoints--------------------------------

var pedidos = [];


server.get('/pedidos', (req, res) => {
  res.send('Listado de Pedidos');
});

server.get('/pedido/{ID}', (req, res) => {
  res.send('Detalle de pedido ID');
});

server.post('/pedido/', (req, res) => {
  let userverified = authentication.verifyUser(req, res, clientes);
  if (userverified) {
    res.send(clientes);
  } else {
    res.send('Error: Ha ocurrido un problema con el token');
  }
  res.status(201).send();
  res.send('Crea pedido');
});

server.put('/pedido/', (req, res) => {
  let userverified = authentication.verifyUser(req, res, clientes);
  if (userverified) {
    res.send(clientes);
  } else {
    res.send('Error: Ha ocurrido un problema con el token');
  }
  res.status(201).send();
  res.send('Pedido modificado');
});





// server.post('/register', (req, res) => {
//     var arg = req.body;

//     if (!validateEmail(arg.email)) {
//         res.send("ERROR: el correo no es tiene el formato correcto");
//     }

//     usuarios.push(arg);
//     res.send(arg);
// });

// function validateContraseña(password) {
//     var Mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     var Numeros = '1234567890';
//     var Minusculas = 'abcdefghijklmnopqrstuvwxyz';
//     for (let index = 0; index < password.length; index++) {
//         const caracter = password[index];
//         var contieneMayuscula = Mayusculas.includes(caracter);
//     }
// }

// function validateEmail(email) {
//     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// }

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});