let due_timestamp;

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
    if(Object.keys(params).includes("id")){
        get_request_info(params.id);
        request_id = params.id;
    }
    else
        goto404();
}


async function accountChanged() {
    let account = accounts[0];
    if(!account) return;
    // $("#to").val(account);

    const { data } = await axios.post("https://wrapped.jax.net:8443/jax-bsc/deposit_address", { to: account});
    console.log(data);
    $("#depositAddress").html(data);
}

async function get_request_info(request_id) {
    let contract = new web3.eth.Contract(jaxBridgeABI, contract_addresses.jaxBridge);
    try {
        let { amount, from, deposit_address_id, status, valid_until } = await callSmartContract(contract, "requests", [request_id]);
        console.log(amount, from, deposit_address_id, status);
        if(parseInt(status) > 0) {
            goto('status.html' + '?id=' + request_id);
        }
        let deposit_address = await callSmartContract(contract, "deposit_addresses", deposit_address_id);
        console.log(deposit_address);
        $("#from").html(from);
        $("#depositAddress").html(deposit_address);
        due_timestamp = valid_until ;
    }catch(e) {
        goto404();
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
    let txHash = $("#txHash").val();
    if(txHash == "") return;
    let contract = new web3.eth.Contract(jaxBridgeABI, contract_addresses.jaxBridge);
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
        goto('status.html' + '?id=' + request_id);
        
    })
}