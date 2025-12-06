import PageTitle from "@/components/darkone/layout/PageTitle";

const FormsValidation = () => {
  return (
    <>
      <PageTitle title="Validation" subTitle="Forms" />

      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Browser Defaults</h4>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="validationDefault01" className="form-label">First name</label>
                  <input type="text" className="form-control" id="validationDefault01" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="validationDefault02" className="form-label">Last name</label>
                  <input type="text" className="form-control" id="validationDefault02" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="validationDefaultEmail" className="form-label">Email</label>
                  <input type="email" className="form-control" id="validationDefaultEmail" required />
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="terms" required />
                    <label className="form-check-label" htmlFor="terms">Agree to terms and conditions</label>
                  </div>
                </div>
                <button className="btn btn-primary" type="submit">Submit form</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Validation States</h4>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Valid Input</label>
                  <input type="text" className="form-control is-valid" defaultValue="Correct value" />
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Invalid Input</label>
                  <input type="text" className="form-control is-invalid" defaultValue="" />
                  <div className="invalid-feedback">Please provide a valid value.</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Valid Select</label>
                  <select className="form-select is-valid">
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                  <div className="valid-feedback">Looks good!</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Invalid Textarea</label>
                  <textarea className="form-control is-invalid" rows={3}></textarea>
                  <div className="invalid-feedback">Please enter a message.</div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormsValidation;
