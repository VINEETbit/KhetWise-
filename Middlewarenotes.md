Express.js Middleware — One-Page Notes
🔹 What is Middleware?

A function that executes between Request and Response.

const middleware = (req, res, next) => {
    // logic
    next();
};

Flow: Client → Middleware → Controller → Response

🔹 Types of Middleware
Type	Purpose	Example
Application-level	Runs globally	app.use(logger)
Route-level	Runs for specific route	router.get("/", auth, controller)
Authentication	Verify JWT	authMiddleware
Authorisation/Role	Check permissions/role	roleMiddleware("admin")
Ownership	Check resource belongs to user	checkFarmOwnership
Validation	Validate request data	Joi/Zod
Error handling	Handle errors	(err,req,res,next)
404	Route not found	notFound
CORS	Allow frontend requests	cors()
Security	HTTP security headers	helmet()
Rate limiting	Prevent excessive requests	express-rate-limit
File upload	Handle images/files	multer
Logging	Track requests	logger
Async handler	Catch async errors	asyncHandler
🔐 Authentication Middleware
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token)
            return res.status(401).json({ message: "No token" });

        req.user = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
👤 Role Middleware
const roleMiddleware = (...roles) => {
    return (req, res, next) => {

        if (!req.user)
            return res.status(401).json({ message: "Login required" });

        if (!roles.includes(req.user.role))
            return res.status(403).json({ message: "Access denied" });

        next();
    };
};

module.exports = roleMiddleware;

Usage:

router.delete(
    "/users/:id",
    authMiddleware,
    roleMiddleware("admin"),
    deleteUser
);
🛡️ Ownership Middleware
const farm = await Farm.findOne({
    _id: req.params.farmId,
    farmer: req.user.id
});

if (!farm)
    return res.status(403).json({
        message: "You don't own this farm"
    });

req.farm = farm;
next();
✅ Validation Middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error)
            return res.status(400).json({
                message: error.details[0].message
            });

        next();
    };
};
❌ Error Middleware

Must have 4 parameters:

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Server Error"
    });
};

module.exports = errorMiddleware;

Use it last:

app.use(errorMiddleware);
🚫 404 Middleware
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
};
🌐 Common Global Middleware
app.use(cors());
app.use(express.json());
app.use(logger);
⭐ Middleware Order
Request
   ↓
CORS
   ↓
JSON Parser
   ↓
Logger
   ↓
Authentication
   ↓
Role / Ownership
   ↓
Validation
   ↓
Controller
   ↓
Response
   ↓
404 / Error Handler
🎯 Golden Rule

One middleware = one responsibility.

For KhetWise:

authMiddleware
      ↓
roleMiddleware
      ↓
checkFarmOwnership
      ↓
validation
      ↓
controller