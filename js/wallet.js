
let web3;
let accounts = [];
let notifier;
let BN;


const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const EvmChains = window.EvmChains;
const Fortmatic = window.Fortmatic;


// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;

let networks = {
    ethereum: {
        chainId: 0x1,
        symbol: 'ETH',
        blockExplorer: 'https://etherscan.io',
        url: 'https://cloudflare-eth.com'
    },
    bsc: {
        chainId: 0x38,
        chainName: 'Binance Smart Chain Mainnet',
        blockExplorer: 'https://bscscan.com',
        url: 'https://bscrpc.com',
        symbol: 'BNB'
    },
    polygon: {
        chainId: 0x89,
        chainName: 'Polygon Mainnet',
        url: `https://polygon-rpc.com`,
        symbol: 'MATIC',
    },
    avax: {
        chainId: 43114,
        chainName: 'Avalanche C Chain',
        blockExplorer: 'https://snowtrace.io',
        url: 'https://rpc.ankr.com/avalanche',
        symbol: 'AVAX',
    },
    rinkeby: {
        chainId: 0x4,
        symbol: 'ETH',
        blockExplorer: 'https://rinkeby.etherscan.io',
    },
    bsctestnet: {
        chainId: 0x61,
        chainName: 'Binance Smart Chain Testnet',
        blockExplorer: 'https://testnet.bscscan.com',
        symbol: 'BNB'
    },
    polygontestnet: {
        chainId: 0x13881,
        symbol: 'MATIC'
    },
    avatestnet: {
        chainId: 0xa869,
        symbol: 'AVAX'
    },

}

let chains = {
    1: "ethereum",
    4: "rinkeby",
    56: "bsc",
    97: "bsctestnet",
    137: "polygon",
    43113: "avatestnet",
    43114: "avax",
    80001: "polygontestnet"
}


function on_wallet_connected() {
    $(".btn_buy").html("Buy Locked Tokens");
    $("#btn_swap").html("Swap");

    // Colony page
    if(typeof check_status == "function") check_status();
}

function on_wrong_network() {
    $(".btn_connect").html("Switch Network");
    $(".btn_connect").removeClass("btn-info");
    $(".btn_connect").removeClass("btn-success");
    $(".btn_connect").addClass("btn-danger");
    $("#btn_swap").html("Switch Network");
}

function init_web3() {

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          // Mikko's test key - don't copy as your mileage may vary
          rpc: {
            1: "https://mainnet.infura.io/v3/6797126c4f0942d99b649046e1ade16d",
            97: "https://speedy-nodes-nyc.moralis.io/cb02b6b8ff2cdd26f1db08a4/bsc/testnet",
            56: `https://bsc-dataseed1.binance.org/`,
            137: `https://speedy-nodes-nyc.moralis.io/cb02b6b8ff2cdd26f1db08a4/polygon/mainnet`,
            80001: `https://speedy-nodes-nyc.moralis.io/cb02b6b8ff2cdd26f1db08a4/polygon/mumbai`,
            43113: `https://speedy-nodes-nyc.moralis.io/cb02b6b8ff2cdd26f1db08a4/avalanche/testnet`,
          }
        }
      },
  
      fortmatic: {
        package: Fortmatic,
        options: {
          // Mikko's TESTNET api key
          key: "pk_test_391E26A3B43A3350"
        }
      }
    };
  
    web3Modal = new Web3Modal({
      cacheProvider: false, // optional
      providerOptions, // required
    });
  
}

async function onConnect() {

    // console.log("Opening a dialog", web3Modal);
    try {
        if(Web3.givenProvider){
            provider = Web3.givenProvider;
        }
        else{
            provider = await web3Modal.connect();
        }
    } catch(e) {
      console.log("Could not get a wallet connection", e);
    //   onConnect();
      return;
    }

    web3 = new Web3(provider);

    web3.currentProvider.on("accountsChanged", _accounts => {
        accounts = _accounts
        if(is_wrong_network()) {
            accounts = [];
            on_wrong_network();
        }
        if (accounts.length == 0) {
            reset_connect_button();
        } else {
            set_connected_address();
        }
    });

    web3.currentProvider.on("chainChanged", () => {
        if (parseInt(web3.currentProvider.chainId) != networks[active_network()].chainId) {
            on_wrong_network();
            accounts = [];
        } else {
            connect_wallet();
        }
    })

    connect_wallet();

    
}

