let due_timestamp;

void async function main() {
    $("#link").html(location.href);
    
    parseQuery();
}()

function parseQuery() {
    const query = location.search.substr(1);
    const paramList = query.split("&");
    const params = paramList.reduce((a, b) => Object.assign(a, {[b.split('=')[0]]: b.split('=')[1] }), {});
    if(Object.keys(params).includes("id")){
        get_request_info(params.id);
        request_id = params.id;
        $("#request_id").html(request_id);
    }
    else
        goto404();
}


async function get_request_info(request_id) {
    let contract = new web3.eth.Contract(jaxBridgeABI, contract_addresses.jaxBridge);
    try {
        let { amount, from, deposit_address_id, status, valid_until } = await callSmartContract(contract, "requests", [request_id]);
        console.log(amount, from, deposit_address_id, status);
        let deposit_address = await callSmartContract(contract, "deposit_addresses", deposit_address_id);
        console.log(deposit_address);
        $("#from").html(from);
        $("#depositAddress").html(deposit_address);
        due_timestamp = valid_until - 12 * 3600;
    }catch(e) {
        goto404();
    }

}