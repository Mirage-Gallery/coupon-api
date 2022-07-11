const mongoose = require('mongoose');
const Coupon = require('./model.js');

const { keccak256, toBuffer, ecsign, bufferToHex, privateToAddress } = require("ethereumjs-utils");
const { ethers } = require('ethers');

require('dotenv').config();

let presaleAddresses = ['0x111C2825e5f29E8748f32b699a486021eCa16765', '0x879138894E25984E5a33BD3d64D9dDA90DEFC723'];
const pvtKeyString = process.env.PRIVATE_KEY;
const signerPvtKey = Buffer.from(pvtKeyString, "hex");
const signerAddress = ethers.utils.getAddress(privateToAddress(signerPvtKey).toString("hex"));

async function createCoupons() {

    let coupons = []

    for (let i = 0; i < presaleAddresses.length; i++) {
        const userAddress = ethers.utils.getAddress(presaleAddresses[i]);
        const hashBuffer = generateHashBuffer(
            ["address"],
            [userAddress]
        );
        let tempCoupon = createCoupon(hashBuffer, signerPvtKey);
        tempCoupon = serializeCoupon(tempCoupon)
        tempCoupon.address = userAddress.toLowerCase()

        let CouponDB = new Coupon(tempCoupon);
        coupons.push(CouponDB);
        console.log('created coupon: ', CouponDB);
    }

    // for all coupons in the array, save them to the database
    for (let i = 0; i < coupons.length; i++) {
        await coupons[i].save();
    }
}

(async () => {
    await createCoupons();
    // disconnect mongoose
    await mongoose.disconnect();

})();


// HELPER FUNCTIONS
function createCoupon(hash, signerPvtKey) {
    return ecsign(hash, signerPvtKey);
}
function generateHashBuffer(typesArray, valueArray) {
    return keccak256(
        toBuffer(ethers.utils.defaultAbiCoder.encode(typesArray,
            valueArray))
    );
}
function serializeCoupon(coupon) {
    return {
        r: bufferToHex(coupon.r),
        s: bufferToHex(coupon.s),
        v: coupon.v,
    };
}
