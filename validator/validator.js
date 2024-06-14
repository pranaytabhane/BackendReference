import { messages } from '../config/constants';
import { Responses } from '../middleware/responses';

export const validator = (validateFor) => {
    return (req, res, next) => {
        const { error } = validateFor.validate({...req.body, ...req.query}, { abortEarly: false });
    
        if (error) {
            const allErrors = error.details.map(err => {
                return {
                    messages: err.message,
                    context: err.context
                }
            });
            return Responses._403(res, {
                status: false,
                message: messages.validationError,
                body: null,
                error: allErrors,
            })
        } else {
            next();
        }
    };
}
const getFileSizeInMB = (size) => {
    const sizeInMB = (size / (1024*1024)).toFixed(2);
    return sizeInMB
}
const checkFileSizeAndMimeType = (file, allowedFileTypes, fileName) => {
    let errors = {}
    let allowedFileTypes1 = allowedFileTypes.toString() // Convert regexes to strings
    if (!allowedFileTypes.test(file.mimetype)) {
        errors.mimeType = `${fileName} allowed only ${allowedFileTypes1.replace(/\//g, '').replace(/\|/g, ', ')} mime type`
    } else {
        if (getFileSizeInMB(file.size) > 5) {
            errors.size = `${fileName} file size should not be greater than 5MB for ${file.name}`
        }
    }
    return errors
}
export const imageValidator = (allowedFileTypes, allowedFiles) => {
    return (req, res, next) => {
        let allErrors = []
        for (const value of allowedFiles) {
            const file = value.split('-')[0]
            const fieldAttr = value.split('-')[1] // R-required | O-optional
            if (!req.files && fieldAttr === 'R') {
                allErrors.push(`${file} is required`)
            }
            if (req.files && !(file in req.files) && fieldAttr === 'R') {
                allErrors.push(`${file} is required`)
            }
            if (req.files && file in req.files) {
                if (Array.isArray(req.files[file])) {
                    for (const idx in req.files[file]) {
                        const error = checkFileSizeAndMimeType(req.files[file][idx], allowedFileTypes, file)
                        if (Object.keys(error).length > 0) {
                            allErrors.push(error.size)
                            allErrors.push(error.mimeType)
                        }
                    }
                } else {
                    const error = checkFileSizeAndMimeType(req.files[file], allowedFileTypes, file)
                    if (Object.keys(error).length > 0) {
                        allErrors.push(error.size)
                        allErrors.push(error.mimeType)
                    }
                }
            }
            
        }
        allErrors = [...new Set(allErrors)].filter(err => err).map(err => {
            return {
                messages: err
            }
        });
        if (allErrors.length > 0) {
            return Responses._403(res, {
                status: false,
                message: messages.validationError,
                body: null,
                error: allErrors,
            })
        } else {
            next();
        }
    };
}