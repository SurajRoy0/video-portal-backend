import multer from "multer";
import path from "path";
import fs from "fs";


// Ensure the temporary directory exists
// const tempDir = path.join(__dirname, "./public/temp");
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
// }

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname); // Keeping file name simple for now instead of adding uniqueSuffix
  },
});


// File filter to accept only specific file types (e.g., images)
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (extname && mimetype) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only images are allowed"));
//     }
//   };
  
  // Multer instance with options
  export const upload = multer({ 
    storage,
    // limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
    // fileFilter,
  });

