export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
    }

    return next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.code || error.message });
  }
};
