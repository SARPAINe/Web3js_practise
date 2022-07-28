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
        const TOKENS_2 = [4001, 4002, 4003, 2002];
        const SALES_TOKENS_2 = [4004, 4005, 4006];
        const SALES_TOKENS_3 = [4007, 4008, 4009];
        const AMOUNTS = [1, 1, 1, 1];
        const AMOUNTS_REF = [1, 1, 1];
        const SALES_METHOD = 1;
        let main;
        before(async () => {
            main = await Main.deployed(); //returns deployed instance of sc.
        });

        // -----------------Secondary Sale Test---------------

        describe("Secondary Sale", async () => {
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

                await main.initialPurchase(4001, accounts[1], "120", {
                    from: SALES_ADMIN_1,
                });

                await main.salesInfoReg(4001, "first-registration", 0, "130", {
                    from: accounts[1],
                });
            });

            it("Should be able to secondary purchase", async () => {
                response = await main.secondaryPurchase(
                    4001,
                    accounts[2],
                    "150",
                    { from: SALES_ADMIN_1 }
                );
                res = await main.getSalesToken(4001);
                salesTokenOwner = res[3];
                assert.equal(
                    res[3],
                    accounts[2],
                    `Sales Token Owner should be ${accounts[2]}`
                );
            });

            it("Should revert with the message- The sale of this Sales Token is stopped! ", async () => {
                try {
                    await main.salesInfoReg(
                        4001,
                        "second-registration",
                        0,
                        "140",
                        {
                            from: accounts[2],
                        }
                    );
                    await main.stopSale(4001, { from: accounts[2] });
                    await main.secondaryPurchase(4001, accounts[3], "150", {
                        from: SALES_ADMIN_1,
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                assert.equal(
                    reason,
                    "The sale of this Sales Token is stopped!",
                    "Revert reason should be- The sale of this Sales Token is stopped!"
                );
            });

            it("Should revert with the message- The Sales Token is not avaliable for secondary sale.", async () => {
                try {
                    await main.secondaryPurchase(4002, accounts[1], "150", {
                        from: SALES_ADMIN_1,
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                }
                console.log(reason);
                assert.equal(
                    reason,
                    "The Sales Token is not available for secondary sale.",
                    "Revert reason should be- The Sales Token is not avaliable for secondary sale."
                );
            });
        });
    }
);
