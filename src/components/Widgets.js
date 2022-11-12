import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
const Widget = ({ color, title, icon, ticketCount, pathColor }) => {
  return (
    <div className="col-xs-12 col-lg-3 col-md-6 ">
      <div
        className={`card shadow bg-${color} bg-opacity-25 text-center`}
        style={{ width: 15 + "rem" }}
      >
        <h5 className="card-subtitle my-2 text-${color}">
          <i className={`bi bi-${icon} text-${color} mx-2`}></i>
          {title}
        </h5>
        <hr></hr>
        <div className="row mb-2  d-flex align-items-center">
          <div className={`col text-${color} mx-4 fw-bolder display-6`}>
            {ticketCount}
          </div>

          <div className="col">
            <div style={{ width: 40, height: 40 }}>
              <CircularProgressbar
                value={ticketCount}
                styles={buildStyles({
                  pathColor: `${pathColor}`,
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Widget;
