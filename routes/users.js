import express from 'express';
import { updateUser, deleteUser, getUser, subscribe, unsubscribe,applyEdu,reqVerify,updateAcceptReq,updateRejectReq, logoutFun } from '../controller/user.js';
import { tokenChecker } from '../controller/verifyToken.js';

const router = express.Router();

//UPDATE A USER
router.put('/update/:id',tokenChecker, updateUser);

//DELETE A USER
router.delete('/:id', tokenChecker ,deleteUser);

//GET A USER
router.get('/find/:id', getUser);

//SUBSCRIBE A USER
router.put('/sub/:id',tokenChecker, subscribe);

//UNSUBSCRIBE A USER
router.put('/unsub/:id',tokenChecker, unsubscribe);

router.put('/applyEdu',tokenChecker, applyEdu);

router.get('/req', tokenChecker, reqVerify);

router.put('/updateAcceptReq/:id', tokenChecker, updateAcceptReq);

router.put('/updateRejectReq/:id', tokenChecker, updateRejectReq);

router.get('/logout', logoutFun);

export default router;
