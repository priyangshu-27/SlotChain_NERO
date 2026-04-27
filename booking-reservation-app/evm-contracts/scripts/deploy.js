import hre from "hardhat";

async function main() {
  const BookingReservation = await hre.ethers.getContractFactory("BookingReservation");
  const contract = await BookingReservation.deploy();

  await contract.waitForDeployment();

  console.log(`BookingReservation deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
