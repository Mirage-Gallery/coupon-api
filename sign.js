const mongoose = require('mongoose');
const Coupon = require('./model.js');

const { keccak256, toBuffer, ecsign, bufferToHex, privateToAddress } = require("ethereumjs-utils");
const { ethers } = require('ethers');

require('dotenv').config();

let presaleAddresses = ['0x99cfd045a577b2e256979c322e4f56735db09d9c'];
const pvtKeyString = process.env.PRIVATE_KEY;
const signerPvtKey = Buffer.from(pvtKeyString, "hex");
const signerAddress = ethers.utils.getAddress(privateToAddress(signerPvtKey).toString("hex"));

const couponType = 'standard'

async function createCoupons() {

    let coupons = []

    for (let i = 0; i < presaleAddresses.length; i++) {
        const userAddress = ethers.utils.getAddress(presaleAddresses[i]);
        const hashBuffer = generateHashBuffer(
            ["address","string"],
            [userAddress,couponType]
        );
        let tempCoupon = createCoupon(hashBuffer, signerPvtKey);
        tempCoupon = serializeCoupon(tempCoupon)
        tempCoupon.address = userAddress.toLowerCase()
        
        tempCoupon.type = 'braindrops'

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

console.log("Signer Address:",signerAddress)
