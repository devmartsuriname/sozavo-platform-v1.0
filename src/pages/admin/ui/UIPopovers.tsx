import PageTitle from "@/components/darkone/layout/PageTitle";

const UIPopovers = () => {
  return (
    <>
      <PageTitle title="Popovers" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Popover Directions</h4></div>
            <div className="card-body d-flex gap-2 flex-wrap">
              <button type="button" className="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="top" data-bs-content="Vivamus sagittis lacus vel augue laoreet.">
                Popover on top
              </button>
              <button type="button" className="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="Vivamus sagittis lacus vel augue laoreet.">
                Popover on right
              </button>
              <button type="button" className="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-content="Vivamus sagittis lacus vel augue laoreet.">
                Popover on bottom
              </button>
              <button type="button" className="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="left" data-bs-content="Vivamus sagittis lacus vel augue laoreet.">
                Popover on left
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Dismissible Popover</h4></div>
            <div className="card-body">
              <button type="button" className="btn btn-danger" data-bs-toggle="popover" data-bs-trigger="focus" title="Dismissible popover" data-bs-content="And here's some amazing content.">
                Dismissible popover
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UIPopovers;
