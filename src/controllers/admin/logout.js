// src/controllers/admin/logout.js

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).send('Error al cerrar sesión');
    }

    res.clearCookie('connect.sid'); // borra la cookie de sesión
    return res.redirect('/admin/login');
  });
};
