const paypal = require("paypal-rest-sdk");

paypal.configure({
    mode: 'sandbox',
    client_id: 'AfdFfGde7e1DfncSycGlHPZU1OifhflyVWcYcDdUoeDztKq9oo1ZuTcM2vldLTKLp3ViN83yaM3Y9-XG', // your client_id
    client_secret : 'ENHMholhb-AgAKhM1163XM1SPUKmBC0oH3MxuvOS_MMn_rcc_TQye0abo4Wk9w-5rHFVolXVQ1u3zHZy', // your client_secret
})

module.exports = paypal;