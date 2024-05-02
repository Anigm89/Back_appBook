const firebaseAdmin = require('../config/firebase')
const express = require('express');


const verifyUser = async (req, res, next) => {
    
  const token = req.headers['authorization'];

    if(!token){
      return res.redirect('/')
    }
    next();
  };

module.exports = verifyUser;
