const { assert } = require("chai");
const Main = artifacts.require("Main");

contract(
    "GDAMS: Production Deliverables and Copyright Management System",
    (accounts) => {
        const corporate_account_admin = accounts[1];
        const corporate_account_delegate = accounts[2];
        const userRandom = accounts[4];
        const userRandomNew = accounts[5];
        const corporate_account_subcontractor = accounts[7];
        const ASSET_RIGHT_TOKEN_ID = 1001;
        const PERMITTED_USER_1 = "user1@email.com";
        const PERMITTED_USER_2 = "user2@email.com";
        const PERMITTED_USER_3 = "user3@email.com";
        const PERMITTED_USER_4 = "user4@email.com";
        const PERMITTED_USER_5 = "user5@email.com";
        const PERMITTED_USER_BATCH = [
            PERMITTED_USER_1,
            PERMITTED_USER_2,
            PERMITTED_USER_3,
            PERMITTED_USER_4,
            PERMITTED_USER_5,
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
                [],
                {
                    from: corporate_account_admin,
                }
            );
        });

        describe("Add permitted users to the token", async () => {
            before(async () => {
                transactionReceipt = await main.addPermittedUser(
                    ASSET_RIGHT_TOKEN_ID,
                    PERMITTED_USER_BATCH,
                    { from: corporate_account_admin }
                );
            });

            it("Should return added permitted users", async () => {
                response = await main.getPermittedUserOfAssetRightToken(
                    ASSET_RIGHT_TOKEN_ID
                );
                assert.equal(response.toString(), PERMITTED_USER_BATCH);
            });
        });

        describe("permitted user events", async () => {
            it("should return AddedPermittedUser event", async () => {
                eventResponse = await main.getPastEvents("AddedPermittedUser", {
                    fromBlock: 0,
                    toBlock: "latest",
                });
                caller = eventResponse[0].args.primeContractorAddress;
                permittedUserIDs = eventResponse[0].args.permittedUserIDs;
                data = eventResponse[0].args.data;

                res = await main.getPermittedUserOfAssetRightToken(
                    ASSET_RIGHT_TOKEN_ID
                );

                assert.equal(
                    caller,
                    corporate_account_admin,
                    "Prime contractor should be 0xE946F096344B2C7A569290e3128e63e207F2AAc0"
                );
                assert.equal(
                    res.toString(),
                    PERMITTED_USER_BATCH.toString(),
                    "the permittedUserIDs should be equal to the permitted user batch"
                );

                assert.equal(
                    data,
                    "Added permitted User IDs",
                    "the data should be 'Added permitted User Ids'"
                );
            });
        });
    }
);
