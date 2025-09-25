import ApiError from "../utils/ApiError.js";


const canCreateDepartment = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return next(new ApiError(401, 'Not Allowed to create Department', 'INVALID_TOKEN', 'Authentication token is invalid or expired'));
    }
};

const canCreateEmployee = (req, res, next) => {
    if (req.user && (req.user.role === "admin" || req.user.role === "department_head", req.user.role === "municipal_admin")) {
        next();
    } else {
        return next(new ApiError(401, 'Not Allowed to create Employee', 'INVALID_TOKEN', 'Authentication token is invalid or expired'));
    }
}

export { canCreateDepartment, canCreateEmployee };