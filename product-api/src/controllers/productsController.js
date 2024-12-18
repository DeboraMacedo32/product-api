const { readJSON, writeJSON } = require('../utils/jsonhandler');

const PRODUCT_FILE = './data/products.json';
const CATEGORY_FILE = './data/categories.json';

exports.listProducts = async (req, res) => {
    const { limit = 5, page = 1 } = req.query;

    if (![5, 10, 30].includes(Number(limit))) {
        return res.status(400).json({ error: 'O limite deve ser 5, 10 ou 30.' });
    }

    const products = await readJSON(PRODUCT_FILE);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + Number(limit));

    res.status(200).json({ data: paginatedProducts });
};

exports.getProduct = async (req, res) => {
    const { id } = req.params;
    const products = await readJSON(PRODUCT_FILE);
    const product = products.find(prod => prod.id === parseInt(id));

    if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    res.status(200).json({ data: product });
};

exports.createProduct = async (req, res) => {
    const { name, description, price, categoryId } = req.body;

    if (!name || !description || !price || !categoryId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const categories = await readJSON(CATEGORY_FILE);
    const categoryExists = categories.some(cat => cat.id === parseInt(categoryId));

    if (!categoryExists) {
        return res.status(400).json({ error: 'Categoria inválida.' });
    }

    const products = await readJSON(PRODUCT_FILE);
    const newProduct = { id: Date.now(), name, description, price: parseFloat(price), categoryId: parseInt(categoryId) };
    products.push(newProduct);

    await writeJSON(PRODUCT_FILE, products);
    res.status(201).json({ message: 'Produto criado com sucesso.', data: newProduct });
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, categoryId } = req.body;

    const products = await readJSON(PRODUCT_FILE);
    const productIndex = products.findIndex(prod => prod.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    if (categoryId) {
        const categories = await readJSON(CATEGORY_FILE);
        const categoryExists = categories.some(cat => cat.id === parseInt(categoryId));

        if (!categoryExists) {
            return res.status(400).json({ error: 'Categoria inválida.' });
        }
        products[productIndex].categoryId = parseInt(categoryId);
    }

    if (name) products[productIndex].name = name;
    if (description) products[productIndex].description = description;
    if (price) products[productIndex].price = parseFloat(price);

    await writeJSON(PRODUCT_FILE, products);
    res.status(200).json({ message: 'Produto atualizado com sucesso.', data: products[productIndex] });
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    const products = await readJSON(PRODUCT_FILE);
    const productIndex = products.findIndex(prod => prod.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    products.splice(productIndex, 1);
    await writeJSON(PRODUCT_FILE, products);

    res.status(200).json({ message: 'Produto excluído com sucesso.' });
};