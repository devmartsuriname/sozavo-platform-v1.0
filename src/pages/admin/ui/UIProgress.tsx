import PageTitle from "@/components/darkone/layout/PageTitle";

const UIProgress = () => {
  return (
    <>
      <PageTitle title="Progress" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Basic Progress</h4></div>
            <div className="card-body">
              <div className="progress mb-3">
                <div className="progress-bar" style={{width: '25%'}}></div>
              </div>
              <div className="progress mb-3">
                <div className="progress-bar" style={{width: '50%'}}></div>
              </div>
              <div className="progress mb-3">
                <div className="progress-bar" style={{width: '75%'}}></div>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Colored Progress</h4></div>
            <div className="card-body">
              <div className="progress mb-3">
                <div className="progress-bar bg-success" style={{width: '25%'}}></div>
              </div>
              <div className="progress mb-3">
                <div className="progress-bar bg-info" style={{width: '50%'}}></div>
              </div>
              <div className="progress mb-3">
                <div className="progress-bar bg-warning" style={{width: '75%'}}></div>
              </div>
              <div className="progress">
                <div className="progress-bar bg-danger" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIProgress;
