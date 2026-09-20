import { Router } from 'express';
import * as settingController from '../controllers/setting.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateSettingSchema, bulkUpdateSettingsSchema } from '../validators/settings';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

router.get('/', settingController.getAll);
router.get('/:key', settingController.get);
router.post('/', validate(updateSettingSchema), settingController.update);
router.post('/bulk', validate(bulkUpdateSettingsSchema), settingController.bulkUpdate);
router.delete('/:key', settingController.remove);

export default router;
