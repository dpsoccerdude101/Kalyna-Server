/* tslint:disable */
import Stripe from "stripe";
import * as functions from "firebase-functions";
export const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: "2020-08-27",
});
export const testStripe = new Stripe(functions.config().stripe.testsecret, {
  apiVersion: "2020-08-27",
});


/**
 * Create a Payment Intent with a specific amount
 */
export async function createPaymentIntent(amount, email) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "usd",
    receipt_email: email,
  });
  return paymentIntent;
}
/**
 * Create a Payment Intent with a specific amount
 */
export async function createTestPaymentIntent(amount, email) {
  const paymentIntent = await testStripe.paymentIntents.create({
    amount,
    currency: "usd",
    receipt_email: email,
  });
  return paymentIntent;
}
