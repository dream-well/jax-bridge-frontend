let web3;
let accounts = [];
let mode = "test";
let active_network = "bsctestnet";
let testnet_chain_id = "0x61";
let markup_fee_decimal = 8;
//https://f3oall.github.io/awesome-notifications/docs/
let notifier;
let BN;

let networks = {
    ethmainnet: {
        url: "https://mainnet.infura.io/v3/6797126c4f0942d99b649046e1ade16d",
        chainId: "0x1",
        symbol: 'ETH'
    },
    bsctestnet: {
        url: "https://data-seed-prebsc-2-s3.binance.org:8545/",
        chainId: "0x61",
        chainName: 'Binance Smart Chain Testnet',
        blockExplorer: 'https://testnet.bscscan.com',
        symbol: 'BNB'
    },
    bscmainnet: {
        url: `https://bsc-dataseed1.binance.org/`,
        chainId: "0x38",
        chainName: 'Binance Smart Chain Mainnet',
        blockExplorer: 'https://bscscan.com',
        symbol: 'BNB'
    },
    polygonmainnet: {
        url: `https://rpc-mainnet.maticvigil.com/`,
        chainId: "0x89",
        symbol: 'MATIC'
    },
    polygontestnet: {
        url: `https://rpc-mumbai.maticvigil.com/`,
        chainId: "0x13881",
        symbol: 'MATIC'
    },
    avatestnet: {
        url: `https://api.avax-test.network/ext/bc/C/rpc/`,
        chainId: "0xa869",
        symbol: 'AVAX'
    },
}

let tokens = {
    "BUSD": {
        decimals: 18,
        approval: true,
        code: 'busd',
        approval: true,
        exchanges: ["JAXUD", "JAXRE", "WJAX"],
        image: 'https://beta.jax.money/img/busd_logo.png'
    },
    "WJXN": {
        decimals: 0,
        approval: true,
        code: 'wjxn',
        exchanges: ["VRP"],
        image: 'https://beta.jax.money/img/wjxn.png'
    },
    "WJAX": {
        decimals: 4,
        approval: true,
        code: 'wjax',
        exchanges: ["JAXUD", "BUSD"],
        image: 'https://beta.jax.money/img/jax.png'
    },
    "VRP": {
        decimals: 18,
        approval: true,
        code: 'vrp',
        exchanges: ["WJXN"],
        image: 'https://beta.jax.money/img/j-usd.png'
    },
    "JAXUD": {
        decimals: 18,
        approval: true,
        code: 'jusd',
        exchanges: ["WJAX", "JAXRE", "BUSD"],
        image: 'https://beta.jax.money/img/j-usd.png'
    },
    "JAXRE": {
        decimals: 18,
        approval: true,
        code: 'jinr',
        exchanges: ["JAXUD", "BUSD"],
        image: 'https://beta.jax.money/img/j-inr.png'
    },

}

let contracts = {};

void async function getContractAddresses() {
    const { data: contractsInfo } = await axios.get("https://beta.jax.money:8443/contract_addresses");
    tokens.WJXN.address = contractsInfo.wjxn.address;
    tokens.WJAX.address = contractsInfo.wjax.address;
    tokens.VRP.address = contractsInfo.vrp.address;
    tokens.BUSD.address = contractsInfo.busd.address;
    tokens["JAXUD"].address = contractsInfo.jusd.address;
    tokens["JAXRE"].address = contractsInfo.jinr.address;

    // contract_address = contractsInfo.admin.address;

    for(let key in contractsInfo) {
        const info = contractsInfo[key];
        if(!info.abi) {
            contracts[key] = new web3.eth.Contract(minABI, info.address)
            $(`.${key}_address`).html(info.address);
            continue;
        }
        contracts[key] = new web3.eth.Contract(info.abi, info.address);
    }
    check_status && check_status();
}()

let exchange_rate = 0;

let minABI = [{ "inputs": [], "stateMutability": "payable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_tx_fee", "type": "uint256" }], "name": "setTransactionFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_wallet", "type": "address" }], "name": "setTransactionFeeWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "transaction_fee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "transaction_fee_decimal", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "tx_fee_wallet", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }]

