import { catchAsync } from '../utils/catchAsync.js';
import * as mediaService from '../services/media.service.js';

export const getUploadSignature = catchAsync(async (req, res, next) => {
  // We can pass a folder name via query parameters (e.g., ?folder=properties)
  const targetFolder = req.query.folder || 'rentals/general';

  const signatureData = mediaService.generateUploadSignature(targetFolder);

  res.status(200).json({
    status: 'success',
    data: signatureData,
  });
});