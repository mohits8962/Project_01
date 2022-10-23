const blogsModel = require("../model/blogsmodel");
let authorModel = require("../model/authormodel");
const mongoose = require("mongoose");


const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}

const isValidObjectId = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}



//============================================= Blog create ======================================================//


const createBlog = async function (req, res) {
  try {
    const requestBody = req.body
    if (!isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, msg: 'Invalid' })
    }

    // extract
    const { title, body, authorId, tags, category, subcategory, isPublished } = requestBody

    // validations
    if (!isValid(title)) {
      return res.status(400).send({ status: false, msg: 'title is required' })
    }

    if (!isValid(body)) {
      return res.status(400).send({ status: false, msg: 'body is required' })
    }

    if (!isValid(authorId)) {
      return res.status(400).send({ status: false, msg: 'authorId is required' })
    }

    if (!isValidObjectId(authorId)) {
      return res.status(400).send({ status: false, msg: `${authorId} is not a valid author Id` })
    }

    if (!isValid(category)) {
      return res.status(400).send({ status: false, msg: 'category is required' })
    }

    if (!isValid(subcategory)) {
      return res.status(400).send({ status: false, msg: 'subcategory is required' })
    }

    ////////////////

    let condition = await authorModel.findById(requestBody.authorId);

    if (condition) {
      if (requestBody.isPublished == true) {
        requestBody.publishedAt = Date.now();
        let savedData = await blogsModel.create(requestBody);
        return res.status(201).send({ data: savedData });

      } else if (requestBody.isPublished == false) {
        requestBody.publishedAt = null;
        let savedData = await blogsModel.create(requestBody);
        return res.status(201).send({ data: savedData });
      }
    } else {
      return res.status(400).send({ status: false, msg: "authorId is not present" });
    }
  } catch (err) {
    return res.status(500).send({ msg: "error", error: err.message });
  }
}


//========================================= Get blogs ============================================================//



const getAllBlogs = async function (req, res) {
  try {
    let filters = req.query

    if (Object.keys(filters).length === 0) {
      let blogs = await blogsModel.find({ isDeleted: false, isPublished: true })
      if (blogs.length == 0) res.status(404).send({ status: false, msg: "No result found" })
      return res.status(200).send({ status: true, data: blogs })

    } else {
      filters.isDeleted = false
      filters.isPublished = true
      if (filters.tags) {
        if (filters.tags.includes(",")) {
          let tagArray = filters.tags.split(",").map(String).map(x => x.trim())
          filters.tags = { $all: tagArray }
        }
      }

      if (filters.subcategory) {
        if (filters.subcategory.includes(",")) {
          let subcatArray = filters.subcategory.split(",").map(String).map(x => x.trim())
          filters.subcategory = { $all: subcatArray }
        }
      }

      let filteredBlogs = await blogsModel.find(filters)
      if (filteredBlogs.length === 0) {
        return res.status(404).send({ status: false, msg: "No such data available" })
      }
      else {
        return res.status(200).send({ status: true, data: filteredBlogs })
      }
    }
  }
  catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}


//============================================== Update Blogs =====================================================//


const updatedBlogsData = async function (req, res) {
  try {
    let getId = req.params.blogId;
    let data = req.body;

    let checkId = await blogsModel.findOne({ _id: getId });
    if (checkId) {
      if (checkId.isDeleted === false) {
        let check = await blogsModel.findByIdAndUpdate(
          getId,
          {
            $push: { tags: data.tags, subcategory: data.subcategory },
            title: data.title,
            body: data.body,
            isPublished: true,
            publishedAt: Date.now(),
          },
          { new: true }
        );

        let a = check.tags.flat()
        let b = check.subcategory.flat()
        let check2 = await blogsModel.findByIdAndUpdate(getId, { tags: a, subcategory: b }, { new: true })

        return res.status(200).send({ status: true, message: 'updated data successfully', data: check2 });
      } else {
        return res.status(404).send("File is not present or Deleted");
      }
    } else {
      return res.status(404).send({ status: false, msg: "please enter valid blog id" });
    }
  } catch (err) {
    return res.status(500).send({ staus: false, error: err.message });
  }
};


//=========================================== Delete by params ========================================================//



const deletedByParams = async function (req, res) {
  try {
    let blogid = req.params.blogId;
    if (!blogid) {
      return res.status(400).send({ msg: "blogId is not valid" });
    }

    let findBlockid = await blogsModel.findById(blogid);
    if (!findBlockid) {
      return res.status(404).send({ msg: " blog is not exits" });
    }

    if (findBlockid.isDeleted == false) {
      let finddata = await blogsModel.findOneAndUpdate(
        { _id: blogid },
        { $set: { isDeleted: true, deletedAt: Date.now() } },
        { new: true }
      );
      return res.status(200).send({ status: true, msg: 'data deleted successfully' });
    } else {
      return res.status(404).send({ msg: "file is already deleted" });
    }
  } catch (err) {
    return res.status(500).send({ staus: false, error: err.message });
  }
};


//=========================================== Delete By query ========================================================//



const deleteByQuery = async (req, res) => {
  try {
    let data = req.query;
    let allBlogs = await blogsModel.find(data);
    if (allBlogs.length == 0) {
      return res.status(400).send({ status: false, msg: "No blog found" });
    }

    let deletedData = await blogsModel.updateMany(
      { isDeleted: false },
      { $set: { isDeleted: true, deletedAt: Date.now() } },
      { new: true }
    );

    if (deletedData.modifiedCount == 0) return res.status(404).send({ status: false, msg: "No Such BLog Or the blog already is Deleted" });

    return res.status(200).send({ status: true, msg: deletedData });

  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};


//========================================= module exports ========================================================//


module.exports.createBlog = createBlog;

module.exports.getAllBlogs = getAllBlogs;

module.exports.updatedBlogsData = updatedBlogsData;

module.exports.deletedByParams = deletedByParams;

module.exports.deleteByQuery = deleteByQuery;
