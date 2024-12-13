const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "../config/config.env" });

// Load model
const Employee = require("../models/Employee");

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read json data
const path = require("path");
const employees = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "Employees.json"), "utf-8")
);

const importData = async () => {
  try {
    await Employee.create(employees);
    console.log("Data imported...".green.inverse);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Employee.deleteMany();
    console.log("Data Destroyed...".red.inverse);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};

[, , ...args] = process.argv;
const [action] = args;
if (action === "-i") importData();
else if (action === "-d") deleteData();
