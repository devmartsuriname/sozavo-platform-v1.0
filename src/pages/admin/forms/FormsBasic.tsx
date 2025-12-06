import PageTitle from "@/components/darkone/layout/PageTitle";

const FormsBasic = () => {
  return (
    <>
      <PageTitle title="Basic Elements" subTitle="Forms" />

      <div className="row">
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Input Types</h4>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <label htmlFor="text" className="col-sm-3 col-form-label">Text</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="text" placeholder="Enter text" />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
                <div className="col-sm-9">
                  <input type="email" className="form-control" id="email" placeholder="Enter email" />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="password" className="col-sm-3 col-form-label">Password</label>
                <div className="col-sm-9">
                  <input type="password" className="form-control" id="password" placeholder="Password" />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="number" className="col-sm-3 col-form-label">Number</label>
                <div className="col-sm-9">
                  <input type="number" className="form-control" id="number" placeholder="Number" />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="date" className="col-sm-3 col-form-label">Date</label>
                <div className="col-sm-9">
                  <input type="date" className="form-control" id="date" />
                </div>
              </div>
              <div className="row mb-3">
                <label htmlFor="textarea" className="col-sm-3 col-form-label">Textarea</label>
                <div className="col-sm-9">
                  <textarea className="form-control" id="textarea" rows={3} placeholder="Enter text"></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title mb-0">Select & Checkboxes</h4>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <label htmlFor="select" className="col-sm-3 col-form-label">Select</label>
                <div className="col-sm-9">
                  <select className="form-select" id="select">
                    <option>Option 1</option>
                    <option>Option 2</option>
                    <option>Option 3</option>
                  </select>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Checkboxes</label>
                <div className="col-sm-9">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="check1" />
                    <label className="form-check-label" htmlFor="check1">Option 1</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="check2" />
                    <label className="form-check-label" htmlFor="check2">Option 2</label>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Radio</label>
                <div className="col-sm-9">
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="radio1" id="radio1" />
                    <label className="form-check-label" htmlFor="radio1">Option 1</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="radio1" id="radio2" />
                    <label className="form-check-label" htmlFor="radio2">Option 2</label>
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <label className="col-sm-3 col-form-label">Switch</label>
                <div className="col-sm-9">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="switch1" />
                    <label className="form-check-label" htmlFor="switch1">Toggle this switch</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormsBasic;
