const MAX_UINT = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

let is_wjxn_to_hst = true;

async function approve() {
    if(accounts.length == 0){
        return;
    }
    let contract = new web3.eth.Contract(erc20ABI, contract_addresses.wjxn);
    runContract(contract, "approve", [contract_addresses.haber, MAX_UINT], {confirmationTitle: "Approving WJXN", pendingTitle: "Approving WJXN"})
}

async function swap() {
    if(accounts.length == 0){
        connect_wallet();
        return;
    }
    let amountIn = $("#amountIn").val();
    if(is_wjxn_to_hst) {
        await _mint_haber(amountIn);
    }
    else {
        amountIn = parseInt(amountIn / 1e8);
        await _burn_haber(amountIn);
    }
    $("#amountIn").val("");
    check_status();
}

async function _mint_haber(amount) {
    let contract = new web3.eth.Contract(abis.haber, contract_addresses.haber);
    runContract(contract, "mint", [amount], {confirmationTitle: "Swapping WJXN to HST", pendingTitle: "Swapping WJXN to HST"})
}

async function _burn_haber(amount) {
    let contract = new web3.eth.Contract(abis.haber, contract_addresses.haber);
    runContract(contract, "burn", [amount], {confirmationTitle: "Swapping WJXN to HST", pendingTitle: "Swapping WJXN to HST"});
}

async function check_status() {
    update_balance();
    if(accounts.length == 0) {
        $("#btn_swap").html("Connect wallet");
        $("#btn_swap").show();
        return;
    }
    let allowance = await callSmartContract(new web3.eth.Contract(erc20ABI, contract_addresses.wjxn), "allowance", [accounts[0], contract_addresses.haber]);
    allowance = formatUnit(allowance);
    let amountIn = $("#amountIn").val();
    if(amountIn && allowance < amountIn) {
        $("#btn_approve").show();
        $("#btn_swap").hide();
        return;
    }
    else {
        $("#btn_approve").hide();
        $("#btn_swap").show();
    }
}

async function update_balance() {
    if(!web3 || accounts.length == 0){
        $("#balance_token1").html(0);
        $("#balance_token2").html(0);
        return;
    }
    let [balance_wjxn, balance_hst] = await Promise.all([
        get_token_balance("wjxn"),
        get_token_balance("hst")
    ])
    balance_wjxn = Number(balance_wjxn).toLocaleString();
    balance_hst = Number(balance_hst).toLocaleString();
    if(is_wjxn_to_hst) {
        $("#balance_token1").html(balance_wjxn);
        $("#balance_token2").html(balance_hst);
    }
    else {
        $("#balance_token1").html(balance_hst);
        $("#balance_token2").html(balance_wjxn);
    }
}

function onAmountInChanged() {
    let amountIn = parseInt($("#amountIn").val());
    let amountOut;
    if(is_wjxn_to_hst) 
        amountOut = amountIn * 1e8;
    else amountOut = Math.floor(amountIn / 1e8);
    $("#amountOut").html(amountOut.toLocaleString());
}

function _get_amount_out() {
    let amountIn = $("#amountIn").val();
    let amountOut;
    if(is_wjxn_to_hst) 
        amountOut = amountIn * 1e8;
    else amountOut = parseInt(amountIn / 1e8);
    return amountOut;
}

async function select_max_balance() {
    let [balance_wjxn, balance_hst] = await Promise.all([
        get_token_balance("wjxn"),
        get_token_balance("hst")
    ])
    if(is_wjxn_to_hst) {
        $("#amountIn").val(balance_wjxn);
    }
    else {
        $("#amountIn").val(balance_hst);
    }
    onAmountInChanged();
}

function swap_currency() {
    let amountOut = _get_amount_out();
    is_wjxn_to_hst = !is_wjxn_to_hst;
    if(is_wjxn_to_hst) {
        $("#token1 img").attr("src", "img/jxnLogo.png");
        $("#token1 .token_name").html("WJXN");
        $("#token2 img").attr("src", "img/hst.png");
        $("#token2 .token_name").html("HST");
    }
    else {
        $("#token1 img").attr("src", "img/hst.png");
        $("#token1 .token_name").html("HST");
        $("#token2 img").attr("src", "img/jxnLogo.png");
        $("#token2 .token_name").html("WJXN");
    }
    $("#amountIn").val(amountOut);
    onAmountInChanged();
    check_status();
}

void async function main() {
    $("#amountIn").on('input', onAmountInChanged);
    $("#btn_swap").on('click', swap);
    $("#btn_approve").on('click', approve);
    check_status();
    setInterval(check_status, 10000);
}()