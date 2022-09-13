const authorModel = require("../model/authormodel");
const jwt = require("jsonwebtoken");


const isValid = function (value) {
  if (typeof value === 'undefined' || value === null) return false
  if (typeof value === 'string' && value.trim().length === 0) return false
  return true
}

const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0
}

//========================================= Author Create ========================================================//


const createAuthor = async function (req, res) {

  try {
    const requestBody = req.body
    if (!isValidRequestBody(requestBody)) {
      return res.status(400).send({ status: false, msg: 'Invalid' })
    }

    // extract
    const { fname, lname, title, email, password } = requestBody

    //validations
    if (!isValid(fname)) {
      res.status(400).send({ status: false, msg: 'first name is required' })
    }

    if (!isValid(lname)) {
      res.status(400).send({ status: false, msg: 'last name is required' })
    }

    if (!isValid(title)) {
      res.status(400).send({ status: false, msg: 'title is required' })
    }

    if (!isValidTitle(title)) {
      res.status(400).send({ status: false, msg: 'title should be among Mr, Mrs, Miss' })
    }

    if (!isValid(email)) {
      res.status(400).send({ status: false, msg: 'email is required' })
    }

    if (!isValid(password)) {
      res.status(400).send({ status: false, msg: 'password is required' })
    }

    const emailAlreadyUsed = await authorModel.findOne({ email })
    if (emailAlreadyUsed) {
      res.status(400).send({ status: false, msg: `${email} email is already registered` })
    }

    //////

    const authorData = { fname, lname, title, email, password }
    const newAuthor = await authorModel.create(authorData)

    res.status(201).send({ status: true, msg: 'author created succesfully', data: newAuthor })

  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};


//========================================== Login author ======================================================================//


const authorLogin = async (req, res) => {
  try {
    let userName = req.body.email;
    let pwd = req.body.password;

    if(!isValid(userName)){
      return res.status(400).send({status:false, msg:'invalid email address'})
    }

    if(!isValid(pwd)){
      return res.status(400).send({status:false, msg:'invalid password'})
    }

    let authorDetails = await authorModel.findOne({
      email: userName,
      password: pwd,
    });
    if (!authorDetails) {
      return res
        .status(401)
        .send({ status: false, msg: "Invalid login credentials" });
    }

    // token create :-
    let token = await jwt.sign(
      {
        userId: authorDetails._id,
        Batch: "plutonium",
        Project1: "Group26",
      },
      "secret key"
    );
    res.header('x-auth-token', token)
    res.status(200).send({ status: true, data: token, msg: 'Author login successfull' });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};


//=========================================== export the module ===================================================//

module.exports.createAuthor = createAuthor;

module.exports.authorLogin = authorLogin;
