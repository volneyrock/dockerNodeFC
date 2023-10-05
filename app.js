const express = require('express');
const mysql = require('mysql2/promise');
const faker = require('faker');

const app = express();
const port = 3000;

// Configuração da conexão com o MySQL
const db = mysql.createPool({
  host: 'mysql',
  port: 3306,
  user: 'root',
  password: 'fullcycle',
  database: 'mysql',
})

module.exports = db;

// Função para criar a tabela 'people' se ela não existir
async function createTableIfNotExists() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS people (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `);
    console.log('Tabela "people" criada com sucesso ou já existe.');
  } catch (error) {
    console.error('Erro ao criar a tabela "people":', error.message);
  }
}

// Chama a função para criar a tabela no início do aplicativo
createTableIfNotExists();

// Rota principal que adiciona um nome à tabela "people" e retorna a lista de nomes
app.get('/', async (req, res) => {
  const name = faker.name.firstName();

  try {
    // Insira o nome na tabela "people"
    await db.execute('INSERT INTO people (name) VALUES (?)', [name]);

    // Consulte o banco de dados para obter a lista de nomes
    const [rows] = await db.query('SELECT * FROM people');
    
    // Formate a resposta
    const namesList = rows.map((row) => `<li>${row.name}</li>`).join('\n');
    const response = `
      <h1>Full Cycle Rocks!</h1>
      <p>Lista de nomes cadastrados:</p>
      <ul>${namesList}</ul>
    `;
    console.log(`Nome "${name}" adicionado ao banco de dados.`);
    res.send(response);
  } catch (error) {
    console.error('Erro:', error.message);
    res.status(500).send('Erro interno do servidor');
  }
});
  
app.listen(port, () => {
    console.log(`Servidor Node.js rodando na porta ${port}`);
});