void function main() {

    $(".money").on('keydown', money_validator);
    
    $(".copy_btn").on('click', function () {
        let id = $(this).data('id');
        let text = $("#" + id).text();
        navigator.clipboard.writeText(text);
        notifier.success("Copied to clipboard");
    })

    BN = (str) => (new web3.utils.BN(str));

    init_listners();

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

    init_web3();
    if(localStorage.getItem("walletconnected") == "true")
        connect_wallet();

    $("#chainSelector").on("change", switch_network);
}()

function init_listners() {
}

function connect_wallet() {
    if(!web3){
        return onConnect();
    }
    if(is_wrong_network()) {
        return switch_network();
    }
    if(web3.currentProvider.selectedAddress){
        accounts = [web3.currentProvider.selectedAddress];
        if(is_wrong_network()){
            on_wrong_network();
        }
        else{
            on_wallet_connected();
            set_connected_address();    
        }
        return;
    }
    else if(web3.currentProvider.accounts && web3.currentProvider.accounts.length > 0) {
        accounts = web3.currentProvider.accounts;
        if(is_wrong_network()){
            on_wrong_network();
        }
        else{
            on_wallet_connected();
            set_connected_address();    
        }
        return;
    }

    return web3.eth.requestAccounts()
        .then(_accounts => {
            accounts = _accounts;

            // console.log(accounts);
            if (parseInt(web3.currentProvider.chainId) != networks[active_network()].chainId) {
                $(".btn_connect").html("Switch Network");
                switch_network();
            } else {
                on_wallet_connected();
                set_connected_address();
            }
        })

}

function disconnect_wallet() {
    accounts = [];
    reset_connect_button();
}

function switch_network(net) {
    let network = networks[typeof net == 'string' ? net : active_network()];
    return web3.currentProvider.request({
        
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x' + network.chainId.toString(16) }]
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
    const network = networks[active_network()];
    web3.currentProvider.request({
        method: 'wallet_addEthereumChain',
        params: [{
        chainId: '0x' + network.chainId.toString(16),
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
    $(".btn_connect").html("Connect a Wallet");
    
    localStorage.setItem("walletconnected", false);
    if( typeof accountChanged != "undefined")
        accountChanged();
}

function set_connected_address() {
    $(".btn_connect").html(accounts[0].substr(0, 9) + "...");
    // $("#to").val(accounts[0]);
    if( typeof accountChanged != "undefined")
        accountChanged();

    $(".btn_connect").removeClass("btn-info");
    $(".btn_connect").removeClass("btn-danger");
    $(".btn_connect").addClass("btn-success");

    localStorage.setItem("walletconnected", true);
}

const timer = async (time) => {
    return new Promise(resolve => setTimeout(resolve, time))
};

async function add_to_wallet(token, name) {

    if(is_wrong_network() ) {
        await switch_network();
        await timer(1000);
    }
    if(accounts.length == 0) {
        await connect_wallet();
        await timer(1000);
    }
    token = token.toLowerCase();
    let address = get_contract_address(token);
    let image = token_images[token];
    await add_token_to_metamask(address, name ? name : token.toUpperCase(), decimals[token], image);
}

async function add_to_wallet(token, network) {
    
    if(network) {
        try{
            await switch_network(network);
        } catch(e) {
            return;
        }
        await (() => {
            return new Promise(resolve => setTimeout(resolve, 1000))
        })()
    }
    else if(accounts.length == 0) {
        await connect_wallet();
        await timer(1000)
    }
    token = token.toLowerCase();
    let address = get_contract_address(token);
    let image = token_images[token];
    await add_token_to_metamask(address, token_names[token], decimals[token], image);
}

function is_wrong_network() {
    if(!web3 || accounts.length == 0) return false;
    if(!active_network()) return false;
    return parseInt(web3.currentProvider.chainId) != networks[active_network()].chainId;
}

function active_network() {
    let active =  $("#chainSelector").val();
    return active ? active : "bsc";
}

function money_validator(e) {
    if(e.key == "-")
        e.preventDefault();
}
