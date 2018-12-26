import express from 'express'
import PaymentService from '../services/payment.service'
import { hasToken } from '../utils/helperMethods'
// import validateInput from '../utils/validateInput'
// make sure you validate input

const { updatePaymentInfo } = PaymentService

const router = express.Router()

router.post('/update/:userId', hasToken, updatePaymentInfo)
