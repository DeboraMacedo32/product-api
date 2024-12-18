const express = require('express');
const productsController = require('../controllers/productsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Operações relacionadas a produtos
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista os produtos com paginação
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           enum: [5, 10, 30]
 *         description: Número de itens por página
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página atual
 *     responses:
 *       200:
 *         description: Lista de produtos
 *       400:
 *         description: Parâmetros inválidos
 */
router.get('/', productsController.listProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Dados do produto
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', productsController.getProduct);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Produto criado
 *       400:
 *         description: Dados inválidos ou categoria inexistente
 */
router.post('/', authMiddleware, productsController.createProduct);

module.exports = router;