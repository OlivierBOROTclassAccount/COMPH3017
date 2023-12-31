export async function GET(req, res) {
  // Make a note we are on
  // the api. This goes to the console.
  console.log("in the login api page");

  // get the values
  // that were sent across to us.
  const { searchParams } = new URL(req.url);
  const emailF = searchParams.get("email");
  const pass = searchParams.get("pass");

  const express = require('express');
  const session = require('express-session');
  const crypto = require('crypto');

  const app = express();

  app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: true
  }));

  console.log(emailF);
  console.log(pass);

  // database call goes here
  const { MongoClient } = require("mongodb");
  // const url = "mongodb://root:example@localhost:27017/";
  const url = 'mongodb+srv://olivierborot:VNoAzU7j54TxP3Wb@rwa-cluster.iyfqywo.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(url);
  const dbName = "App"; // Nom de la base de données

  try {
    await client.connect();
    console.log("Successfully connected to MongoDB server");
    const db = client.db(dbName);
    const collection = db.collection("Login"); // Nom de la collection
    const findResult = await collection
      .find({"username": emailF, "pass": pass })
      .toArray();
    console.log("Found docs =>", findResult);

    let valid = false;
    if (findResult.length > 0) {
      valid = true;
      req.session.user = findResult;
      console.log("Login valid");

    } else {
      console.log("Login invalid");
    }


    return Response.json({ success: true, redirect: '/dashboard_'+findResult[0].acc_type });
  } catch (error) {
    console.error("An error occured :", error);
  } finally {
    await client.close();
  }

  main();

  return Response.json({ success: true, redirect: '/dashboard_'+findResult[0].acc_type });
}