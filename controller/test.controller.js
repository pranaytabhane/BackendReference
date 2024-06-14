const { messages } = require("../config/constants")
const { Responses } = require("../middleware/responses")

const testFunction = async (req, res) => {
    try {
        Responses._201(res, {
            status: true,
            message: messages.add,
            body: data,
        })
    } catch (error) {
        Responses._500(res, {
            status: false,
            message: error.message,
            body: null,
        })
    }
}

module.exports = {
    testFunction,
}