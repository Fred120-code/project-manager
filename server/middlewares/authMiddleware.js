export const protect = async (req, res, next) => {
  try {
    const auth = await req.auth();
    const { userId } = auth || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Store userId in request for rate limiting and other middleware
    req.userId = userId;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: error.code || error.message });
  }
};
