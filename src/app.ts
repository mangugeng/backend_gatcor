import express from 'express';
import cors from 'cors';
import authRoutes from './api/v1/auth/auth.routes';
import customerRoutes from './api/v1/customer/customer.routes';
import driverRoutes from './api/v1/driver/driver.routes';
import adminRoutes from './api/v1/admin/admin.routes';
import orderRoutes from './api/v1/order/order.routes';
import paymentRoutes from './api/v1/payment/payment.routes';
import promotionRoutes from './api/v1/promotion/promotion.routes';
import ratingRoutes from './api/v1/rating/rating.routes';
import notificationRoutes from './api/v1/notification/notification.routes';
import reportRoutes from './api/v1/report/report.routes';
import locationRoutes from './api/v1/location/location.routes';
import gamificationRoutes from './api/v1/gamification/gamification.routes';
import surveyRoutes from './api/v1/survey/survey.routes';
import contentRoutes from './api/v1/content/content.routes';
import assetRoutes from './api/v1/asset/asset.routes';
import catalogRoutes from './api/v1/catalog/catalog.routes';
import templateRoutes from './api/v1/template/template.routes';
import workflowRoutes from './api/v1/workflow/workflow.routes';
import financeRoutes from './routes/finance.routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/drivers', driverRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/promotions', promotionRoutes);
app.use('/api/v1/ratings', ratingRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/gamification', gamificationRoutes);
app.use('/api/v1/surveys', surveyRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/templates', templateRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/admin/finance', financeRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

// Start server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
