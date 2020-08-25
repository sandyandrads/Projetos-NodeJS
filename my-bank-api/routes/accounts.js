var express = require('express'); // instancia modulo express em variavel
var fs = require('fs').promises;
var router = express.Router(); //variavel com o router, substituir palavras app. por router.

//Método POST
router.post('/', async (req, res) => {
  let account = req.body; //variavel para busca corpo JSON
  try {
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);

    account = { id: json.nextId++, ...account }; // ... trás todos os objetivos anteriores
    json.accounts.push(account); // insere no accounts.json o novo account

    await fs.writeFile(global.fileName, JSON.stringify(json));
    res.end();

    logger.info(`POST /account - ${JSON.stringify(account)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /account - ${err.message}`);
  }
});

//MÉTODO GET
router.get('/', async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf8');
    //Não é importante visualizar o proximo ID, removemos esta opção
    let json = JSON.parse(data);
    delete json.nextId;
    res.send(json);
    logger.info('GET /account');
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /account - ${err.message}`);
  }
});

//MÉTODO GET DE ID ESPECÍFICO
router.get('/:id', async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    const account = json.accounts.find(
      (account) => account.id === parseInt(req.params.id, 10)
    );

    if (account) {
      res.send(account);
      logger.info(`GET /account/:id - ${JSON.stringify(account)}`);
    } else {
      res.end();
      logger.info('GET /account/:id');
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`GET /account/:id - ${err.message}`);
  }
});

//MÉTODO DELETE DE ID ESPECÍFICO
router.delete('/:id', async (req, res) => {
  try {
    let data = await fs.readFile(global.fileName, 'utf8');

    let json = JSON.parse(data);
    let accounts = json.accounts.filter(
      (account) => account.id !== parseInt(req.params.id, 10)
    );
    json.accounts = accounts;

    await fs.writeFile(global.fileName, JSON.stringify(json));

    res.end();
    logger.info(`DELETE /account/:id - ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`DELETE /account - ${err.message}`);
  }
});

//MÉTODO PUT
router.put('/', async (req, res) => {
  //readFile responsável por ler o JSON antes de inserir um novo objeto
  try {
    let newAccount = req.body; //variavel para busca corpo JSON
    let data = await fs.readFile(global.fileName, 'utf8');
    let json = JSON.parse(data);
    let oldIndex = json.accounts.findIndex(
      (account) => account.id === newAccount.id
    );

    json.accounts[oldIndex].nome = newAccount.nome;
    json.accounts[oldIndex].balance = newAccount.balance;

    await fs.writeFile(global.fileName, JSON.stringify(json));

    res.end();
    logger.info(`PUT /account - ${JSON.stringify(newAccount)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`PUT /account - ${err.message}`);
  }
});

//MÉTODO TRANSCTION
router.post('/transction', async (req, res) => {
  try {
    let params = req.body; //variavel para busca corpo JSON
    let data = await fs.readFile(global.fileName, 'utf8');

    let json = JSON.parse(data);
    let index = json.accounts.findIndex((account) => account.id === params.id);

    if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
      throw new Error('Não há saldo suficiente.');
    }

    json.accounts[index].balance += params.value;

    await fs.writeFile(global.fileName, JSON.stringify(json));

    res.send(json.accounts[index]);
    logger.info(`POST /account/transction - ${JSON.stringify(params)}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
    logger.error(`POST /account/transction - ${err.message}`);
  }
});

module.exports = router; // criação do modulo de exportação contendo router

/* //Método POST
router.post('/', (req, res) => {
  let account = req.body; //variavel para busca corpo JSON

  //readFile responsável por ler o JSON antes de inserir um novo objeto
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      account = { id: json.nextId++, ...account }; // ... trás todos os objetivos anteriores
      json.accounts.push(account); // insere no accounts.json o novo account

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        //se tiver erro console.log do contrário nada
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
}); */

/* //MÉTODO GET DE ID ESPECÍFICO
router.get('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      //tratamento de erro, se ocorrer algum no fim da página ele joga pra cá e para as execuções
      if (!err) {
        let json = JSON.parse(data);
        //a comparação com os tres iguais só seria possivel se fossem do mesmo tipo, como não é fazemos um parseInt para transformar a string em inteiro
        const account = json.accounts.find(
          (account) => account.id === parseInt(req.params.id, 10)
        );
        if (account) {
          res.send(account);
        } else {
          res.end();
        }
      } else {
        res.status(400).send({ error: err.message });
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
}); */

/* //MÉTODO DELETE DE ID ESPECÍFICO
router.delete('/:id', (req, res) => {
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;

      let json = JSON.parse(data);
      let accounts = json.accounts.filter(
        (account) => account.id !== parseInt(req.params.id, 10)
      );
      json.accounts = accounts;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
}); */

/* //MÉTODO PUT
router.put('/', (req, res) => {
  let newAccount = req.body; //variavel para busca corpo JSON
  //readFile responsável por ler o JSON antes de inserir um novo objeto
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      let oldIndex = json.accounts.findIndex(
        (account) => account.id === newAccount.id
      );
      json.accounts[oldIndex].name = newAccount.name;
      json.accounts[oldIndex].balance = newAccount.balance;

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.end();
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
}); */

/* //MÉTODO TRANSCTION
router.put('/transction', (req, res) => {
  let params = req.body; //variavel para busca corpo JSON
  //readFile responsável por ler o JSON antes de inserir um novo objeto
  fs.readFile(global.fileName, 'utf8', (err, data) => {
    try {
      if (err) throw err;
      let json = JSON.parse(data);
      let index = json.accounts.findIndex(
        (account) => account.id === params.id
      );
      json.accounts[index].balance += params.value;

      if (params.value < 0 && json.accounts[index].balance + params.value < 0) {
        throw new Error('Não há saldo suficiente.');
      }

      fs.writeFile(global.fileName, JSON.stringify(json), (err) => {
        if (err) {
          res.status(400).send({ error: err.message });
        } else {
          res.send(json.accounts[index]);
        }
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  });
}); */
