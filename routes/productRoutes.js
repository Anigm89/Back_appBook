const express = require("express");
const router = express.Router();
const BookController = require('../controllers/productController');
const verifyUser = require('../middleware/authMiddleware');

router.get('/', BookController.ShowBooks);
router.get('/id/:id', BookController.getById);
router.get('/generos', BookController.getGenero);
router.get('/genero/:genero', BookController.getLibrosGenero);
router.get('/titulo/:titulo', BookController.getTitle);
router.get('/autor/:autor', BookController.getAutor);
router.get('/keywords/:keywords', BookController.getKeywords);
router.get('/relacionados/:genero/:autor/:keywords', BookController.getRelacionados)
router.post('/create',verifyUser, BookController.create);
router.put('/edit/:id', verifyUser, BookController.updateBook);
router.delete('/delete/:id', verifyUser, BookController.deleteBook);

router.post('/createUser', BookController.createUser);
router.post('/leidos/',verifyUser, BookController.leidos);
router.post('/pendientes', verifyUser, BookController.pendientes);
router.get('/leidos/:uid', BookController.getLeidos);
router.get('/pendientes/:uid', BookController.getPendientes);
router.delete('/deletePendiente/:id_libro/:uid', verifyUser, BookController.deletePendiente)
router.delete('/deleteLeido/:id_libro/:uid', verifyUser, BookController.deleteLeido)

router.get('/valorado/:id_libro/:uid', BookController.getValorado);
router.post('/valorados', verifyUser, BookController.valorados);

module.exports = router;