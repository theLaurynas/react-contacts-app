import React from "react";
import { Form, redirect } from "react-router-dom";
import { login } from "../contacts";

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await login(data);
  return redirect("/");
}

export default function Login() {
  return (
    <div className="account-form">
      <Form method="POST">
        <label>Email:</label>
        <input
          type="text"
          name="email"
          defaultValue="jonas@gmail.com"
          placeholder="tomjackson@gmail.com"
        ></input>
        <br />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          defaultValue="pass"
          placeholder="someStrongPassword"
        ></input>
        <br />
        <input type="submit" value="Login"></input>
      </Form>
    </div>
  );
}
