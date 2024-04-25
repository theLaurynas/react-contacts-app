import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user }) {
  return (
    <>
      <p>
        {user == "" ? (
          <>
            <Link to="/register">Register</Link> |{" "}
            <Link to="/login">Login</Link>
          </>
        ) : (
          <>
            Welcome back, {user.email}
            <Link to="/logout">Logout</Link>
          </>
        )}
      </p>
      <hr />
    </>
  );
}
