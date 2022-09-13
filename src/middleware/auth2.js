const jwt = require("jsonwebtoken");
const blogsModel = require("../model/blogsmodel");

const authorization = async (req, res, next) => {
  try {
    
    let blogId = req.params.blogId;
    let findBlog = await blogsModel.findById(blogId).select({authorId:1})
    if (!findBlog) {
      return res.status(400).send({ status: false, msg: "blog data not find" });
    }

    let token = req.headers["x-auth-token"];

    let decodedToken = jwt.verify(token, "secret key");
    if (!decodedToken) {
      res.status(400).send({ status: false, msg: "invalid user" });
    }

    let authorId = findBlog.authorId.toString()
    let validAuthorLoggedIn = decodedToken.userId;
    if (authorId !== validAuthorLoggedIn) {
      return res.status(400).send({ status: false, msg: "not a valid user" });
    }

    next();
  } catch (err) {
    res.status(400).send({ status: false, error: err.message });
  }
};




module.exports.authorization = authorization;
