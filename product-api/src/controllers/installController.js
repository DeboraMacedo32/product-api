const USERS_FILE = './data/users.json';
const { writeJSON, readJSON } = require('../utils/jsonhandler');

exports.install = async (req, res) => {
    try {
      const newAdmin = {
        username: 'admin',
        password: 'admin',
        isAdmin: true
      };
  
      const users = await readJSON(USERS_FILE);
      if (users.some(user => user.isAdmin)) {
        return res.status(400).json({ error: 'Administrador já existe.' });
      }
  
      users.push(newAdmin);
      await writeJSON(USERS_FILE, users);
  
      res.status(200).json({ message: 'Usuário administrador padrão criado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao realizar a configuração inicial' });
    }
  };