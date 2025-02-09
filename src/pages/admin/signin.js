import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import axiosClient from "../../../axiosClient";

export default function index() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!email) return setEmailError("Please enter valid email");
      setEmailError("");

      if (!password) return setPasswordError("Please enter your password");
      if (password.length < 6)
        return setPasswordError("Password must be at least 6 characters");
      setPasswordError("");

      setIsLoading(true);

      const payload = { email, password };

      axiosClient
        .post("/api/admins/signin", payload)
        .then(async (response) => {
          setIsLoading(false);
          setSuccessMessage("Login successful");
          const { data } = response;
          await localStorage.setItem("ACCESS_TOKEN", data.token);
          await localStorage.setItem("ID", data.id);
          setTimeout(() => {
            setIsLoading(false);
            router.push("/admin/dashboard");
          }, 1000);
        })
        .catch((err) => {
          console.log({ err });
          setError(err?.response?.data?.error);
          return setIsLoading(false);
        });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}>
          <Link href="/" className="d-flex">
            <Image
              src="/images/logo.png"
              alt=""
              width="150"
              height="150"
              className="mx-auto"
              priority={false}
            />
          </Link>
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating my-2">
            <input
              type="email"
              className="form-control"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="floatingInput">Email address</label>
            {emailError && (
              <div className="alert alert-danger">{emailError}</div>
            )}
          </div>
          <div className="form-floating my-2">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingPassword">Password</label>
            {passwordError && (
              <div className="alert alert-danger">{passwordError}</div>
            )}
          </div>

          {successMessage && (
            <div className="alert alert-success text-center">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="alert alert-success text-center">{error}</div>
          )}

          {isLoading ? (
            <div className="d-flex">
              <Spinner className="text-warning mx-auto" />
            </div>
          ) : (
            <button className="btn btn-success w-100 py-2" type="submit">
              Sign In
            </button>
          )}

          <div className="my-3 text-center">
            Do not have account <Link href="/admin/signup">Register Here</Link>
          </div>
          <p className="mt-5 mb-3 text-body-secondary text-center">
            <small>
              <i>&copy; 2024–2025</i>
            </small>
          </p>
        </form>
      </main>
    </>
  );
}
