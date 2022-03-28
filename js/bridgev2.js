
const maxUint = "0x" + "f".repeat(64);

let deposit_address_id;
let request_id;
let fee_percent = 0.0;
let minimum_fee_amount = 50;

void async function main() {
    $("#amountIn").on('input', update_state)
    $("#network1").on('change', update_state)
    $("#network2").on('change', update_state)
    update_state();
    setInterval(check_status, 3000);
    check_status();
}()

async function deposit() {
    let network1 = $("#network1").val();
    let network2 = $("#network2").val();
    if(accounts.length == 0){
        connect_wallet();
    }
    const amountIn = $("#amountIn").val();
    const from = $("#from").val();
    const to = $("#to").val();
    let destChainId;
    if(network2 == "bsc" || network2 == "ethereum") {
        destChainId = networks[network2].chainId;
    }
    else destChainId = 0;
    const func = 'create_request';
    // address to, uint destChainId, uint amount, uint nonce, bytes calldata signature
    let contract = new web3.eth.Contract(jaxBridgeABI, contract_addresses.jaxBridge);
    const msg = web3.utils.soliditySha3(
        {t: 'uint', v: request_id},
        {t: 'uint', v: amountIn},
      ).toString('hex');

    const msgHash = web3.eth.accounts.hashMessage(msg)

    const args = [request_id, amountIn, deposit_address_id, to, from];
    const {success, gas, message} = await estimateGas(contract, func, args);
    if(!success) {
        notifier.warning(message);
        return;
    }
    const promi = runSmartContract(contract, func, args);
    await notifier.async(promi
        , null, null, `Create request`,
        {labels: {async: "Please wait..."}});
    promi.then(() => {
        const path = location.pathname.split("/");
        path.pop();
        location.href = path.join("/") + '/deposit.html' + '?id=' + request_id;
        
    })
    
}

async function approve() {
    let contract = new web3.eth.Contract(erc20ABI, contract_addresses.wjxn);
    if((await check_allowance()) != true)
        approve_token("WJXN", contract, contract_addresses.jaxBridge, maxUint);
}

async function check_allowance() {
    let contract = new web3.eth.Contract(erc20ABI, contract_addresses.wjxn);
    let allowance = await callSmartContract(contract, "allowance", [accounts[0], contract_addresses.jaxBridge]);
    return allowance >= 500;
}

async function check_status() {
    await update_status();
    let network1 = $("#network1").val();
    if(network1 == "jax") {
        if(request_id)
            $("#btn_deposit").attr("disabled", false);
        else
            $("#btn_deposit").attr("disabled", true);
        $("#btn_approve").hide();
        return;
    }
    if(await check_allowance()) {
        $("#btn_approve").hide();
        $("#btn_deposit").attr("disabled", false);
    }
    else {
        $("#btn_approve").show();
        $("#btn_deposit").attr("disabled", true);
    }
}

async function update_state() {
    let network1 = $("#network1").val();
    let network2 = $("#network2").val();
    let activeChain = $("#chainSelector").val();
    if(network1 == network2) {
        let currentIndex = $("#network2")[0].selectedIndex;
        $("#network2")[0].selectedIndex = (currentIndex + 1) % 3;
    }
    if(network1 != "jax" && network1 != activeChain) {
        $("#chainSelector").val(network1);
        $("#chainSelector").trigger("change");
    }
    network2 = $("#network2").val();
    let amountIn = $("#amountIn").val();
    let amountOut;
    let fee_amount = amountIn * fee_percent;
    if(fee_amount < minimum_fee_amount) fee_amount = minimum_fee_amount;
    fee_amount = parseInt(fee_amount);
    if(network1 == "ethereum") {
        if(network2 == "bsc")
            amountOut = amountIn;
        else
            amountOut = Math.max(amountIn - fee_amount, 0);
    }
    if(network1 == "bsc") {
        if(network1 == "ethereum")
            amountOut = amountIn;
        else
            amountOut = amountIn - 50;
    }
    if(network1 == "jax") {
        amountOut = Math.max(amountIn - fee_amount, 0);
    }
    if(amountOut < 0) amountOut = 0;
    $("#amountOut").val(amountOut);
}

function accountChanged() {
    let account = accounts[0];
    $("#to").val(account);
    check_status();
}

async function update_status() {
    let contract = new web3.eth.Contract(jaxBridgeABI, contract_addresses.jaxBridge);
    request_id = await callSmartContract(contract, "get_new_request_id");
    try{
        deposit_address_id = await callSmartContract(contract, "get_free_deposit_address_id")
        let deposit_address = await callSmartContract(contract, "deposit_addresses", deposit_address_id);
        $("#depositAddress").val(deposit_address);
        console.log(request_id, deposit_address_id, deposit_address);
    }catch(e) {
        if(e.message == "execution reverted: All deposit addresses are in use") {
            request_id = undefined;
            $("#btn_deposit").attr("disabled", true);
        }
    }
}