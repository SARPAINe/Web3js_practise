const { assert } = require("chai");
const Main = artifacts.require("Main");
const revertReasonDecoder = require("../../helper/revertReasonDecoder");

contract(
    "GDAMS: Production Deliverables and Copyright Management System",
    (accounts) => {
        const ASSET_RIGHT_TOKEN_ID = 1001; // fixed
        const MASTER_TOKEN_ID = 2001;
        const BATCH_ID_1 = "3001";
        const BATCH_ID_2 = "3002";

        const CORPORATE_ACCOUNT_ADMIN = accounts[0];
        const CORPORATE_ACCOUNT_SUBCONTRACTOR = accounts[0];
        const OTHER_USER = accounts[1];
        const SALES_ADMIN_1 = accounts[3];
        const SALES_ADMIN_2 = accounts[4];
        const SALES_ADMIN_3 = accounts[5];
        const BATCH_ADMIN = accounts[9];
        const REVENUE_SHARE = "10";
        const PLANNED_SALE_PRICE = "100";
        const SALES_METHOD = 0;
        const TOKENS = [4001, 4002, 4003, 2001];
        const SALES_TOKENS_2 = [4004, 4005, 4006];

        let main;
        let batchCount;

        before(async () => {
            main = await Main.deployed();

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
                TOKENS,
                [SALES_ADMIN_1, SALES_ADMIN_2, SALES_ADMIN_3],
                { from: CORPORATE_ACCOUNT_ADMIN }
            );
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
        });
        describe("Remove Product Information", async () => {
            it("Should remove product information", async () => {
                try {
                    await main.removeBatch(BATCH_ID_1, {
                        from: CORPORATE_ACCOUNT_ADMIN,
                    });

                    batchCount = await main.getBatchCounterOfMasterToken(
                        MASTER_TOKEN_ID
                    );

                    assert.equal(batchCount, 1, "Batch Count Should be 1");
                } catch (error) {
                    console.log(error);
                }
            });

            it("Should not be able to remove already removed product information", async () => {
                try {
                    await main.removeBatch(BATCH_ID_1, {
                        from: CORPORATE_ACCOUNT_ADMIN,
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                    assert.equal(
                        reason,
                        "The Sales Token Batch has already been removed.",
                        "The transaction should be reverted."
                    );
                }
            });

            it("Should not be able to able to remove other than owner", async () => {
                try {
                    await main.removeBatch(BATCH_ID_2, {
                        from: OTHER_USER,
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                    assert.equal(
                        reason,
                        "You are not the master token owner!",
                        "the transaction should revert"
                    );
                }
            });

            it("Should remove master token when all the batch are removed", async () => {
                try {
                    await main.removeBatch(BATCH_ID_2, {
                        from: CORPORATE_ACCOUNT_ADMIN,
                    });

                    isRemoved = await main.getIsMasterTokenRemoved(
                        MASTER_TOKEN_ID
                    );
                    assert.equal(
                        isRemoved,
                        true,
                        "The Master Token should be removed."
                    );
                } catch (error) {
                    console.log(error);
                }
            });

            it("Should not remove product information after master token removal.", async () => {
                try {
                    await main.removeBatch(BATCH_ID_1, {
                        from: CORPORATE_ACCOUNT_ADMIN,
                    });
                } catch (error) {
                    reason = await revertReasonDecoder(
                        error.receipt.revertReason
                    );
                    assert.equal(
                        reason,
                        "The Master Token is removed!",
                        "Batch Count Should be 1"
                    );
                }
            });
        });
    }
);
