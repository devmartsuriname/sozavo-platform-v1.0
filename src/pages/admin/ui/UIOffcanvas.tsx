import PageTitle from "@/components/darkone/layout/PageTitle";

const UIOffcanvas = () => {
  return (
    <>
      <PageTitle title="Offcanvas" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Offcanvas Directions</h4></div>
            <div className="card-body d-flex gap-2 flex-wrap">
              <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasStart">
                Toggle Start
              </button>
              <button className="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasEnd">
                Toggle End
              </button>
              <button className="btn btn-success" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop">
                Toggle Top
              </button>
              <button className="btn btn-info" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom">
                Toggle Bottom
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Backdrop Options</h4></div>
            <div className="card-body">
              <p className="text-muted">
                Offcanvas components can have different backdrop behaviors and scroll options.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-outline-primary">With Backdrop</button>
                <button className="btn btn-outline-secondary">Static Backdrop</button>
                <button className="btn btn-outline-success">Body Scroll</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIOffcanvas;
