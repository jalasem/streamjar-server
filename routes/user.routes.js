/* eslint-disable jsx-a11y/label-has-for */
import express from 'express'
import UserService from '../services/user.service'
import validateInput from '../utils/validateInput'
import { hasToken, isAdmin, getOffer } from '../utils/helperMethods'

const router = express.Router()
const { signupInput, signInInput } = validateInput
const {
  register, loginUser, loginAdminUser, getOneUser, getAllUsers, updateUser
} = UserService

router.post('/signup', signupInput, register)
router.post('/signin', signInInput, loginUser)
router.post('/admin/signin', signInInput, loginAdminUser)
router.get('/', hasToken, isAdmin, getAllUsers)
router.post('/offers', getOffer)
router.get('/:userId', hasToken, getOneUser)
// router.patch('/forgot-password', forgotPasswordInput, forgotPassword);
// router.put('/forgot-password/:passwordToken', resetPassword);
router.put('/:userId', hasToken, updateUser)
// router.post('/profile-picture', hasToken, uploadProfileImg);

export default router
