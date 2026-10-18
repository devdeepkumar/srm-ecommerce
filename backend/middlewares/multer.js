// utils/multer.js or middleware/multer.js
import multer from "multer";

import { avatarStorage, productStorage } from "../custom/cloudinary.js";


// Multer middleware for avatar
export const uploadAvatar = multer({ storage: avatarStorage });

// Multer middleware for product images
export const uploadProductImages = multer({ storage: productStorage });
