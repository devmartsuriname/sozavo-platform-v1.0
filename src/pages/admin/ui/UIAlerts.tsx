import PageTitle from "@/components/darkone/layout/PageTitle";

const UIAlerts = () => {
  return (
    <>
      <PageTitle title="Alerts" subTitle="Base UI" />
      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Default Alerts</h4></div>
            <div className="card-body">
              <div className="alert alert-primary" role="alert">A simple primary alert!</div>
              <div className="alert alert-secondary" role="alert">A simple secondary alert!</div>
              <div className="alert alert-success" role="alert">A simple success alert!</div>
              <div className="alert alert-danger" role="alert">A simple danger alert!</div>
              <div className="alert alert-warning" role="alert">A simple warning alert!</div>
              <div className="alert alert-info" role="alert">A simple info alert!</div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Dismissible Alerts</h4></div>
            <div className="card-body">
              <div className="alert alert-primary alert-dismissible fade show" role="alert">
                <strong>Primary!</strong> A dismissible alert.
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Success!</strong> A dismissible alert.
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIAlerts;
