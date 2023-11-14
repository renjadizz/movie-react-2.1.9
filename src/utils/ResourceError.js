export default class ResourceError extends Error {
  constructor(message) {
    super()
    this.name = 'ResourceError'
    this.message = message
  }
}
