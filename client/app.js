if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
} else {
    alert('Please install MetaMask to use this DApp!');
}

const web3 = new Web3(window.ethereum);

let contract;
let userAccount;


async function initApp() {
    try {
        // 1. Connect MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        console.log("Connected account:", userAccount);

        // 2. Fetch the Contract Data dynamically from the build folder
        const response = await fetch('./Calculator.json');
        const contractData = await response.json();
        const contractABI = contractData.abi;

        // 3. Get Network ID and Contract Address
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = contractData.networks[networkId];
        
        if (!deployedNetwork) {
            alert("Contract not deployed to the current MetaMask network! Please switch to the correct Ganache network.");
            return;
        }
        
        const contractAddress = deployedNetwork.address;

        // 4. Initialize the contract
        contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log("Contract loaded successfully! Address:", contractAddress);

    } catch (error) {
        console.error("Initialization error:", error);
        alert("Error loading contract. Ensure you are running a local server in the project root.");
    }
}

// Automatically initialize on load
initApp();

// --- Calculator Functions ---
async function calculate(operation) {
    if (!contract) {
        alert("Contract is not loaded yet!");
        return;
    }

    const numA = document.getElementById('numA').value;
    const numB = document.getElementById('numB').value;

    if (!numA || !numB) {
        alert("Please enter both numbers.");
        return;
    }

    try {
        let result;
        if (operation === 'add') {
            result = await contract.methods.add(numA, numB).call();
        } else if (operation === 'subtract') {
            result = await contract.methods.subtract(numA, numB).call();
        } else if (operation === 'multiply') {
            result = await contract.methods.multiply(numA, numB).call();
        } else if (operation === 'divide') {
            result = await contract.methods.divide(numA, numB).call();
        }
        document.getElementById('calcResult').innerText = result;
    } catch (error) {
        console.error(error);
        alert("Error performing calculation.");
    }
}

document.getElementById('addBtn').onclick = () => calculate('add');
document.getElementById('subBtn').onclick = () => calculate('subtract');
document.getElementById('mulBtn').onclick = () => calculate('multiply');
document.getElementById('divBtn').onclick = () => calculate('divide');

// --- Name Functions ---
document.getElementById('setNameBtn').onclick = async () => {
    if (!contract) return;
    const name = document.getElementById('nameInput').value;
    if (!name) return;
    try {
        await contract.methods.setName(name).send({ from: userAccount });
        alert("Name set successfully!");
    } catch (error) {
        console.error(error);
        alert("Error setting name.");
    }
};

document.getElementById('getNameBtn').onclick = async () => {
    if (!contract) return;
    try {
        const name = await contract.methods.getName().call();
        document.getElementById('nameResult').innerText = name;
    } catch (error) {
        console.error(error);
    }
};

// Listen for account changes
window.ethereum.on('accountsChanged', function (accounts) {
    userAccount = accounts[0];
});
