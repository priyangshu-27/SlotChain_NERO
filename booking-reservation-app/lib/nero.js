import { ethers } from "ethers";

// Replace this with the address obtained after deploying the contract
export const CONTRACT_ADDRESS = "0x6d3282366cc05FDf26a60E238a850edCdbE58ba8";

// Nero Testnet Config
export const NERO_TESTNET_CONFIG = {
  chainId: "0x2b1", // 689 in hex
  chainName: "Nero Testnet",
  nativeCurrency: {
    name: "NERO",
    symbol: "NERO",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-testnet.nerochain.io"],
  blockExplorerUrls: ["https://testnet.neroscan.io/"],
};

// Simplified ABI matching BookingReservation.sol
const ABI = [
  "function createSlot(string memory id, string memory serviceName, uint256 date, uint256 startTime, uint256 endTime, uint256 price) public",
  "function bookSlot(string memory id) public",
  "function cancelBooking(string memory id) public",
  "function completeBooking(string memory id) public",
  "function getSlot(string memory id) public view returns (tuple(address provider, address customer, bool isBooked, string serviceName, uint256 date, uint256 startTime, uint256 endTime, uint256 price, string status))",
  "function listSlots() public view returns (string[] memory)",
  "function getSlotCount() public view returns (uint256)"
];

export const checkConnection = async () => {
    if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask is not installed");
    }
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            return { publicKey: accounts[0] };
        }
        return null;
    } catch (e) {
        return null;
    }
};

const ensureNetwork = async () => {
    if (typeof window.ethereum === 'undefined') return;
    
    try {
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (currentChainId !== NERO_TESTNET_CONFIG.chainId) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: NERO_TESTNET_CONFIG.chainId }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [NERO_TESTNET_CONFIG],
                    });
                } else {
                    throw switchError;
                }
            }
        }
    } catch (error) {
        console.error("Failed to setup network:", error);
    }
};

const getContract = async (withSigner = false) => {
    if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask is not installed. Please install it to use this app.");
    }
    
    if (withSigner) {
        await ensureNetwork();
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    if (withSigner) {
        const signer = await provider.getSigner();
        return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    }
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
};

export const createSlot = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    const contract = await getContract(true);
    const tx = await contract.createSlot(
        payload.id,
        payload.serviceName || "",
        payload.date,
        payload.startTime,
        payload.endTime,
        payload.price
    );
    await tx.wait();
    return { ok: true, hash: tx.hash };
};

export const bookSlot = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    const contract = await getContract(true);
    const tx = await contract.bookSlot(payload.id);
    await tx.wait();
    return { ok: true, hash: tx.hash };
};

export const cancelBooking = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    const contract = await getContract(true);
    const tx = await contract.cancelBooking(payload.id);
    await tx.wait();
    return { ok: true, hash: tx.hash };
};

export const completeBooking = async (payload) => {
    if (!payload?.id) throw new Error("id is required");
    const contract = await getContract(true);
    const tx = await contract.completeBooking(payload.id);
    await tx.wait();
    return { ok: true, hash: tx.hash };
};

export const getSlot = async (id) => {
    if (!id) throw new Error("id is required");
    const contract = await getContract(false);
    const data = await contract.getSlot(id);
    
    // Convert BigInts from ethers back to strings/numbers for UI tracking
    return {
        provider: data.provider,
        customer: data.customer,
        isBooked: data.isBooked,
        serviceName: data.serviceName,
        date: data.date.toString(),
        startTime: data.startTime.toString(),
        endTime: data.endTime.toString(),
        price: data.price.toString(),
        status: data.status
    };
};

export const listSlots = async () => {
    const contract = await getContract(false);
    const data = await contract.listSlots();
    return Array.from(data);
};

export const getSlotCount = async () => {
    const contract = await getContract(false);
    const data = await contract.getSlotCount();
    return Number(data);
};
