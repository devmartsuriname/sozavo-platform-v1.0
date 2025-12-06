import PageTitle from "@/components/darkone/layout/PageTitle";

const TablesBasic = () => {
  return (
    <>
      <PageTitle title="Tables" subTitle="Basic Tables" />

      {/* Basic Example */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Basic Example</h5>
          <p className="card-subtitle">
            For basic styling—light padding and only horizontal dividers—add the base class{" "}
            <code>.table</code> to any <code>&lt;table&gt;</code>.
          </p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-centered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First</th>
                  <th scope="col">Last</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Larry the Bird</td>
                  <td>Simsons</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Variants</h5>
          <p className="card-subtitle">
            Use contextual classes to color tables, table rows or individual cells.
          </p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Class</th>
                  <th scope="col">Heading</th>
                  <th scope="col">Heading</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Default</td>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
                <tr className="table-primary">
                  <td>Primary</td>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
                <tr className="table-secondary">
                  <td>Secondary</td>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
                <tr className="table-success">
                  <td>Success</td>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
                <tr className="table-danger">
                  <td>Danger</td>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
                <tr className="table-warning">
                  <td>Warning</td>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
                <tr className="table-info">
                  <td>Info</td>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
                <tr className="table-light">
                  <td>Light</td>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
                <tr className="table-dark">
                  <td>Dark</td>
                  <td>Cell</td>
                  <td>Cell</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Striped Rows Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Striped Rows Table</h5>
          <p className="card-subtitle">
            Use <code>.table-striped</code> to add zebra-striping to any table row within the{" "}
            <code>&lt;tbody&gt;</code>.
          </p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-centered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First</th>
                  <th scope="col">Last</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Larry the Bird</td>
                  <td>Simsons</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Striped Rows Table Dark */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Striped Rows Table Dark</h5>
          <p className="card-subtitle">
            Use <code>.table-dark .table-striped</code> to add zebra-striping to any table row within
            the <code>&lt;tbody&gt;</code>.
          </p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-dark table-striped table-centered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First</th>
                  <th scope="col">Last</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Larry the Bird</td>
                  <td>Simsons</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hoverable Rows */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Hoverable Rows</h5>
          <p className="card-subtitle">
            Add <code>.table-hover</code> to enable a hover state on table rows within a{" "}
            <code>&lt;tbody&gt;</code>.
          </p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-centered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First</th>
                  <th scope="col">Last</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Larry the Bird</td>
                  <td>Simsons</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bordered Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Bordered Table</h5>
          <p className="card-subtitle">
            Add <code>.table-bordered</code> for borders on all sides of the table and cells.
          </p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-centered">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First</th>
                  <th scope="col">Last</th>
                  <th scope="col">Handle</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Larry the Bird</td>
                  <td>Simsons</td>
                  <td>@twitter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default TablesBasic;
