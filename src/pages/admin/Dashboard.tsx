import PageTitle from "@/components/darkone/layout/PageTitle";
import Icon from "@/components/darkone/ui/Icon";
import { SparklineChart, RevenueChart, SalesCategoryChart } from "@/components/darkone/charts";

const Dashboard = () => {
  return (
    <>
      <PageTitle title="Darkone" subTitle="Dashboard" />

      {/* Stats Cards Row */}
      <div className="row">
        {/* Card 1 - Total Income */}
        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <p className="text-muted mb-0 text-truncate">Total Income</p>
                  <h3 className="text-dark mt-2 mb-0">$78.8k</h3>
                </div>
                <div className="col-6">
                  <div className="ms-auto avatar-md bg-soft-primary rounded">
                    <Icon icon="solar:globus-outline" className="fs-32 avatar-title text-primary" />
                  </div>
                </div>
              </div>
            </div>
            <SparklineChart data={[25, 28, 32, 38, 43, 55, 60, 48, 42, 51, 35]} />
          </div>
        </div>

        {/* Card 2 - New Users */}
        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <p className="text-muted mb-0 text-truncate">New Users</p>
                  <h3 className="text-dark mt-2 mb-0">2,150</h3>
                </div>
                <div className="col-6">
                  <div className="ms-auto avatar-md bg-soft-primary rounded">
                    <Icon icon="solar:users-group-two-rounded-broken" className="fs-32 avatar-title text-primary" />
                  </div>
                </div>
              </div>
            </div>
            <SparklineChart data={[87, 54, 4, 76, 31, 95, 70, 92, 53, 9, 6]} />
          </div>
        </div>

        {/* Card 3 - Orders */}
        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <p className="text-muted mb-0 text-truncate">Orders</p>
                  <h3 className="text-dark mt-2 mb-0">1,784</h3>
                </div>
                <div className="col-6">
                  <div className="ms-auto avatar-md bg-soft-primary rounded">
                    <Icon icon="solar:cart-5-broken" className="fs-32 avatar-title text-primary" />
                  </div>
                </div>
              </div>
            </div>
            <SparklineChart data={[41, 42, 35, 42, 6, 12, 13, 22, 42, 94, 95]} />
          </div>
        </div>

        {/* Card 4 - Conversion Rate */}
        <div className="col-md-6 col-xl-3">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <p className="text-muted mb-0 text-truncate">Conversion Rate</p>
                  <h3 className="text-dark mt-2 mb-0">12.3%</h3>
                </div>
                <div className="col-6">
                  <div className="ms-auto avatar-md bg-soft-primary rounded">
                    <Icon icon="solar:pie-chart-2-broken" className="fs-32 avatar-title text-primary" />
                  </div>
                </div>
              </div>
            </div>
            <SparklineChart data={[8, 41, 40, 48, 77, 35, 0, 77, 63, 100, 71]} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row">
        {/* Revenue Chart */}
        <div className="col-lg-4">
          <div className="card card-height-100">
            <div className="card-header d-flex align-items-center justify-content-between gap-2">
              <h4 className="mb-0 flex-grow-1">Revenue</h4>
              <div>
                <button type="button" className="btn btn-sm btn-outline-light">ALL</button>
                <button type="button" className="btn btn-sm btn-outline-light">1M</button>
                <button type="button" className="btn btn-sm btn-outline-light">6M</button>
                <button type="button" className="btn btn-sm btn-outline-light active">1Y</button>
              </div>
            </div>
            <div className="card-body pt-0">
              <div className="apex-charts">
                <RevenueChart />
              </div>
            </div>
          </div>
        </div>

        {/* Sales by Category Chart */}
        <div className="col-lg-4">
          <div className="card card-height-100">
            <div className="card-header d-flex align-items-center justify-content-between gap-2">
              <h4 className="card-title flex-grow-1 mb-0">Sales By Category</h4>
              <div>
                <button type="button" className="btn btn-sm btn-outline-light">ALL</button>
                <button type="button" className="btn btn-sm btn-outline-light">1M</button>
                <button type="button" className="btn btn-sm btn-outline-light">6M</button>
                <button type="button" className="btn btn-sm btn-outline-light active">1Y</button>
              </div>
            </div>
            <div className="card-body">
              <div className="apex-charts">
                <SalesCategoryChart />
              </div>
              <div className="table-responsive mb-n1 mt-2">
                <table className="table table-nowrap table-borderless table-sm table-centered mb-0">
                  <thead className="bg-light bg-opacity-50 thead-sm">
                    <tr>
                      <th className="py-1">Category</th>
                      <th className="py-1">Orders</th>
                      <th className="py-1">Perc.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Grocery</td>
                      <td>187,232</td>
                      <td>
                        48.63%
                        <span className="badge badge-soft-success float-end">2.5% Up</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Electronics</td>
                      <td>126,874</td>
                      <td>
                        36.08%
                        <span className="badge badge-soft-success float-end">8.5% Up</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Other</td>
                      <td>90,127</td>
                      <td>
                        23.41%
                        <span className="badge badge-soft-danger float-end">10.98% Down</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions by Country */}
        <div className="col-lg-4">
          <div className="card">
            <div className="d-flex card-header justify-content-between align-items-center border-bottom border-dashed">
              <h4 className="card-title mb-0">Sessions by Country</h4>
              <div className="dropdown">
                <a href="#" className="dropdown-toggle btn btn-sm btn-outline-light">
                  View Data
                </a>
              </div>
            </div>
            <div className="card-body pt-0">
              <div 
                className="mt-3 d-flex align-items-center justify-content-center rounded" 
                style={{ 
                  height: "309px",
                  backgroundColor: 'rgba(169, 183, 197, 0.1)',
                  border: '1px dashed rgba(169, 183, 197, 0.3)'
                }}
              >
                <div className="text-center">
                  <i className="bx bx-globe fs-48 text-primary"></i>
                  <p className="text-muted mb-0 mt-2">World Map</p>
                  <small className="text-muted">jsVectorMap integration</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="row">
        {/* New Accounts Table */}
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">New Accounts</h4>
              <a href="#" className="btn btn-sm btn-light">View All</a>
            </div>
            <div className="card-body pb-1">
              <div className="table-responsive">
                <table className="table table-hover mb-0 table-centered">
                  <thead>
                    <tr>
                      <th className="py-1">ID</th>
                      <th className="py-1">Date</th>
                      <th className="py-1">User</th>
                      <th className="py-1">Account</th>
                      <th className="py-1">Username</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#US523</td>
                      <td>24 April, 2024</td>
                      <td>
                        <img src="/darkone/images/users/avatar-2.jpg" alt="avatar-2" className="img-fluid avatar-xs rounded-circle" />
                        <span className="align-middle ms-1">Dan Adrick</span>
                      </td>
                      <td>
                        <span className="badge badge-soft-success">Verified</span>
                      </td>
                      <td>@omions</td>
                    </tr>
                    <tr>
                      <td>#US652</td>
                      <td>24 April, 2024</td>
                      <td>
                        <img src="/darkone/images/users/avatar-3.jpg" alt="avatar-3" className="img-fluid avatar-xs rounded-circle" />
                        <span className="align-middle ms-1">Daniel Olsen</span>
                      </td>
                      <td>
                        <span className="badge badge-soft-success">Verified</span>
                      </td>
                      <td>@alliates</td>
                    </tr>
                    <tr>
                      <td>#US862</td>
                      <td>20 April, 2024</td>
                      <td>
                        <img src="/darkone/images/users/avatar-4.jpg" alt="avatar-4" className="img-fluid avatar-xs rounded-circle" />
                        <span className="align-middle ms-1">Jack Roldan</span>
                      </td>
                      <td>
                        <span className="badge badge-soft-warning">Pending</span>
                      </td>
                      <td>@griys</td>
                    </tr>
                    <tr>
                      <td>#US756</td>
                      <td>18 April, 2024</td>
                      <td>
                        <img src="/darkone/images/users/avatar-5.jpg" alt="avatar-5" className="img-fluid avatar-xs rounded-circle" />
                        <span className="align-middle ms-1">Betty Cox</span>
                      </td>
                      <td>
                        <span className="badge badge-soft-success">Verified</span>
                      </td>
                      <td>@reffon</td>
                    </tr>
                    <tr>
                      <td>#US420</td>
                      <td>18 April, 2024</td>
                      <td>
                        <img src="/darkone/images/users/avatar-6.jpg" alt="avatar-6" className="img-fluid avatar-xs rounded-circle" />
                        <span className="align-middle ms-1">Carlos Johnson</span>
                      </td>
                      <td>
                        <span className="badge badge-soft-danger">Blocked</span>
                      </td>
                      <td>@bebo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="card-title mb-0">Recent Transactions</h4>
              <a href="#" className="btn btn-sm btn-light">View All</a>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover mb-0 table-centered">
                  <thead>
                    <tr>
                      <th className="py-1">ID</th>
                      <th className="py-1">Date</th>
                      <th className="py-1">Amount</th>
                      <th className="py-1">Status</th>
                      <th className="py-1">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#98521</td>
                      <td>24 April, 2024</td>
                      <td>$120.55</td>
                      <td>
                        <span className="badge bg-success">Cr</span>
                      </td>
                      <td>Commissions</td>
                    </tr>
                    <tr>
                      <td>#20158</td>
                      <td>24 April, 2024</td>
                      <td>$9.68</td>
                      <td>
                        <span className="badge bg-success">Cr</span>
                      </td>
                      <td>Affiliates</td>
                    </tr>
                    <tr>
                      <td>#36589</td>
                      <td>20 April, 2024</td>
                      <td>$105.22</td>
                      <td>
                        <span className="badge bg-danger">Dr</span>
                      </td>
                      <td>Grocery</td>
                    </tr>
                    <tr>
                      <td>#95362</td>
                      <td>18 April, 2024</td>
                      <td>$80.59</td>
                      <td>
                        <span className="badge bg-success">Cr</span>
                      </td>
                      <td>Refunds</td>
                    </tr>
                    <tr>
                      <td>#75214</td>
                      <td>18 April, 2024</td>
                      <td>$750.95</td>
                      <td>
                        <span className="badge bg-danger">Dr</span>
                      </td>
                      <td>Bill Payments</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
