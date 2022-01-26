
void async function main() {
    
}

async function swap() {
    if(accounts.length == 0){
        connect_wallet();
    }
    const amountIn = $("#amountIn").val();
    const to = $("#to").val();
    const destChainId = $("#destChain").val();
    const func = 'deposit';
    // address to, uint destChainId, uint amount, uint nonce, bytes calldata signature
    const nonce = await callSmartContract(contracts.jaxBridgeBsc, "nonces", accounts[0]);

    const signature = await sign(to, destChainId, amountIn, nonce);

    const args = [to, destChainId, amountIn, nonce, signature];
    const {success, gas, message} = await estimateGas(contracts.jaxBridgeBsc, func, ...args);
    if(!success) {
        notifier.warning(message);
        return;
    }
    await notifier.async(runSmartContract(contracts.jaxBridgeBsc, func, ...args)
        , null, null, `deposit`,
        {labels: {async: "Please wait..."}});
    
}

async function sign(to, destchainId, amountIn, nonce) {
    const message = web3.utils.soliditySha3(
        {t: 'address', v: accounts[0]},
        {t: 'address', v: to},
        {t: 'uint256', v: destchainId},
        {t: 'uint256', v: amountIn},
        {t: 'uint256', v: nonce},
      ).toString('hex');

    const msgHash = web3.eth.accounts.hashMessage(message)

    const signature = await web3.eth.sign(
        msgHash, 
        accounts[0]
    ); 

    return signature;
    // await bridgePolygon.burn(accounts[0], amount, nonce, signature);
}

async function check_status() {

}