
const maxUint = "0x" + "f".repeat(64);

let deposit_address_id;
let request_id;
let fee_percent = 0.0;
let minimum_fee_amount = 15;

void async function main() {
    $("#amountIn").on('input', update_state)
    // $("#network1").on('change', update_state)
    // update_state();
    setInterval(update_state, 5000);
    update_fee();

    // $("#fee").html(minimum_fee_amount);
    check_visible();
    $("#network1").on('change', network1_changed);
    $("#network2").on('change', network2_changed);
    init_swap_inn_block();
    $("#swap_network").click(() => {
        let network1 = get_network1();
        let network2 = get_network2();
        $("#network1").val(network2);
        $("#network2").val(network1);
        $("#network1").trigger('change');
    })
    $(".swapicon").click(function() {
        $(".jax_title_input").toggleClass('active');
        $(".wjax_title_input").toggleClass('active');
    })
}()

async function update_fee() {
    $("#fee").html("...");
    let web3 = new Web3(networks['bsc'].url);
    let abi;
    let decimal;
    let contract_address;
    let network1 = get_network1();
    if(get_token() == "jxn"){
        abi = network1 == "jax" ? abis.jxn_wjxn2 : abis.wjxn2_jxn;
        contract_address = contract_addresses.bsc[network1 == "jax" ? "jxn_wjxn2_bridge" : "wjxn2_jxn_bridge"];
        decimal = decimals.wjxn2;
    }
    else {
        abi = network1.indexOf("jax") == 0 ? abis.jax_wjax : abis.wjax_jax;
        contract_address = contract_addresses.bsc[network1.indexOf("jax") == 0 ? "jax_wjax_bridge" : "wjax_jax_bridge"];
        decimal = decimals.wjax;
    }
    let contract = new web3.eth.Contract(abi, contract_address);
    fee_percent = formatUnit(await contract.methods.fee_percent().call(), 8);
    minimum_fee_amount = formatUnit(await contract.methods.minimum_fee_amount().call(), decimal);
    update_state();
}


function init_swap_inn_block() {
    $(".swap_inn_block").click(function() {
        // $(".swap_inn_block").removeClass('active');
        // $(this).addClass('active');
        let token = $(this).data('token');
        if(token == "jax") {
            $(".option-jxn").hide();
            $(".option-jax").show();
            if(get_network1() == "jax") {
                $("#network1").val("jax1");
                $("#network1").trigger("change");
            }
        }
        else{
            $(".option-jxn").show();
            $(".option-jax").hide();
            if(get_network1().indexOf('jax') == 0 && get_network1().length == 4) {
                $("#network1").val("jax");
                $("#network1").trigger("change");
            }
        }
        $('.tokenName').html(get_token().toUpperCase());
        $('.option-bsc').html('W' + get_token().toUpperCase() + ' BEP-20 (BSC)');
        network1_changed();
        update_state(); 
    })
}

function network1_changed() {
    let network1 = $("#network1").val();
    let network2 = $("#network2").val();
    if(get_token() == "jax" && network2 == "jax"){
        network2 = "jax1";
        $("#network2").val(network2);
    }
    if(get_token() == "jax" && network1.indexOf("jax") == 0 && network2.indexOf("jax") == 0) {
        network2 = "bsc";
        $("#network2").val(network2);
    }
    if(get_token() == "jxn" && network2.length == 4 && network2.indexOf("jax") == 0) {
        network2 = "jax";
        $("#network2").val(network2);
    }
    if(network1 == network2) {
        if(network1.indexOf("jax") == 0)
            $("#network2").val("bsc");
        else if(get_token() == "jax") 
            $("#network2").val("jax1");
        else
            $("#network2").val("jax");
    }   
    update_state();
    check_visible();
}

function network2_changed() {
    let network1 = $("#network1").val();
    let network2 = $("#network2").val();
    if(network1.indexOf('jax') == 0 && network2.indexOf('jax') == 0) {
        $("#network1").val('bsc');
    }
    else if(network1 == network2){
        $("#network1").val(get_token() == 'jax' ? 'jax1' : 'jax');
    }
    update_state();
    check_visible();
}

async function deposit() {

    let network1 = $("#network1").val();
    let network2 = $("#network2").val();
    if(accounts.length == 0){
        connect_wallet();
    }
    const amountIn = $("#amountIn").val();
    let destChainId;
    if(network2 == "bsc" || network2 == "ethereum") {
        destChainId = networks[network2].chainId;
    }
    else destChainId = 0;
    if(get_token() == "jxn") {
        if(network1 == "jax" && network2 == "bsc") {
            const from = $("#from").val();
            const to = $("#to").val();
            if(!validate_source_address(from)) {
                notifier.warning("Invalid source address");
                return;
            }
            bridge_jxn_bsc(amountIn, to, from);
        }
        if(network1 == "bsc" && network2 == "jax") {
            const to = $("#to").val();
            if(!validate_source_address(to)) {
                notifier.warning("Invalid destination address");
                return;
            }
            bridge_bsc_jxn(amountIn, to);
        }
    }
    if(get_token() == "jax") {
        if(network1.indexOf("jax") == 0) {
            let shard_id = network1.split("jax")[1];
            const from = $("#from").val();
            const to = $("#to").val(); 
            if(!validate_source_address(from)) {
                notifier.warning("Invalid source address");
                return;
            }
            bridge_jax_bsc(shard_id, amountIn, to, from);
        }
        if(network1 == "bsc") {
            let shard_id = network2.split("jax")[1];
            const to = $("#to").val();
            if(!validate_source_address(to)) {
                notifier.warning("Invalid destination address");
                return;
            }
            bridge_bsc_jax(shard_id, amountIn, to);
        }
    }
}

