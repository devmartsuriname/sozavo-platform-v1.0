import PageTitle from "@/components/darkone/layout/PageTitle";

const UITooltips = () => {
  return (
    <>
      <PageTitle title="Tooltips" subTitle="Base UI" />
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">Tooltip Directions</h4></div>
            <div className="card-body d-flex gap-2 flex-wrap">
              <button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
                Tooltip on top
              </button>
              <button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">
                Tooltip on right
              </button>
              <button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Tooltip on bottom">
                Tooltip on bottom
              </button>
              <button type="button" className="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="left" title="Tooltip on left">
                Tooltip on left
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h4 className="card-title mb-0">HTML Tooltips</h4></div>
            <div className="card-body">
              <button type="button" className="btn btn-primary" data-bs-toggle="tooltip" data-bs-html="true" title="<em>Tooltip</em> <u>with</u> <b>HTML</b>">
                Tooltip with HTML
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UITooltips;
