/* tslint:disable */
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
export const app = express();
//import { createStripeCheckoutSession } from "./checkout";
import { createPaymentIntent, createTestPaymentIntent } from "./payments";
//import { handleStripeWebhook } from "./webhooks";
//import { auth } from "./firebase";

// Allows cross origin requests
app.use(cors({ origin: true }));
app.use(express.json());
app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

/**
 * Catch async errors when awaiting promises
 */
const runAsync = (callback) => {
  return (req, res, next) => {
    callback(req, res, next).catch(next);
  };
};

app.post(
  "/payments/",
  runAsync(async ({ body }, res) => {
    res.send(await createPaymentIntent(body.amount, body.email));
  })
);

app.post(
  "/test-payments/",
  runAsync(async ({ body }, res) => {
    res.send(await createTestPaymentIntent(body.amount, body.email));
  })
);

/* app.post("/test", (req, res) => {
  const amount = req.body.amount;
  res.status(200).send({ with_tax: amount * 7 });
}); */

/* app.post(
  "/checkouts/",
  runAsync(async ({ body }, res) => {
    res.send(await createStripeCheckoutSession(body.line_items));
  })
); */

//Handle webhooks
//app.post("/hooks", runAsync(handleStripeWebhook));

//Decodes the Firebase JSON Web Token
//app.use(decodeJWT);
/**
 * Decodes the JSON Web Token sent via the frontend app
 * Makes the currentUser (firebase) data available on the body
 */
/* async function decodeJWT(req, res, next) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }
  next();
} */
/**
 * Throws an error if the currentUser does not exist on the request
 */
/* function validateUser(req) {
  const user = req["currentuser"];
  if (!user) {
    throw new Error(
      "You must be logged in to make this request. i.e. Authorization: Bearer <token>"
    );
  }
  return user;
} */
