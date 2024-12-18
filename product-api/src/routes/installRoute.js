const express = require('express');
const installController = require('../controllers/installController');

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Install
 *   description: Rotas para configuração inicial do sistema
 */

/**
 * @swagger
 * /install:
 *   get:
 *     summary: Configura a aplicação inicial, criando o usuário administrador padrão
 *     tags: [Install]
 *     responses:
 *       200:
 *         description: Configuração inicial realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensagem de sucesso
 *               example:
 *                 message: "Usuário administrador padrão criado com sucesso"
 *       500:
 *         description: Erro ao realizar a configuração inicial
 */
router.get('/', installController.install);

module.exports = router;