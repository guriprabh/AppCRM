import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Widget from "../components/Widgets";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import MaterialTable from "@material-table/core";
import { Modal, Button } from "react-bootstrap";
import { ticketCreation, fetchTicket, ticketUpdation } from "../api/tickets";
import { useNavigate } from "react-router-dom";
const columns = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "TITLE",
    field: "title",
  },
  {
    title: "DESCRIPTION",
    field: "description",
  },
  {
    title: "ASSIGNEE",
    field: "assignee",
  },
  {
    title: "PRIORITY",
    field: "priority ",
  },
  {
    title: "STATUS",
    field: "status",
    lookup: {
      OPEN: "OPEN",
      IN_PROGRESS: "IN_PROGESS",
      CLOSED: "CLOSED",
      BLOCKED: "BLOCKED",
    },
  },
];

function Customer() {
  const [createTicketModal, setCreateTicketModal] = useState(false);
  const [message, setMessage] = useState("");
  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketCount, setTicketCount] = useState("  ");
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);
  const createTicket = (e) => {
    e.preventDefault();

    const data = {
      title: e.target.title.value,
      description: e.target.description.value,
    };

    ticketCreation(data)
      .then(function (response) {
        console.log(response);
        setMessage("Ticket Created Successfully");
        setCreateTicketModal(false);
        fetchTickets();
      })
      .catch(function (error) {
        setMessage(error.message);
        if (error.response.status === 400) {
          setMessage(error.response.data.message);
        } else if (error.response.status === 401) {
          logoutFn();
        } else console.log(error);
      });
  };

  let navigate = useNavigate();
  const logoutFn = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    (async () => {
      fetchTickets();
    })();
  }, []);

  const fetchTickets = () => {
    fetchTicket()
      .then(function (response) {
        setTicketDetails(response.data);
        updateTicketCount(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (response) {
        console.log(" Ticket Updated successfully!");
        setTicketUpdationModal(false);
        fetchTickets();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onTicketUpdate = (e) => {
    if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value;
    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };

  const editTicket = (ticketDetails) => {
    const ticket = {
      id: ticketDetails.id,
      title: ticketDetails.title,
      description: ticketDetails.description,
      assignee: ticketDetails.assignee,
      reporter: ticketDetails.reporter,
      priority: ticketDetails.ticketPriority,
      status: ticketDetails.status,
    };

    setSelectedCurrTicket(ticket);
    setTicketUpdationModal(true);
  };

  // ticket count for widgets
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

  return (
    <div className="bg-light vh-100">
      Customer Page;
      <Sidebar />
      <div className="container pt-5">
        <h3 className="text-center text-success">
          Welcome,{localStorage.getItem("name")}{" "}
        </h3>
        <p className="text-center text-muted">
          Take a look at all your tickets below!
        </p>
        <div className="row">
          <Widget
            color="primary"
            title="OPEN"
            icon="envelope-open"
            ticketCount={ticketStatusCount.open}
            pathColor="darkblue"
          />
          <Widget
            color="warning"
            title="PROGRESS"
            icon="hourglass-split"
            ticketCount={ticketStatusCount.progress}
            pathColor="darkyellow"
          />
          <Widget
            color="success"
            title="CLOSED"
            icon="chech-2-circle"
            ticketCount={ticketStatusCount.closed}
            pathColor="darkolivegreen"
          />
          <Widget
            color="secondary"
            title="BLOCKED"
            icon="slash-circle"
            ticketCount={ticketStatusCount.blocked}
            pathColor="darkgrey"
          />
        </div>
        <hr />
        <MaterialTable
          onRowClick={(event, rowData) => editTicket(rowData)}
          title="TICKETS RAISED BY YOU"
          columns={columns}
          data={ticketDetails}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#288859",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },
            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, datas) =>
                  ExportPdf(cols, datas, "Ticket Records"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, datas) =>
                  ExportCsv(cols, datas, "Ticket Records "),
              },
            ],
          }}
        ></MaterialTable>
        <hr />
        <h4 className="text-center">Facing any issue?Raise a ticket!</h4>
        <button
          className="btn btn-lg btn-success form-control"
          onClick={() => setCreateTicketModal(true)}
        >
          Raise Ticket{" "}
        </button>

        {createTicketModal ? (
          <Modal
            show={createTicketModal}
            backdrop="static"
            centered
            onHide={() => setCreateTicketModal(false)}
          >
            <Modal.Header closeButton>Create a new Ticket</Modal.Header>
            <Modal.Body>
              <form onSubmit={createTicket}>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    TITLE
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    required
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    DESCRIPTION
                  </label>
                  <textarea
                    type="text"
                    className=" md-textarea form-control"
                    rows="3"
                    name="description"
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => setCreateTicketModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="m-1" type="submit" variant="success">
                    Create
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}

        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            backdrop="static"
            centered
            onHide={() => setTicketUpdationModal(false)}
          >
            <Modal.Header closeButton>Update the Ticket</Modal.Header>
            <Modal.Body>
              <form onSubmit={updateTicket}>
                <h5 className="card-subtitle lead text-success">
                  ID : {selectedCurrTicket.id}
                </h5>

                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    TITLE
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={selectedCurrTicket.title}
                    disabled
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    Assignee
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="assignee"
                    value={selectedCurrTicket.assignee}
                    disabled
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    Priority
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="priority"
                    value={selectedCurrTicket.priority}
                    disabled
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    DESCRIPTION
                  </label>
                  <textarea
                    type="text"
                    className=" md-textarea form-control"
                    rows="3"
                    name="description"
                    value={selectedCurrTicket.description}
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    STATUS
                  </label>
                  <select
                    name="status"
                    className="form-select"
                    value={selectedCurrTicket.status}
                    onChange={onTicketUpdate}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => setTicketUpdationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="m-1" type="submit" variant="success">
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}
      </div>
    </div>
  );
}
export default Customer;
