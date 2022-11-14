import MaterialTable from "@material-table/core";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import Widget from "../components/Widgets";
import { fetchTicket, ticketUpdation } from "../api/tickets";
import { getAllUser, updateUserData } from "../api/user";

import { Modal, Button } from "react-bootstrap";
const lookup = { true: "Available", false: "Unavailable" };

const columns = [
  {
    title: "ID",
    field: "id",
  },
  { title: "TITLE", field: "title" },
  { title: "DESCRIPTION  ", field: "description" },
  { title: "REPORTER", field: "reporter" },
  { title: "ASSIGNEE", field: "assignee" },
  { title: "PRIORITY", field: "ticketPriority" },
  {
    title: "STATUS",
    field: "status",
    lookup: {
      OPEN: "OPEN",
      IN_PROGRESS: "IN_PROGRESS",
      CLOSED: "CLOSED",
      BLOCKED: "BLOCKED",
    },
  },
];

const userColumns = [
  {
    title: "ID",
    field: "userid",
  },
  { title: "NAME", field: "name" },
  { title: "EMAIL", field: "email" },
  { title: "ROLE", field: "userTypes" },
  {
    title: "STATUS",
    field: "userstatus",
    lookup: {
      APPROVED: "APPROVED",
      REJECTED: "REJECTED",
      PENDING: "PENDING ",
    },
  },
];

