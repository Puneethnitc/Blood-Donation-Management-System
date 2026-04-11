-- BDMS v2 schema migration
-- Apply on database: bdms
-- Run this script in a controlled maintenance window.

ALTER TABLE Blood_Request_from_hospital
MODIFY request_id CHAR(36) NOT NULL;

ALTER TABLE Requests_sent_to_BloodBanks
MODIFY request_id CHAR(36) NOT NULL;

ALTER TABLE Blood_Issued_to_Hospital
MODIFY issued_id CHAR(36) NOT NULL;

ALTER TABLE Blood_Stock
DROP COLUMN IF EXISTS collection_dt;

ALTER TABLE Blood_Stock
ADD COLUMN IF NOT EXISTS donation_id INT;

ALTER TABLE Blood_Stock
ADD FOREIGN KEY (donation_id) REFERENCES Donation(donation_id) ON DELETE RESTRICT;

-- No database notification tables are used in final implementation.
