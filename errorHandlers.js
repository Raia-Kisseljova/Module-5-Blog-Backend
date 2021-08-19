export const testFields = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({ success: false, message: err.message });
  }
};
