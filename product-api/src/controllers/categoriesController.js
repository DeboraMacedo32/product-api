const { readJSON, writeJSON } = require('../utils/jsonhandler.js');

const CATEGORY_FILE = './data/categories.json';

exports.listCategories = async (req, res) => {
    const { limit = 5, page = 1 } = req.query;

    if (![5, 10, 30].includes(Number(limit))) {
        return res.status(400).json({ error: 'O limite deve ser 5, 10 ou 30.' });
    }

    const categories = await readJSON(CATEGORY_FILE);
    const startIndex = (page - 1) * limit;
    const paginatedCategories = categories.slice(startIndex, startIndex + Number(limit));

    res.status(200).json({ data: paginatedCategories });
};

exports.getCategory = async (req, res) => {
    const { id } = req.params;
    const categories = await readJSON(CATEGORY_FILE);
    const category = categories.find(cat => cat.id === parseInt(id));

    if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    res.status(200).json({ data: category });
};

exports.createCategory = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Nome e descrição são obrigatórios.' });
    }

    const categories = await readJSON(CATEGORY_FILE);
    const newCategory = { id: Date.now(), name, description };
    categories.push(newCategory);

    await writeJSON(CATEGORY_FILE, categories);
    res.status(201).json({ message: 'Categoria criada com sucesso.', data: newCategory });
};

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const categories = await readJSON(CATEGORY_FILE);
    const categoryIndex = categories.findIndex(cat => cat.id === parseInt(id));

    if (categoryIndex === -1) {
        return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    if (name) categories[categoryIndex].name = name;
    if (description) categories[categoryIndex].description = description;

    await writeJSON(CATEGORY_FILE, categories);
    res.status(200).json({ message: 'Categoria atualizada com sucesso.', data: categories[categoryIndex] });
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    const categories = await readJSON(CATEGORY_FILE);
    const categoryIndex = categories.findIndex(cat => cat.id === parseInt(id));

    if (categoryIndex === -1) {
        return res.status(404).json({ error: 'Categoria não encontrada.' });
    }

    categories.splice(categoryIndex, 1);
    await writeJSON(CATEGORY_FILE, categories);

    res.status(200).json({ message: 'Categoria excluída com sucesso.' });
};