async function approve() {
    let bridge_address;
    let network1 = get_network1();
    let token_address;
    if(get_token() == "jxn") {
        if(network1 == "jax")
            bridge_address = contract_addresses.bsc.jxn_wjxn2_bridge;
        else
            bridge_address = contract_addresses.bsc.wjxn2_jxn_bridge;
    }
    if(get_token() == "jax") {
        if(network1.indexOf("jax") == 0)
            bridge_address = contract_addresses.bsc.jax_wjax_bridge;
        else
            bridge_address = contract_addresses.bsc.wjax_jax_bridge;
    }

    let contract = new web3.eth.Contract(erc20ABI, contract_addresses.bsc[get_token() == "jxn" ? "wjxn2" : "wjax"]);
    if((await check_allowance()) != true)
        await approve_token(get_token() == "jxn" ? "WJXN-2": "WJAX", contract, bridge_address, maxUint);
    check_allowance();
}

async function check_allowance() {
    let contract = new web3.eth.Contract(erc20ABI, contract_addresses.bsc[get_token() == "jxn" ? "wjxn2" : "wjax"]);
    let bridge_address;
    let network1 = get_network1();
    let network2 = get_network2();
    if(get_token() == "jxn") {
        if(network1 == "jax")
            return true;
        else
            bridge_address = contract_addresses.bsc.wjxn2_jxn_bridge;
    }
    if(get_token() == "jax") {
        if(network1.indexOf("jax") == 0)
            return true;
        else
            bridge_address = contract_addresses.bsc.wjax_jax_bridge;
    }

    let allowance = await callSmartContract(contract, "allowance", [accounts[0], bridge_address]);
    return allowance >= 500;
}

async function check_status() {
    // await update_status();
    let network1 = $("#network1").val();
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
    update_balance();
    let network1 = $("#network1").val();
    let network2 = $("#network2").val();
    let activeChain = $("#chainSelector").val();
    if(network1 == network2) {
        let currentIndex = $("#network2")[0].selectedIndex;
        $("#network2")[0].selectedIndex = (currentIndex + 1) % 3;
    }
    if(network1.indexOf("jax") != 0 && network1 != activeChain) {
        $("#chainSelector").val(network1);
        $("#chainSelector").trigger("change");
    }
    network2 = $("#network2").val();
    let amountIn = $("#amountIn").val();
    let amountOut = amountIn;
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
            amountOut = amountIn - fee_amount;
    }
    if(network1.indexOf("jax") == 0) {
        amountOut = Math.max(amountIn - fee_amount, 0);
    }
    if(amountOut < 0) amountOut = 0;
    $("#amountOut").val(amountOut);
    $("#fee").html(fee_amount);
    // check_allowance();
    if(network1.indexOf("jax") == 0)
        $("#to").val(accounts[0]);
    else
        $("#from").val(accounts[0]);
    // $(".jxn-bsc #to").val(accounts[0]); 
    check_status();
}


async function update_balance() {
    let network1 = $("#network1").val();
    if(!web3 || accounts.length == 0){
        $("#balance_token1").html(0);
        $("#balance_token2").html(0);
        return;
    }
    let balance = await get_token_balance(get_token() == 'jxn' ? 'wjxn2' : 'wjax')
    balance = Number(balance).toLocaleString();
    if(network1 == "jax")
        $("#balance_token2").html(balance);
    else
        $("#balance_token1").html(balance);
}

async function select_max_balance() {
    let balance = await get_token_balance(get_token() == 'jxn' ? 'wjxn2' : 'wjax')
    $("#amountIn").val(balance);
    update_state();
}

function accountChanged() {
    update_state();
}

async function update_status(contract) {
    // request_id = await callSmartContract(contract, "get_new_request_id");
    try{
        deposit_address_id = await callSmartContract(contract, "get_free_deposit_address_id")
        let deposit_address = await callSmartContract(contract, "deposit_addresses", deposit_address_id);
        $("#depositAddress").val(deposit_address);
        // console.log(request_id, deposit_address_id, deposit_address);
    }catch(e) {
        if(e.message == "execution reverted: All deposit addresses are in use") {
            // request_id = undefined;
            $("#btn_deposit").attr("disabled", true);
        }
    }
}

async function save_email() {
    const email = $("#email").val();
    if(validate_email(email)) {
        axios.post("")
    }
}

