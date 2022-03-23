void async function main() {
    accountChanged();
}()


async function accountChanged() {
    let account = accounts[0];
    if(!account) return;
    // $("#to").val(account);

    const { data } = await axios.post("http://localhost:8001/jax-bsc/deposit_address", { to: account});
    console.log(data);
    $("#depositAddress").html(data);
}