const mongoose = require('mongoose');
const Coupon = require('./model.js');

const { keccak256, toBuffer, ecsign, bufferToHex, privateToAddress } = require("ethereumjs-utils");
const { ethers } = require('ethers');

require('dotenv').config();

let presaleAddresses = ['0x111C2825e5f29E8748f32b699a486021eCa16765'];
const pvtKeyString = process.env.PRIVATE_KEY;
const signerPvtKey = Buffer.from(pvtKeyString, "hex");
const signerAddress = ethers.utils.getAddress(privateToAddress(signerPvtKey).toString("hex"));

async function createCoupons() {

    for (let i = 0; i < presaleAddresses.length; i++) {
        const userAddress = ethers.utils.getAddress(presaleAddresses[i]);
        const hashBuffer = generateHashBuffer(
            ["address"],
            [userAddress]
        );
        let tempCoupon = createCoupon(hashBuffer, signerPvtKey);
        tempCoupon = serializeCoupon(tempCoupon)
        tempCoupon.address = userAddress;

        let CouponDB = new Coupon(tempCoupon);
        console.log(CouponDB);

        // save to mongodb
        await CouponDB.save();
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
