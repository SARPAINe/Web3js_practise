const { assert } = require("chai");
const Main = artifacts.require("Main");
const revertReasonDecoder = require("../../helper/revertReasonDecoder");

contract(
    "GDAMS: Production Deliverables and Copyright Management System",
    (accounts) => {
        const CORPORATE_ACCOUNT_ADMIN = accounts[0];
        const CORPORATE_ACCOUNT_SUBCONTRACTOR = accounts[0];
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

        // -----------------Initial Sale Test---------------

        describe("Initial Sale", async () => {
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

            it("Should enable token owner to register for secondary sales", async () => {
                await main.initialPurchase(4001, accounts[1], "120", {
                    from: SALES_ADMIN_1,
                });

                await main.salesInfoReg(4001, "first-registration", 0, "130", {
                    from: accounts[1],
                });

                let salesInfo = await main.getLatestSalesInfoOfSalesToken(4001);
                // console.log(salesInfo);
                let masterTokenID = salesInfo[0];
                let owner = salesInfo[1];
                let plannedSalesPrice = salesInfo[2];
                let salesMethod = salesInfo[3];
                let registrationDate = salesInfo[4];
                assert.equal(
                    masterTokenID,
                    2001,
                    `Master Token ID should be 2001`
                );

                assert.equal(
                    owner,
                    accounts[1],
                    `Owner should be ${accounts[1]}`
                );

                assert.equal(
                    plannedSalesPrice,
                    "130",
                    `Planned sales price should be 130`
                );

                assert.equal(salesMethod, 0, `Sales Method should be 0`);
            });
        });

        // -----------------Custom Event Test----------------

        describe("Custom Event Test", async () => {
            before(async () => {
                eventResponseSalesTokenBatchInitialized =
                    await main.getPastEvents("SalesTokenBatchInitialized", {
                        fromBlock: 0,
                        toBlock: "latest",
                    });
            });

            it("Should return SalesTokenBatchInitialized event", async () => {
                // console.log(eventResponseSalesTokenBatchInitialized);
                let batchID =
                    eventResponseSalesTokenBatchInitialized[1].args[0];
                let assetRightTokenId =
                    eventResponseSalesTokenBatchInitialized[1].args[1];
                let masterTokenID =
                    eventResponseSalesTokenBatchInitialized[1].args[2];
                let owner = eventResponseSalesTokenBatchInitialized[1].args[3];
                let data = eventResponseSalesTokenBatchInitialized[1].args[4];
                assert.equal(
                    batchID,
                    "first-registration",
                    `Sales id should be first-registration`
                );
                assert.equal(
                    assetRightTokenId,
                    1001,
                    `Asset Right Token ID should be 2001`
                );
                assert.equal(
                    masterTokenID,
                    2001,
                    `Master Token ID should be 2001`
                );

                assert.equal(
                    owner,
                    accounts[1],
                    `Owner should be ${accounts[1]}`
                );

                assert.equal(
                    data,
                    "Sales Information Registered.",
                    `Data should be - Sales Information Registered.`
                );
            });
        });

        // // // ----------------- modifier tests-------------------------------------

        describe("Modifier tests", async () => {
            it("Should revert with the message You are not the owner of this Sales Token.", async () => {
                await main.initialPurchase(4002, accounts[1], "120", {
                    from: SALES_ADMIN_2,
                });
                try {
                    await main.salesInfoReg(
                        4002,
                        "second-registration",
                        0,
                        "130",
                        {
                            from: accounts[0],
                        }
                    );
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "You are not the owner of this Sales Token.",
                    "revert reason should be - You are not the owner of this Sales Token."
                );
            });
        });
    }
);
