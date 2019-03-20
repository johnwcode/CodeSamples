import React from 'react'

const InputComponent = (props) => {
    return (
        <div className={props.className}>
            <input
                className="form-control"
                name={props.name}
                type={props.type}
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
                list={props.list}
                hidden={props.hidden}
                 />
           
        </div >
    )
}

export default InputComponent