import React from "react";
import { Form, redirect } from "react-router-dom";
import { register } from "../contacts";

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  await register(data);
  return redirect("/");
}

export default function Registration() {
  return (
    <div className="account-form">
      <Form method="POST">
        <label>First name:</label>
        <input
          type="text"
          name="firstname"
          defaultValue="Jonas"
          placeholder="Tom"
        ></input>
        <br />
        <label>Last name:</label>
        <input
          type="text"
          name="lastname"
          defaultValue="Jonaitis"
          placeholder="Jackson"
        ></input>
        <br />
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
        <input type="submit" value="Register"></input>
      </Form>
    </div>
  );
}
