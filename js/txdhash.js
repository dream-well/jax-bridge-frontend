
void async function main() {
}()

async function deposit() {
    const txhash = $("#txhash").val();
    const msg = web3.utils.soliditySha3(
        {t: 'string', v: txhash},
      ).toString('hex');

    const txdhash = web3.eth.accounts.hashMessage(msg)
        $("#txdhash").val(txdhash);
}
