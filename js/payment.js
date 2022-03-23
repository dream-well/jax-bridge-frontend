void async function main() {
    accountChanged();
}()


async function accountChanged() {
    let account = accounts[0];
    if(!account) return;
    // $("#to").val(account);

    const { data } = await axios.post("https://wrapped.jax.net:8443/jax-bsc/deposit_address", { to: account});
    console.log(data);
    $("#depositAddress").html(data);
}