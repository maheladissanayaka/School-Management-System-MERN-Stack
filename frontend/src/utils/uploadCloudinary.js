import axios from 'axios';

const uploadToCloudinary = async (file) => {
  // 1. Access variables using import.meta.env in Vite
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // 2. Fallback check to ensure variables are loaded
  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary config missing. Check your .env file.");
    return null;
  }

  // 3. Prepare the form data for Cloudinary
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "school-management/assignments"); // Updated folder for clarity

  try {
    // 4. Send the upload request
    // 👇 FIXED: Changed '/image/upload' to '/auto/upload'
    // 'auto' allows Cloudinary to detect PDF, Docs, Zip, Video, and Images automatically.
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      formData
    );
    
    // 5. Return the secure URL (https://...)
    return res.data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.response?.data || error.message);
    throw error;
  }
};

export default uploadToCloudinary;