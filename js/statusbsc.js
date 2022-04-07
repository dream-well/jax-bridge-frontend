let due_timestamp;
let request_id;
let srcChain;
let destChain;

void async function main() {
    $("#link").html(location.href);
    
    parseQuery();
}()

function parseQuery() {
    const query = location.search.substr(1);
    const paramList = query.split("&");
    const params = paramList.reduce((a, b) => Object.assign(a, {[b.split('=')[0]]: b.split('=')[1] }), {});
    if(Object.keys(params).includes("id")){
        request_id = params.id; 
        src_network = params.srcChain;

        $("#chainSelector").val(src_network);
        $("#request_id").html(request_id);
        get_deposit_info();
    }
    // else 
    //     goto404();
}


async function get_deposit_info() {
    if(!src_network) return;
    const src_web3 = new Web3(networks[src_network].url);
    let src_contract = new src_web3.eth.Contract(jaxBridgeEvmABI, contract_addresses.jaxBridgeEVM);
    try {
        let { amount, to, destChainId, depositHash } = await callSmartContract(src_contract, "requests", [request_id]);
        console.log(amount, to, destChainId, depositHash);

        let dest_network = chains[destChainId];
        dest_web3 = new Web3(networks[dest_network].url);
        let dest_contract = new dest_web3.eth.Contract(jaxBridgeEvmABI, contract_addresses.jaxBridgeEVM);
        let status = await callSmartContract(dest_contract, "proccessed_deposit_hashes", depositHash);
        let text, color;
        switch(status) {
            case false:
                text = "PENDING";
                color = "blue";
                break;
            case true:
                text = "BRIDGED";
                color = "green";
                break;
        }
        $("#status").html(text)
        $("#status").css("color", color);
    }catch(e) {
        goto404();
    }

}