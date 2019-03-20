import React from 'react'
import { DebounceInput } from 'react-debounce-input'

const SearchForm = props => {
    return (
        <div className="container-fluid">
            < div className="row" >
                <div className="col-2">
                        <label>Page Size:
                            <select name="pageSize" className="form-control form-control-md" value={props.selectValue} onChange={props.onChange}>
                                <option name="dropdown1" value="5">5</option>
                                <option name="dropdown2" value="10">10</option>
                                <option name="dropdown3" value="25">25</option>
                                <option name="dropdown4" value="50">50</option>
                            </select>
                        </label>
                </div>
                <div className="col-2">
                </div>
                <div className="col-8">
                        <label>{props.searchDescription}:
                        <DebounceInput minLenght={2} debounceTimeout={300} type="text" name="searchTerm" className="form-control form-control-md" value={props.searchTerm} aria-controls="DataTables_Table_0" onChange={props.onChange} />
                        </label>
                </div>
            </div>
        </div >
    )
}
export default SearchForm