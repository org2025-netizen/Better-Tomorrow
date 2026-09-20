import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createPaymentSchema, paymentQuerySchema, receiptQuerySchema } from '../validators/payments';

const router = Router();

router.use(authenticate);

router.get('/', validate(paymentQuerySchema), paymentController.getAll);
router.get('/student/:studentId', paymentController.getByStudent);
router.get('/receipts/all', validate(receiptQuerySchema), paymentController.getReceipts);
router.get('/receipts/:id', paymentController.getReceiptById);
router.get('/:id', paymentController.getById);
router.get('/:id/receipt', paymentController.getReceiptByPaymentId);
router.post('/', authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), validate(createPaymentSchema), paymentController.create);
router.delete('/:id', authorize('ADMIN', 'SUPER_ADMIN'), paymentController.remove);

export default router;