function validate_email(email) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
  {
    return (true)   
  }
    // alert("You have entered an invalid email address!")
    return (false)
}
// 17CDWGCQxMHmNfRGMe5uSYVTx15GwV3JRH
function validate_source_address(address) {
    if(address.length != 34) return false;
    if(address[0] != '1') return false;
    let v = normalize(address);
    return validate(v);
}

function check_visible() {
    let network1 = $("#network1").val();
    let network2 = $("#network2").val();
    $(".address").hide();
    if(network1.indexOf("jax") == 0 && network2 == "bsc") {
        $(".jxn-bsc").show();
    }
    if(network1 == "bsc") {
        $(".bsc-jxn").show();
    }
}


async function bridge_jxn_bsc(amountIn, to, from) {
    const func = 'create_request';
    // address to, uint destChainId, uint amount, uint nonce, bytes calldata signature
    let contract = new web3.eth.Contract(abis.jxn_wjxn2, contract_addresses.bsc.jxn_wjxn2_bridge);
    await update_status(contract);
    // const msg = web3.utils.soliditySha3(
    //     {t: 'uint', v: request_id},
    //     {t: 'uint', v: amountIn},
    //   ).toString('hex');

    // const msgHash = web3.eth.accounts.hashMessage(msg)
    if(!deposit_address_id) {
        notifier.warning("Bridge is busy");
        return;
    }
    amountIn = parseUnit(amountIn, decimals.wjxn2);
    const args = [deposit_address_id, amountIn, from];
    const {success, gas, message} = await estimateGas(contract, func, args);
    if(!success) {
        notifier.warning(message);
        return;
    }
    const promi = runSmartContract(contract, func, args);
    await notifier.async(promi
        , null, null, `Creating request`,
        {labels: {async: "Please wait..."}});
    promi.then((tx) => {
        const request_id = tx.events.Create_Request.returnValues.request_id;
        console.log(request_id);
        const path = location.pathname.split("/");
        path.pop();
        location.href = path.join("/") + '/deposit.html' + '?id=' + request_id + "&mode=jxn_bsc";
        
    })
    
}

async function bridge_jax_bsc(shard_id, amountIn, to, from) {
    const func = 'create_request';
    // address to, uint destChainId, uint amount, uint nonce, bytes calldata signature
    let contract = new web3.eth.Contract(abis.jax_wjax, contract_addresses.bsc.jax_wjax_bridge);
    await update_status(contract);
    // const msg = web3.utils.soliditySha3(
    //     {t: 'uint', v: request_id},
    //     {t: 'uint', v: amountIn},
    //   ).toString('hex');

    // const msgHash = web3.eth.accounts.hashMessage(msg)
    if(!deposit_address_id) {
        notifier.warning("Bridge is busy");
        return;
    }
    amountIn = parseUnit(amountIn, decimals.wjax);

    const args = [shard_id, deposit_address_id, amountIn, from];
    const {success, gas, message} = await estimateGas(contract, func, args);
    if(!success) {
        notifier.warning(message);
        return;
    }
    const promi = runSmartContract(contract, func, args);
    await notifier.async(promi
        , null, null, `Creating request`,
        {labels: {async: "Please wait..."}});
    promi.then((tx) => {
        const request_id = tx.events.Create_Request.returnValues.request_id;
        console.log(request_id);
        const path = location.pathname.split("/");
        path.pop();
        location.href = path.join("/") + '/deposit.html' + '?id=' + request_id + "&mode=jax_bsc";
        
    })
    
}

async function bridge_bsc_jax(shard_id, amountIn, to) {
    let contract = new web3.eth.Contract(abis.wjax_jax, contract_addresses.bsc.wjax_jax_bridge);
    let func = "deposit";
    let args = [shard_id, parseUnit(amountIn, decimals.wjax), to];
    const {success, gas, message} = await estimateGas(contract, func, args);
    if(!success) {
        notifier.warning(message);
        return;
    }
    const promi = runSmartContract(contract, func, args);
    await notifier.async(promi
        , null, null, `Depositing`,
        {labels: {async: "Please wait..."}});
    promi.then(tx => {
        const request_id = tx.events.Deposit.returnValues.request_id;
        console.log(request_id);
        goto('status.html' + '?id=' + request_id + "&mode=bsc_jax");
    })
}

async function bridge_bsc_jxn(amountIn, to) {
    let contract = new web3.eth.Contract(abis.wjxn2_jxn, contract_addresses.bsc.wjxn2_jxn_bridge);
    let func = "deposit";
    let args = [parseUnit(amountIn, decimals.wjxn2), to];
    const promi = runSmartContract(contract, func, args);
    await notifier.async(promi
        , null, null, `Depositing`,
        {labels: {async: "Please wait..."}});
    promi.then(tx => {
        const request_id = tx.events.Deposit.returnValues.request_id;
        console.log(request_id);
        goto('status.html' + '?id=' + request_id + "&mode=bsc_jxn");
    })
}

function get_network1() {
    return $("#network1").val();
}

function get_network2() {
    return $("#network2").val();
}

function get_token() {
    return $(".swap_inn_block.active").data('token');
}






//17CDWGCQxMHmNfRGMe5uSYVTx15GwV3JRH