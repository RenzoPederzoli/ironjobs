// const mongoose = require('mongoose');
const { Schema, model } = require("mongoose");
const PLM = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    email: String,
    firstName: String,
    lastName: String,
    googleId: String,
    imageUrl: String,
    addedJobs: []
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.plugin(PLM, { usernameField: "email" });

module.exports = model("User", userSchema);

