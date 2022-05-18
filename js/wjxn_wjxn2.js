const MAX_UINT = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

let is_wjxn_to_wjxn2 = true;

async function approve() {
    if(accounts.length == 0){
        return;
    }
    let contract = new web3.eth.Contract(erc20ABI, contract_addresses.wjxn);
    await runContract(contract, "approve", [contract_addresses.wjxn2, MAX_UINT], {confirmationTitle: "Approving WJXN", pendingTitle: "Approving WJXN"})
    check_status();
}

async function swap() {
    if(accounts.length == 0 || is_wrong_network()){
        connect_wallet();
        return;
    }
    let amountIn = $("#amountIn").val();
    if(is_wjxn_to_wjxn2) {
        await _mint_wjxn2(amountIn);
    }
    else {
        amountIn = parseInt(amountIn);
        await _burn_wjxn2(amountIn);
    }
    // $("#amountIn").val("");
    check_status();
}

function _mint_wjxn2(amount) {
    let contract = new web3.eth.Contract(abis.wjxn2, contract_addresses.wjxn2);
    return runContract(contract, "swapWjxnToWjxn2", [amount], {confirmationTitle: "Swapping WJXN to wjxn2", pendingTitle: "Swapping WJXN to wjxn2"})
}

function _burn_wjxn2(amount) {
    let contract = new web3.eth.Contract(abis.wjxn2, contract_addresses.wjxn2);
    return runContract(contract, "swapWjxn2ToWjxn", [amount], {confirmationTitle: "Swapping WJXN to wjxn2", pendingTitle: "Swapping WJXN to wjxn2"});
}

async function check_status() {
    update_balance();
    if(accounts.length == 0) {
        $("#btn_swap").html("Connect wallet");
        $("#btn_swap").show();
        return;
    }
    let allowance = await callSmartContract(new web3.eth.Contract(erc20ABI, contract_addresses.wjxn), "allowance", [accounts[0], contract_addresses.wjxn2]);
    allowance = formatUnit(allowance);
    let amountIn = $("#amountIn").val();
    if(allowance == 0 || (amountIn && allowance < amountIn)) {
        $("#btn_approve").show();
        $("#btn_swap").html("Swap");
        $("#btn_swap").attr("disabled", true);
        $("#btn_swap").show();
        return;
    }
    else {
        $("#btn_approve").hide();
        $("#btn_swap").show();
        $("#btn_swap").attr("disabled", false);
    }
}

function accountChanged() {
    check_status();
}

async function update_balance() {
    if(!web3 || accounts.length == 0){
        $("#balance_token1").html(0);
        $("#balance_token2").html(0);
        return;
    }
    let [balance_wjxn, balance_wjxn2] = await Promise.all([
        get_token_balance("wjxn"),
        get_token_balance("wjxn2")
    ])
    balance_wjxn = Number(balance_wjxn).toLocaleString();
    balance_wjxn2 = Number(balance_wjxn2).toLocaleString();
    if(is_wjxn_to_wjxn2) {
        $("#balance_token1").html(balance_wjxn);
        $("#balance_token2").html(balance_wjxn2);
    }
    else {
        $("#balance_token1").html(balance_wjxn2);
        $("#balance_token2").html(balance_wjxn);
    }
}

function onAmountInChanged() {
    let amountIn = parseInt($("#amountIn").val());
    let amountOut;
    if(is_wjxn_to_wjxn2) 
        amountOut = amountIn;
    else amountOut = Math.floor(amountIn);
    $("#amountOut").html(amountOut.toLocaleString());
}

function _get_amount_out() {
    let amountIn = $("#amountIn").val();
    let amountOut;
    if(is_wjxn_to_wjxn2) 
        amountOut = amountIn;
    else amountOut = parseInt(amountIn);
    return amountOut;
}

async function select_max_balance() {
    let [balance_wjxn, balance_wjxn2] = await Promise.all([
        get_token_balance("wjxn"),
        get_token_balance("wjxn2")
    ])
    if(is_wjxn_to_wjxn2) {
        $("#amountIn").val(balance_wjxn);
    }
    else {
        $("#amountIn").val(balance_wjxn2);
    }
    onAmountInChanged();
}

function swap_currency() {
    let bro = _get_amount_out();
    is_wjxn_to_wjxn2 = !is_wjxn_to_wjxn2;
    if(is_wjxn_to_wjxn2) {
        $("#token1 img").attr("src", "img/jxnLogo.png");
        $("#token1 .token_name").html("WJXN");
        $("#token2 img").attr("src", "img/jxnLogo.png");
        $("#token2 .token_name").html("WJXN-2");
    }
    else {
        $("#token1 img").attr("src", "img/jxnLogo.png");
        $("#token1 .token_name").html("WJXN-2");
        $("#token2 img").attr("src", "img/jxnLogo.png");
        $("#token2 .token_name").html("WJXN");
    }
    $("#amountIn").val(bro);
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