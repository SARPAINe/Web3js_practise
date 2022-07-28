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
        const REVENUE_SHARE = "10";
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

            it("Should return informations for certifcate page for a sales token before a transfer", async () => {
                const certifcate = await main.getCertificate(4001);
                console.log(certifcate);
            });

            it("Should enable batch sales admin to transfer one sales token to a buyer's account", async () => {
                await main.initialPurchase(4001, accounts[1], "120", {
                    from: SALES_ADMIN_1,
                });
                res1 = await main.getSalesToken(4001);
                salesTokenOwner1 = res1[3];
                assert.equal(
                    salesTokenOwner1,
                    accounts[1],
                    `Sales Token Owner should be ${accounts[1]}`
                );
            });

            it("Should return informations for certifcate page for a sales token after a transfer", async () => {
                const certifcate = await main.getCertificate(4001);
                console.log(certifcate);
            });
        });

        // -----------------Custom Event Test----------------

        describe("Custom Event Test", async () => {
            before(async () => {
                eventResponseTransactedSalesToken = await main.getPastEvents(
                    "TransactedSalesToken",
                    {
                        fromBlock: 0,
                        toBlock: "latest",
                    }
                );
            });

            it("Should return TransactedSalesToken event", async () => {
                previousOwner = eventResponseTransactedSalesToken[0].args[0];
                newOwner = eventResponseTransactedSalesToken[0].args[1];
                salesTokenID = eventResponseTransactedSalesToken[0].args[2];
                data = eventResponseTransactedSalesToken[0].args[3];

                assert.equal(
                    previousOwner,
                    CORPORATE_ACCOUNT_ADMIN,
                    `Previous Owner should be ${CORPORATE_ACCOUNT_ADMIN}`
                );

                assert.equal(
                    newOwner,
                    accounts[1],
                    `Previous Owner should be ${accounts[1]}`
                );

                assert.equal(
                    salesTokenID.toString(),
                    "4001",
                    `Sales Token IDs should be 4001`
                );

                assert.equal(
                    data,
                    "Sales Token Transferred.",
                    "data should be Sales Token Transferred."
                );
            });
        });

        // // // ----------------- modifier tests-------------------------------------

        describe("Modifier tests", async () => {
            it("Should revert with the message Not enough sales tokens in stock!", async () => {
                await main.initialPurchase(4002, accounts[1], "120", {
                    from: SALES_ADMIN_2,
                });
                await main.initialPurchase(4003, accounts[1], "120", {
                    from: SALES_ADMIN_3,
                });
                try {
                    await main.initialPurchase(4003, accounts[2], "120", {
                        from: SALES_ADMIN_3,
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "Not enough sales tokens in stock!",
                    "revert reason should be - Not enough sales tokens in stock!"
                );
            });

            it("Should revert with the message The sales token Batch is removed.", async () => {
                await main.removeBatch(BATCH_ID_1, {
                    from: CORPORATE_ACCOUNT_ADMIN,
                });
                try {
                    await main.initialPurchase(4003, accounts[2], "120", {
                        from: SALES_ADMIN_3,
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "The sales token Batch is removed.",
                    "Revert reason should be - The sales token Batch is removed."
                );
            });

            it("Should revert with the message You are not the admin!", async () => {
                try {
                    // tokenInfo1 = await main.getSalesToken(4005);
                    // console.log(tokenInfo1);
                    await main.productInfoReg(
                        [
                            ASSET_RIGHT_TOKEN_ID,
                            BATCH_ID_2,
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
                    await main.initialPurchase(4004, accounts[2], "120", {
                        from: SALES_ADMIN_2,
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "You are not the admin!",
                    "Revert reason should be - You are not the admin!"
                );
            });

            it("Should revert with the message You don't have permission to sell this token!!!", async () => {
                try {
                    await main.initialPurchase(4004, accounts[1], "120", {
                        from: SALES_ADMIN_1,
                    });
                    await main.initialPurchase(4004, accounts[2], "120", {
                        from: SALES_ADMIN_1,
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "You don't have permission to sell this token!!!",
                    "Revert reason should be - You don't have permission to sell this token!!!"
                );
            });
        });
    }
);
