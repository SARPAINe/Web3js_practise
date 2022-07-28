const { assert } = require("chai");
const Main = artifacts.require("Main");

/*  initialize add to shared from    */

contract(
    "GDAMS: Production Deliverables and Copyright Management System",
    (accounts) => {
        const corporate_account_admin = accounts[1];
        const corporate_account_subcontractor = accounts[7];
        const corporate_account_delegate = accounts[2];
        const userRandom = accounts[4];
        const userRandomNew = accounts[5];
        const ASSET_RIGHT_TOKEN_ID = 10001;
        const SHARED_TOKEN_1 = 10101;
        const SHARED_TOKEN_2 = 10102;
        const SHARED_TOKEN_3 = 10103;
        const SHARED_TOKEN_4 = 10104;
        const SHARED_TOKEN_5 = 10105;
        const SHARED_TOKEN_BATCH = [
            SHARED_TOKEN_1,
            SHARED_TOKEN_2,
            SHARED_TOKEN_3,
        ];

        let main;
        let response;
        let transactionReceipt;
        let eventResponse;
        before(async () => {
            main = await Main.deployed();

            transactionReceipt = await main.initAssetRightToken(
                ASSET_RIGHT_TOKEN_ID,
                corporate_account_admin,
                corporate_account_subcontractor,
                ["Refat", "Ragib"],
                {
                    from: corporate_account_admin,
                }
            );
            response = await main.getAssetToken(ASSET_RIGHT_TOKEN_ID);

            await main.initAssetRightToken(
                SHARED_TOKEN_1,
                corporate_account_admin,
                corporate_account_subcontractor,
                ["Refat", "Ragib"],
                {
                    from: corporate_account_admin,
                }
            );

            await main.initAssetRightToken(
                SHARED_TOKEN_2,
                corporate_account_admin,
                corporate_account_subcontractor,
                ["Refat", "Ragib"],
                {
                    from: corporate_account_admin,
                }
            );

            await main.initAssetRightToken(
                SHARED_TOKEN_3,
                corporate_account_admin,
                corporate_account_subcontractor,
                ["Refat", "Ragib"],
                {
                    from: corporate_account_admin,
                }
            );
        });

        describe("Share Asset Token", async () => {
            let transactionReceipt;
            let eventResponse;
            let response;

            before(async () => {
                transactionReceipt = await main.addSharedFrom(
                    ASSET_RIGHT_TOKEN_ID,
                    SHARED_TOKEN_BATCH,
                    { from: corporate_account_admin }
                );

                eventResponse = await main.getPastEvents("AddedSharedFrom", {
                    fromBlock: 0,
                    toBlock: "latest",
                });
            });

            // children
            it("Should return children of asset right token", async () => {
                // console.log(eventResponse[0].args);
                // console.log(eventResponse[0].args.tokenIDs);
                for (
                    let index = 0;
                    index < SHARED_TOKEN_BATCH.length;
                    index++
                ) {
                    response = await main.getChildAssetRightToken(
                        SHARED_TOKEN_BATCH[index]
                    );
                    // console.log(response);
                    assert.equal(
                        response.toString(),
                        ASSET_RIGHT_TOKEN_ID,
                        `${SHARED_TOKEN_BATCH[index]} should return ${ASSET_RIGHT_TOKEN_ID}`
                    );
                }
            });

            //parent;
            it("Should return parents of the AssetRightToken", async () => {
                response = await main.getParentAssetRightToken(
                    ASSET_RIGHT_TOKEN_ID
                );

                assert.equal(
                    response.toString(),
                    SHARED_TOKEN_BATCH,
                    `Should return ${SHARED_TOKEN_BATCH}`
                );
            });
        });

        describe("Delete shared asset right token", async () => {
            let transactionReceipt;
            let eventResponse;
            let response;

            // delete a token
            before(async () => {
                transactionReceiptToken2 =
                    await main.deleteAssetRightTokenFromSharedFrom(
                        ASSET_RIGHT_TOKEN_ID,
                        SHARED_TOKEN_1,
                        {
                            from: corporate_account_admin,
                        }
                    );
                transactionReceiptToken3 =
                    await main.deleteAssetRightTokenFromSharedFrom(
                        ASSET_RIGHT_TOKEN_ID,
                        SHARED_TOKEN_3,
                        {
                            from: corporate_account_admin,
                        }
                    );
            });

            //1001 1003 er child blank
            it("Should return empty child array", async () => {
                response1 = await main.getChildAssetRightToken(SHARED_TOKEN_1);
                response3 = await main.getChildAssetRightToken(SHARED_TOKEN_3);

                assert.equal(response1.toString(), []);
                assert.equal(response3.toString(), []);
            });

            // get modified parent
            it("should return modified parent tokens", async () => {
                response = await main.getParentAssetRightToken(
                    ASSET_RIGHT_TOKEN_ID
                );

                assert.equal(response.toString(), [SHARED_TOKEN_2]);
            });

            // get tokenID which is removed
            it("Should return removed previously shared tokens", async () => {
                response = await main.getRemovedReferencedTokens(
                    ASSET_RIGHT_TOKEN_ID
                );

                assert.equal(response.toString(), [
                    SHARED_TOKEN_1,
                    SHARED_TOKEN_3,
                ]);
            });

            // get tokenID from which is removed
            it("Should return token id from which is deleted", async () => {
                responseToken1 = await main.getDeletedFrom(SHARED_TOKEN_1);
                responseToken3 = await main.getDeletedFrom(SHARED_TOKEN_3);

                assert.equal(responseToken1.toString(), [ASSET_RIGHT_TOKEN_ID]);
                assert.equal(responseToken3.toString(), [ASSET_RIGHT_TOKEN_ID]);
            });
        });

        describe("Shared Token events", async () => {
            it("Should return AddedSharedFrom event", async () => {
                eventResponse = await main.getPastEvents("AddedSharedFrom", {
                    fromBlock: 0,
                    toBlock: "latest",
                });

                assetRightTokenID = eventResponse[0].args.assetRightTokenID;
                tokenIDs = eventResponse[0].args.tokenIDs;
                data = eventResponse[0].args.data;

                assert.equal(
                    assetRightTokenID,
                    ASSET_RIGHT_TOKEN_ID,
                    "should return asset right token id"
                );
                assert.equal(
                    tokenIDs.toString(),
                    SHARED_TOKEN_BATCH,
                    "should return shared token id"
                );
                assert.equal(
                    data,
                    "Added referenced tokens.",
                    "should return Added referenced tokens.'should return shared token id'"
                );
            });

            it("Should return DeletedAssetRightTokenFromSharedFrom event", async () => {
                eventResponse = await main.getPastEvents(
                    "DeletedAssetRightTokenFromSharedFrom",
                    { fromBlock: 0, toBlock: "latest" }
                );

                assetRightTokenID = eventResponse[0].args.assetRightTokenID;
                tokenID = eventResponse[0].args.tokenID;
                data = eventResponse[0].args.data;

                assert.equal(
                    assetRightTokenID,
                    ASSET_RIGHT_TOKEN_ID,
                    "should return asset right token id"
                );
                assert.equal(
                    tokenID,
                    SHARED_TOKEN_1,
                    "should return shared token id"
                );
                assert.equal(
                    data,
                    "Removed referenced token.",
                    "should return Added referenced tokens.'Removed referenced token.'"
                );
            });
        });
    }
);
