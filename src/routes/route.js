const express = require('express');
const router = express.Router();
const authorController = require("../Controller/authorcontroller");
const blogController = require("../Controller/blogsController")
const middleware = require("../middleware/middleware")



//author api's
router.post("/authors", authorController.createAuthor)
router.post("/loginUser", authorController.loginAuthor)

// blogs api's
router.post("/blogs", middleware.authentication, blogController.createBlog)
router.get("/getblogs", middleware.authentication, blogController.getAllBlogs)
router.put("/blogs/:blogId", middleware.authentication, middleware.authorization, blogController.updatedBlogsData)
router.delete("/blogs/:blogId", middleware.authentication, middleware.authorization, blogController.deletedByParams)
router.delete("/blogs", middleware.authentication, middleware.authorization2, blogController.deleteByQuery)



module.exports = router;