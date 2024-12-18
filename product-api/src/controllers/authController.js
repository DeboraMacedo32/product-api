const jwt = require('jsonwebtoken');
const USERS_FILE = './data/users.json';
const { writeJSON, readJSON } = require('../utils/jsonhandler');

exports.register = async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const users = await readJSON(USERS_FILE);

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: 'Usuário já existe.' });
    }

    const newUser = { id: Date.now(), username, password, isAdmin: !!isAdmin };
    users.push(newUser);
    await writeJSON(USERS_FILE, users);

    res.status(201).json(newUser);
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const users = await readJSON(USERS_FILE);

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
};

exports.createAdmin = async (req, res) => {
    const { username, password } = req.body;
    const users = await readJSON(USERS_FILE);

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: 'Usuário já existe.' });
    }

    const newAdmin = { id: Date.now(), username, password, isAdmin: true };
    users.push(newAdmin);
    await writeJSON(USERS_FILE, users);

    res.status(201).json(newAdmin);
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const users = await readJSON(USERS_FILE);

    const userIndex = users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (users[userIndex].isAdmin) {
        return res.status(403).json({ error: 'Não é permitido excluir administradores.' });
    }

    users.splice(userIndex, 1);
    await writeJSON(USERS_FILE, users);

    res.status(200).json({ message: 'Usuário excluído com sucesso.' });
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
    const users = await readJSON(USERS_FILE);

    const userIndex = users.findIndex(user => user.id === parseInt(id));
    if (userIndex === -1) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    if (users[userIndex].id !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Você só pode alterar seus próprios dados.' });
    }

    if (username) users[userIndex].username = username;
    if (password) users[userIndex].password = password;

    await writeJSON(USERS_FILE, users);
    res.status(200).json({ message: 'Dados atualizados com sucesso.', user: users[userIndex] });
};