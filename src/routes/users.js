import { Router as router } from 'express';

/* GET users listing. */
router().get('/', (req, res) => res.json({ message: 'hooray! welcome to our api!' }));

export default router;
