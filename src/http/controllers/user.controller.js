const { asyncHandler } = require('../utils/async-handler');
const { Router } = require('express');
const { inject } = require('awilix-express');
const { authenticated } = require('../middlewares/authenticated');

const UserController = {

  get router() {
    const router = Router();
    router.post('/signup', inject(this.signup));
    router.post('/login', inject(this.login));
    router.post('/refresh', inject(this.refresh));
    router.post('/logout', inject(this.logout));
    router.get('/me', inject(authenticated), inject(this.me));
    return router;
  },

  /**
   * @swagger
   * /api/user/signup:
   *   post:
   *     name: Signup
   *     summary: Signup new user
   *     tags:
   *       - Users
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
   *                 format: password
   *               email:
   *                 type: string
   *     responses:
   *       201:
   *         description: User created
   *       400:
   *         description: Invalid parameter
   *         schema:
   *           type: object
   *           properties:
   *             reason:
   *               type: string 
   *               examples:
   *                 - username must be at least 6 characters long
   *                 - password must be at least 6 characters long
   *                 - invalid email
   */
  signup({ userService }) {
    return asyncHandler(async (req, res, next) => {
      await userService.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      res.status(201).send();
    });
  },

  /**
   * @swagger
   * /api/user/login:
   *   post:
   *     name: Login
   *     summary: Login user
   *     tags:
   *       - Users
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
   *                 format: password
   *     responses:
   *       204:
   *         description: User logged in
   *       400:
   *         description: Invalid parameter
   *         schema:
   *           type: object
   *           properties:
   *             reason:
   *               type: string
   *               examples:
   *                 - username must be at least 6 characters long
   *                 - password must be at least 6 characters long
   */
  login({ userService }) {
    return asyncHandler(async (req, res, next) => {
      const [accessToken, refreshToken] = await userService.authenticate(
        req.body.username,
        req.body.password
      );
      res.cookie('Authorization', accessToken);
      res.cookie('Refresh', refreshToken, { httpOnly: true });
      res.status(204).send();
    });
  },

  /**
   * @swagger
   * /api/user/refresh:
   *   post:
   *     name: Refresh
   *     summary: Refresh access token
   *     tags:
   *       - Users
   *     responses:
   *       204:
   *         description: User re-authenticated
   *       400:
   *         description: Token expired
   *         schema:
   *           type: object
   *           properties:
   *             reason:
   *               type: string
   *               example: token expired
   */
  refresh({ userService }) {
    return asyncHandler(async (req, res, next) => {
      const token = req.cookies.Refresh;
      const [accessToken, refreshToken] = await userService.refreshAuthentication(token);
      res.cookie('Authorization', accessToken);
      res.cookie('Refresh', refreshToken, { httpOnly: true });
      res.status(204).send();
    });
  },

  /**
   * @swagger
   * /api/user/logout:
   *   post:
   *     name: Logout
   *     summary: Logout user
   *     tags:
   *       - Users
   *     responses:
   *       204:
   *         description: User logged out
   */
  logout({ }) {
    return asyncHandler(async (req, res, next) => {
     res.clearCookie('Authorization');
      res.clearCookie('Refresh');
      res.status(204).send();
    });
  },

  /**
   * @swagger
   * /api/user/me:
   *   get:
   *     name: Me
   *     summary: Information about authenticated user
   *     tags:
   *       - Users
   *     produces:
   *       - application/json
   *     security:
   *       - login: []
   *     responses:
   *       200:
   *         description: User information
   *         schema:
   *           type: object
   *           properties:
   *             id:
   *               type: string
   *             username:
   *               type: string
   *             email:
   *               type: string
   *       400:
   *         description: Token expired
   *         schema:
   *           type: object
   *           properties:
   *             reason:
   *               type: string
   *               value: token expired
   */
  me({ userService }) {
    return asyncHandler(async (req, res, next) => {
      const user = await userService.about(req.userId);
      res.status(200).json(user);
    });
  }
}

module.exports = UserController;
