const multer = require('multer');
const path = require('path');
const { ErrorResponse } = require('../middleware/error');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';
        
        // Determine upload directory based on file type
        if (file.fieldname === 'safetyImages') {
            uploadPath += 'safety/';
        } else if (file.fieldname === 'homestayImages') {
            uploadPath += 'homestays/';
        } else if (file.fieldname === 'claimEvidence') {
            uploadPath += 'claims/';
        } else if (file.fieldname === 'profilePicture') {
            uploadPath += 'profiles/';
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = /jpeg|jpg|png|pdf/;
    
    // Check extension
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // Check mime type
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new ErrorResponse('Invalid file type. Only JPEG, JPG, PNG, and PDF files are allowed.', 400), false);
    }
};

// Configure upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload middleware configurations
const uploadConfigs = {
    safetyImages: upload.array('safetyImages', 5),
    homestayImages: upload.array('homestayImages', 10),
    claimEvidence: upload.array('claimEvidence', 3),
    profilePicture: upload.single('profilePicture')
};

module.exports = uploadConfigs;
