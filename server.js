const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
const MONGO_URI = "mongodb+srv://abdo_store1:lu7Yt9r5t6V3YwCE@abdo-astore.ecejes7.mongodb.net/abdo_store?retryWrites=true&w=majority";
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ تم الاتصال بقاعدة البيانات بنجاح'))
  .catch(err => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message));
const orderSchema = new mongoose.Schema({
    orderId: { type: Number, unique: true },
    productName: String,
    playerId: String,
    phone: String,
    total: Number,
    paymentMethod: String,
    paymentMethodName: String,
    receiptImage: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);
app.get('/', (req, res) => res.send('🚀 سيرفر متجر عبدو يعمل بنجاح!'));
app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ success: true, message: 'تم إرسال الطلب بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.put('/api/orders/:orderId', async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status: req.body.status },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: 'الطلب غير موجود' });
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(🚀 السيرفر يعمل على المنفذ ${PORT}));
