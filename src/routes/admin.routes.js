const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Conexión a MySQL
const logoutController = require('../controllers/admin/logout');

// Middleware para proteger rutas solo para admin
function isAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.redirect('/admin/login');
}

// Redirige /admin al dashboard si ya está logueado
router.get('/', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  res.redirect('/admin/login');
});

// Página de login
router.get('/login', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { title: 'Login Admin', showMenu: false, error: null });
});

// Procesar login consultando la base de datos
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Datos recibidos en login:', username, password);

  try {
    const [rows] = await db.query(
      'SELECT * FROM admins WHERE username = ? AND password = ? LIMIT 1',
      [username, password]
    );

      console.log('Resultado de la consulta:', rows);

    if (rows.length > 0) {
      req.session.isAdmin = true;
      req.session.adminId = rows[0].id; // opcional, guardar el id del admin
      return res.redirect('/admin/dashboard');
    } else {
      res.render('admin/login', { title: 'Login Admin', error: 'Credenciales incorrectas' });
    }
  } catch (err) {
    console.error('Error en el login de admin:', err);
    res.render('admin/login', { title: 'Login Admin', error: 'Error en el servidor' });
  }
});

// Panel de administrador protegido
router.get('/dashboard', isAdmin, (req, res) => {
  res.render('admin/dashboard', { title: 'Panel de Administración' });
});

// Página de gestión de menús
router.get('/menus', isAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu');
    res.render('admin/menus', {
      title: 'Gestión de Menús',
      menus: rows,
      menu: null,
      formAction: '/admin/menus'
    });
  } catch (error) {
    console.error('Error cargando menús:', error);
    res.render('admin/menus', {
      title: 'Error al cargar menús',
      menus: [],
      menu: null,
      formAction: '/admin/menus'
    });
  }
});


// Crear o actualizar menú
router.post('/menus', isAdmin, async (req, res) => {
  const { id, nombre, enlace, padre_id } = req.body;

  try {
    if (id) {
      await db.query('UPDATE menu SET nombre = ?, enlace = ?, padre_id = ? WHERE id = ?', [nombre, enlace, padre_id, id]);
    } else {
      await db.query('INSERT INTO menu (nombre, enlace, padre_id) VALUES (?, ?, ?)', [nombre, enlace, padre_id]);
    }
    res.redirect('/admin/menus');
  } catch (error) {
    console.error('Error guardando menú:', error);
    res.redirect('/admin/menus');
  }
});

// Cargar menú para editar
router.get('/menus/:id', isAdmin, async (req, res) => {
  try {
    const [menus] = await db.query('SELECT * FROM menu');
    const [menuData] = await db.query('SELECT * FROM menu WHERE id = ?', [req.params.id]);

    res.render('admin/menus', {
      title: 'Editar Menú',
      menus,
      menu: menuData[0],
      formAction: '/admin/menus'
    });
  } catch (error) {
    console.error('Error editando menú:', error);
    res.redirect('/admin/menus');
  }
});

// Eliminar menú
router.post('/menus/eliminar/:id', isAdmin, async (req, res) => {
  try {
    await db.query('DELETE FROM menu WHERE id = ?', [req.params.id]);
    res.redirect('/admin/menus');
  } catch (error) {
    console.error('Error eliminando menú:', error);
    res.redirect('/admin/menus');
  }
});



router.get('/logout', logoutController.logout);

// Cerrar sesión
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});



module.exports = router;
