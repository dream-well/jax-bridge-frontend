let due_timestamp;
let request_id;
let srcChain;
let destChain;
let active_token;

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
        active_token = params.token;

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
    let src_contract = new src_web3.eth.Contract(jaxBridgeEvmABI, contract_addresses[active_token + "_" + src_network]);
    try {
        let { amount, to, dest_chain_id, src_chain_data_hash } = await callSmartContract(src_contract, "requests", [request_id]);
        console.log(amount, to, dest_chain_id, src_chain_data_hash);

        let dest_network = chains[dest_chain_id];
        dest_web3 = new Web3(networks[dest_network].url);
        let dest_contract = new dest_web3.eth.Contract(jaxBridgeEvmABI, contract_addresses[active_token + "_" + dest_network]);
        let processed = await callSmartContract(dest_contract, "proccessed_deposit_hashes", [src_chain_data_hash]);
        let status = 0;
        try{
            let request = await callSmartContract(dest_contract, "foreign_requests", [src_chain_data_hash]);
            status = request.status;
        }
        catch(e) {

        }
        //{Init, Proved, Verified, Released, Completed}
        
        let text, color;
        switch(status) {
            case "0":
                text = "PENDING";
                color = "red";
                break;
            case "2":
                text = "VERIFIED";
                color = "blue";
                break;
            case "3":
                text = "EXECUTED";
                color = "purple";
            case "4":
                text = "COMPLETED";
                color = "green";
        }
        $("#status").html(text)
        $("#status").css("color", color);
    }catch(e) {
        goto404();
    }

}