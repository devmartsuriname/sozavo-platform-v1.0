import PageTitle from "@/components/darkone/layout/PageTitle";
import { DarkoneCard } from "@/components/darkone/ui";

const TablesBasic = () => {
  return (
    <>
      <PageTitle title="Tables" subTitle="Basic Tables" />

      {/* Basic Example */}
      <DarkoneCard 
        title="Basic Example" 
        titleTag="h5"
        subtitle={<>For basic styling—light padding and only horizontal dividers—add the base class <code>.table</code> to any <code>&lt;table&gt;</code>.</>}
      >
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
      </DarkoneCard>

      {/* Variants */}
      <DarkoneCard 
        title="Variants" 
        titleTag="h5"
        subtitle="Use contextual classes to color tables, table rows or individual cells."
      >
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
      </DarkoneCard>

      {/* Striped Rows Table */}
      <DarkoneCard 
        title="Striped Rows Table" 
        titleTag="h5"
        subtitle={<>Use <code>.table-striped</code> to add zebra-striping to any table row within the <code>&lt;tbody&gt;</code>.</>}
      >
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
      </DarkoneCard>

      {/* Striped Rows Table Dark */}
      <DarkoneCard 
        title="Striped Rows Table Dark" 
        titleTag="h5"
        subtitle={<>Use <code>.table-dark .table-striped</code> to add zebra-striping to any table row within the <code>&lt;tbody&gt;</code>.</>}
      >
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
      </DarkoneCard>

      {/* Hoverable Rows */}
      <DarkoneCard 
        title="Hoverable Rows" 
        titleTag="h5"
        subtitle={<>Add <code>.table-hover</code> to enable a hover state on table rows within a <code>&lt;tbody&gt;</code>.</>}
      >
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
      </DarkoneCard>

      {/* Bordered Table */}
      <DarkoneCard 
        title="Bordered Table" 
        titleTag="h5"
        subtitle={<>Add <code>.table-bordered</code> for borders on all sides of the table and cells.</>}
      >
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
      </DarkoneCard>
    </>
  );
};

export default TablesBasic;
