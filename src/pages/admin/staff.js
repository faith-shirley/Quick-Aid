import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Spinner } from "react-bootstrap";
import axiosClient from "../../../axiosClient";
import moment from "moment";

export default function index() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const getAllUsers = async () => {
    try {
      axiosClient.get("/api/admins/getAllStaffs").then((res) => {
        setUsers([...res.data.message]);
        return setIsLoading(false);
      });
    } catch (error) {
      console.log({error})
      setError("Error loading admins data");
      return setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const deleteStaff = async (id) => {
    try {
      setIsProcessing(true);
      axiosClient
        .delete(`/api/admins/deleteStaff?id=${id}`)
        .then((res) => {
          setIsProcessing(false);
          alert("Staff has been successfully deleted")
          axiosClient.get("/api/admins/getAllStaffs").then((res) => {
            setUsers([...res.data.message]);
            return setIsLoading(false);
          });
        });
    } catch (error) {
      setError("Error loading users data");
      setIsProcessing(false);
      return setIsLoading(false);
    }
  };

  return (
    <main>
      <Header />

      <div className="container-fluid">
        <div className="row">
          <Sidebar />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h3 className="h2">Staffs</h3>
            </div>

            <div className="table-responsive small">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Date Created</th>
                    <th scope="col">Date Updated</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={8}>
                        <Spinner className="text-warning text-center mx-auto" />
                      </td>
                    </tr>
                  )}
                  {users.length > 0 ? (
                    <>
                      {users.map((elem, index) => {
                        return (
                          <tr key={elem.id}>
                            <td>{index + 1}</td>
                            <td>{elem.name}</td> <td>{elem.email}</td>{" "}
                            <td>{elem.phone}</td>
                            <td>{moment(elem.createdAt).format("LLLL")}</td>
                            <td>{moment(elem.updatedAt).format("LLLL")}</td>
                            <td>{elem.isActivated ? "ACTIVE" : "DEACTIVE"}</td>
                            <td>
                              {isProcessing ? (
                                <Spinner className="text-warning text-center mx-auto" />
                              ) : (
                                <button
                                  className="btn btn-danger py-0"
                                  onClick={() => deleteStaff(elem.id)}
                                >
                                  <small>Delete Staff</small>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <tr>
                      <td>No Staffs found</td>
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
