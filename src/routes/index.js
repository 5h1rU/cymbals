import { Router as router } from 'express';

/* GET home page. */
router().get('/', (req, res) => res.render('index', { title: 'Express' }));

export default router;
