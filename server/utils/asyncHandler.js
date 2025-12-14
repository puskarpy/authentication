export const asyncHandler = (asyncFunction) =>  (req, res, next) => {
        Promise.resolve(asyncFunction(req, res, next)).catch((error) => next(error));
    }
