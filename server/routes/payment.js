const express = require('express');
const crypto = require('crypto');
const https = require('https');
const router = express.Router();
const Orders = require('../models/orders'); // Mô hình đơn hàng
const Product = require('../models/products'); // Mô hình sản phẩm

// Giả lập database (thực tế sẽ dùng MongoDB)
const orders = {}; // Lưu trạng thái đơn hàng { orderId: { status, amount, info } }

// Hàm xác thực chữ ký từ MoMo
const verifySignature = (data, signature, secretKey) => {
    const rawSignature = Object.keys(data)
        .filter(key => key !== 'signature' && data[key]) // Bỏ qua 'signature'
        .sort()
        .map(key => `${key}=${data[key]}`)
        .join('&');

    const computedSignature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    return computedSignature === signature;
};

// Route thanh toán MoMo
router.post('/pay', (req, res) => {
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const orderInfo = "pay with MoMo";
    const redirectUrl = "http://localhost:8000/api/payment/return"; // URL trả về sau thanh toán
    const ipnUrl = "http://localhost:8000/api/payment/notify"; // URL thông báo IPN
    const amount = req.body.amount || "50000"; // Số tiền thanh toán
    const requestType = "captureWallet";
    const extraData = ""; // Thêm thông tin bổ sung nếu cần

    // Tạo chữ ký bảo mật
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    // Request body gửi đến MoMo
    const requestBody = JSON.stringify({
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'en'
    });

    // Gửi yêu cầu đến API MoMo
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };

    const reqMoMo = https.request(options, (momoRes) => {
        let data = '';
        momoRes.on('data', chunk => { data += chunk; });

        momoRes.on('end', () => {
            const response = JSON.parse(data);
            if (response.payUrl) {
                // Lưu trạng thái đơn hàng tạm thời
                orders[orderId] = { status: 'pending', amount, info: orderInfo };
                res.json({ success: true, payUrl: response.payUrl });
            } else {
                res.status(500).json({ error: 'Thanh toán thất bại', details: response });
            }
        });
    });

    reqMoMo.on('error', (e) => {
        console.error(`Có vấn đề với yêu cầu: ${e.message}`);
        res.status(500).json({ error: e.message });
    });

    reqMoMo.write(requestBody);
    reqMoMo.end();
});

// Route nhận thông báo IPN từ MoMo
router.post('/notify', async (req, res) => {
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const { orderId, amount, resultCode, signature } = req.body;

    // Xác thực chữ ký
    if (!verifySignature(req.body, signature, secretKey)) {
        console.error(`Chữ ký không hợp lệ: Order ID ${orderId}`);
        return res.status(400).send('Chữ ký không hợp lệ');
    }

    // Kiểm tra trạng thái giao dịch
    if (resultCode === 0) {
        console.log(`Thanh toán thành công: Order ID ${orderId}, Số tiền: ${amount}`);
        
        // Tìm đơn hàng trong cơ sở dữ liệu (MongoDB)
        const order = await Orders.findOne({ paymentId: orderId });  // Cập nhật tìm theo `paymentId` nếu cần
        
        if (order) {
            // Cập nhật trạng thái đơn hàng thành 'paid' và lưu thời gian thanh toán
            await Orders.findByIdAndUpdate(order._id, {
                status: 'paid',
                paymentDate: new Date()
            });

            // Lặp qua danh sách sản phẩm trong đơn hàng và xóa sản phẩm khỏi kho
            for (let product of order.products) {
                await Product.findByIdAndDelete(product.productId); // Xóa sản phẩm khỏi kho
            }

            // Cập nhật giỏ hàng: xóa các sản phẩm trong giỏ hàng của người dùng
            await Cart.deleteMany({ userId: order.userId }); // Xóa tất cả sản phẩm trong giỏ hàng của user

            console.log(`Đơn hàng ${orderId} đã được thanh toán và giỏ hàng đã được cập nhật.`);
        } else {
            console.log(`Không tìm thấy đơn hàng với Order ID ${orderId}`);
            return res.status(404).send('Đơn hàng không tồn tại');
        }
        
        res.status(200).send('OK');
    } else {
        console.log(`Thanh toán thất bại: Order ID ${orderId}, Result Code: ${resultCode}`);
        res.status(400).send('Lỗi thanh toán');
    }
});



// Route trả về sau thanh toán
router.get('/return', (req, res) => {
    const { orderId, resultCode, message } = req.query;

    if (resultCode === '0') {
        // Thanh toán thành công
        res.send(`<h1>Thanh toán thành công</h1><p>Order ID: ${orderId}</p>`);
    } else {
        // Thanh toán thất bại
        res.send(`<h1>Thanh toán không thành công</h1><p>Order ID: ${orderId}</p><p>${message}</p>`);
    }
});

module.exports = router;
