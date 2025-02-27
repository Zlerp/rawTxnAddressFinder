const { ethers } = require("ethers");

// Your array of raw transaction hex strings
const rawTxns = [
  "0x02f8b401821e95847735940084a88f7e2782854394a5f565650890fba1824ee0f21ebbbf660a179934878482b2cf6785f4b840a71536e873a42dd0ed8854b0568dfb9263c593102a986400a624320dc95ceff0a71536e873a42dd0ed8854b0568dfb9263c593102a986400a624320dc95ceff0c001a07cc369e30cdedd18a2e1cca39f68912ba073b3b02acf5d9a78b09f4335b2d5eba013b4512060b25c509ae702685fd082c3b8ec4ad4a5830b0061556dc60324d2a7",
  "0x02f8af017f839896808477359400830185d9946c3ea9036406852006290770bedfcaba0e23a0e880b844a9059cbb0000000000000000000000003af4a49c8e2fcaf33fd3389543b80d320fcc9091000000000000000000000000000000000000000000000000000001d1a9393010c001a0d64ba43dc42fb07d6c1890345217321ec6d7c21194c177ba253d7dc69658db71a01aa7058965a1cf0a8a9b8874f6add2c90914b3cc981ff87209a333d1424143a5",
  "0xf86b0f84504529cd82520894787b8840100d9baadd7463f4a73b5ba73b00c6ca8801065deda12a67988026a07e2b544ce9545fcd52ffde9ee3141c62c26c675e102daf8e82ad104d8a99d726a05abe8ee661deeedd5e571d1ed3062ac6b1cbf7becb1cc9f957b2a801c3dce431",
  "0x02f9019301821e9e847735940084c76ffea48302fc1094a66b23d9a8a46c284fa5b3f2e2b59eb5cc3817f480b901242c34322900000000000000000000000000000000000000000000000000000000000000200000000000000000000000008881c19665bbf8fa0677900d0e6c689e71bd8db7000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000077170f80000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000449f93f779000000000000000000000000c20c9f571ab84c0722f08a2ce3bdf7b5a48e0250000000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000c080a040786fb5f94ad93c37654d0d31868fc45a8e871d8e6b30540d6f7b1805520eb6a04430395506298efc134575a0f2d2c4d03435f7c7121df096879338a625ad54cd",
];

// Address to check against (replace with the address you want to monitor)
const addressToCheck = "0xE2e9b071452011bc20FbDcF302AD9692417cB12C";

const badTxns = [];

// Process each transaction
rawTxns.forEach((rawTx) => {
  try {
    // Parse the transaction
    const tx = ethers.Transaction.from(rawTx);
    const txnHash = ethers.keccak256(rawTx);

    console.log("checking the txn: ", txnHash);
    // Check if sender or receiver matches the address we're monitoring
    if (
      (tx.from && tx.from.toLowerCase() === addressToCheck.toLowerCase()) ||
      (tx.to && tx.to.toLowerCase() === addressToCheck.toLowerCase())
    ) {
      // Add transaction details to badTxns array
      badTxns.push({
        rawTx,
        txnHash,
        tx,
      });
    }
  } catch (error) {
    console.error("Error processing transaction:", error.message);
  }
});

console.log(
  `Found ${badTxns.length} transactions matching address ${addressToCheck}`
);

badTxns.forEach((badTx, index) => {
  console.log(`\n--- Suspicious Transaction ${index + 1} ---`);
  console.log("txnHash:", "https://etherscan.io/tx/" + badTx.txnHash);
  console.log("Sender:", badTx.tx.from);
  console.log("Receiver:", badTx.tx.to);
  console.log("Nonce:", badTx.tx.nonce);
  console.log(
    "Max Priority Fee Per Gas:",
    badTx.tx.maxPriorityFeePerGas?.toString()
  );
  console.log("Max Fee Per Gas:", badTx.tx.maxFeePerGas?.toString());
  console.log("Gas Limit:", badTx.tx.gasLimit.toString());
  console.log("Value (wei):", badTx.tx.value.toString());
  console.log("Data:", badTx.tx.data);
});

if (badTxns.length === 0) {
  console.log("No suspicious transactions found for the specified address.");
}
