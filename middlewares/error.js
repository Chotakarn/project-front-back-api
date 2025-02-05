const errorMiddleware = (err , req , res , next ) => {
    console.log(err)
    res.status(err.statusCode || 500).json(err.message || "Internal server error")
}

module.exports = errorMiddleware;