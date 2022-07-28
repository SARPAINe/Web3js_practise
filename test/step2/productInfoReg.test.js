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

        // -----------------Product Information Registration Test---------------

        describe("Product Information Registration", async () => {
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
            });

            it("Should register product information", async () => {
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

                masterTokenInfo = await main.getMasterToken(MASTER_TOKEN_ID);
                assetRightTokenId = masterTokenInfo[0];
                masterTokenOwner = masterTokenInfo[1];

                assert.equal(
                    assetRightTokenId,
                    ASSET_RIGHT_TOKEN_ID,
                    "Asset Right Token ID should be 1001"
                );

                assert.equal(
                    masterTokenOwner,
                    CORPORATE_ACCOUNT_ADMIN,
                    `Master Token Owner should be ${accounts[0]}`
                );
            });
        });

        // -----------------Product Information Reference Registration Test---------------

        describe("Product Information Reference Registration", async () => {
            it("Should reference product information", async () => {
                await main.productInfoRefReg(
                    [
                        MASTER_TOKEN_ID,
                        BATCH_ID_2,
                        CORPORATE_ACCOUNT_ADMIN,
                        PLANNED_SALE_PRICE,
                        SALES_METHOD,
                    ],
                    SALES_TOKENS_2,
                    [SALES_ADMIN_1, SALES_ADMIN_2, SALES_ADMIN_3],
                    { from: CORPORATE_ACCOUNT_ADMIN }
                );

                assetRightTokenId =
                    await main.getAssetRightTokenIDOfSalesTokenBatch(
                        BATCH_ID_2
                    );
                masterTokenID = await main.getMasterTokenIDOfSalesTokenBatch(
                    BATCH_ID_2
                );
                salesTokenBatchOwner = await main.getOwnerOfSalesTokenBatch(
                    BATCH_ID_2
                );

                assert.equal(
                    assetRightTokenId,
                    ASSET_RIGHT_TOKEN_ID,
                    "Asset Right Token ID should be 1001"
                );

                assert.equal(
                    masterTokenID,
                    MASTER_TOKEN_ID,
                    "Master Token ID should be 2001"
                );

                assert.equal(
                    salesTokenBatchOwner,
                    CORPORATE_ACCOUNT_ADMIN,
                    `Master Token Owner should be ${CORPORATE_ACCOUNT_ADMIN}`
                );
            });

            it("checks reference registration increases batch counter", async () => {
                batchCounter = await main.getBatchCounterOfMasterToken(
                    MASTER_TOKEN_ID
                );
                assert.equal(
                    batchCounter,
                    2,
                    "Number of batches for this master token should be 2!"
                );
            });
        });

        // ----------------- modifier tests-------------------------------------

        describe("Modifier tests", async () => {
            it("Should revert Asset Right token not registered", async () => {
                try {
                    await main.productInfoReg(
                        [
                            ASSET_RIGHT_TOKEN_ID_NOT_INIT,
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
                } catch (error) {
                    // console.log(error);
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                    // console.log(reason);
                }
                assert.equal(
                    reason,
                    "Asset Token is not registered!",
                    "asset right token should not be registered"
                );
            });

            // it("Should revert when revenue Share is not in Range", async () => {
            //     try {
            //         await main.productInfoReg(
            //             [
            //                 ASSET_RIGHT_TOKEN_ID,
            //                 MASTER_TOKEN_ID,
            //                 BATCH_ID_3,
            //                 CORPORATE_ACCOUNT_ADMIN,
            //                 BATCH_ADMIN_1,
            //                 REVENUE_SHARE + 100,
            //                 PLANNED_SALE_PRICE,
            //                 SALES_METHOD,
            //                 "masterTokenURI",
            //             ],
            //             SALES_TOKENS_1,
            //             [SALES_ADMIN_1, SALES_ADMIN_2, SALES_ADMIN_3],
            //             ["salesTokenURI1", "salesTokenURI2", "salesTokenURI3"],
            //             { from: CORPORATE_ACCOUNT_ADMIN }
            //         );
            //     } catch (error) {
            //         reason = await revertReasonDecoder(
            //             error.receipt.revertReason
            //         );
            //     }
            //     assert.equal(
            //         reason,
            //         "Revenue share should be 0 to 100 (inclusive)",
            //         "Revenue Share is not in range"
            //     );
            // });

            it("Should revert if Master Token ID is not unique", async () => {
                try {
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
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "The Master Token is already registered under this ID!",
                    "The Master Token is already registered under this ID!"
                );
            });

            it("Should revert if Sales Token Batch ID is already used", async () => {
                try {
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
                        TOKENS_2,
                        [SALES_ADMIN_1, SALES_ADMIN_2, SALES_ADMIN_3],
                        { from: CORPORATE_ACCOUNT_ADMIN }
                    );
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "A Sales Token Batch is already registered under this ID",
                    "A Sales Token Batch is already registered under this ID"
                );
            });

            it("Should revert if Sales Tokens count and sales admin count mismatch", async () => {
                try {
                    await main.productInfoReg(
                        [
                            ASSET_RIGHT_TOKEN_ID,
                            BATCH_ID_3,
                            CORPORATE_ACCOUNT_ADMIN,
                            REVENUE_SHARE,
                            PLANNED_SALE_PRICE,
                            SALES_METHOD,
                            "masterTokenURI",
                        ],
                        TOKENS_2,
                        [SALES_ADMIN_1, SALES_ADMIN_2],
                        { from: CORPORATE_ACCOUNT_ADMIN }
                    );
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "Number of Sales Token is not equal to allowed number of admins!",
                    "Number of Sales Token is not equal to allowed number of admins!"
                );
            });
        });

        // ------------------ custom event test ---------------------------

        describe("Custom Event Test", async () => {
            before(async () => {
                eventResponseMasterTokenInitialized = await main.getPastEvents(
                    "MasterTokenInitialized",
                    {
                        fromBlock: 0,
                        toBlock: "latest",
                    }
                );
                eventResponseSalesTokenBatchInitialized = eventResponse =
                    await main.getPastEvents("SalesTokenBatchInitialized", {
                        fromBlock: 0,
                        toBlock: "latest",
                    });
                eventResponseTokensGenerated = eventResponse =
                    await main.getPastEvents("TokensGenerated", {
                        fromBlock: 0,
                        toBlock: "latest",
                    });
            });

            it("Should return MasterTokenInitialized event", async () => {
                console.log(eventResponseMasterTokenInitialized);
                assetRightTokenId =
                    eventResponseMasterTokenInitialized[0].args[0];
                masterTokenID = eventResponseMasterTokenInitialized[0].args[1];
                masterTokenOwner =
                    eventResponseMasterTokenInitialized[0].args[2];
                data = eventResponseMasterTokenInitialized[0].args[3];

                assert.equal(
                    assetRightTokenId,
                    ASSET_RIGHT_TOKEN_ID,
                    "Asset Right Token ID should be 1001"
                );

                assert.equal(
                    masterTokenID,
                    MASTER_TOKEN_ID,
                    "Master Token ID should be 2001"
                );

                assert.equal(
                    masterTokenOwner,
                    CORPORATE_ACCOUNT_ADMIN,
                    `Master Token Owner should be ${CORPORATE_ACCOUNT_ADMIN}`
                );

                assert.equal(
                    data,
                    "Master Token Initialized.",
                    "data should be Master Token Initialized."
                );
            });

            it("Should return SalesTokenBatchInitialized event", async () => {
                batchID = eventResponseSalesTokenBatchInitialized[0].args[0];
                assetRightTokenId =
                    eventResponseSalesTokenBatchInitialized[0].args[1];
                masterTokenID =
                    eventResponseSalesTokenBatchInitialized[0].args[2];
                salesTokenBatchOwner =
                    eventResponseSalesTokenBatchInitialized[0].args[3];
                data = eventResponseSalesTokenBatchInitialized[0].args[4];

                assert.equal(
                    batchID,
                    BATCH_ID_1,
                    `Batch ID should be ${BATCH_ID_1}`
                );

                assert.equal(
                    assetRightTokenId,
                    ASSET_RIGHT_TOKEN_ID,
                    `Asset Right Token ID should be ${ASSET_RIGHT_TOKEN_ID}`
                );

                assert.equal(
                    masterTokenID,
                    MASTER_TOKEN_ID,
                    `Master Token ID should be ${MASTER_TOKEN_ID}`
                );

                assert.equal(
                    salesTokenBatchOwner,
                    CORPORATE_ACCOUNT_ADMIN,
                    `Sales Token Batch Owner should be ${CORPORATE_ACCOUNT_ADMIN}`
                );

                assert.equal(
                    data,
                    "Sales Token Batch Initialized.",
                    "data should be Sales Token Batch Initialized."
                );
            });

            it("Should return TokensGenerated event", async () => {
                tokenOwner = eventResponseTokensGenerated[0].args[0];
                tokenIDs = eventResponseTokensGenerated[0].args[1].toString();
                data = eventResponseTokensGenerated[0].args[2];
                assert.equal(
                    tokenOwner,
                    CORPORATE_ACCOUNT_ADMIN,
                    `Tokens should be ${CORPORATE_ACCOUNT_ADMIN}`
                );

                assert.equal(tokenIDs, TOKENS_1.toString());

                assert.equal(
                    data,
                    "Tokens Generated.",
                    "data should be Tokens Generated."
                );
            });
        });
    }
);
