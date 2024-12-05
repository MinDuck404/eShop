// routes/payment.js
const express = require('express');
const crypto = require('crypto');
const https = require('https');
const router = express.Router();

// Route thanh toán MoMo
router.post('/pay', (req, res) => {
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const orderInfo = "pay with MoMo";
    const redirectUrl = "https://momo.vn/return"; // URL chuyển hướng của bạn
    const ipnUrl = "https://callback.url/notify"; // URL IPN của bạn
    const amount = req.body.amount || "50000"; // Lấy số tiền từ body request nếu có
    const requestType = "captureWallet";
    const extraData = ""; // Truyền rỗng nếu merchant của bạn không có cửa hàng

    // Tạo chữ ký raw để bảo mật
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    
    // Chuẩn bị requestBody gửi đến MoMo
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

    // Cấu hình yêu cầu MoMo API
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

    // Gửi yêu cầu đến MoMo API
    const reqMoMo = https.request(options, (momoRes) => {
        let data = '';
        momoRes.on('data', chunk => {
            data += chunk;
        });

        momoRes.on('end', () => {
            const response = JSON.parse(data);
            if (response.payUrl) {
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

// routes/payment.js
router.post('/notify', (req, res) => {
    const { orderId, amount, orderInfo, partnerCode, status, message } = req.body;

    // Kiểm tra trạng thái thanh toán
    if (status === '0') {
        // Thanh toán thành công
        console.log(`Thanh toán thành công: Order ID ${orderId}, Số tiền: ${amount}, Thông tin: ${orderInfo}`);
        // Xử lý thành công thanh toán, ví dụ: Cập nhật trạng thái đơn hàng trong database
        // Có thể gọi một hàm để cập nhật trạng thái đơn hàng, ví dụ: updateOrderStatus(orderId, 'paid');
        res.status(200).send('OK');
    } else {
        // Thanh toán không thành công
        console.log(`Thanh toán thất bại: Order ID ${orderId}, Lỗi: ${message}`);
        // Có thể lưu log hoặc xử lý trường hợp thất bại
        res.status(500).send('Lỗi thanh toán');
    }
});

module.exports = router;
