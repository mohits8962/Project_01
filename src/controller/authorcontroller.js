const jwt = require("jsonwebtoken");
const authormodel = require("../model/authormodel");



//=================================//creating author//==========================================================//

const createAuthor = async function (req, res) {
  try {
    let { fname, lname, title, email, password } = req.body;

    if (!fname) {
      return res.status(400).send({ msg: "Please enter fname, it is required" });
    }

    if (!lname) {
      return res.status(400).send({ msg: "Please enter lname, it is required" });
    }

    if (!title) {
      return res.status(400).send({ msg: "Please enter title, it is required" });
    }

    if (!email) {
      return res.status(400).send({ msg: "Please enter email, it is required" });
    }

    if (!password) {
      return res.status(400).send({ msg: "Please enter password, it is required" });
    }

    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;      //email regex
    let checkEmail = regex.test(email);
    if (!checkEmail) {
      return res.status(400).send({ msg: "Please provide a valid email address" });
    }

    let findEmail = await authormodel.findOne({ email })
    if (findEmail) {
      return res.status(400).send({ msg: "Email you enter is already present, try another one" });
    }

    let authordata = await authormodel.create(req.body);
    res.status(201).send({ status: true, msg: authordata });

  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};


//=================================//login author//==========================================================//

const loginAuthor = async function (req, res) {
  try {
    let { email, password } = req.body;

    let author = await authormodel.findOne({ email, password });

    if (author) {
      let payload = { authorId: author._id, email: email };
      const generatedToken = jwt.sign(payload, "bloggingproject1");
      return res.status(200).send({ status: true, token: generatedToken });

    } else {
      return res.status(400).send({ status: false, message: "Invalid credentials, please enter right credentials" });
    }
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.loginAuthor = loginAuthor;
module.exports.createAuthor = createAuthor;