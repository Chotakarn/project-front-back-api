const authController = {} ;

authController.register = async(req , res , next ) => {
    try {
        const { email , firstname , lastname , password , confirmPassword } = req.body;

        res.status(201).json({message : "register"});
    } catch (error) {
        next(error);
    }
}


authController.login = async(req , res , next ) => {
    try {
        res.status(201).json({message : "login"});
    } catch (error) {
        next(error);
    }
}

module.exports = authController;