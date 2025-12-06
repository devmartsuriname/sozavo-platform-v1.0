import PageTitle from "@/components/darkone/layout/PageTitle";

const UISpinners = () => {
  return (
    <>
      <PageTitle title="Spinners" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Border Spinners</h4></div>
            <div className="card-body d-flex gap-3 flex-wrap">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-border text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-border text-danger" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-border text-info" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Growing Spinners</h4></div>
            <div className="card-body d-flex gap-3 flex-wrap">
              <div className="spinner-grow text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-success" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-danger" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
              <div className="spinner-grow text-info" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UISpinners;
