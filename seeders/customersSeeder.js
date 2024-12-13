const fs = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "../config/config.env" });

// Load model
const Customer = require("../models/Customer");

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read json data
const path = require("path");
const customers = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "Customers.json"), "utf-8")
);

const importData = async () => {
  try {
    await Customer.create(customers);
    console.log("Data imported...".green.inverse);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};

const deleteData = async () => {
  try {
    await Customer.deleteMany();
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
