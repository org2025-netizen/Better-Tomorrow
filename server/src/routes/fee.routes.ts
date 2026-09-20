import { Router } from 'express';
import * as feeController from '../controllers/fee.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createFeeStructureSchema, updateFeeStructureSchema, createInvoiceSchema, updateInvoiceSchema, feeQuerySchema } from '../validators/fees';

const router = Router();

router.use(authenticate);

router.get('/structures', validate(feeQuerySchema), feeController.getAllStructures);
router.get('/structures/:id', feeController.getStructureById);
router.post('/structures', authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), validate(createFeeStructureSchema), feeController.createStructure);
router.put('/structures/:id', authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), validate(updateFeeStructureSchema), feeController.updateStructure);
router.delete('/structures/:id', authorize('ADMIN', 'SUPER_ADMIN'), feeController.deleteStructure);

router.get('/invoices', feeController.getAllInvoices);
router.get('/invoices/student/:studentId', feeController.getStudentInvoices);
router.post('/invoices/generate', authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), feeController.generateInvoices);
router.get('/invoices/:id', feeController.getInvoiceById);
router.post('/invoices', authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), validate(createInvoiceSchema), feeController.createInvoice);
router.put('/invoices/:id', authorize('ADMIN', 'ACCOUNTANT', 'SUPER_ADMIN'), validate(updateInvoiceSchema), feeController.updateInvoice);
router.delete('/invoices/:id', authorize('ADMIN', 'SUPER_ADMIN'), feeController.deleteInvoice);

export default router;
