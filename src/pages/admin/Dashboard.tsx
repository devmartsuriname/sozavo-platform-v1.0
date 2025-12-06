import PageTitle from "@/components/darkone/layout/PageTitle";
import Icon from "@/components/darkone/ui/Icon";
import { SparklineChart, RevenueChart, SalesCategoryChart } from "@/components/darkone/charts";
import {
  kpiCards,
  salesCategories,
  newAccounts,
  recentTransactions,
  statusBadgeClass,
  transactionBadgeClass,
} from "@/components/darkone/demo";

const Dashboard = () => {
  return (
    <>
      <PageTitle title="Darkone" subTitle="Dashboard" />

      {/* Stats Cards Row */}
      <div className="row">
        {kpiCards.map((card) => (
          <div key={card.id} className="col-md-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-6">
                    <p className="text-muted mb-0 text-truncate">{card.title}</p>
                    <h3 className="text-dark mt-2 mb-0">{card.value}</h3>
                  </div>
                  <div className="col-6">
                    <div className="ms-auto avatar-md bg-soft-primary rounded">
                      <Icon icon={card.icon} className="fs-32 avatar-title text-primary" />
                    </div>
                  </div>
                </div>
              </div>
              <SparklineChart data={card.sparklineData} />
            </div>
          </div>
        ))}
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
                    {salesCategories.map((row) => (
                      <tr key={row.category}>
                        <td>{row.category}</td>
                        <td>{row.orders}</td>
                        <td>
                          {row.percentage}
                          <span className={`badge ${row.trend === 'up' ? 'badge-soft-success' : 'badge-soft-danger'} float-end`}>
                            {row.trendValue}
                          </span>
                        </td>
                      </tr>
                    ))}
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
              <div className="mt-3 d-flex align-items-center justify-content-center rounded bg-light bg-opacity-50 border border-dashed map-placeholder-height">
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
                    {newAccounts.map((account) => (
                      <tr key={account.id}>
                        <td>{account.id}</td>
                        <td>{account.date}</td>
                        <td>
                          <img src={account.avatar} alt={account.name} className="img-fluid avatar-xs rounded-circle" />
                          <span className="align-middle ms-1">{account.name}</span>
                        </td>
                        <td>
                          <span className={`badge ${statusBadgeClass[account.status]}`}>{account.status}</span>
                        </td>
                        <td>{account.username}</td>
                      </tr>
                    ))}
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
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{transaction.id}</td>
                        <td>{transaction.date}</td>
                        <td>{transaction.amount}</td>
                        <td>
                          <span className={`badge ${transactionBadgeClass[transaction.type]}`}>{transaction.type}</span>
                        </td>
                        <td>{transaction.description}</td>
                      </tr>
                    ))}
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
