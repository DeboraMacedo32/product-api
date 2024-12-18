const express = require('express');
const categoriesController = require('../controllers/categoriesController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Operações relacionadas a categorias
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Lista as categorias com paginação
 *     tags: [Categorias]
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
 *         description: Lista de categorias
 *       400:
 *         description: Parâmetros inválidos
 */
router.get('/', categoriesController.listCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Retorna uma categoria pelo ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria
 *     responses:
 *       200:
 *         description: Dados da categoria
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', categoriesController.getCategory);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categorias]
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
 *     responses:
 *       201:
 *         description: Categoria criada
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, categoriesController.createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       404:
 *         description: Categoria não encontrada
 */
router.put('/:id', authMiddleware, categoriesController.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Exclui uma categoria pelo ID
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria excluída
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/:id', authMiddleware, categoriesController.deleteCategory);

module.exports = router;