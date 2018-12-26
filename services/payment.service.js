// import { logger, handleServerError } from '../utils/helperMethods';
import PaymentDetail from '../models/paymentDetail'
import { isAdmin } from '../utils/helperMethods'

import { handleServerResponse } from './error.service'

export default {
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} res
   */
  async updatePaymentInfo (req, res) {
    const { userId } = req.params
    if (userId !== req.decoded.id) {
      let admin = isAdmin(req.decoded.id)
      if (!admin) {
        return handleServerResponse(res, 401, {
          success: true,
          message: "you can't update payment info that is not yours"
        })
      }
    }
    const {
      fullname, paymentMethod, paymentInfo
    } = req.body
    let paymentData = await PaymentDetail.findOne({ owner: userId }).exec()
    if (!paymentData) {
      paymentData = new PaymentDetail({
        fullname, paymentMethod, paymentInfo
      })
    } else {
      paymentData = new PaymentDetail({
        fullname, paymentMethod, paymentInfo
      })
    }
    let updatedInfo = await paymentData.save()

    return res.send({
      success: true,
      paymentData: updatedInfo
    })
  }
}
