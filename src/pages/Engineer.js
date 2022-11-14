import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Modal, ModalHeader, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Widget from "../components/Widgets";
import { fetchTicket, ticketUpdation } from "../api/tickets";

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
    title: "REPORTER",
    field: "reporter",
  },
  {
    title: "DESCRIPTION",
    field: "description",
  },
  {
    title: "PRIORITY",
    field: "ticketPriority",
  },

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

function Engineer() {
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const [ticketDetail, setTicketDetail] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [message, setMessage] = useState("");

  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  const closeTicketUpdationModal = () => setTicketUpdationModal(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = () => {
    fetchTicket()
      .then(function (res) {
        setTicketDetail(res.data);
        updateTicketCount(res.data);
        console.log("fetchTickets: ", res.data);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };

  const updateTicketCount = (tickets) => {
    const data = {
      open: 0,
      closed: 0,
      progress: 0,
      blocked: 0,
    };
    tickets.forEach((ticket) => {
      if (ticket.status === "OPEN") data.open += 1;
      else if (ticket.status === "CLOSED") data.closed += 1;
      else if (ticket.status === "IN_PROGRESS") data.progress += 1;
      else if (ticket.status === "BLOCKED") data.blocked += 1;
    });
    setTicketStatusCount(Object.assign({}, data));
  };

  const editTicket = (ticketDetail) => {
    setTicketUpdationModal(true);

    const ticket = {
      id: ticketDetail.id,
      title: ticketDetail.title,
      description: ticketDetail.description,
      priority: ticketDetail.ticketPriority,
      reporter: ticketDetail.reporter,
      assignee: ticketDetail.assignee,
      status: ticketDetail.status,
    };
    setSelectedCurrTicket(ticket);
    setTicketUpdationModal(true);
  };

  const onTicketUpdate = (e) => {
    if (e.target.name === "priority")
      selectedCurrTicket.priority = e.target.value;
    else if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value;

    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));

    console.log(selectedCurrTicket);
  };

  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (res) {
        setMessage("Ticket Updated Successfully!");
        fetchTickets();
        closeTicketUpdationModal();
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };
  return (
    <div className="bg-light vh-100">
      <Sidebar />
      <div className="container py-5">
        <h3 className="text-center text-primary">
          Welcome {localStorage.getItem("name")}!
        </h3>
        <p className="lead text-muted text-center">
          Take a quick look at your engineer stats below!
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
            pathColor="yellow"
          />
          <Widget
            color="success"
            title="CLOSED"
            icon="check-2-circle"
            ticketCount={ticketStatusCount.closed}
            pathColor="darkgreen"
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
        <h4 className="text-primary text-center">{message}</h4>
        <MaterialTable
          onRowClick={(event, rowData) => editTicket(rowData)}
          data={ticketDetail}
          columns={columns}
          title="TICKETS ASSIGNED TO YOU "
          options={{
            filtering: true,
            exportMenu: [
              {
                label: "ExportPdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "Ticket Records"),
              },
              {
                label: "ExportCsv",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "Ticket Records"),
              },
            ],
            headerStyle: {
              background: "darkblue",
              color: "#fff",
            },

            rowStyle: {
              backgroundColor: "#c8dcfc",
            },
          }}
        />

        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            onHide={() => setTicketUpdationModal(false)}
            backdrop="static"
            centered
          >
            <ModalHeader closeButton>
              <Modal.Title>UPDATE TICKET</Modal.Title>
            </ModalHeader>
            <Modal.Body>
              <form onSubmit={updateTicket}>
                <div className="p-1">
                  <h5 className="text-primary">ID:{selectedCurrTicket.id} </h5>
                </div>
                <div className="input-group" m-1>
                  <label className="label label-md input-group-text">
                    TITLE
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={selectedCurrTicket.title}
                  />
                </div>
                <div className="input-group" m-1>
                  <label className="label label-md input-group-text">
                    REPORTER
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={selectedCurrTicket.reporter}
                  />
                </div>

                <div className="input-group" m-1>
                  <label className="label label-md input-group-text">
                    PRIORITY
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={selectedCurrTicket.ticketPriority}
                    onChange={onTicketUpdate}
                    name="priority"
                  />
                </div>

                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    STATUS
                  </label>
                  <select
                    className="form-select"
                    value={selectedCurrTicket.status}
                    onChange={onTicketUpdate}
                    name="status"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    DESCRIPTION
                  </label>
                  <input
                    type="text"
                    onChange={onTicketUpdate}
                    name="description"
                    className="form-control"
                    value={selectedCurrTicket.description}
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
                  <Button variant="primary" className="m-1" type="submit">
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
export default Engineer;
