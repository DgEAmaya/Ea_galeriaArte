exports.login = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error en el servidor');
    }

    if (results.length > 0) {
      req.session.user = results[0];
      return res.redirect('/admin/dashboard');
    } else {
      return res.render('admin/login', { error: 'Credenciales incorrectas' });
    }
  });
};
