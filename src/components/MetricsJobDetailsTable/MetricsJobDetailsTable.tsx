import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectJobs } from '../../redux/slices/jobsSlice'
import { GenericJobDetailsTable } from '../JobDetailsTable/GenericJobDetailsTable'

export const MetricsJobDetailsTable = (): JSX.Element => {

    // Redux
    const { selectedJob } = useSelector(selectJobs)

    const data = [
        // {'header': 'Architecture', 'value': selectedJob.jobInfo.metrics.metrics.architecture},
        // {'header': 'Directory Size', 'value': selectedJob.jobInfo.metrics.metrics.directory_size},
        {'header': 'Job Duration', 'value': selectedJob.jobInfo.duration},
        {'header': 'Job End Time', 'value': selectedJob.jobInfo.timeend},
        {'header': 'Job Start Time', 'value': selectedJob.jobInfo.starttime},
        // {'header': 'Machine Memory Size', 'value': selectedJob.jobInfo.metrics.metrics.machine_memory_size},
        // {'header': 'Machine Type', 'value': selectedJob.jobInfo.metrics.metrics.machine_type},
        // {'header': 'Operating System', 'value': selectedJob.jobInfo.metrics.metrics.operating_system}
    ]

    return (
        <>
        <GenericJobDetailsTable data={data}/>
        </>
    )
}