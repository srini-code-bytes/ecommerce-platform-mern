export const isValidFileType = (file, allowedTypes = ["image/jpeg","image/jpg", "image/png"]) => {
    const fileType = file.type;
    return allowedTypes.includes(fileType);
}

export const isValidFileSize = ( file, maxSize = 5 * 1024 * 1024) => {
    const fileSize = file.size;
    return fileSize <= maxSize;
}