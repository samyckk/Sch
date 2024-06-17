import express from 'express';
import { tokenChecker } from '../controller/verifyToken.js';
import { addVideo, random, subVids, trending, getByTag,search,fetchVideo, like, dislike,likeVids,yourVid,deleteVid, addView } from '../controller/video.js';

const router = express.Router();


router.post('/addVid',tokenChecker,addVideo);
router.get('/fetch/:id',fetchVideo);
router.put('/addView/:id',addView);


router.delete('/:id',tokenChecker,deleteVid);
router.get('/trending',trending );
router.get('/random',random);
router.get('/subVids',tokenChecker, subVids );
router.get('/likeVideos',tokenChecker, likeVids );
router.get('/yourVids',tokenChecker, yourVid );
router.get('/tags', getByTag);
router.get('/search', search);
router.put('/like/:id',tokenChecker, like);
router.put('/dislike/:id',tokenChecker, dislike);

export default router;