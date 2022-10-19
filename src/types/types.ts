/**
 * IJob
 */
export interface IJob {
  command?: string,
  container_image_name?: string,
  container_image_url?: string,
  disk_usage?: string,
  duration?: string,
  ec2_instance_type?: string,
  ec2_instance_id?: string,
  ec2_availability_zone?: string,
  error?: string,
  job_dir_size?: string,
  job_id?: string,
  job_type?: string,
  name?: string,
  params?: [],
  payload_id?: string,
  products?: [],
  queue?: string,
  status?: string,
  tags?: string[],
  time_end?: string,
  time_queued?: string,
  time_start?: string,
  username?: string,
  version?: string
}


/**
 * Job Info Table Template
 * 
 * @param header - human-friendly field name to be displayed in table row
 * @param accessor - path to field data, relative to IJob
 * @param type - field data type
 * 
 */
export interface IJobInfoTable {
  header: string,
  accessor: string,
  type?: string
}


/**
 * Algorithm Input Param
 * 
 * @param name - algorithm input param name
 * @param value - algorithm input param value
 * @param destination - algorithm input param destination
 * 
 */
export interface IInputParam {
  name: string,
  value: string,
  destination: string
}