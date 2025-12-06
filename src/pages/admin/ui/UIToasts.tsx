import PageTitle from "@/components/darkone/layout/PageTitle";

const UIToasts = () => {
  return (
    <>
      <PageTitle title="Toasts" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Basic Toast</h4></div>
            <div className="card-body">
              <div className="toast show" role="alert">
                <div className="toast-header">
                  <strong className="me-auto">Bootstrap</strong>
                  <small>11 mins ago</small>
                  <button type="button" className="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div className="toast-body">Hello, world! This is a toast message.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Color Toasts</h4></div>
            <div className="card-body">
              <div className="toast show align-items-center text-white bg-primary border-0 mb-2" role="alert">
                <div className="d-flex">
                  <div className="toast-body">Primary toast message.</div>
                  <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
              </div>
              <div className="toast show align-items-center text-white bg-success border-0 mb-2" role="alert">
                <div className="d-flex">
                  <div className="toast-body">Success toast message.</div>
                  <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
              </div>
              <div className="toast show align-items-center text-white bg-danger border-0" role="alert">
                <div className="d-flex">
                  <div className="toast-body">Danger toast message.</div>
                  <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIToasts;
