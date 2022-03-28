
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
    // ethereum: {
    //     chainId: 0x1,
    //     symbol: 'ETH'
    // },
    ethereum: {
        chainId: 0x4,
        symbol: 'ETH',
        blockExplorer: 'https://rinkeby.etherscan.io',
    },
    bsc: {
        chainId: 0x61,
        chainName: 'Binance Smart Chain Testnet',
        blockExplorer: 'https://testnet.bscscan.com',
        symbol: 'BNB'
    },
    // bsc: {
    //     chainId: 0x38,
    //     chainName: 'Binance Smart Chain Mainnet',
    //     blockExplorer: 'https://bscscan.com',
    //     symbol: 'BNB'
    // },
    polygonmainnet: {
        chainId: 0x89,
        symbol: 'MATIC'
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


function on_wallet_connected() {
    $(".btn_buy").html("Buy Locked Tokens");
    $("#btn_swap").html("&nbsp;");

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
      onConnect();
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


    $(".copy_btn").on('click', function () {
        let id = $(this).data('id');
        let text = $("#" + id).html();
        navigator.clipboard.writeText(text);
        notifier.success("Copied to clipboard");
    })

    on_wallet_disconnected();

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
    connect_wallet();

    $("#chainSelector").on("change", switch_network);
}()

function init_listners() {
}

function connect_wallet() {
    if(!web3){
        onConnect();
        return;
    }
    if(is_wrong_network()) {
        switch_network();
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
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x' + networks[active_network()].chainId.toString(16) }]
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
    $("#balance_1").html("Balance:");
    $("#balance_2").html("Balance:");
}

function set_connected_address() {
    $(".btn_connect").html(accounts[0].substr(0, 9) + "...");
    $("#to").val(accounts[0]);
    if( typeof accountChanged != "undefined")
        accountChanged();

    $(".btn_connect").removeClass("btn-info");
    $(".btn_connect").removeClass("btn-danger");
    $(".btn_connect").addClass("btn-success");
}

async function get_balance_token(token, id) {
    if (accounts.length == 0) return 0;
    if(!contracts) return 0;
    let contract = new web3.eth.Contract(minABI, tokens[token].address);
    const [balance, decimals] = await Promise.all([
            contract.methods.balanceOf(accounts[0]).call(),
            contract.methods.decimals().call()
        ])
    let real_balance = parseInt(balance) / (10 ** decimals);
    $(`#${id}`).html(`Balance: ${floor(real_balance, 2)} ${token}`)
    return balance;
}

function floor(n, digit) {
    str = n.toFixed(17)
    a = str.split(".")
    if (Number(a[1]) == 0)
        return a[0]
    return a[0] + "." + a[1].replace(/0+$/, "").substr(0, digit)
}

function toUint(amount, decimals) {
    const splits = amount.split(".")
    if (splits.length == 1) splits[1] = "";
    splits[1] = splits[1].substr(0, decimals);
    return splits[0] + splits[1] + "0".repeat(decimals - splits[1].length)
}

function fromUint(amount, decimals) {
    return parseFloat(amount) / (10 ** decimals)
}

async function show_reserves() {
    const { data } = await axios.get('/api/reserves')
    Object.keys(data).map(key => {
        $(`#${key}`).html(data[key])
    });
}

async function get_balance_of(token, address) {
    let contract = new web3.eth.Contract(minABI, tokens[token].address);
    const balance = await contract.methods.balanceOf(address).call();
    return balance;
}

async function get_total_supply(token) {
    let contract = new web3.eth.Contract(minABI, tokens[token].address);
    const [total_supply, decimals] = await Promise.all([
        contract.methods.totalSupply().call(),
        contract.methods.decimals().call()
    ])
    return total_supply / (10 ** decimals);
}


async function get_fees() {
    get_exchange_rates();

    const { data } = await axios.get('/api/fees');

    Object.keys(data).forEach(each => {
        $(`#${each}`).html(data[each] * 100 + "%")
    })

}

function get_tx_fee(token) {
    let contract = new web3.eth.Contract(minABI, tokens[token].address);
    return contract.methods.transaction_fee().call()
}

async function get_exchange_rates() {
    const { data } = await axios.get('/api/exchange_rates')

    Object.keys(data).forEach(id => {
        $(`#${id}`).html(floor(data[id], 8));
    })
}

// ?input=WJAX&output=JAXUD
function pre_select_currency() {
    const query = window.location.search;
    if (query.length <= 1) return;
    const params = query.substr(1).split("&");
    const input = params[0].split('=')[1]
    const output = params[1].split('=')[1]
    if (Object.keys(tokens).indexOf(input) < 0)
        return;
    if (tokens[input].exchanges.indexOf(output) < 0)
        return;
    $("#token_1").val(input);
    on_token_changed({ target: $("#token_1")[0] }, output)
}

/// Colony.html

async function register_colony() {

    if (accounts.length == 0) {
        connect_wallet();
        return;
    }

    const keys = ["tx_tax", "policy_link", "policy_hash", "mother_colony_public_key"];
    const values = keys.map(key => $(`#${key}`).val());
    console.log("register_colony", keys, values);
    let contract = new web3.eth.Contract(mainABI, contract_address);
    try {
        (await contract.methods.register_colony(...values).send({ from: accounts[0] }))
    } catch (e) {
        console.log("failed");
        return;
    }

    notifier.async(
        contract.methods.register_colony(...values).send({ from: accounts[0] })
        .then(() => {
            notifier.success("Colony registered");
        })
        .catch(error => {
            if (error.code != 4001) {
                notifier.alert(error.message);
            }
            console.error(error);
        }), null, null, "Please, wait...", {
            labels: {
                async: "Registering your colony..."
            }
        }
    )

}

async function set_colony_address() {

    if (accounts.length == 0) {
        connect_wallet();
        return;
    }

    const colony_address = $("#colony_address").val();
    
    let contract = new web3.eth.Contract(mainABI, contract_address);
    
    notifier.async(
        contract.methods.set_colony_address(colony_address).send({ from: accounts[0] })
        .then(() => {
            notifier.success("Colony registered");
        })
        .catch(error => {
            if (error.code != 4001) {
                notifier.alert(error.message);
            }
            console.error(error);
        }), null, null, "Please, wait...", {
            labels: {
                async: "Registering your colony..."
            }
        }
    )
}

async function get_clony_info() {
    let contract = new web3.eth.Contract(mainABI, tokens['JAXUD'].address);
    const {
        0: {
            _level: level,
            _transaction_tax: tx_tax,
            _policy_hash: polic_hash,
            _policy_link: policy_link
        },
        1: mother_colony_address
    } = await contract.methods.getColonyInfo.call();
    console.log({
        level,
        tx_tax,
        polic_hash,
        policy_link,
        mother_colony_address
    });
}

async function buylockedtokens(plan) {
    if( accounts.length == 0) {
        await connect_wallet();
        return;
    }
    let contract = new web3.eth.Contract(locked_abi, locked_token_sale_address);
    let amount = $("#amount" + plan).val();
    if(amount < 100){
        notifier.alert("Amount should not be less than 100");
    }
    let value = amount * (await contract.methods.getLockedTokenPrice(plan).call()) * 1.1;
    let referrer = $("#referral" + plan).val();
    if(referrer == "") referrer = "0x0000000000000000000000000000000000000000"
    notifier.async(
        contract.methods.buyLockedTokens(plan, amount, referrer).send({ from: accounts[0], value })
        .then(() => {
            // // real_time_update();
            // notifier.success("Transaction Completed");
        })
        .catch(error => {
            if (error.code != 4001) {
                notifier.alert(error.message);
            }
            console.error(error);
        }), null, null, "Please, wait...", {
            labels: {
                async: "Transaction is in progress..."
            }
        }
    )
}

async function add_to_wallet(token) {
    let {address, decimals, image} = tokens[token];
    await add_token_to_metamask(address, token, decimals, image);
}

function is_wrong_network() {
    return parseInt(web3.currentProvider.chainId) != networks[active_network()].chainId;
}

function active_network() {
    return $("#chainSelector").val();
}