import PageTitle from "@/components/darkone/layout/PageTitle";

const FormsFileUpload = () => {
  return (
    <>
      <PageTitle title="File Upload" subTitle="Forms" />

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Default File Input</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Single File</label>
                <input type="file" className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Multiple Files</label>
                <input type="file" className="form-control" multiple />
              </div>
              <div className="mb-3">
                <label className="form-label">With Size Limit Info</label>
                <input type="file" className="form-control" />
                <small className="text-muted">Max file size: 5MB</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Dropzone Placeholder</h4>
            </div>
            <div className="card-body">
              <div 
                className="border border-dashed rounded p-5 text-center"
                style={{ borderColor: '#7e67fe', backgroundColor: 'rgba(126, 103, 254, 0.05)' }}
              >
                <i className="bx bx-cloud-upload fs-1 text-primary"></i>
                <h5 className="mt-3">Drop files here or click to upload</h5>
                <p className="text-muted mb-0">Supports: JPG, PNG, PDF (max 10MB)</p>
                <input type="file" className="d-none" />
                <button className="btn btn-primary mt-3">Browse Files</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormsFileUpload;
