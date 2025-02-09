import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Spinner } from "react-bootstrap";
import axiosClient from "../../../axiosClient";
import moment from "moment";

export default function index() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const getAllRequests = async () => {
    try {
      axiosClient.get("/api/admins/getAllAmbulanceOrders").then((res) => {
        setRequests([...res.data.message]);
        return setIsLoading(false);
      });
    } catch (error) {
      setError("Error loading admins data");
      return setIsLoading(false);
    }
  };

  const deleteRequest = async (id) => {
    try {
      setIsProcessing(true);
      axiosClient
        .delete(`/api/admins/deleteAmbulanceOrder?id=${id}`)
        .then((res) => {
          setIsProcessing(false);
          alert("Request has been successfully deleted")
          axiosClient.get("/api/admins/getAllAmbulanceOrders").then((res) => {
            setRequests([...res.data.message]);
            return setIsLoading(false);
          });
        });
    } catch (error) {
      setError("Error loading blogs data");
      setIsProcessing(false);
      return setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllRequests();
  }, []);

  return (
    <main>
      <Header />

      <div className="container-fluid">
        <div className="row">
          <Sidebar />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h3 className="h2">FirstAid requests({requests.length})</h3>
            </div>

            <div className="table-responsive small">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Patient Name</th>
                    <th scope="col">Patient Phone</th>
                    <th scope="col">Patient Email</th>
                    <th scope="col">Location</th>
                    <th scope="col">Health Condition</th>
                    <th scope="col">Notes</th>
                    <th scope="col">Staff Name</th>
                    <th scope="col">Staff Phone</th>
                    <th scope="col">Staff Email</th>
                    <th scope="col">Date Requested</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && (
                    <tr>
                      <td colSpan={12}>
                        <Spinner className="text-warning text-center mx-auto" />
                      </td>
                    </tr>
                  )}
                  {requests.length > 0 ? (
                    <>
                      {requests.map((elem, index) => {
                        return (
                          <tr key={elem.id}>
                            <td>{index + 1}</td>
                            <td>{elem?.user?.name}</td>
                            <td>{elem?.user?.email}</td>{" "}
                            <td>{elem?.user?.phone}</td>
                            <td>{elem?.location}</td>
                            <td>{elem?.healthCondition}</td>
                            <td>{elem?.notes}</td>
                            <td>{elem?.staff?.name}</td>
                            <td>{elem?.staff?.email}</td>{" "}
                            <td>{elem?.staff?.phone}</td>
                            <td>{moment(elem.createdAt).format("LLLL")}</td>
                            <td>
                              <div
                                className={
                                  elem.status === "COMPLETED"
                                    ? "badge bg-success"
                                    : elem.status === "ACCEPTED"
                                    ? "badge bg-warning"
                                    : "badge bg-secondary"
                                }
                              >
                                {elem.status}
                              </div>
                            </td>
                            <td>
                              {isProcessing ? (
                                <Spinner className="text-warning text-center mx-auto" />
                              ) : (
                                <button
                                  className="btn btn-danger py-0"
                                  onClick={() => deleteRequest(elem.id)}
                                >
                                  <small>Delete Request</small>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  ) : (
                    <tr>
                      <td>No Requests found</td>
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
