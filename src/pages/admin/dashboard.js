import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import axiosClient from "../../../axiosClient";

export default function index() {
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getAllRequests = async () => {
    try {
      axiosClient.get("/api/admins/getAllAmbulanceOrders").then((res) => {
        setRequests([...res.data.message]);
        return setIsLoading(false);
      });
    } catch (error) {
      console.log({ error });
      setError("Error loading admins data");
      return setIsLoading(false);
    }
  };

  const getAllPatients = async () => {
    try {
      axiosClient.get("/api/admins/getAllUsers").then((res) => {
        setPatients([...res.data.message]);
        return setIsLoading(false);
      });
    } catch (error) {
      setError("Error loading admins data");
      return setIsLoading(false);
    }
  };

  const getAllStaff = async () => {
    try {
      axiosClient.get("/api/admins/getAllStaffs").then((res) => {
        setStaff([...res.data.message]);
        return setIsLoading(false);
      });
    } catch (error) {
      console.log({ error });
      setError("Error loading admins data");
      return setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllPatients();
    getAllRequests();
    getAllStaff();
  }, []);

  const options = {
    maintainAspectRatio: false, // Set to false to allow manual adjustment of aspectRatio
    aspectRatio: 100, // Set the desired aspect ratio (width:height)
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        // Use 'category' scale for the x-axis
        type: "category",
      },
    },
    // barThickness: 150,
  };

  const countElementsByMonth = (data) => {
    const monthlyCounts = Array(12).fill(0); // Initialize array to store counts for each month

    data.forEach((elem) => {
      const createdAt = new Date(elem.createdAt);
      const month = createdAt.getMonth(); // Get the month index (0-11)

      // Increment count for the corresponding month
      monthlyCounts[month]++;
    });

    return monthlyCounts;
  };

  return (
    <main>
      <Header />

      <div className="container-fluid">
        <div className="row">
          <Sidebar />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
              <h3 className="h2">Dashboard</h3>
            </div>

            <div className="row p-1">
              <div className="col-md-4 col-12 p-1">
                <div className="p-2 shadow-sm rounded border">
                  <h5>First Aid Requests({requests.length})</h5>
                  <div className="m-2" style={{ height: "400px" }}>
                    <Line
                      datasetIdKey="id"
                      data={{
                        labels: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                        datasets: [
                          {
                            id: 1,
                            label: "First Aid Requests",
                            data: countElementsByMonth(requests),
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false, // Set to false to allow manual adjustment of aspectRatio
                        aspectRatio: 100, // Set the desired aspect ratio (width:height)
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-12 p-1">
                <div className="p-2 shadow-sm rounded border">
                  <h5>Patients({patients.length})</h5>
                  <div className="m-2" style={{ height: "400px" }}>
                    <Line
                      datasetIdKey="id"
                      data={{
                        labels: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                        datasets: [
                          {
                            id: 1,
                            label: "Patients",
                            data: countElementsByMonth(patients),
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false, // Set to false to allow manual adjustment of aspectRatio
                        aspectRatio: 100, // Set the desired aspect ratio (width:height)
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-12 p-1">
                <div className="p-2 shadow-sm rounded border">
                  <h5>Medical Staff({staff.length})</h5>
                  <div className="m-2" style={{ height: "400px" }}>
                    <Line
                      datasetIdKey="id"
                      data={{
                        labels: [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ],
                        datasets: [
                          {
                            id: 1,
                            label: "Medical Staff",
                            data: countElementsByMonth(staff),
                          },
                        ],
                      }}
                      options={{
                        maintainAspectRatio: false, // Set to false to allow manual adjustment of aspectRatio
                        aspectRatio: 100, // Set the desired aspect ratio (width:height)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}
