import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Spinner } from "react-bootstrap";

export default function index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.push("/");
        setTimeout(() => {
          router.reload();
        }, 1000);
      }, 500);
    } catch (error) {}
  };

  return (
    <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary text-dark">
      <div
        className="offcanvas-md offcanvas-end bg-body-tertiary"
        tabIndex="-1"
        id="sidebarMenu"
        aria-labelledby="sidebarMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarMenuLabel">
            Admin Dashboard
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2 active"
                aria-current="page"
                href="/admin/dashboard"
              >
                <i className="bi bi-speedometer"></i>
                Dashboard
              </Link>
            </li>
          </ul>

          <hr className="my-2" />

          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
            <span>USER MANAGEMENT</span>
            <a
              className="link-secondary"
              href="#"
              aria-label="Add a new report"
            >
              <i className="bi bi-plus-circle-fill"></i>
            </a>
          </h6>
          <ul className="nav flex-column mb-auto">
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                href="/admin/users"
              >
                <i className="bi bi-people-fill"></i>
                Users
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                href="/admin/staff"
              >
                <i className="bi bi-person-bounding-box"></i>
                Staff
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                href="/admin/admins"
              >
                <i className="bi bi-person-circle"></i>
                Admins
              </Link>
            </li>
          </ul>

          <hr className="my-2" />
          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
            <span>MODULE MANAGEMENT</span>
            <a
              className="link-secondary"
              href="#"
              aria-label="Add a new report"
            >
              <i className="bi bi-plus-circle-fill"></i>
            </a>
          </h6>
          <ul className="nav flex-column mb-auto">
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                href="/admin/requests"
              >
                <i className="bi bi-hospital-fill"></i>
                FirstAid Requests
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                href="/admin/blogs"
              >
                <i className="bi bi-book-half"></i>
                Blogs
              </Link>
            </li> */}
          </ul>
          <hr className="my-2" />

          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
            <span>BLOG MANAGEMENT</span>
            <a
              className="link-secondary"
              href="#"
              aria-label="Add a new report"
            >
              <i className="bi bi-plus-circle-fill"></i>
            </a>
          </h6>
          <ul className="nav flex-column mb-auto">
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                href="/admin/manageBlogs"
              >
                <i className="bi bi-substack"></i>
               Manage Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                href="/admin/blogs"
              >
                <i className="bi bi-book-half"></i>
                Blogs
              </Link>
            </li>
          </ul>
          <hr className="my-2" />
          <div className="nav flex-column mb-auto px-2">
            {isLoading ? (
              <Spinner className="text-warning mx-auto" />
            ) : (
              <button
                className="d-flex align-items-center gap-2 btn btn-danger"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-left"></i>
                SignOut
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
