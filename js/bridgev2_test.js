
const maxUint = "0x" + "f".repeat(64);

let deposit_address_id;
let request_id;
let fee_percent = 0.0;
let minimum_fee_amount = 15;

void async function main() {
    $("#amountIn").on('input', update_state)
    // $("#network1").on('change', update_state)
    // update_state();
    setInterval(update_state, 3000);
    update_state();

    $("#fee").html(minimum_fee_amount);
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

function init_swap_inn_block() {
    $(".swap_inn_block").click(function() {
        $(".swap_inn_block").removeClass('active');
        $(this).addClass('active');
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
    let contract = new web3.eth.Contract(erc20ABI, contract_addresses.wjxn);
    let bridge_address;
    let network1 = get_network1();
    if(get_token() == "jxn") {
        if(network1 == "jax")
            bridge_address = contract_addresses.jxn_bsc;
        else
            bridge_address = contract_addresses.bsc_jxn;
    }
    if(get_token() == "jax") {
        if(network1.indexOf("jax") == 0)
            bridge_address = contract_addresses.jax_bsc;
        else
            bridge_address = contract_addresses.bsc_jax;
    }

    if((await check_allowance()) != true)
        await approve_token("WJXN", contract, bridge_address, maxUint);
    check_allowance();
}

async function check_allowance() {
    let contract = new web3.eth.Contract(erc20ABI, contract_addresses.wjxn);
    let bridge_address;
    let network1 = get_network1();
    let network2 = get_network2();
    if(get_token() == "jxn") {
        if(network1 == "jax")
            return true;
        else
            bridge_address = contract_addresses.bsc_jxn;
    }
    if(get_token() == "jax") {
        if(network1.indexOf("jax") == 0)
            return true;
        else
            bridge_address = contract_addresses.bsc_jax;
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
    // check_allowance();
    $(".jxn-bsc #to").val(accounts[0]); 
    check_status();
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
    let contract = new web3.eth.Contract(abis.jxn_bsc, contract_addresses.jxn_bsc);
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

    const args = [amountIn, deposit_address_id, to, from];
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
        location.href = path.join("/") + '/deposit_test.html' + '?id=' + request_id + "&mode=jxn_bsc";
        
    })
    
}

async function bridge_jax_bsc(shard_id, amountIn, to, from) {
    const func = 'create_request';
    // address to, uint destChainId, uint amount, uint nonce, bytes calldata signature
    let contract = new web3.eth.Contract(abis.jax_bsc, contract_addresses.jax_bsc);
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

    const args = [shard_id, amountIn, deposit_address_id, to, from];
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
        location.href = path.join("/") + '/deposit_test.html' + '?id=' + request_id + "&mode=jax_bsc";
        
    })
    
}

async function bridge_bsc_jax(shard_id, amountIn, to) {
    let contract = new web3.eth.Contract(abis.bsc_jax, contract_addresses.bsc_jax);
    let func = "create_request";
    let args = [shard_id, amountIn, to];
    const promi = runSmartContract(contract, func, args);
    await notifier.async(promi
        , null, null, `Creating request`,
        {labels: {async: "Please wait..."}});
    promi.then(tx => {
        const request_id = tx.events.Create_Request.returnValues.request_id;
        console.log(request_id);
        goto('status_test.html' + '?id=' + request_id + "&mode=bsc_jax");
    })
}

async function bridge_bsc_jxn(amountIn, to) {
    let contract = new web3.eth.Contract(abis.bsc_jxn, contract_addresses.bsc_jxn);
    let func = "create_request";
    let args = [amountIn, to];
    const promi = runSmartContract(contract, func, args);
    await notifier.async(promi
        , null, null, `Creating request`,
        {labels: {async: "Please wait..."}});
    promi.then(tx => {
        const request_id = tx.events.Create_Request.returnValues.request_id;
        console.log(request_id);
        goto('status_test.html' + '?id=' + request_id + "&mode=bsc_jxn");
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