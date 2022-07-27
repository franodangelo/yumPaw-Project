const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const { Owner, Provider} = require('./db');

require('./db.js');
const http = require('http');
const server = express();

const app = http.createServer(server);
const socketio = require('socket.io');
const io = socketio(app, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
var conectados = [];

io.on('connection', (socket) => {
  // Se conecta el usuario
  socket.on('conectado', (email, providerEmail, ownerEmail) => {
    // Cada vez que alguien se conecte, se ejecutará la función
    // Agregamos a la variable conectados
    conectados.push({
      email,
      id: socket.id
    });
    // Verificamos si el usuario es Owner
    if (email === providerEmail) {
      Owner.findAll().then(owners => {
        owners.forEach((x) => {
          // Por cada registro de owner, quiero verificar si existe algún mensaje para mí

          //-------------------------- Verificación Owner ----------------------
          // pendingMessages tiene el valor de [], por lo tanto si su length es > 0, esto significa 
          // que este owner tiene mensajes pendientes
          if (x.dataValues.pendingMessages.length > 0) {
            // Verifico si este usuario tiene algún mensaje pendiente para mí
            let myMessages = x.dataValues.pendingMessages.find(x => {
              return x.providerEmail === email
            })
            const arrWithoutMyMessages = x.dataValues.pendingMessages.filter(x => x !== myMessages);
            if (myMessages) {
              for (let x = 0; x <= myMessages.message.length - 1; x++) {
                if (x === myMessages.message.length - 1) {
                  io.emit('Mensaje agregado a Mensajes', myMessages.message[x], false, false, true, true)
                  Owner.update({
                    ...x,
                    pendingMessages: arrWithoutMyMessages
                  }, {
                    where: {
                      email: ownerEmail
                    }
                  }).then(() => console.log("Se vació la base de datos")).catch((e) => console.log(e))
                } else {
                  io.emit('Mensaje agregado a Mensajes', myMessages.message[x], false, false, true, false)
                }
              }
            }
          }
        })
      }).catch(error => console.log(error))
    } else if (email === ownerEmail) {
      Provider.findAll().then(providers => {
        providers.forEach(x => {
          // Por cada registro de owner, quiero verificar si existe algún mensaje para mí

          //-------------------------- Verificación Provider ----------------------
          //pending messages tiene el valor de [], por lo tanto si su length es > 0, esto significa 
          //que este provider tiene por lo menos un mensaje pendiente a alguien
          if (x.dataValues.pendingMessages.length > 0) {
            //  console.log(x.dataValues.pendingMessages[0].message)
            //verifico si este usuario tiene algún mensaje pendiente para mí
            let myMessages = x.dataValues.pendingMessages.find(x => {
              return x.ownerEmail === email
            })
            const arrWithoutMyMessages = x.dataValues.pendingMessages.filter(x => x !== myMessages);
            //Si hay un mensaje pendiente para mí
            if (myMessages) {
              for (let x = 0; x <= myMessages.message.length - 1; x++) {
                if (x === myMessages.message.length - 1) {
                  io.emit('Mensaje agregado a Mensajes', myMessages.message[x], false, false, true, true)
                  Provider.update({
                    ...x,
                    pendingMessages: arrWithoutMyMessages
                  }, {
                    where: {
                      email: providerEmail
                    }
                  }).then(() => console.log("Se vació la base de datos")).catch((e) => console.log(e))
                } else {
                  io.emit('Mensaje agregado a Mensajes', myMessages.message[x], false, false, true, false)
                }
              }
            }
          }
        })
      }).catch(err => console.log(err))
    }
  })

  // Quiero enviar un mensaje
  socket.on('mensaje enviado', (mensaje, providerEmail, email, ownerEmail) => {
    // Verifico si el usuario está conectado
    if (email === ownerEmail) {
      if (conectados.find(x => x.email === providerEmail)) {
        io.emit('Mensaje agregado a Mensajes', mensaje, true, false, false, false)
      } else {
        // Usuario no encontrado
        io.emit('Mensaje agregado a Mensajes', mensaje, false, true, false, false);
        // Almaceno en este objeto el mensaje y el mail de la persona con la cual queria hablar
        const unreadMessage = {
          message: [mensaje],
          providerEmail
        }
        // Busco en la base de datos por el registro que almacena mi información
        Owner.findOne({
          where: {
            email: email
          }
        }).then(x => {
          var hasProviderEmail = x.pendingMessages.find(x => x.providerEmail === providerEmail);
          // Verifico si existe algún mensaje pendiente al mismo usuario
          if (hasProviderEmail) {
            // Tomo el registro de los anteriores y agrego el nuevo mensaje
            hasProviderEmail = {
              ...hasProviderEmail,
              message: [...hasProviderEmail.message, unreadMessage.message[0]]
            }
            // Tomo el arreglo con todos los registros de mensaje y le sumo mis alteraciones
            var newPendingMessages = x.pendingMessages.filter(x => x.providerEmail !== providerEmail);
            newPendingMessages.push(hasProviderEmail)
            // Actualizo la base de datos con este nuevo arreglo
            x.update({
              ...x,
              pendingMessages: newPendingMessages
            })
          }
          else {
            x.update({
              ...x,
              pendingMessages: [...x.pendingMessages, unreadMessage]
            })
          }
        })
      }
    } else if (email === providerEmail) {
      if (conectados.find(x => x.email === ownerEmail)) {
        io.emit('Mensaje agregado a Mensajes', mensaje, true, false, false, false)
      }
      else {
        io.emit('Mensaje agregado a Mensajes', mensaje, false, true, false, false);
        // Almaceno en este objeto el mensaje y el mail de la persona con la cual quería hablar
        const unreadMessage = {
          message: [mensaje],
          ownerEmail
        }
        // Busco en la base de datos por el registro que almacena mi info
        Provider.findOne({
          where: {
            email: email
          }
        }).then(x => {
          var hasOwnerEmail = x.pendingMessages.find(x => x.ownerEmail === ownerEmail);
          // Verifico si existe algún mensaje pendiente al mismo usuario
          if (hasOwnerEmail) {
            // Tomo el registro de los anteriores y agrego el nuevo mensaje
            hasOwnerEmail = {
              ...hasOwnerEmail,
              message: [...hasOwnerEmail.message, unreadMessage.message[0]]
            }
            // Tomo el arreglo con todos los registros de mensaje y le sumo mis alteraciones
            var newPendingMessages = x.pendingMessages.filter(x => x.ownerEmail !== ownerEmail);
            newPendingMessages.push(hasOwnerEmail)
            // Actualizo la base de datos con este nuevo arreglo modificado
            x.update({
              ...x,
              pendingMessages: newpendingMessages
            })
          }
          else {
            x.update({
              ...x,
              pendingMessages: [...x.pendingMessages, unreadMessage]
            })
          }
        })
      }
    }
  })

  socket.on('disconnect', () => {
    conectados = conectados.filter(x => x.id !== socket.id)
  })
});

server.name = 'API';

server.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
server.use(bodyParser.json({
  limit: '50mb'
}));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use('/', routes);

server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = { server, app };