/**
 * Object containing response functions for different HTTP status codes.
 * @type {object}
 * @property {function} _200 - Sends a 200 status code response with the provided result.
 * @property {function} _201 - Sends a 201 status code response with the provided result.
 * @property {function} _400 - Sends a 400 status code response with the provided result.
 * @property {function} _403 - Sends a 403 status code response with the provided result.
 * @property {function} _404 - Sends a 404 status code response with the provided result.
 * @property {function} _500 - Sends a 500 status code response with the provided result.
 */
export const Responses = {
    _200: function (res, result) {
        return res.status(200).json(result);
    },
    _201: function (res, result) {
        return res.status(201).json(result);
    },
    _400: function (res, result) {
        return res.status(400).json(result);
    },
    _401: function (res, result) {
        return res.status(401).json(result);
    },
    _403: function (res, result) {
        return res.status(403).json(result);
    },
    _404: function (res, result) {
        return res.status(404).json(result);
    },
    _500: function (res, result) {
        return res.status(500).json(result);
    }
}