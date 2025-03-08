const User = require('../models/User');
const { ErrorResponse } = require('./error');

const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.userId);

            if (!user) {
                return next(new ErrorResponse('User not found', 404));
            }

            if (!roles.includes(user.role)) {
                return next(
                    new ErrorResponse(
                        `User role ${user.role} is not authorized to access this route`,
                        403
                    )
                );
            }

            req.user = user;
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = authorize;
