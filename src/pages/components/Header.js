import React, { useEffect, useState } from "react";
import axiosClient from "../../../axiosClient";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";

export default function Header() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(true);

  const getAdmin = async () => {
    try {
      axiosClient
        .post(`/api/admins/getAdmin`)
        .then((res) => {
          setUser(res.data.message);
          return setIsLoading(false);
        })
        .catch((error) => {
          router.push("/admin/signin");
          return;
        });
    } catch (error) {}
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = window.localStorage.getItem("ID");
      if (id) {
        getAdmin();
      } else {
        return router.push("/admin/signin");
      }
    }
  }, []);

  return (
    <header
      className="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow"
      data-bs-theme="dark"
    >
      <a
        className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white"
        href="#"
      >
        Admin Dashboard
      </a>
      {isLoading ? (
        <Spinner className="text-warming" />
      ) : (
        <p className="text-white m-0 p-2">Hey {user?.name}</p>
      )}

      <ul className="navbar-nav flex-row d-md-none">
        <li className="nav-item text-nowrap">
          <button
            className="nav-link px-3 text-white"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list text-white"></i>
          </button>
        </li>
      </ul>
    </header>
  );
}
