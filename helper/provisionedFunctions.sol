// function transferOwnerOfMasterToken(
//         uint64 masterTokenID,
//         address newOwnerOfMasterToken
//     )
//         external
//         isOwnerOfMasterToken(masterTokenID)
//         masterTokenNotRemoved(masterTokenID)
//         masterTokenAlreadyRegistered(masterTokenID)
//         whenNotPaused
//     {
//         masterTokens[masterTokenID].prevMasterTokenOwners.push(
//             newOwnerOfMasterToken
//         );
//         address currentOwner = masterTokens[masterTokenID].masterTokenOwner;
//         masterTokens[masterTokenID].masterTokenOwner = newOwnerOfMasterToken;
//         _safeTransferFrom(
//             currentOwner,
//             newOwnerOfMasterToken,
//             masterTokenID,
//             1,
//             ""
//         );
//     }




// // business admin user
// mapping(address => bool) public businessAdminUser;
// // WARNING!! remove before next address change/ production
// mapping(address => Member) public members;
// mapping(address => bool) public adjournedMembers;
// mapping(address => bool) public suspendedMembers;

//  function getMembershipStatus(address walletAddress)
//     public
//     view
//     returns (string memory)
// {
//     if (suspendedMembers[walletAddress]) {
//         return "Membership Status: Suspended.";
//     } else if (adjournedMembers[walletAddress]) {
//         return "Membership Status: adjourned.";
//     } else return "Membership Status: Member";
// }

// function adjournMember() external {
//     require(!suspendedMembers[msg.sender], "You are suspended!");
//     adjournedMembers[msg.sender] = true;
//     emit CurrentMembershipStatus(
//         msg.sender,
//         "Membership status changed to Adjourned!"
//     );
// }

// function beMember() public {
//     require(!suspendedMembers[msg.sender], "You are suspended!");
//     adjournedMembers[msg.sender] = false;
//     emit CurrentMembershipStatus(
//         msg.sender,
//         "Membership status changed to Member!"
//     );
// }

// // BE discussion
// function addBusinessAdminUser(address _businessAdminUser) external {
//     businessAdminUser[_businessAdminUser] = true;
// }

// function removeBusinessAdminUser(address _businessAdminUser) external {
//     businessAdminUser[_businessAdminUser] = false;
// }

// // step-3 feature
// function suspendMember(address memberWalletAddress) external {
//     require(
//         businessAdminUser[msg.sender],
//         "You are not business admin user!"
//     );
//     adjournedMembers[msg.sender] = false;
//     suspendedMembers[memberWalletAddress] = true;
//     emit CurrentMembershipStatus(
//         msg.sender,
//         "Membership status changed to suspended!"
//     );
// }

// function unSuspendMember(address memberWalletAddress) external {
//     require(
//         businessAdminUser[msg.sender],
//         "You are not business admin user!"
//     );
//     adjournedMembers[msg.sender] = false;
//     suspendedMembers[memberWalletAddress] = false;
//     emit CurrentMembershipStatus(
//         msg.sender,
//         "Membership status changed to Member!"
//     );
// }

// function _convertuint256Touint64(uint256 _a) private pure returns (uint64) {
//     return uint64(_a);
// }
// transfer function for secondary sales
// secondary sale information registration
// name could be registerForSecondarySales
// this should be upload to marketplace
// function makeSalesTokenAvailableForSale(
//     uint64 salesTokenID,
//     string calldata currentSellingPrice
// )
//     external
//     // isSecondarySale(salesTokenID)
//     isSalesTokenOwner(salesTokenID)
//     masterTokenNotRemoved(
//         salesTokenBatch[salesTokens[salesTokenID].batchIDs[0]].masterTokenID
//     )
//     whenNotPaused
// {
//     isSalesTokenAvailableForSale[salesTokenID] = true;
//     salesTokens[salesTokenID].currentSellingPrice = currentSellingPrice;
// }

// For secondary sale
// function changePriceOfSalesToken(
//     uint64 salesTokenID,
//     string calldata newSalesTokenSellingPrice
// )
//     external
//     salesTokenAlreadyRegistered(salesTokenID)
//     isSalesTokenOwner(salesTokenID)
//     // isSecondarySale(salesTokenID)
//     masterTokenNotRemoved(
//         salesTokenBatch[salesTokens[salesTokenID].batchIDs[0]].masterTokenID
//     )
//     saleDisabled(salesTokenID)
//     whenNotPaused
// {
//     salesTokens[salesTokenID]
//         .currentSellingPrice = newSalesTokenSellingPrice;
// }

// only gonzo admin can call this version
// cannot use this function without calling initial sale first
// function transferSalesToken(uint64 salesTokenID, address buyer)
//     external
//     saleEnabled(salesTokenID)
//     masterTokenNotRemoved(
//         salesTokenBatch[salesTokens[salesTokenID].batchIDs[0]].masterTokenID
//     )
//     whenNotPaused
// {
//     address prevOwner = salesTokens[salesTokenID].salesTokenOwner;
//     salesTokens[salesTokenID].salesTokenOwner = buyer;
//     // salesTokens[salesTokenID].saleStatusChoice = SalesStatusChoices
//     //     .BEFORE_SALE;
//     salesTokens[salesTokenID].purchaseInformation.prevSalesTokenOwners.push(
//             buyer
//         );
//     salesTokens[salesTokenID].purchaseInformation.obtainingDate.push(
//         block.timestamp
//     );
//     // salesTokens[salesTokenID].purchaseInformation.prevSellingPrice.push(
//     //     salesTokens[salesTokenID].currentSellingPrice
//     // );
//     safeTransferFrom(prevOwner, buyer, salesTokenID, 1, "");
// }

// function startSale(uint64 salesTokenID)
//     external
//     salesTokenAlreadyRegistered(salesTokenID)
//     whenNotPaused
// {
//     salesTokens[salesTokenID].isStoppedSelling = false;
// }

//only business operation user can call this
//need to add modifiers
// function stopSale(uint64 salesTokenID)
//     external
//     salesTokenAlreadyRegistered(salesTokenID)
//     whenNotPaused
// {
//     salesTokens[salesTokenID].isStoppedSelling = true;
// }

// secondary sale er jonno

// function changeSalesStatusToSale(uint64 salesTokenID)
//     external
//     salesTokenAlreadyRegistered(salesTokenID)
//     whenNotPaused
// {
//     salesTokens[salesTokenID].saleStatusChoice = SalesStatusChoices
//         .ONGOING_SALE;
// }

// function changeSalesStatusToSaleClosed(uint64 salesTokenID)
//     external
//     salesTokenAlreadyRegistered(salesTokenID)
//     whenNotPaused
// {
//     salesTokens[salesTokenID].saleStatusChoice = SalesStatusChoices
//         .AFTER_SALE;
// }
