// let contract_addresses = {
//     jaxBridge: '0x9d8eD6989A9e7c26a589562fca80db4D28Ae17dF',
//     wjxn: '0xa25946ec9d37dd826bbe0cbdbb2d79e69834e41e'
// } testnet

let contract_addresses = {
    jaxBridge: '0xdA344A64FB38AeE04f52cE99c0d34b5413D589C3',
    wjxn: '0xcA1262e77Fb25c0a4112CFc9bad3ff54F617f2e6',
    haber: '0xd6AF849b09879a3648d56B5d43c6e5908a74CA83',
    hst: '0xd6AF849b09879a3648d56B5d43c6e5908a74CA83',
    wjxn_bsc: '0x5B97aa5CF0669C788c79A12065c25c918056489D',
    wjxn_ethereum: '0xA581cb3883d84dAb7f1B1340fF01F1cB34A2B5d3',
    bsc: {
        wjxn2: '0x643d58cf4af8f5fa32139981d85b8629802bcd5e',
        wjax: '0xf07352E8e3b88e8500D24301f5FC05A916d708cc',
        jaxud: '0xeff49aED7baaBa69DCBdA577b34850c41e8F5226',
        jaxre: '0x86ECE7D9cdA927B3Ec4044Df67B082FA55A1c198',
        wjax_evm_bridge: '0x5CD0BE8439473c9908725B83393bc3bB9Dd53F13'
    },
    ethereum: {
        wjax: '0x2Df380cD3eeB7F1Ee5deB087Fe9FbCF8959095Ee',
        jaxud: '0x935b0bF173552cd55E53AD651a783430a5700cD4',
        jaxre: '0x88d7FE32284f1dBD398D58222DE8DFd87dD75460',
        wjax_evm_bridge: '0x65f865Bf1893B8974904805f94D7F4364B093631'
    },
    polygon: {
        wjax: '0x1d60AA1D6137Dcb1306C8A901EBd215Ca661d0cb',
        jaxud: '0x9e79696a4c1163d35f01d71dcbbc5c139691c6d3',
        jaxre: '0xd85a8b4964850ae85121d5652e6f0696512feb10',
        wjax_evm_bridge: '0x4702202a5DEEA8a7414380b18ff195F3321b5159'
    },
    avax: {
        wjax: '0xdD32f4DBA92B04F2d4Ade25dFAD7a127027C379d',
        jaxud: '0x1d60AA1D6137Dcb1306C8A901EBd215Ca661d0cb',
        jaxre: '0x9E79696a4C1163D35f01d71DcbBc5C139691C6D3',
        wjax_evm_bridge: '0x4702202a5DEEA8a7414380b18ff195F3321b5159'
    }
}

function get_contract_address(name) {
    if(!contract_addresses[active_network()]) return contract_addresses[name];
    if(!contract_addresses[active_network()][name]) return contract_addresses[name];
    return contract_addresses[active_network()][name]
}

let decimals = {
    wjxn2: 8,
    wjax: 4,
    wjxn: 0,
    haber: 0
}

