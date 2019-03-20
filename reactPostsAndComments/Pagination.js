import React from 'react'

const Pagination = props => {
    
    return (
        <React.Fragment>
        
        <div style={{ height: "100px" }}>
            <nav>
                <button type="button" className="btn btn-outline-primary" onClick={props.pagePrevious} disabled={props.pageNumber < 2 ? true : false}>«</button>
                <span> Page: {props.pageNumber}{props.totalPages ? ` of ${props.totalPages}` : null}</span>
                <button type="button" className="btn btn-outline-primary" onClick={props.pageNext} disabled={props.pageNumber === props.totalPages ? true : false}>»</button>
            </nav>
        </div>
        </React.Fragment>
    )
}
export default Pagination