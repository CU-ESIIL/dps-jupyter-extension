import React, { useMemo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectJobsContainer } from '../redux/slices/JobsContainerSlice'
import { useTable, useGlobalFilter, useSortBy, usePagination, useAsyncDebounce } from 'react-table';
import { Button, FormControl, InputGroup, Spinner, Table } from 'react-bootstrap';
import { getUserJobs } from '../api/maap_py';
import { jobsActions, selectJobs } from '../redux/slices/jobsSlice';
import { BsArrowClockwise } from 'react-icons/bs'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdLastPage, MdFirstPage, MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { JobStatusBadge } from './JobStatusBadge';
import { parseJobData } from '../utils/mapping'
import { Search } from 'react-bootstrap-icons';
import "../../style/JobsOverview.css"

const GlobalFilter = ({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
}: any) => {
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(value => {
        setGlobalFilter(value || undefined)
    }, 200)


    return (
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1"><Search /></InputGroup.Text>
                <FormControl
                    type="search"
                    key="globalSearch"
                    placeholder={`Search records...`}
                    aria-label="Search"
                    aria-describedby="basic-addon1"
                    value={value || ""}
                    onChange={e => {
                        setValue(e.target.value);
                        onChange(e.target.value);
                    }}
                />
            </InputGroup>
    )
}

export const JobsOverviewContainer = (): JSX.Element => {

    // Redux
    const dispatch = useDispatch()

    const { itemSize } = useSelector(selectJobsContainer)
    const { selectedJob, userJobInfo, formattedJobsInfo } = useSelector(selectJobs)

    const { setSelectedJob, setUserJobInfo, setFormattedJobsInfo } = jobsActions

    // Local component variables
    const [refreshTimestamp, setRefreshTimestamp] = useState(null)
    const [showSpinner, setShowSpinner] = useState(false)

    const getJobInfo = () => {

        setShowSpinner(true)

        // List all jobs for a given user
        let response = getUserJobs("anonymous")

        response.then((data) => {
            dispatch(setUserJobInfo(parseJobData(data["response"]["jobs"])))
        })

        setShowSpinner(false)
        setRefreshTimestamp(new Date().toUTCString())
    }

    useEffect(() => {
        getJobInfo()
    }, []);


    useEffect(() => {
        setPageSize(itemSize)
    }, [itemSize]);


    const handleRowClick = (row) => {
        userJobInfo.map(job => {
            if (job['payload_id'] === row.values.payload_id) {
                dispatch(setSelectedJob({ rowIndex: row.index, jobID: row.values.payload_id, jobInfo: job }))
                return
            }
        })
    }

    const dateSort = useMemo(
        () => (rowA, rowB, columnId) => {
          const a = parseFloat(rowA.values[columnId]);
          const b = parseFloat(rowB.values[columnId]);
          return a > b ? 1 : -1;
        },
        []
      );

    const data = useMemo(() => userJobInfo, [userJobInfo])

    const columns = useMemo(
        () => [
            {
                Header: 'Tag',
                accessor: 'tags' as const,
                disableSortBy: true,
            },
            {
                Header: 'Job Type',
                accessor: 'job_type' as const,
                disableSortBy: true,
            },
            {
                Header: 'Status',
                accessor: 'status' as const,
                disableSortBy: true,
                Cell: ({ cell: { row: { values: { status } } } }: any) => <JobStatusBadge status={status} />,
            },
            {
                Header: 'Payload ID',
                accessor: 'payload_id' as const,
                disableSortBy: true,
            },
            {
                Header: 'Start Time',
                accessor: 'time_start' as const,
                sortType: dateSort,
                
            }
        ],

        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        // rows,
        page,
        prepareRow,
        state,
        preGlobalFilteredRows,
        setGlobalFilter,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        visibleColumns,
        state: { pageIndex, pageSize, sortBy }
    } = useTable({ columns, data: data, disableSortRemove: true, initialState: { pageIndex: 0, pageSize: itemSize } }, useGlobalFilter, useSortBy, usePagination)

    return (
        <div>
            <div className="overview-header">
                <div className="margin-1rem">
                    <h1>My Jobs</h1>
                </div>
                <div className="refresh-info">
                    <BsArrowClockwise className="clickable" onClick={getJobInfo} size={28} />
                    <div className="refresh-timestamp">Last updated: {refreshTimestamp}</div>
                </div>
            </div>

            {showSpinner ? <div className="loader"><Spinner animation="border" variant="primary" /></div> :
                <Table {...getTableProps()} >
                    <thead >
                        <tr>
                            <th colSpan={2} className="global-filter">
                                <GlobalFilter
                                    preGlobalFilteredRows={preGlobalFilteredRows}
                                    globalFilter={state.globalFilter}
                                    setGlobalFilter={setGlobalFilter}
                                />
                            </th>
                        </tr>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}
                                    >
                                        <span {...column.getSortByToggleProps()}>
                                            {column.canSort ? (column.isSortedDesc ? <MdKeyboardArrowUp size={24} /> : <MdKeyboardArrowDown size={24} />) : ""}
                                        </span>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} >
                        {page.map(row => {
                            prepareRow(row)
                            return (
                                <tr className={selectedJob && (selectedJob.rowIndex === row.index) ? "selected-row" : ""} onClick={() => handleRowClick(row)}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td{...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>}
            <div className='overview-footer'>
                <div>
                    Page {pageIndex + 1} of {pageOptions.length}
                </div>{" "}
                <div>
                    <Button variant="outline-primary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        <MdFirstPage size={24} />
                    </Button>{" "}
                    <Button variant="outline-primary" onClick={() => previousPage()} disabled={!canPreviousPage}>
                        <MdKeyboardArrowLeft size={24} />
                    </Button>{" "}
                    <Button variant="outline-primary" onClick={() => nextPage()} disabled={!canNextPage}>
                        <MdKeyboardArrowRight size={24} />
                    </Button>{" "}
                    <Button
                        variant="outline-primary"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        <MdLastPage size={24} />
                    </Button>{" "}
                </div>
            </div>
        </div>
    )
}