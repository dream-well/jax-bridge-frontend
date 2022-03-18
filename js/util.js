
function parseUnit(number, decimal = 18) {
    return BN(number).mul(BN(10).pow(BN(decimal))).toString();
}

function formatUnit(number, decimal = 18, fractionDigits = 6) {
    if(typeof number != "string") number = "0";
    if(number.length <= decimal) number = "0".repeat(decimal + 1 - number.length) + number;
    number = Number(number.substr(0, number.length - decimal) + "." + number.substr(number.length - decimal)).toFixed(fractionDigits);
    return Number(number);
}

function callSmartContract(contract, func, ...args) {
    if(!contract) return false;
    if(!contract.methods[func]) return false;
    return contract.methods[func](...args).call();
}

async function runSmartContract(contract, func, ...args) {
    if(accounts.length == 0) return false;
    if(!contract) return false;
    if(!contract.methods[func]) return false;
    return contract.methods[func](...args).send({ from: accounts[0] })
}

async function estimateGas(contract, func, ...args) {
    try {
        const gasAmount = await contract.methods[func](...args).estimateGas({from: accounts[0]});
        return {
            success: true,
            gas: gasAmount
        }
    } catch(e) {
        if(e.message.startsWith("Internal JSON-RPC error.")) {
            e = JSON.parse(e.message.substr(24));
        }
        return {
            success: false,
            gas: -1,
            message: e.message
        }
    }
}

async function approve_token(token_name, contract, spender, amount) {
    const promise = runSmartContract(contract, "approve", spender, amount);
    notifier.async(promise, null, null, `Approving ${token_name}`, {labels: {
        async: "Please wait..."
    }});
    try{
        await promise;
    }catch(e){
        return false;
    }
    return true;
}

async function get_balance(contract, decimal) {
    let balance = -1;
    if(accounts.length) {
        balance = await callSmartContract(contract, 'balanceOf', accounts[0]);
        balance = formatUnit(balance, decimal ?? await get_decimal(contract));
    }
    return balance;
}

async function get_decimal(contract) {
    let decimal = await callSmartContract(contract, 'decimals');
    if(decimal === false) return -1;
    return decimal;
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