function Admin() {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});

  const [userList, setUserList] = useState([]);
  const [userDetail, setUserDetail] = useState({});
  const [userUpdationModal, setUserUpdationModal] = useState(false);
  const [selectedCurrUser, setSelectedCurrUser] = useState({});

  const [userModal, setUserModal] = useState(false);
  const [message, setMessage] = useState("");

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  const openTicketUpdationModal = () => setTicketUpdationModal(true);
  const closeTicketUpdationModal = () => setTicketUpdationModal(false);

  const showUserModal = () => setUserModal(true);
  const closeUserModal = () => {
    setUserModal(false);
    setUserDetail({});
  };

  useEffect(() => {
    (async () => {
      fetchUsers("");
      fetchTickets();
    })();
  }, []);

  const fetchTickets = () => {
    fetchTicket()
      .then((response) => {
        setTicketDetails(response.data);
        updateTicketCount(ticketDetails);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };

  const fetchUsers = (userId) => {
    getAllUser(userId)
      .then(function (response) {
        if (response.status === 200) {
          if (userId) {
            setUserDetail(response.data[0]);
            showUserModal();
          } else setUserList(response.data);
          console.log("fetchUsers => ", response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateTicketCount = (tickets) => {
    // filling this empty object with the ticket counts
    // Segrating the tickets in 4 properties according to the status of the tickets
    const data = {
      open: 0,
      closed: 0,
      progress: 0,
      blocked: 0,
    };

    tickets.forEach((x) => {
      if (x.status === "OPEN") {
        data.open += 1;
      } else if (x.status === "CLOSED") {
        data.closed += 1;
      } else if (x.status === "IN_PROGRESS") {
        data.progress += 1;
      } else {
        data.blocked += 1;
      }
    });

    setTicketStatusCount(Object.assign({}, data));
  };

  const onTicketUpdate = (e) => {
    if (e.target.name === "ticketPriority")
      selectedCurrTicket.ticketPriority = e.target.value;
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value;
    else if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;

    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };

  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (response) {
        // closing the modal
        setTicketUpdationModal(false);
        // fetching the tickets again to update the table and the widgets
        fetchTickets();
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };

  const updateUserDetail = () => {
    const data = {
      userType: userDetail.userTypes,
      userStatus: userDetail.userStatus,
      userName: userDetail.name,
    };
    updateUserData(userDetail.userId, data)
      .then(function (response) {
        if (response.status === 200) {
          setMessage(response.message);
          let idx = userList.findIndex(
            (obj) => obj.userId === userDetail.userId
          );
          userList[idx] = userDetail;
          closeUserModal();
          setMessage("User detail updated successfully");
        }
      })
      .catch(function (error) {
        if (error.status === 400) setMessage(error.message);
        else console.log(error);
      });
  };

  const editTicket = (ticketDetail) => {
    const ticket = {
      assignee: ticketDetail.assignee,
      description: ticketDetail.description,
      title: ticketDetail.title,
      id: ticketDetail.id,
      reporter: ticketDetail.reporter,
      status: ticketDetail.status,
      ticketPriority: ticketDetail.ticketPriority,
    };
    setTicketUpdationModal(true);
    setSelectedCurrTicket(ticket);
  };

  const changeUserDetail = (e) => {
    if (e.target.name === "status") userDetail.userStatus = e.target.value;
    else if (e.target.name === "name") userDetail.name = e.target.value;
    else if (e.target.name === "type") userDetail.userTypes = e.target.value;
    setUserDetail(userDetail);
    setUserModal(e.target.value);
  };

  return (
    <div className="bg-light vh-100">
      <Sidebar />
      <div className="container ">
        <h3 className="text-center text-danger">
          Welcome,{localStorage.getItem("name")}!
        </h3>
        <p className="text-muted text-center">
          Take a quick look at your admin stats below
        </p>
      </div>

      <div className="row ms-5 ps-5 mb-5  ">
        {/* w1 */}
        <Widget
          color="primary"
          title="Open"
          icon="envelope-open"
          ticketCount={ticketStatusCount.open}
          pathColor="darkblue"
        ></Widget>

        <Widget
          color="success"
          title="Closed"
          icon="check2-circle"
          ticketCount={ticketStatusCount.closed}
          pathColor="darkgreen"
        ></Widget>

        <Widget
          color="warning"
          title="Progress"
          icon="hourglass-split"
          ticketCount={ticketStatusCount.progress}
          pathColor="darkgoldenrod"
        ></Widget>

        <Widget
          color="secondary"
          title="Blocked"
          icon="slash-circle"
          ticketCount={ticketStatusCount.blocked}
          pathColor="darkgrey"
        ></Widget>
      </div>

      <div className="text-center">
        <h5 className="text-info">{message}</h5>
      </div>

      <div className="container">
        <MaterialTable
          onRowClick={(event, rowData) => editTicket(rowData)}
          title="TICKET"
          columns={columns}
          data={ticketDetails}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#d9534f",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },

            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "ticketRecords"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "ticketRecords"),
              },
            ],
          }}
        />
        <Button onClick={openTicketUpdationModal}>Ticket update</Button>
        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            onHide={closeTicketUpdationModal}
            backdrop="static"
            centered
            className="shadow-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={updateTicket}>
                <div>
                  <h5 className="card-subtitle mb-2 text-danger">
                    {" "}
                    User ID:{selectedCurrTicket.id}
                  </h5>
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Title
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCurrTicket.title}
                    className="form-control"
                  ></input>
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Reporter
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCurrTicket.reporter}
                    className="form-control"
                  ></input>
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Assignee
                  </label>
                  <select className="form-control">
                    <option>Utkarshini</option>
                  </select>
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={selectedCurrTicket.ticketPriority}
                    className="form-control"
                    name="ticketPriority"
                    onChange={onTicketUpdate}
                  ></input>
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Status
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    onChange={onTicketUpdate}
                    value={selectedCurrTicket.status}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN-PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Description
                  </label>
                  <textarea
                    type="text"
                    value={selectedCurrTicket.description}
                    className="md-textarea form-control"
                    rows="3"
                    name="description"
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => closeTicketUpdationModal}
                  >
                    Cancel
                  </Button>
                  <Button varient="danger" className="m-1" type="submit">
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}

        {userModal ? (
          <Modal
            show={userModal}
            onHide={closeUserModal}
            backdrop="static"
            keyboard={false}
            centered
            className="shadow-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={updateUserDetail}>
                <div>
                  <h5 className="card-subtitle mb-2 text-danger">
                    {" "}
                    User ID:{userDetail.userId}
                  </h5>
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Name
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={userDetail.name}
                  ></input>
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Email
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={userDetail.email}
                    onChange={changeUserDetail}
                  ></input>
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Type
                  </label>

                  <select
                    type="text"
                    disabled
                    className="form-control"
                    value={userDetail.userTypes}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ENGINEER">ENGINEER</option>
                  </select>
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Status
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    value={userDetail.userStatus}
                    onChange={changeUserDetail}
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => closeUserModal}
                  >
                    Close
                  </Button>
                  <Button
                    varient="danger"
                    className="m-1"
                    type="submit"
                    onClick={() => updateUserDetail()}
                  >
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}

        <hr />

        <MaterialTable
          onRowClick={(event, rowData) => fetchUsers(rowData.userId)}
          title="USER DETAILS"
          columns={userColumns}
          data={userList}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#d9534f",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },

            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "userRecords"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "userRecords"),
              },
            ],
          }}
        />
      </div>
      <Button
        className="btn-btn danger m-1"
        onClick={() => setUserUpdationModal(true)}
      >
        {" "}
        Update user details
      </Button>
    </div>
  );
}
export default Admin;
