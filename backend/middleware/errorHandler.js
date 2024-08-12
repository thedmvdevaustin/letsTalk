const notFound = (req, res, next) => {
    const error = new Error(`Page Not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode===200 ? 500 : res.statusCode
    let message = err.message

    if (err.name==='CastError' && err.type==='ObjectId'){
        statusCode = 404
        message = ("Resource not found in DB...")
    }

    res.status(statusCode).json({
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

export { notFound, errorHandler }