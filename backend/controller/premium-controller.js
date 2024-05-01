const User = require("../model/user");
const jwt = require("jsonwebtoken");
const RazorPay = require("razorpay");
const Order = require("../model/orders");

function generateAccessToken(id, premium) {
  return jwt.sign(
    { userId: id, premium },
    "magical-key-for-userAuthentication"
  );
}

exports.PurchasePremium = (req, res, next) => {
  const uId = req.user.id;
  try {
    var rzp = new RazorPay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });
    const amount = 6900;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      //console.log(`premium purchse==${order}`)
      Order.create({ orderId: order.id, status: "PENDING", UserId: uId })
        .then(() => {
          //console.log(`chal le bewkoof code ${order,rzp.key_id}`)
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.UpdateTransactionStatus = async (req, res) => {
  try {
    const uId = req.user.id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderId: order_id } });
    const promise1 = order.update({
      paymentId: payment_id,
      status: "SUCCESSFULL",
    });
    const promise2 = User.update({ premium: true }, { where: { id: uId } });
    Promise.all([promise1, promise2])
      .then(() => {
        return res.status(202).json({
          success: true,
          message: "Transaction completed",
          token: generateAccessToken(uId, true),
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "something went wrong" });
  }
};

exports.ShowLeaderBoard = async (req, res) => {
  try {
    const Leaderboard = await User.findAll({
      attributes: ["name", "total"],
      order: [["total", "DESC"]],
    });
    console.log(Leaderboard);
    res.status(200).json(Leaderboard);
  } catch (err) {
    console.log(err);
  }
};
