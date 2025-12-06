import PageTitle from "@/components/darkone/layout/PageTitle";

const TablesGridJS = () => {
  return (
    <>
      <PageTitle title="Tables" subTitle="Grid JS" />

      {/* Basic Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Basic</h5>
          <p className="card-subtitle">Basic grid.js example</p>
        </div>
        <div className="card-body">
          <div id="table-gridjs"></div>
        </div>
      </div>

      {/* Pagination */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Pagination</h5>
          <p className="card-subtitle">
            Pagination can be enabled by setting <code>pagination: true</code>
          </p>
        </div>
        <div className="card-body">
          <div id="table-pagination"></div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Search</h5>
          <p className="card-subtitle">
            Grid.js supports global search on all rows and columns. Set <code>search: true</code>{" "}
            to enable the search plugin.
          </p>
        </div>
        <div className="card-body">
          <div id="table-search"></div>
        </div>
      </div>

      {/* Sorting */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Sorting</h5>
          <p className="card-subtitle">
            To enable sorting, simply add <code>sort: true</code> to your config.
          </p>
        </div>
        <div className="card-body">
          <div id="table-sorting"></div>
        </div>
      </div>

      {/* Loading State */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Loading State</h5>
          <p className="card-subtitle">
            Grid.js renders a loading bar automatically while it waits for the data to be fetched.
          </p>
        </div>
        <div className="card-body">
          <div id="table-loading-state"></div>
        </div>
      </div>

      {/* Fixed Header */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Fixed Header</h5>
          <p className="card-subtitle">
            The header can be fixed to the top of the table by setting <code>fixedHeader: true</code>.
          </p>
        </div>
        <div className="card-body">
          <div id="table-fixed-header"></div>
        </div>
      </div>

      {/* Hidden Columns */}
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Hidden Columns</h5>
          <p className="card-subtitle">
            Add <code>hidden: true</code> to the columns definition to hide them.
          </p>
        </div>
        <div className="card-body">
          <div id="table-hidden-column"></div>
        </div>
      </div>
    </>
  );
};

export default TablesGridJS;
