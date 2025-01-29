function errorHandler(err, req, res, next) {
    // Check for specific error types
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'The user is not Authorized..' });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'The user is not Validated..' });
    }

    // Handle other errors
    return res.status(500).json({ message: 'An unexpected error occurred', error: err.message });
}

module.exports = errorHandler;
