const MAX_UINT = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

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
    await _mint_haber(amountIn);
}

async function _mint_haber(amount) {
    let contract = new web3.eth.Contract(abis.haber, contract_addresses.haber);
    runContract(contract, "mint", [amount], {confirmationTitle: "Swapping WJXN to HST", pendingTitle: "Swapping WJXN to HST"})
}

async function check_status() {
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

function onAmountInChanged() {
    let amountIn = $("#amountIn").val();
    let amountOut = amountIn * 1e8;
    $("#amountOut").html(amountOut.toLocaleString());
}

void async function main() {
    $("#amountIn").on('input', onAmountInChanged);
    $("#btn_swap").on('click', swap);
    $("#btn_approve").on('click', approve);
    check_status();
    setInterval(check_status, 10000);
}()