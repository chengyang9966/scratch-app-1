import React, { useState } from "react";
import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import config from "../config";
import { Elements } from "@stripe/react-stripe-js";
import BillingForm from "../components/BillingForm";
import "./Settings.css";
import { useAppContext } from "../lib/contextLib";

const stripePromise = loadStripe(config.STRIPE_KEY);
export default function Settings() {
  const nav = useNavigate();
  const { setErrorMsg } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  function billUser(details) {
    return API.post("notes", "/billing", {
      body: details,
    });
  }
  async function handleFormSubmit(storage, { token, error }) {
    if (error) {
        setErrorMsg(current=>[...current,{message:error,title:'Submit Bill'}])
      return;
    }
  
    setIsLoading(true);
  
    try {
      await billUser({
        storage,
        source: token.id,
      });
  
      alert("Your card has been charged successfully!");
      nav("/");
    } catch (e) {
        setErrorMsg(current=>[...current,{message:e,title:'Submit Bill User'}])
      setIsLoading(false);
    }
  }
  
  return (
    <div className="Settings">
      <Elements
        stripe={stripePromise}
        fonts={[
          {
            cssSrc:
              "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
          },
        ]}
      >
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );
}