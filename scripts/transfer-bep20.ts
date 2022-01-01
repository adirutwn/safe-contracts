import { ethers } from "hardhat";
import { buildContractCall, buildSafeTransaction, executeTx, safeSignMessage } from "../src/utils/execution";

async function main() {
  const signer = (await ethers.getSigners())[0];
  const GnosisSafe = await ethers.getContractFactory("GnosisSafe");
  const safe = GnosisSafe.attach("0x450FD11f769064193a13E418F6f472E84bD75BA3");
  const wbnbAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
  const token = await ethers.getContractFactory("ERC20Token")

  const data = token.interface.encodeFunctionData("transfer", ["0x88888344157c62D161bA7F98f8774bF9115C766b", ethers.utils.parseEther("3.235")])
  const safeTx = buildSafeTransaction({ to: wbnbAddress, data, safeTxGas: 0, nonce: await safe.nonce() })
  const sig = await safeSignMessage(signer, safe, safeTx)

  console.log(safeTx)
  console.log(sig)

  // Fill second signature then remove comment
  // await executeTx(safe, safeTx, [sig, { signer: '', data: ''}])
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });