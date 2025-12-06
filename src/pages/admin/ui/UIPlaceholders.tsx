import PageTitle from "@/components/darkone/layout/PageTitle";

const UIPlaceholders = () => {
  return (
    <>
      <PageTitle title="Placeholders" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Placeholder Card</h4></div>
            <div className="card-body">
              <div className="card" aria-hidden="true">
                <div className="card-body">
                  <h5 className="card-title placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </h5>
                  <p className="card-text placeholder-glow">
                    <span className="placeholder col-7"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-6"></span>
                    <span className="placeholder col-8"></span>
                  </p>
                  <a className="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Placeholder Colors</h4></div>
            <div className="card-body">
              <span className="placeholder col-12 mb-2"></span>
              <span className="placeholder col-12 bg-primary mb-2"></span>
              <span className="placeholder col-12 bg-secondary mb-2"></span>
              <span className="placeholder col-12 bg-success mb-2"></span>
              <span className="placeholder col-12 bg-danger mb-2"></span>
              <span className="placeholder col-12 bg-warning mb-2"></span>
              <span className="placeholder col-12 bg-info"></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIPlaceholders;
