import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        // replace "my-limit-key" with a unique key per user/IP if needed
        const { success } = await ratelimit.limit("my-limit-key");
        if (!success) {
            return res.status(429).json({ error: "Too many requests" });
        }
        next();
    } catch (error) {
        console.log("Rate Limiter Error:", error);
        next(error);
    }
}

export default rateLimiter;