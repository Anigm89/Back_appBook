const pool = require('../config/config');

const BookController = {
    async ShowBooks (req, res) {
        try{
            const [books] = await pool.query('SELECT * FROM libros');
            res.json(books)
        }
        catch(error){
            res.status(500).json({ message: "Error al mostrar los libros" });

        }
    },
    async getById(req, res) {
        try {
            const id = req.params.id;
            const [bookId] = await pool.query(`SELECT * FROM libros where id = ${id}`);
            res.json(bookId[0])
        } catch (error) {
            res.status(500).json({ message: "Error al mostrar el libro" });

        }
    },
    async getAutor(req, res){
        try {
            const autor = req.params.autor;
            const [books] = await pool.query(`SELECT * FROM libros WHERE autor like '%${autor}%'`);
            res.json([books])
        } catch (error) {
            res.status(500).json({ message: "Error al mostrar los libros del autor" });
        }
    },
    async getGenero(req, res){
        try {
            const [books] = await pool.query(`SELECT genero FROM libros`);
            res.json([books])
        } catch (error) {
            res.status(500).json({ message: "Error al buscar los géneros" });
        }
    },
    async getLibrosGenero(req, res){
        try {
            const genero = req.params.genero;
            const queryGenero = `SELECT * FROM libros WHERE genero like '%${genero}%' GROUP BY id`
            const [books] = await pool.query(queryGenero);
            res.json([books])
        } catch (error) {
            res.status(500).json({ message: "Error al mostrar los libros por género" });
        }
    },
    async getTitle(req, res) {
        try {
            const title = req.params.titulo;
            const [titles] = await pool.query(`SELECT * FROM libros WHERE titulo like '%${title}%' OR subtitulo like '%${title}%'`);
            res.json([titles])
        } catch (error) {
            res.status(500).json({ message: "Error al buscar libros por titulo" });
        }
    },  
    async getKeywords(req, res) {
        try {
            const keyword = req.params.keywords;
            const [keywords] = await pool.query(`SELECT * FROM libros WHERE keywords like '%${keyword}%'`);
            res.json([keywords])
        } catch (error) {
            res.status(500).json({ message: "Error al buscar libros por palabras clave" });
        }
    },    
    async getRelacionados(req, res){
        try {
            const { genero, autor, keywords } = req.params;

            const searchQuery = `SELECT * FROM libros WHERE genero LIKE '%${genero}%' or autor LIKE '%${autor}%' or keywords like '%${keywords}%' LIMIT 5`
            const relacionados = await pool.query(searchQuery);
            res.json(relacionados);            
        } catch (error) {
            res.status(500).json({ message: "Error al buscar libros relacionados" });
        }
    },    
    async create (req, res){
        try{
            const {titulo, subtitulo, autor, sinopsis, imagen, paginas, genero, keywords} = req.body;
            const insertQuery = `INSERT INTO libros (titulo, subtitulo, autor, sinopsis, imagen, paginas, genero, keywords) 
                                VALUES ("${titulo}","${subtitulo}","${autor}","${sinopsis}","${imagen}","${paginas}","${genero}","${keywords}")`;
            const newBook = await pool.query(insertQuery)
            res.status(201).send(newBook)
        }
        catch(error){
            res.status(500).json({ message: "Error creating book" });
            console.log(error)
        }
    },
   
    async updateBook (req, res){
        try{
            const id = req.params.id;
            const {titulo, subtitulo, autor, sinopsis, imagen, paginas, genero, keywords} = req.body;
            const updateQuery = `UPDATE libros SET titulo ='${titulo}', subtitulo='${subtitulo}',autor='${autor}',sinopsis='${sinopsis}',imagen='${imagen}',paginas='${paginas}',genero='${genero}',keywords='${keywords}' WHERE id = ${id}`;
            const updateBook = await pool.query(updateQuery)
            if(!updateBook) {
                return res.status(404).json({ mensaje: 'No se ha podido actualizar' })
              } 
            res.status(201).json(updateBook)
        }
        catch(error){
            res.status(500).json({ message: "Error al actualizar" });

        }  
    },
    async deleteBook(req, res){
        try{
            const id = req.params.id;
            const deleteQuery = `DELETE FROM libros WHERE id = ${id} `;
            const deletebook = await pool.query(deleteQuery)
        if(!deletebook){
            return res.status(404).json({ mensaje: "Libro no encontrado" });
        }
        res.status(200).json({ mensaje: "Libro eliminado con éxito: ", deletebook })
        }
        catch(error){
            res.status(500).json({ message: "Error al eliminar el libro" });
        }          
    },
    async createUser (req, res){
        try{
            const {email, uid} = req.body;
            const insertQuery = `INSERT INTO usuarios (email, uid) VALUES ("${email}", "${uid}")`;
            const newUser = await pool.query(insertQuery)
            if (!newUser) {
                res.status(500).send('Error al guardar el email en la base de datos');
            } else {
                res.status(201).send('Email guardado correctamente');
            }
        }
        catch(error){
            res.status(500).json({ message: "Error creating user" });
        }
    },
    async leidos (req, res){
        try{
            const {id_libro, uid} = req.body;
            const insertQuery = `INSERT INTO leidos (id_libro, uid) VALUES ("${id_libro}", "${uid}")`;
            const leido = await pool.query(insertQuery)
            if (!leido) {
                res.status(500).send('Error al guardar el libro como leido en la base de datos');
            } else {
                res.status(201).send('añadido como leido correctamente');
            }
        }
        catch(error){
            res.status(500).json({ message: "Error al marcar como leido" });
        }
    },
    async getLeidos (req, res) {
        try{
            const { uid } = req.params;
            const leidosquery = `SELECT b.*, u.uid, MAX(l.id) AS leido_id, MAX(l.id_libro) AS id_libro, MAX(l.uid) AS leido_uid
            FROM libros b JOIN leidos l ON b.id = l.id_libro JOIN usuarios u ON u.uid = l.uid WHERE u.uid = '${uid}' GROUP BY b.id`;
            const [books] = await pool.query(leidosquery);
            res.json(books)
        }
        catch(error){
            console.log(error)
            res.status(500).json({ message: "Error al actualizar" });
        }
    },
    async pendientes (req, res){
        try{
            const {id_libro, uid} = req.body;
           
                const insertQuery = `INSERT INTO pendientes (id_libro, uid) VALUES ("${id_libro}", "${uid}")`;
                const pendientes = await pool.query(insertQuery);

                if (pendientes) {
                    res.status(201).send('Libro añadido como pendiente correctamente');
                  } else {
                    res.status(500).send('Error al guardar el libro como pendiente en la base de datos');
                  }
        }
        catch(error){
            res.status(500).json({ message: "Error al marcar como pendiente" });
        }
    },

    async getPendientes (req, res) {
        try{
            const { uid } = req.params;
            const pendientesquery = `SELECT b.*, u.uid, p.* FROM libros b, usuarios u, pendientes p WHERE b.id = p.id_libro AND u.uid = p.uid AND u.uid = '${uid}'`;
            const [books] = await pool.query(pendientesquery);
            res.json(books)
        }
        catch(error){
            console.log(error)
        }
    },
    async deletePendiente (req, res){
        try{
            const {id_libro, uid} = req.params;
            const deleteQuery = `DELETE FROM pendientes WHERE id_libro = ${id_libro} AND uid = "${uid}"`;
            await pool.query(deleteQuery);
            res.status(200).json('Libro movido de pendientes a leídos correctamente');
        }
        catch(error){
            console.log(error)
        }
    },
    async deleteLeido (req, res){
        try{
            const {id_libro, uid} = req.params;
            const deleteQuery = `DELETE FROM leidos WHERE id_libro = ${id_libro} AND uid = "${uid}"`;
            await pool.query(deleteQuery);
            res.status(200).json('Libro quitado de leídos correctamente');
        }
        catch(error){
            console.log(error)
        }
    },
    async getValorado (req, res) {
        try{
            const { id_libro, uid } = req.params;
            const valoradoquery = `SELECT b.*, u.uid, v.* FROM libros b, usuarios u, valorados v WHERE b.id = v.id_libro AND v.id_libro = '${id_libro}' AND u.uid = v.uid AND u.uid  = '${uid}' ORDER BY v.id DESC LIMIT 1`;
            const [books] = await pool.query(valoradoquery);
            res.json(books)
        }
        catch(error){
            console.log(error)
        }
    },
    async valorados (req, res){
        try{
            const {id_libro, uid, puntos} = req.body;
            const insertQuery = `INSERT INTO valorados (id_libro, uid, puntos) VALUES ("${id_libro}", "${uid}", "${puntos}")`;
            const valorado = await pool.query(insertQuery)
            if (!valorado) {
                res.status(500).send({mensaje: 'Error al valuar el libro'});
            } else {
                res.status(201).send({mensaje: 'valor añadido correctamente'});
            }
        }
        catch(error){
            res.status(500).json({ message: "Error al puntuar libro", error });
        }
    }
}

module.exports = BookController;
