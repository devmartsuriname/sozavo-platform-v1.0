import PageTitle from "@/components/darkone/layout/PageTitle";

const FormsFlatpicker = () => {
  return (
    <>
      <PageTitle title="Flatpicker" subTitle="Forms" />

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Date Picker</h4>
            </div>
            <div className="card-body">
              <p className="text-muted">Flatpicker date picker component placeholder.</p>
              <div className="mb-3">
                <label className="form-label">Basic Date</label>
                <input type="date" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Date and Time</label>
                <input type="datetime-local" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Time Only</label>
                <input type="time" className="form-control" />
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Range & Options</h4>
            </div>
            <div className="card-body">
              <p className="text-muted">Additional date picker options placeholder.</p>
              <div className="mb-3">
                <label className="form-label">Date Range</label>
                <div className="d-flex gap-2">
                  <input type="date" className="form-control" placeholder="Start date" />
                  <input type="date" className="form-control" placeholder="End date" />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Month Picker</label>
                <input type="month" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Week Picker</label>
                <input type="week" className="form-control" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormsFlatpicker;
