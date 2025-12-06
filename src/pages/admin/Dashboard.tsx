import PageTitle from "@/components/darkone/layout/PageTitle";
import { SparklineChart, RevenueChart, SalesCategoryChart } from "@/components/darkone/charts";
import { DarkoneCard, DarkoneTable, DarkoneBadge, Icon } from "@/components/darkone/ui";
import {
  kpiCards,
  salesCategories,
  newAccounts,
  recentTransactions,
  statusBadgeClass,
  transactionBadgeClass,
} from "@/components/darkone/demo";

// Type definitions for table data
interface AccountRow {
  id: string;
  date: string;
  avatar: string;
  name: string;
  status: 'Verified' | 'Pending' | 'Deleted' | 'Blocked';
  username: string;
}

interface TransactionRow {
  id: string;
  date: string;
  amount: string;
  type: 'Cr' | 'Dr';
  description: string;
}

const Dashboard = () => {
  // Column definitions for New Accounts table
  const accountColumns = [
    { key: 'id' as const, header: 'ID', className: 'py-1' },
    { key: 'date' as const, header: 'Date', className: 'py-1' },
    {
      key: 'name' as const,
      header: 'User',
      className: 'py-1',
      render: (row: AccountRow) => (
        <>
          <img src={row.avatar} alt={row.name} className="img-fluid avatar-xs rounded-circle" />
          <span className="align-middle ms-1">{row.name}</span>
        </>
      )
    },
    {
      key: 'status' as const,
      header: 'Account',
      className: 'py-1',
      render: (row: AccountRow) => (
        <DarkoneBadge
          variant={statusBadgeClass[row.status].includes('success') ? 'success' :
                   statusBadgeClass[row.status].includes('warning') ? 'warning' :
                   statusBadgeClass[row.status].includes('danger') ? 'danger' : 'secondary'}
          soft={statusBadgeClass[row.status].includes('soft')}
        >
          {row.status}
        </DarkoneBadge>
      )
    },
    { key: 'username' as const, header: 'Username', className: 'py-1' }
  ];

  // Column definitions for Transactions table
  const transactionColumns = [
    { key: 'id' as const, header: 'ID', className: 'py-1' },
    { key: 'date' as const, header: 'Date', className: 'py-1' },
    { key: 'amount' as const, header: 'Amount', className: 'py-1' },
    {
      key: 'type' as const,
      header: 'Status',
      className: 'py-1',
      render: (row: TransactionRow) => (
        <DarkoneBadge
          variant={transactionBadgeClass[row.type].includes('success') ? 'success' : 'danger'}
          soft={transactionBadgeClass[row.type].includes('soft')}
        >
          {row.type}
        </DarkoneBadge>
      )
    },
    { key: 'description' as const, header: 'Description', className: 'py-1' }
  ];

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
                          <DarkoneBadge
                            variant={row.trend === 'up' ? 'success' : 'danger'}
                            soft
                            className="float-end"
                          >
                            {row.trendValue}
                          </DarkoneBadge>
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
          <DarkoneCard
            title="New Accounts"
            headerAction={<a href="#" className="btn btn-sm btn-light">View All</a>}
            bodyClassName="pb-1"
          >
            <DarkoneTable<AccountRow>
              columns={accountColumns}
              data={newAccounts as AccountRow[]}
              variant="hover"
            />
          </DarkoneCard>
        </div>

        {/* Recent Transactions Table */}
        <div className="col-xl-6">
          <DarkoneCard
            title="Recent Transactions"
            headerAction={<a href="#" className="btn btn-sm btn-light">View All</a>}
          >
            <DarkoneTable<TransactionRow>
              columns={transactionColumns}
              data={recentTransactions as TransactionRow[]}
              variant="hover"
            />
          </DarkoneCard>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
