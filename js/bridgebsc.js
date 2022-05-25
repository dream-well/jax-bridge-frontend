
const maxUint = "0x" + "f".repeat(64);

let deposit_address_id;
let request_id;
let fee_percent = 0.0;
let minimum_fee_amount = 15;

void async function main() {
    $("#amountIn").on('input', update_state)
    $("#network1").on('change', update_fee)
    $("#network2").on('change', update_fee)
    update_fee();
    setInterval(check_status, 3000);
    check_status();
}()

async function deposit() {
    let network1 = $("#network1").val();
    let network2 = $("#network2").val();
    if(accounts.length == 0){
        connect_wallet();
    }
    let amountIn = $("#amountIn").val();
    const from = $("#from").val();
    const to = $("#to").val();
    let srcChainId = networks[network1].chainId;
    let destChainId = networks[network2].chainId;
    const func = 'deposit';
    // address to, uint destChainId, uint amount, uint nonce, bytes calldata signature
    let contract = new web3.eth.Contract(jaxBridgeEvmABI, contract_addresses[`${active_token}_` + active_network()]);

    amountIn = parseUnit(amountIn, decimals[active_token]);
    const args = [destChainId, amountIn];
    const {success, gas, message} = await estimateGas(contract, func, args);
    if(!success) {
        notifier.warning(message);
        return;
    }
    const promi = runSmartContract(contract, func, args);
    await notifier.async(promi
        , null, null, `Depositing`,
        {labels: {async: "Please wait..."}});
    promi.then((e) => {
        const request_id = e.events.Deposit.returnValues.request_id;
        const path = location.pathname.split("/");
        path.pop();
        location.href = path.join("/") + 
            '/statusbsc.html' + 
            '?id=' + parseInt(request_id) +     
            '&token=' + active_token +
            '&srcChain=' + network1.trim() + 
            '&destChain=' + network2.trim();
        
    })
    
}

async function update_fee() {
    let network1 = $("#network1").val();
    let network2 = $("#network2").val();
    let activeChain = $("#chainSelector").val();
    if(network1 == network2) {
        let currentIndex = $("#network1")[0].selectedIndex;
        $("#network2")[0].selectedIndex = (currentIndex + 1) % 2;
    }
    if(network1 != "jax" && network1 != activeChain) {
        $("#chainSelector").val(network1);
        $("#chainSelector").trigger("change");
    }
    network2 = $("#network2").val();
    $("#fee").html("-");
    let web3 = new Web3(networks[network1].url);
    let contract = new web3.eth.Contract(jaxBridgeEvmABI, contract_addresses[`${active_token}_` + active_network()]);
    let destChainId = networks[network2].chainId;
    fee_percent = formatUnit(await contract.methods.fee_percent(destChainId).call(), 8);
    minimum_fee_amount = formatUnit(await contract.methods.minimum_fee_amount(destChainId).call(), decimals[active_token]);
    update_state();
}

async function approve() {
    let contract = new web3.eth.Contract(erc20ABI, get_contract_address(active_token));
    if((await check_allowance()) != true)
        approve_token(active_token.toUpperCase(), contract, contract_addresses[`${active_token}_` + active_network()], maxUint);
}

async function check_allowance() {
    let contract = new web3.eth.Contract(erc20ABI, get_contract_address(active_token));
    let allowance = await callSmartContract(contract, "allowance", [accounts[0], contract_addresses[`${active_token}_` + active_network()]]);
    return allowance >= 500;
}

async function check_status() {
    // await update_status();
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
    update_balance();
}

async function update_balance() {
    let contract = new web3.eth.Contract(erc20ABI, get_contract_address(active_token));
    $("#balance").html(await get_balance(contract, decimals[active_token]));
}

async function select_max_balance() {
    let contract = new web3.eth.Contract(erc20ABI, get_contract_address(active_token));
    let balance = await get_balance(contract, decimals[active_token]);
    $("#amountIn").val(balance);
    update_state();
}

async function update_state() {
    let amountIn = $("#amountIn").val();
    let amountOut;
    let fee_amount = amountIn * fee_percent;
    if(fee_amount < minimum_fee_amount) fee_amount = minimum_fee_amount;
    fee_amount = parseInt(fee_amount);
    amountOut = Math.max(amountIn - fee_amount, 0);
    if(amountOut < 0) amountOut = 0;
    $("#amountOut").val(amountOut);
    $("#fee").html(fee_amount);
}

function accountChanged() {
    let account = accounts[0];
    $("#to").val(account);
    check_status();
}

async function update_status() {
    let contract = new web3.eth.Contract(jaxBridgeABI, contract_addresses[`${active_token}_` + active_network()]);
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

function reverse_networks() {
    let network1 = $("#network1").val();
    let network2 = $("#network2").val();
    $("#network1").val(network2);
    $("#network2").val(network1);
    update_state();
}