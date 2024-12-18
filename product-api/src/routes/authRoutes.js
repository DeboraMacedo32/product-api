const express = require('express');
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const authController = require("../controllers/authController");

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Autenticação e usuários
 *   description: Operações relacionadas a usuários
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do usuário
 *         username:
 *           type: string
 *           description: Nome do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 *         isAdmin:
 *           type: boolean
 *           description: É administrador?
 *       example:
 *         id: 1
 *         username: "admin"
 *         password: "123456"
 *         isAdmin: true
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gerenciamento de autenticação e usuários
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Usuário já existe
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Faz o login de um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "admin"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Token JWT gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de autenticação JWT
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/admin/create:
 *   post:
 *     summary: Cria um novo administrador (apenas para administradores)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "novoAdmin"
 *               password: "senha123"
 *     responses:
 *       201:
 *         description: Administrador criado com sucesso
 *       400:
 *         description: Usuário já existe
 *       403:
 *         description: Acesso negado
 */
router.post('/admin/create', authMiddleware, roleMiddleware, authController.createAdmin);

/**
 * @swagger
 * /auth/admin/delete/{id}:
 *   delete:
 *     summary: Exclui um usuário não administrador (apenas para administradores)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário a ser excluído
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       403:
 *         description: Não é permitido excluir administradores
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/admin/delete/:id', authMiddleware, roleMiddleware, authController.deleteUser);

/**
 * @swagger
 * /auth/user/update/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "novoUsuario"
 *               password: "novaSenha"
 *     responses:
 *       200:
 *         description: Dados do usuário atualizados com sucesso
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/user/update/:id', authMiddleware, authController.updateUser);

module.exports = router;