function on_wallet_connected() {
    $(".btn_buy").html("Buy Locked Tokens");
    $("#btn_swap").html("Swap");

    // Colony page
    $("#set_colony_address").html("Save");
    $("#register_colony").html("Save");
}

function on_wallet_disconnected() {
    $(".btn_buy").html("Connect a wallet");
    $("#btn_swap").html("Connect a Wallet");
    $("#btn_swap").attr("disabled", false);
    $("#btn_approve").hide();
    $(".btn_connect").html("Connect a Wallet");

    // Colony page
    $("#set_colony_address").html("Connect a wallet");
    $("#register_colony").html("Connect a wallet");

}

function on_wrong_network() {
    $(".btn_connect").html("Switch Network");
    $(".btn_connect").removeClass("btn-info");
    $(".btn_connect").removeClass("btn-success");
    $(".btn_connect").addClass("btn-danger");
    $("#btn_swap").html("Switch Network");
}

void function main() {

    on_wallet_disconnected();

    init_listners();
    web3 = new Web3(Web3.givenProvider);
    BN = (str) => (new web3.utils.BN(str));

    // setTimeout(real_time_update, 500);
    // setInterval(real_time_update, 3000)

    web3.currentProvider.on("accountsChanged", _accounts => {
        accounts = _accounts
        if (accounts.length == 0) {
            reset_connect_button();
        } else {
            set_connected_address();
            check_allowance();
        }
    });

    web3.currentProvider.on("chainChanged", () => {
        if (web3.currentProvider.chainId != networks[active_network].chainId) {
            on_wrong_network();
            accounts = [];
        } else {
            connect_wallet();
        }
    })
    notifier = new AWN({
        position: "bottom-right",
        durations: {
            success: 1000,
            alert: 0
        },
        minDurations: {
            alert: 1000,
        }
    });

}()

function init_listners() {
}

function connect_wallet() {
    return web3.eth.requestAccounts()
        .then(_accounts => {
            accounts = _accounts;
            console.log(accounts);

            if (web3.currentProvider.chainId != networks[active_network].chainId) {
                $(".btn_connect").html("Switch Network");
                switch_network();
            } else {
                on_wallet_connected();
                set_connected_address();
                get_balance_token("WJAX");
                check_allowance();
            }
            check_status && check_status();
        })
        .catch(error => {
            console.error(error);
        })

}

function disconnect_wallet() {
    accounts = [];
    reset_connect_button();
    on_wallet_disconnected();
}

function switch_network() {
    web3.currentProvider.request({
            method: "wallet_switchweb3.givenProviderChain",
            params: [{ chainId: networks[active_network].chainId }]
        })
        .then(() => {
            console.log("switched");
            set_connected_address();
        })
        .catch((error) => {
            add_network();
            console.error(error);
            on_wrong_network();
        })
}

function add_network() {
    const network = networks[active_network];
    web3.currentProvider.request({
        method: 'wallet_addweb3.givenProviderChain',
        params: [{
        chainId: network.chainId,
        chainName: network.chainName,
        nativeCurrency: {
            name: 'Coin',
            symbol: network.symbol,
            decimals: 18
        },
        rpcUrls: [network.url],
        blockExplorerUrls: [network.blockExplorer]
        }]
    })
    .catch((error) => {
        console.log(error)
    }) 
}

function reset_connect_button() {
    // $(".btn_connect").html("Connect a wallet");
    $(".btn_connect").removeClass("btn-danger");
    $(".btn_connect").removeClass("btn-success");
    $(".btn_connect").addClass("btn-info");
    $("#balance_1").html("Balance:");
    $("#balance_2").html("Balance:");
}

function set_connected_address() {
    $(".btn_connect").html(accounts[0].substr(0, 9) + "...");

    $(".btn_connect").removeClass("btn-info");
    $(".btn_connect").removeClass("btn-danger");
    $(".btn_connect").addClass("btn-success");
}
