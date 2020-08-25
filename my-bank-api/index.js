const express = require('express'); // instancia modulo express em variavel
const fs = require('fs').promises;
const app = express(); //instancia o proprio express
const accountsRouter = require('./routes/accounts.js'); //importação do router
const winston = require('winston'); //npm do log

global.fileName = 'accounts.json'; //arquivo

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'my-bank-api.log' }),
  ],
  format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormat),
});

app.use(express.json()); // informamos o express do uso do JSON
app.use('/account', accountsRouter);

// escutador na porta 3000,
app.listen(3000, async () => {
  // se não encontrar aquivo accounts.json, ele cria com uma estrutura básica

  try {
    await fs.readFile(global.fileName, 'utf8');
    logger.info('API Inicializada!'); // console mostrando quando a API subir
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    //não esquecer método stringify converte objeto para JSON
    fs.writeFile(global.fileName, JSON.stringify(initialJson), (err) => {
      logger.error(err);
    });
  }
});

/* // escutador na porta 3000,
app.listen(3000, () => {
  // se não encontrar aquivo accounts.json, ele cria com uma estrutura básica
  try {
    fs.readFile(global.fileName, 'utf8', (err, data) => {
      if (err) {
        const initialJson = {
          nextId: 1,
          accounts: [],
        };
        //não esquecer método stringify converte objeto para JSON
        fs.writeFile(global.fileName, JSON.stringify(initialJson), (err) => {
          console.log(err);
        });
      }
    });
  } catch (err) {
    console.log(err);
  }

  console.log('API Inicializada!'); // console mostrando quando a API subir
}); */
