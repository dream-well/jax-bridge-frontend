let due_timestamp;
let request_id;
let mode;
var qrcode = new QRCode("qrcode", {
	width : 160,
	height : 160
});

void async function main() {
    $("#link").html(location.href);
    parseQuery();
    accountChanged();
    setInterval(check_timestamp, 1000);
}()

function parseQuery() {
    const query = location.search.substr(1);
    const paramList = query.split("&");
    const params = paramList.reduce((a, b) => Object.assign(a, {[b.split('=')[0]]: b.split('=')[1] }), {});
    mode = params.mode;
    if(mode == "jax_bsc") {
        $("#tokenName").html("JAX");
    }
    if(Object.keys(params).includes("id")){
        request_id = params.id;
        get_status();
    }   
    else
        goto404();
}

function get_status() {
    switch(mode) {
        case 'jxn_bsc':
            _jxn_bsc();
            return;
        case 'jax_bsc':
            _jax_bsc();
            break;
        default:
            return;
    }
}

async function accountChanged() {
    let account = accounts[0];
    if(!account) return;
}

async function _jxn_bsc() {
    const web3 = new Web3(networks.bsc.url);
    let contract = new web3.eth.Contract(abis.jxn_wjxn2, contract_addresses.bsc.jxn_wjxn2_bridge);
    try {
        let { amount, from, deposit_address_id, status, valid_until } = await callSmartContract(contract, "requests", [request_id]);
        console.log(amount, from, deposit_address_id, status);
        if(parseInt(status) > 0) {
            goto('status.html' + '?id=' + request_id + "&mode=" + mode);
        }
        let deposit_address = await callSmartContract(contract, "deposit_addresses", [deposit_address_id]);
        console.log(deposit_address);
        $("#from").html(from);
        $("#amount").html(formatUnit(amount, decimals.wjxn2, decimals.wjxn2));
        $("#depositAddress").html(deposit_address);
        due_timestamp = valid_until ;
        generate_qrcode({
            coinName: 'jxn',
            address: deposit_address,
            shardID: 0,
            amount: formatUnit(amount, decimals.wjxn2, decimals.wjxn2)
        })
    }catch(e) {
        // goto404();
    }

}


async function _jax_bsc() {
    const web3 = new Web3(networks.bsc.url);
    let contract = new web3.eth.Contract(abis.jax_bsc, contract_addresses.jax_bsc);
    try {
        let { amount, from, shard_id, deposit_address_id, status, valid_until } = await callSmartContract(contract, "requests", [request_id]);
        console.log(amount, from, deposit_address_id, status);
        if(parseInt(status) > 0) {
            goto('status_test.html' + '?id=' + request_id + "&mode=" + mode);
        }
        $("#shardId").html("Shard" + shard_id);
        $("#shardId").show();
        let deposit_address = await callSmartContract(contract, "deposit_addresses", [deposit_address_id]);
        console.log(deposit_address);
        $("#from").html(from);
        $("#amount").html(formatUnit(amount, decimals.wjax, decimals.wjax));
        $("#depositAddress").html(deposit_address);
        due_timestamp = valid_until ;
        generate_qrcode({
            coinName: 'jax',
            address: deposit_address,
            shardID: shard_id,
            amount: formatUnit(amount, decimals.wjax, decimals.wjax)
        })
    }catch(e) {
        // goto404();
    }

}

function check_timestamp() {
    if(!due_timestamp) return;
    let now = parseInt((new Date).getTime() / 1000);
    if( due_timestamp > now) {
        let remain = due_timestamp - now;
        const formatted = moment.utc(remain*1000).format('HH:mm:ss');
        $("#countdown").html(formatted);
    }
    else {
        $("#countdown").html("Expired");
    }

}

async function submit_txhash() {
    if(!web3) {
        connect_wallet();
        return;
    }
    let txHash = $("#txHash").val();
    if(txHash == "") return;
    let contract = new web3.eth.Contract(mode == "jax_bsc" ? abis.jax_bsc : abis.jxn_wjxn2, mode == "jax_bsc"? contract_addresses.jax_bsc : contract_addresses.bsc.jxn_wjxn2_bridge);
    const msg = web3.utils.soliditySha3(
        {t: 'string', v: txHash},
      ).toString('hex');

    const txdHash = web3.eth.accounts.hashMessage(msg)
    const func = "prove_request";
    const args = [request_id, txHash];
    const {success, gas, message} = await estimateGas(contract, func, args);
    if(!success) {
        notifier.warning(message);
        return;
    }
    const promi = runSmartContract(contract, func, args);
    await notifier.async(promi
        , null, null, `Processing deposit`,
        {labels: {async: "Please wait..."}});
    promi.then(() => {
        goto('status.html' + '?id=' + request_id+ "&mode=" + mode);
        
    })
}

function generate_qrcode(data) {
    $("#loading").hide();
    qrcode.makeCode(JSON.stringify(data));
}