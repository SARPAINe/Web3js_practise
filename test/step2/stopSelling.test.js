const { assert } = require("chai");
const Main = artifacts.require("Main");
const revertReasonDecoder = require("../../helper/revertReasonDecoder");

contract(
    "GDAMS: Production Deliverables and Copyright Management System",
    (accounts) => {
        const CORPORATE_ACCOUNT_ADMIN = accounts[0];
        const CORPORATE_ACCOUNT_SUBCONTRACTOR = accounts[0];
        const BATCH_ADMIN_1 = accounts[8];
        const BATCH_ADMIN_2 = accounts[9];
        const SALES_ADMIN_1 = accounts[3];
        const SALES_ADMIN_2 = accounts[4];
        const SALES_ADMIN_3 = accounts[5];
        const REVENUE_SHARE = 10;
        const ASSET_RIGHT_TOKEN_ID = 1001; // fixed
        const ASSET_RIGHT_TOKEN_ID_NOT_INIT = 1002; // fixed
        const PLANNED_SALE_PRICE = "100";
        const MASTER_TOKEN_ID = 2001;
        const BATCH_ID_1 = "3001";
        const BATCH_ID_2 = "3002";
        const BATCH_ID_3 = "3003";
        const TOKENS_1 = [4001, 4002, 4003, 2001];
        const TOKENS_2 = [4004, 4005, 4006, 2002];
        const SALES_TOKENS_2 = [4004, 4005, 4006];
        const SALES_TOKENS_3 = [4007, 4008, 4009];
        const AMOUNTS = [1, 1, 1, 1];
        const AMOUNTS_REF = [1, 1, 1];
        const SALES_METHOD = 1;
        let main;
        before(async () => {
            main = await Main.deployed(); //returns deployed instance of sc.
        });

        // -----------------Stop Sale Test---------------
        // // ----------------- modifier tests-------------------------------------

        describe("Modifier tests", async () => {
            before(async () => {
                await main.initAssetRightToken(
                    ASSET_RIGHT_TOKEN_ID,
                    CORPORATE_ACCOUNT_ADMIN,
                    CORPORATE_ACCOUNT_SUBCONTRACTOR,
                    ["Refat", "Ragib"],
                    {
                        from: CORPORATE_ACCOUNT_ADMIN,
                    }
                );

                await main.approveAssetRightToken(
                    ASSET_RIGHT_TOKEN_ID,
                    "URI of Asset Token",
                    "Hash of Asset Token",
                    { from: CORPORATE_ACCOUNT_ADMIN }
                );

                await main.productInfoReg(
                    [
                        ASSET_RIGHT_TOKEN_ID,
                        BATCH_ID_1,
                        CORPORATE_ACCOUNT_ADMIN,
                        REVENUE_SHARE,
                        PLANNED_SALE_PRICE,
                        SALES_METHOD,
                        "masterTokenURI",
                    ],
                    TOKENS_1,
                    [SALES_ADMIN_1, SALES_ADMIN_2, SALES_ADMIN_3],
                    { from: CORPORATE_ACCOUNT_ADMIN }
                );
            });

            it("Should revert with the message The Sales Token is not avaliable for secondary sale when no initial sale is done", async () => {
                try {
                    await main.stopSale(4001, {
                        from: CORPORATE_ACCOUNT_ADMIN,
                    });
                } catch (error) {
                    // console.log(error);
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "The Sales Token is not available for secondary sale.",
                    "revert reason should be - The Sales Token is not avaliable for secondary sale."
                );
            });

            it("Should revert with the message The Sales Token is not avaliable for secondary sale when initial sale is done", async () => {
                try {
                    await main.initialPurchase(4001, accounts[1], "120", {
                        from: SALES_ADMIN_1,
                    });
                    await main.stopSale(4001, {
                        from: accounts[1],
                    });
                } catch (error) {
                    // console.log(error);
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "The Sales Token is not available for secondary sale.",
                    "revert reason should be - The Sales Token is not avaliable for secondary sale."
                );
            });

            it("Should enable stop selling when secondary registration is done", async () => {
                await main.salesInfoReg(4001, "first-registration", 0, "130", {
                    from: accounts[1],
                });
                await main.stopSale(4001, {
                    from: accounts[1],
                });
                var isSalesStopped = await main.getSalesTokenIsStoppedSelling(
                    4001
                );
                assert.equal(isSalesStopped, true);
            });

            it("Should remove latest batchID when selling is stopped", async () => {
                let batchID = await main.getBatchIDOfSalesToken(4001, {
                    from: accounts[1],
                });
                let salesToken = await main.getSalesToken(4001);
                console.log(salesToken);
                let latestSalesInfoOfSalesToken =
                    await main.getLatestSalesInfoOfSalesToken(4001);
                console.log(latestSalesInfoOfSalesToken);
                assert.equal(batchID, BATCH_ID_1);
            });

            it("Should revert with message - Sales token is already removed!", async () => {
                await main.salesInfoReg(4001, "first-registration", 0, "130", {
                    from: accounts[1],
                });
                await main.secondaryPurchase(4001, accounts[2], "140", {
                    from: SALES_ADMIN_1,
                });
                await main.salesInfoReg(4001, "second-registration", 1, "150", {
                    from: accounts[2],
                });
                let batchID = await main.getBatchIDOfSalesToken(4001, {
                    from: accounts[1],
                });
                console.log(batchID);
                await main.stopSale(4001, {
                    from: accounts[2],
                });
                try {
                    await main.stopSale(4001, {
                        from: accounts[2],
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                console.log(reason);
                assert.equal(reason, "Sales token is already removed!");
            });

            it("Should revert with the message- You have not put this item for sale yet!!", async () => {
                await main.salesInfoReg(4001, "second-registration", 0, "150", {
                    from: accounts[2],
                });
                await main.secondaryPurchase(4001, accounts[3], "160", {
                    from: SALES_ADMIN_1,
                });
                try {
                    await main.stopSale(4001, {
                        from: accounts[3],
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                console.log(reason);
                assert.equal(
                    reason,
                    "You have not put this item for sale yet!!"
                );
            });
            it("Should enable start selling when sales is stopped", async () => {
                try {
                    await main.salesInfoReg(
                        4001,
                        "second-registration",
                        1,
                        "170",
                        {
                            from: accounts[3],
                        }
                    );
                    var isSalesStopped =
                        await main.getSalesTokenIsStoppedSelling(4001);
                    batchIDs = await main.getBatchIDsOfSalesToken(4001);
                    console.log(batchIDs);
                    assert.equal(isSalesStopped, false);
                } catch (err) {
                    console.log(err);
                }
            });
        });
    }
);
