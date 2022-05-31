
let web3;
let accounts = [];

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

function on_wallet_connected() {
    $(".btn_connect").html(accounts[0].substr(0, 9) + "...");
}

function on_wallet_disconnected() {
    $(".btn_connect").html("Connect a Wallet");
}

function on_wrong_network() {
    $(".btn_connect").html("Switch Network");
}

void function main() {
    if(Web3.givenProvider)
        connect_wallet();
}()

function connect_wallet() {
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
            }
        })
        .catch(error => {
            console.error(error);
        })

}

function switch_network() {
    web3.currentProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x' + networks[active_network()].chainId.toString(16) }]
        })
        .then(() => {
            console.log("switched");
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

async function add_token_to_metamask(address, symbol, decimals, image) {
    return await web3.currentProvider.request({
        method: 'wallet_watchAsset',
        params: {
            type: 'ERC20',
            options: {
                address,
                symbol,
                decimals,
                image,
            },
        },
    });
}

function is_wrong_network() {
    if(!web3 || accounts.length == 0) return false;
    if(!active_network()) return false;
    return parseInt(web3.currentProvider.chainId) != networks[active_network()].chainId;
}

function active_network() {
    return "bsctestnet";
}
