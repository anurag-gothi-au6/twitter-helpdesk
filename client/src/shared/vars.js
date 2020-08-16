module.exports = {
  apiUrl:
    process.env.NODE_ENV !== "production"
      ? "https://twitter-hd-anurag.herokuapp.com"
      : "http://127.0.0.1:3000"
};
