const { assert } = require("chai");
const Main = artifacts.require("Main");

/*  1. default information
    2. initialize asset token information
    3. add delegate user using the primeContractorAdmin account
    4. populate metadata
    5. check if assetTokenID already requested modifier
    6. check hasPermissionOfAssetRightToken modifier    */

contract(
    "GBDAM: Production Deliverables and Copyright Management System",
    (accounts) => {
        const corporate_account_admin = accounts[1];
        const corporate_account_subcontractor = accounts[7];
        const corporate_account_delegate = accounts[2];
        const userRandom = accounts[4];
        const userRandomNew = accounts[5];
        const ASSET_RIGHT_TOKEN_ID = 1001;

        let main;
        before(async () => {
            main = await Main.deployed(); //returns deployed instance of sc.
        });
        // -----------------1. Approve asset right token---------------
        describe("Approve asset right token", async () => {
            let response;
            let transactionReceipt;
            let eventResponse;
            before(async () => {
                await main.initAssetRightToken(
                    ASSET_RIGHT_TOKEN_ID,
                    corporate_account_admin,
                    corporate_account_subcontractor,
                    ["Refat", "Ragib"],
                    {
                        from: corporate_account_admin,
                    }
                );
            });
            it("checks prime contractor can approve asset right token", async () => {
                transactionReceipt = await main.approveAssetRightToken(
                    ASSET_RIGHT_TOKEN_ID,
                    "uri",
                    "hash",
                    {
                        from: corporate_account_admin,
                    }
                );
                response = await main.getAssetToken(ASSET_RIGHT_TOKEN_ID);
                assert.equal(response[3], true);
            });
            it("should emit ChangeOfStatus event", async () => {
                eventResponse = await main.getPastEvents("ChangeOfStatus", {
                    fromBlock: 0,
                    toBlock: "latest",
                });
                // console.log(eventResponse);
                assert.equal(eventResponse[0].args[0], corporate_account_admin);
                assert.equal(
                    eventResponse[0].args[1],
                    "Status changed to In Production."
                );
            });
            it("checks isRegistrationAlreadyCompleted modifier", async () => {
                var success = false;
                try {
                    await main.approveAssetRightToken(
                        ASSET_RIGHT_TOKEN_ID,
                        "uri",
                        "hash",
                        {
                            from: corporate_account_admin,
                        }
                    );
                } catch (error) {
                    success = true;
                }
                assert.equal(success, true);
            });
        });
    }
);
