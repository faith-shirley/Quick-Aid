import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import axiosClient from "../../../axiosClient";
import moment from "moment";
import { Spinner } from "react-bootstrap";

export default function index() {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getAllAdmins = async () => {
    try {
      axiosClient.get("/api/admins/getAllAdmins").then((res) => {
        const data = [...res.data.message];
        setAdmins(data.reverse());
        return setIsLoading(false);
      });
    } catch (error) {
      setError("Error loading admins data");
      return setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllAdmins();
  }, []);

  return (
    <main>
      <Header />

      <div className="container-fluid">
        <div className="row">
          <Sidebar />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h3 className="h2">Admins</h3>
            </div>

            <div>
              {error && <div className="alert alert-danger">{error}</div>}
            </div>

            <div className="table-responsive small">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Names</th>
                    <th scope="col">Email</th>
                    <th scope="col">Date Created</th>
                    <th scope="col">Date Updated</th>
                    <th scope="col">Activation Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={5}>
                        <Spinner className="text-warning text-center mx-auto" />
                      </td>
                    </tr>
                  )}
                  {admins.length > 0 ? (
                    <>
                      {admins.map((elem, index) => {
                        return (
                          <tr key={elem.id}>
                            <td>{index + 1}</td>
                            <td>{elem.name}</td>
                            <td>{elem.email}</td>
                            <td>{moment(elem.createdAt).format("LLLL")}</td>
                            <td>{moment(elem.updatedAt).format("LLLL")}</td>
                            <td>{elem.isActivated ? "ACTIVE" : "DEACTIVE"}</td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <tr>
                      <td>No Admins found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}
