import PageTitle from "@/components/darkone/layout/PageTitle";

const UIModal = () => {
  return (
    <>
      <PageTitle title="Modal" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Modal Examples</h4></div>
            <div className="card-body">
              <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
              </button>
              
              <div className="modal fade" id="exampleModal" tabIndex={-1}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Modal title</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                      <p>Modal body text goes here.</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" className="btn btn-primary">Save changes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Modal Sizes</h4></div>
            <div className="card-body d-flex gap-2 flex-wrap">
              <button type="button" className="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#smallModal">
                Small Modal
              </button>
              <button type="button" className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#largeModal">
                Large Modal
              </button>
              <button type="button" className="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#xlModal">
                Extra Large Modal
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIModal;
