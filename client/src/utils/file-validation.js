export const isValidFileType = (file, allowedTypes = ["image/jpeg","image/jpg", "image/png"]) => {
    console.log("** Inside isValidFileType **", file);
    const fileType = file.type;
    return allowedTypes.includes(fileType);
}

export const isValidFileSize = ( file, maxSize = 5 * 1024 * 1024) => {
    console.log("** Inside isValidFileSize **", file);
    const fileSize = file.size;
    return fileSize <= maxSize;
}