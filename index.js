const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração da conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'funcionarios_nodejs'
});

// Conecta ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão ao banco de dados estabelecida');
});

// Rotas CRUD
app.get('/api/funcionarios', (req, res) => {
  db.query('SELECT * FROM funcionarios', (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get('/api/funcionarios/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM funcionarios WHERE id=?', [id], (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });

app.post('/api/funcionarios', (req, res) => {
  const { nome, email } = req.body;
  db.query('INSERT INTO funcionarios (nome, email) VALUES (?, ?)', [nome, email], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Usuário criado com sucesso', id: result.insertId });
  });
});

app.put('/api/funcionarios/:id', (req, res) => {
  const id = req.params.id;
  const { nome, email } = req.body;
  db.query('UPDATE funcionarios SET nome = ?, email = ? WHERE id = ?', [nome, email, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Usuário atualizado com sucesso' });
  });
});

app.delete('/api/funcionarios/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM funcionarios WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Usuário excluído com sucesso' });
  });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
