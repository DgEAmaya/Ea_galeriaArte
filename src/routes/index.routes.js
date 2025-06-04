const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function renderWithLayout(res, view, options = {}) {
  const content = fs.readFileSync(path.join(__dirname, '..', 'views', view + '.ejs'), 'utf8');
  res.render('layout', {
    ...options,
    body: content
  });
}

router.get('/', (req, res) => {
  renderWithLayout(res, 'index', { title: 'Inicio' });
});

router.get('/otra', (req, res) => {
  renderWithLayout(res, 'otraVista', { title: 'Otra Página' });
});

router.get('/login', (req, res) => {
  renderWithLayout(res, '/admin/logout', { title: 'login' });
});

module.exports = router;
