/* eslint-disable jsx-a11y/label-has-for */
import bunyan from 'bunyan'

export default {
  /**
   * logger
   * @returns {Object} object containing logger functions
   */
  logger () {
    const log = bunyan.createLogger({ name: 'myapp' })
    return log
  },
  /**
   *
   * @param {*} response response object from server
   * @param {*} error error message
   * @returns {*} error response
   */
  handleServerError (response, error) {
    const log = bunyan.createLogger({ name: 'myapp' })
    log.error(error)
    return response.status(500).send({
      success: false,
      message: 'Internal Server Error'
    })
  },
  /**
     *
     * @param {*} response response object from server
     * @param {*} status error message
     * @param {*} object meta-data
     * @returns {*} error response
     */
  // eslint-disable-next-line max-len
  handleServerResponse (response, status, object) {
    return response.status(status).send(object)
  }
}
