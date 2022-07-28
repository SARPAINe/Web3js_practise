const axios = require("axios");

const revertReasonDecoder = async (revertReason) => {
    try {
        const response = await axios.get(
            "http://10.15.15.134:8085/api/decodeRevertReason",
            {
                params: {
                    error: revertReason,
                },
            }
        );
        return response.data.data;
    } catch (error) {
        return error;
    }
};
module.exports = revertReasonDecoder;
