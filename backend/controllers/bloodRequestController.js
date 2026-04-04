const BloodRequest = require("../models/bloodRequestModel");


// SEARCH BANKS
exports.searchBanks = async (req, res) => {

    try {

        const { hospital_id, blood_grp, units_required } = req.body;

        const location = await BloodRequest.getHospitalLocation(hospital_id);

        if (!location.length) {
            return res.status(404).json({ message: "Hospital location not found" });
        }

        const { latitude, longitude } = location[0];

        const banks = await BloodRequest.searchBanks(
            latitude,
            longitude,
            blood_grp,
            units_required
        );

        res.json(banks);

    } catch (error) {

        res.status(500).json({
            message: "Search error",
            error: error.message
        });

    }
};



// SEND REQUEST
exports.sendRequest = async (req, res) => {

    try {

        const { hospital_id, blood_grp, units_required, priority, selected_banks } = req.body;

        // Step 1: create hospital request
        const result = await BloodRequest.createRequest(
            hospital_id,
            blood_grp,
            units_required,
            priority || 1
        );

        const request_id = result.insertId;

        // Step 2: send request to selected banks
        if (selected_banks && selected_banks.length > 0) {

            for (const bank_id of selected_banks) {

                await BloodRequest.sendRequestToBank(request_id, bank_id);

            }

        }

        res.json({
            message: "Request sent successfully",
            request_id: request_id
        });

    } catch (error) {

        res.status(500).json({
            message: "Send request failed",
            error: error.message
        });

    }
};


// GET HOSPITAL REQUESTS
exports.getHospitalRequests = async (req, res) => {

    try {

        const { hospital_id } = req.params;

        const requests = await BloodRequest.getHospitalRequests(hospital_id);

        res.json(requests);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching requests",
            error: error.message
        });

    }
};



// CANCEL REQUEST
exports.cancelRequest = async (req, res) => {

    try {

        const { request_id } = req.params;

        await BloodRequest.cancelRequest(request_id);

        res.json({
            message: "Request cancelled successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Cancel failed",
            error: error.message
        });

    }
};



// BANK SIDE REQUESTS
exports.getIncomingRequests = async (req, res) => {

    try {

        const { bank_id } = req.params;

        const requests = await BloodRequest.getIncomingRequests(bank_id);

        res.json(requests);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching requests",
            error: error.message
        });

    }
};