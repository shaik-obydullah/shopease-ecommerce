const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentIntentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      paymentIntentId,
      paymentStatus: paymentMethod === 'stripe' ? 'pending' : 'paid',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.status = req.body.status || order.status;
    if (req.body.status === 'delivered') {
      order.deliveredAt = Date.now();
    }
    if (req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber;
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.paymentStatus = req.body.paymentStatus;
    if (req.body.paymentStatus === 'paid') {
      order.status = 'processing';
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalUsers = (await require('../models/User').countDocuments());
    const recentOrders = await Order.find({}).populate('user', 'name email').sort('-createdAt').limit(5);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
