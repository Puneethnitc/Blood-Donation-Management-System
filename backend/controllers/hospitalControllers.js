const {
    getHospitalLocation,
    searchBanks,
    createRequest,
    sendRequestToBank,
    getHospitalRequests,
    cancelRequest,
    getIncomingRequests
} = require("../models/hospitalModels");


// SEARCH BANKS
const searchBanksRoute = async (req, res) => {
  try {
    const hospital_id = req.user.user_id;

    const { blood_grp, units_required } = req.query;

    const location = await BloodRequest.getHospitalLocation(hospital_id);

    if (!location.length) {
      return res.status(404).json({
        message: "Hospital location not found",
        success: false
      });
    }

    const { latitude, longitude } = location[0];

    const banks = await BloodRequest.searchBanks(
      latitude,
      longitude,
      blood_grp,
      units_required
    );

    return res.status(200).json({
      banks,
      success: true
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};


// SEND REQUEST
const sendRequestRoute = async (req, res) => {
    try {

        const { hospital_id, blood_grp, units_required, priority, selected_banks } = req.body;

        const result = await BloodRequest.createRequest(
            hospital_id,
            blood_grp,
            units_required,
            priority || 1
        );

        const request_id = result.insertId;

        // send request to selected banks
        if (selected_banks && selected_banks.length) {

            for (const bank_id of selected_banks) {
                await BloodRequest.sendRequestToBank(request_id, bank_id);
            }

        }

        return res.status(200).json({
            message: "Request sent successfully",
            request_id,
            success: true
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};



// GET HOSPITAL REQUESTS
// controllers/hospitalControllers.js

const getHospitalRequestsRoute = async (req, res) => {
  try {
    const hospital_id = req.user.user_id;

    const rows = await getHospitalRequests(hospital_id);

    const grouped = {};

    for (let row of rows) {
      if (!grouped[row.request_id]) {
        grouped[row.request_id] = {
          request_id: row.request_id,
          blood_grp: row.blood_grp,
          units_required: row.units_required,
          final_status: row.final_status,
          requested_date: row.requested_date,
          banks: []
        };
      }

      grouped[row.request_id].banks.push({
        bank_id: row.bank_id,
        bank_name: row.bank_name,
        status: row.request_status
      });
    }

    return res.json(Object.values(grouped));

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getHospitalRequestsRoute
};

// CANCEL REQUEST
const cancelRequestRoute = async (req, res) => {
    try {

        const { request_id } = req.params;

        await BloodRequest.cancelRequest(request_id);

        return res.status(200).json({
            message: "Request cancelled successfully",
            success: true
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};



// BANK INCOMING REQUESTS
const incomingRequestsRoute = async (req, res) => {
    try {

        const { bank_id } = req.params;

        const requests = await BloodRequest.getIncomingRequests(bank_id);

        return res.status(200).json({
            message: "Incoming requests fetched",
            requests,
            success: true
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};


module.exports = {
    searchBanksRoute,
    sendRequestRoute,
    getHospitalRequestsRoute,
    cancelRequestRoute,
    incomingRequestsRoute
};