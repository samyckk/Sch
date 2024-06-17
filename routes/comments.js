import express from 'express';
import { tokenChecker } from '../controller/verifyToken.js';
import { addComment, getComments } from '../controller/comment.js';


const router = express.Router();

router.post('/addComment/:id', tokenChecker, addComment);
router.get('/:id', getComments);


export default router;