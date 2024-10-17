module.exports = {
  success: (data) => {
    return {
      isError: false,
      code: 200,
      data: data,
    };
  },
  error: (text) => {
    return {
      isError: true,
      code: 404,
      message: text || "Not Found",
    };
  },
};
