import PageTitle from "@/components/darkone/layout/PageTitle";
import { DarkoneCard } from "@/components/darkone/ui";

const TablesGridJS = () => {
  return (
    <>
      <PageTitle title="Tables" subTitle="Grid JS" />

      {/* Basic Table */}
      <DarkoneCard title="Basic" titleTag="h5" subtitle="Basic grid.js example">
        <div id="table-gridjs"></div>
      </DarkoneCard>

      {/* Pagination */}
      <DarkoneCard 
        title="Pagination" 
        titleTag="h5"
        subtitle={<>Pagination can be enabled by setting <code>pagination: true</code></>}
      >
        <div id="table-pagination"></div>
      </DarkoneCard>

      {/* Search */}
      <DarkoneCard 
        title="Search" 
        titleTag="h5"
        subtitle={<>Grid.js supports global search on all rows and columns. Set <code>search: true</code> to enable the search plugin.</>}
      >
        <div id="table-search"></div>
      </DarkoneCard>

      {/* Sorting */}
      <DarkoneCard 
        title="Sorting" 
        titleTag="h5"
        subtitle={<>To enable sorting, simply add <code>sort: true</code> to your config.</>}
      >
        <div id="table-sorting"></div>
      </DarkoneCard>

      {/* Loading State */}
      <DarkoneCard 
        title="Loading State" 
        titleTag="h5"
        subtitle="Grid.js renders a loading bar automatically while it waits for the data to be fetched."
      >
        <div id="table-loading-state"></div>
      </DarkoneCard>

      {/* Fixed Header */}
      <DarkoneCard 
        title="Fixed Header" 
        titleTag="h5"
        subtitle={<>The header can be fixed to the top of the table by setting <code>fixedHeader: true</code>.</>}
      >
        <div id="table-fixed-header"></div>
      </DarkoneCard>

      {/* Hidden Columns */}
      <DarkoneCard 
        title="Hidden Columns" 
        titleTag="h5"
        subtitle={<>Add <code>hidden: true</code> to the columns definition to hide them.</>}
      >
        <div id="table-hidden-column"></div>
      </DarkoneCard>
    </>
  );
};

export default TablesGridJS;
