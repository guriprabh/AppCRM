import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Modal } from "@material-ui/core";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Widget from "../components/Widgets";
const lookup = { true: "Available", false: "Unavailable" };
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
    field: "priority",
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

  return (
    <div className="bg-light vh-100">
      <Sidebar />
      <div className="container py-5">
        <h3 className="text-center text-primary">Welcome Engineer!</h3>
        <p className="lead text-muted text-center">
          Take a quick look at your engineer stats below!
        </p>

        <div className="row">
          <Widget
            color="primary"
            title="OPEN"
            icon="envelope-open"
            ticketCount="8"
            pathColor="darkblue"
          />
          <Widget
            color="warning"
            title="PROGRESS"
            icon="hourglass-split"
            ticketCount="80"
            pathColor="yellow"
          />
          <Widget
            color="success"
            title="CLOSED"
            icon="check-2-circle"
            ticketCount="23"
            pathColor="darkgreen"
          />
          <Widget
            color="secondary"
            title="BLOCKED"
            icon="slash-circle"
            ticketCount="43"
            pathColor="darkgrey"
          />
        </div>
        <hr />

        <MaterialTable
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
          }}
        />
        <button
          className="btn text-center btn-primary"
          onClick={() => setTicketUpdationModal(true)}
        >
          Edit Ticket
        </button>

        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            onHide={() => setTicketUpdationModal(false)}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>UPDATE TICKET</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="p-1">
                  <h5 className="text-primary">ID:</h5>
                </div>
                <div className="input-group" m-1>
                  <label className="label label-md input-group-text">
                    TITLE
                  </label>
                  <input type="text" disabled className="form-control" />
                </div>
                <div className="input-group" m-1>
                  <label className="label label-md input-group-text">
                    REPORTER
                  </label>
                  <input type="text" disabled className="form-control" />
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