let abis = {
    haber: [{"inputs":[{"internalType":"address","name":"_WJXN","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
}

let jaxBridgeABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"info_hash","type":"bytes32"}],"name":"Add_Penalty_Amount","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"request_id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"from","type":"string"},{"indexed":false,"internalType":"uint256","name":"depoist_address_id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"valid_until","type":"uint256"}],"name":"Create_Request","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"Delete_Deposit_Addresses","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"request_id","type":"uint256"}],"name":"Expire_Request","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"deposit_address_id","type":"uint256"}],"name":"Free_Deposit_Address","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"request_id","type":"uint256"},{"indexed":false,"internalType":"string","name":"tx_hash","type":"string"}],"name":"Prove_Request","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"request_id","type":"uint256"}],"name":"Reject_Request","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"request_id","type":"uint256"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Release","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"admin","type":"address"}],"name":"Set_Admin","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"fee_percent","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minimum_fee_amount","type":"uint256"}],"name":"Set_Fee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"uint256","name":"operating_limit","type":"uint256"}],"name":"Set_Operating_Limit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"wallet","type":"address"}],"name":"Set_Penalty_Wallet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"info_hash","type":"bytes32"}],"name":"Subtract_Penalty_Amount","type":"event"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"operating_limit","type":"uint256"}],"name":"add_bridge_operator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string[]","name":"new_addresses","type":"string[]"}],"name":"add_deposit_addresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"info_hash","type":"bytes32"}],"name":"add_penalty_amount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"bridge_operators","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"request_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"deposit_address_id","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"from","type":"string"}],"name":"create_request","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"delete_deposit_addresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"deposit_address_deleted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"deposit_address_locktimes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"deposit_address_requests","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"deposit_addresses","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fee_percent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"from","type":"uint256"},{"internalType":"uint256","name":"to","type":"uint256"}],"name":"free_deposit_addresses","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"get_deposit_addresses","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"get_free_deposit_address_id","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"get_new_request_id","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"get_user_requests","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"isBridgeOperator","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minimum_fee_amount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"penalty_amount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"penalty_wallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"request_id","type":"uint256"},{"internalType":"string","name":"tx_hash","type":"string"}],"name":"prove_request","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"request_id","type":"uint256"}],"name":"reject_request","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"request_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"from","type":"string"},{"internalType":"address","name":"to","type":"address"},{"internalType":"string","name":"txHash","type":"string"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"requests","outputs":[{"internalType":"uint256","name":"deposit_address_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"amount_hash","type":"bytes32"},{"internalType":"bytes32","name":"txdHash","type":"bytes32"},{"internalType":"uint256","name":"valid_until","type":"uint256"},{"internalType":"uint256","name":"prove_timestamp","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"enum JaxBridgeV2.RequestStatus","name":"status","type":"uint8"},{"internalType":"string","name":"from","type":"string"},{"internalType":"string","name":"txHash","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"name":"set_admin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_fee_percent","type":"uint256"},{"internalType":"uint256","name":"_minimum_fee_amount","type":"uint256"}],"name":"set_fee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"operating_limit","type":"uint256"}],"name":"set_operating_limit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_penalty_wallet","type":"address"}],"name":"set_penalty_wallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"info_hash","type":"bytes32"}],"name":"subtract_penalty_amount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"user_requests","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawByAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"wjxn","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
let erc20ABI = [{ "inputs": [], "stateMutability": "payable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getOwner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_tx_fee", "type": "uint256" }], "name": "setTransactionFee", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_wallet", "type": "address" }], "name": "setTransactionFeeWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "transaction_fee", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "transaction_fee_decimal", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "tx_fee_wallet", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"}]

let jaxBridgeEvmABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"info_hash","type":"bytes32"}],"name":"Add_Penalty_Amount","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"request_id","type":"uint256"},{"indexed":false,"internalType":"string","name":"deposit_tx_hash","type":"string"},{"indexed":false,"internalType":"string","name":"release_tx_hash","type":"string"},{"indexed":false,"internalType":"bytes32","name":"info_hash","type":"bytes32"}],"name":"Complete_Release_Tx_Link","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"request_id","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"data_hash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fee_amount","type":"uint256"},{"indexed":false,"internalType":"uint64","name":"src_chain_id","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"dest_chain_id","type":"uint64"},{"indexed":false,"internalType":"uint128","name":"deposit_timestamp","type":"uint128"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"src_chain_data_hash","type":"bytes32"}],"name":"Reject_Bridge_Transaction","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"request_id","type":"uint256"}],"name":"Reject_Request","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"src_chain_data_hash","type":"bytes32"}],"name":"Release","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"fee_percent","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minimum_fee_amount","type":"uint256"}],"name":"Set_Fee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bytes32","name":"info_hash","type":"bytes32"}],"name":"Subtract_Penalty_Amount","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"request_id","type":"uint256"},{"indexed":false,"internalType":"string","name":"deposit_tx_hash","type":"string"},{"indexed":false,"internalType":"string","name":"release_tx_hash","type":"string"}],"name":"Update_Release_Tx_Link","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"src_chain_data_hash","type":"bytes32"}],"name":"Verify_Data_Hash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw_By_Admin","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[{"internalType":"uint256","name":"request_id","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"src_chain_id","type":"uint256"},{"internalType":"uint256","name":"dest_chain_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"fee_amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"_get_data_hash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"auditor","type":"address"}],"name":"add_auditor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"executor","type":"address"},{"internalType":"uint256","name":"operating_limit","type":"uint256"},{"internalType":"address","name":"fee_wallet","type":"address"}],"name":"add_bridge_executor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"info_hash","type":"bytes32"}],"name":"add_penalty_amount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"verifier","type":"address"}],"name":"add_verifier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"auditors","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"bridge_executors","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"request_id","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"src_chain_id","type":"uint256"},{"internalType":"uint256","name":"dest_chain_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"fee_amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"string","name":"deposit_tx_hash","type":"string"},{"internalType":"string","name":"deposit_tx_link","type":"string"},{"internalType":"string","name":"release_tx_link","type":"string"},{"internalType":"bytes32","name":"info_hash","type":"bytes32"}],"name":"complete_release_tx_link","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"auditor","type":"address"}],"name":"delete_auditor","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"verifier","type":"address"}],"name":"delete_verifier","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"dest_chain_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"fee_percent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"fee_wallets","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"foreign_requests","outputs":[{"internalType":"uint256","name":"src_chain_id","type":"uint256"},{"internalType":"uint256","name":"dest_chain_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"fee_amount","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deposit_timestamp","type":"uint256"},{"internalType":"bytes32","name":"src_chain_data_hash","type":"bytes32"},{"internalType":"bytes32","name":"data_hash","type":"bytes32"},{"internalType":"enum WjxnPolygonBridge.RequestStatus","name":"status","type":"uint8"},{"internalType":"string","name":"deposit_tx_hash","type":"string"},{"internalType":"string","name":"deposit_tx_link","type":"string"},{"internalType":"string","name":"release_tx_link","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"auditor","type":"address"}],"name":"isAuditor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"executor","type":"address"}],"name":"isBridgeExecutor","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"verifier","type":"address"}],"name":"isVerifier","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"max_pending_audit_records","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"minimum_fee_amount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"operating_limits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"penalty_amount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"penalty_wallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pending_audit_records","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"proccessed_txd_hashes","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"request_id","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"src_chain_id","type":"uint256"},{"internalType":"uint256","name":"dest_chain_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"fee_amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"string","name":"deposit_tx_hash","type":"string"}],"name":"reject_bridge_transaction","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"request_id","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"src_chain_id","type":"uint256"},{"internalType":"uint256","name":"dest_chain_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"fee_amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"string","name":"deposit_tx_hash","type":"string"}],"name":"release","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"requests","outputs":[{"internalType":"uint256","name":"src_chain_id","type":"uint256"},{"internalType":"uint256","name":"dest_chain_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"fee_amount","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deposit_timestamp","type":"uint256"},{"internalType":"bytes32","name":"src_chain_data_hash","type":"bytes32"},{"internalType":"bytes32","name":"data_hash","type":"bytes32"},{"internalType":"enum WjxnPolygonBridge.RequestStatus","name":"status","type":"uint8"},{"internalType":"string","name":"deposit_tx_hash","type":"string"},{"internalType":"string","name":"deposit_tx_link","type":"string"},{"internalType":"string","name":"release_tx_link","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"name":"set_admin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"dest_chain_id","type":"uint256"},{"internalType":"uint256","name":"_fee_percent","type":"uint256"},{"internalType":"uint256","name":"_minimum_fee_amount","type":"uint256"}],"name":"set_fee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"executor","type":"address"},{"internalType":"uint256","name":"operating_limit","type":"uint256"}],"name":"set_operating_limit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_penalty_wallet","type":"address"}],"name":"set_penalty_wallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"flag","type":"bool"}],"name":"set_use_no_gas","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bytes32","name":"info_hash","type":"bytes32"}],"name":"subtract_penalty_amount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"request_id","type":"uint256"},{"internalType":"string","name":"deposit_tx_link","type":"string"},{"internalType":"string","name":"release_tx_link","type":"string"}],"name":"update_release_tx_link","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"use_no_gas","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"verifiers","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"request_id","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"src_chain_id","type":"uint256"},{"internalType":"uint256","name":"dest_chain_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"fee_amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"bytes32","name":"src_chain_data_hash","type":"bytes32"},{"internalType":"string","name":"deposit_tx_hash","type":"string"}],"name":"verify_data_hash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawByAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw_ETH","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"wjxn","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}];