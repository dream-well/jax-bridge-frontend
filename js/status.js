let due_timestamp;

void async function main() {
    $("#link").html(location.href);
    
    parseQuery();

    setInterval(get_request_info, 1000);
}()

function parseQuery() {
    const query = location.search.substr(1);
    const paramList = query.split("&");
    const params = paramList.reduce((a, b) => Object.assign(a, {[b.split('=')[0]]: b.split('=')[1] }), {});
    if(Object.keys(params).includes("id")){
        get_request_info();
        request_id = params.id;
        $("#request_id").html(request_id);
    }
    else
        goto404();
}


async function get_request_info() {
    const web3 = new Web3(networks.bsc.url);
    let contract = new web3.eth.Contract(jaxBridgeABI, contract_addresses.jaxBridge);
    try {
        let { amount, from, deposit_address_id, status, valid_until } = await callSmartContract(contract, "requests", [request_id]);
        console.log(amount, from, deposit_address_id, status);
        // let deposit_address = await callSmartContract(contract, "deposit_addresses", deposit_address_id);
        // console.log(deposit_address);
        status = parseInt(status);
        if(status == 0) {

            goto('deposit.html' + '?id=' + request_id);
        }
        let text, color;
        switch(status) {
            case 1:
                text = "Processing Deposit";
                color = "blue";
                break;
            case 2:
                text = "REJECTED";
                color = "red";
                break;
            case 3:
                text = "EXPIRED";
                color = "#ef5a00";
                break;
            case 4:
                text = "BRIDGED";
                color = "green";
                break;
        }
        $("#status").html(text)
        $("#status").css("color", color);
        due_timestamp = valid_until - 12 * 3600;
    }catch(e) {
        // goto404();
    }

}