const { assert } = require("chai");
const Main = artifacts.require("Main");

/*  1. default information
    2. initialize asset token information
    3. add delegate user using the primeContractorAdmin account
    4. populate metadata
    5. check if assetTokenID already requested modifier
    6. check hasPermissionOfAssetRightToken modifier    */

contract(
    "GDAMS: Production Deliverables and Copyright Management System",
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

        // -------------------1. default Asset token Info-----------------------

        describe("Default Asset Token Information", async () => {
            let response;

            before(async () => {
                response = await main.getAssetToken(ASSET_RIGHT_TOKEN_ID);
            });

            it("Should return default Owner", async () => {
                const owner = response[0];
                assert.equal(
                    owner,
                    "0x0000000000000000000000000000000000000000",
                    "owner should be address(0)"
                );
            });

            it("Should return default currentUser", async () => {
                const currentUser = response[1];
                assert.equal(
                    currentUser,
                    "0x0000000000000000000000000000000000000000",
                    "currentUser should be address(0)"
                );
            });

            it("Should return default assetRightTokenStatus", async () => {
                const assetRightTokenStatus = response[2];
                assert.equal(
                    assetRightTokenStatus,
                    "0",
                    "assetRightTokenStatus should be 0(NOT_IN_PRODUCTION)"
                );
            });

            it("Should return default isRegistered", async () => {
                const isRegistered = response[3];
                assert.equal(
                    isRegistered,
                    false,
                    "isRegistered should be false"
                );
            });
        });

        // -----------------2. initialize asset token information---------------

        describe("Initial Asset Token Information", async () => {
            let response;
            let transactionReceipt;
            let eventResponse;
            before(async () => {
                transactionReceipt = await main.initAssetRightToken(
                    ASSET_RIGHT_TOKEN_ID,
                    corporate_account_admin,
                    corporate_account_subcontractor,
                    ["Refat", "Ragib"],
                    {
                        from: corporate_account_admin,
                    }
                );

                response = await main.getAssetToken(1001);
                eventResponse = await main.getPastEvents("Initialized", {
                    fromBlock: 0,
                    toBlock: "latest",
                });
            });

            it("Should return Initialized event", async () => {
                assetRightTokenId = eventResponse[0].args[0].toString();
                owner = eventResponse[0].args.primeContractorAddress;
                data = eventResponse[0].args.data;
                assert.equal(assetRightTokenId, "1001");
                assert.equal(
                    owner,
                    corporate_account_admin,
                    "owner should be corporate_account_admin"
                );
                assert.equal(
                    data,
                    "Asset Right Token Initialized.",
                    "data should be Asset Right Token Initialized."
                );
            });

            it("Should return Owner address", async () => {
                owner = response[0];
                assert.equal(
                    owner,
                    corporate_account_admin,
                    "asset owner is 0xaec08D2819118353d5985D3833B207542D096792"
                );
            });

            it("Should return currentOwner address", async () => {
                owner = response[0];
                currentOwner = response[1];
                assert.equal(
                    currentOwner,
                    corporate_account_subcontractor,
                    "currentOwner should be Owner"
                );
            });

            it("Should return default currentStatus", async () => {
                currentStatus = response[2];
                assert.equal(
                    currentStatus,
                    1,
                    "currentStatus should be 1 (IN_production)"
                );
            });

            it("Should return isRegistered", async () => {
                isRegistered = response[3];
                assert.equal(
                    isRegistered,
                    false,
                    "isRegistered should be false"
                );
            });

            it("Should return OwnerOfAssetRightToken", async () => {
                owner = await main.getOwnerOfAssetRightToken(
                    ASSET_RIGHT_TOKEN_ID
                );
            });
        });

        describe("Check isAssetRightTokenRequested modifier", async () => {
            it("should fail to reinitialize same assetRightToken", async () => {
                try {
                    transactionReceipt = await main.initializeAssetRightToken(
                        ASSET_RIGHT_TOKEN_ID,
                        corporate_account_admin,
                        {
                            from: userRandom,
                        }
                    );
                    assert(false);
                } catch (error) {
                    assert(true);
                }
            });
        });
    }
);
