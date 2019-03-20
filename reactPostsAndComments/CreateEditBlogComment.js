import React from 'react'
import InputComponent from '../common/InputComponent'
import FormErrors from '../common/FormErrors'
import BlogCommentService from '../../services/BlogCommentService'
import { Redirect } from 'react-router-dom';

class CreateEditBlogComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            approved: 0,
            formErrors: {
                comment: "",
                personId: 0,
                blogId: 0,
                modifiedBy: ""
            },
            isEditBlogComment: false,
            editBlogCommentId: 0,
            isCreateBlogComment: false,
            isCommentValid: false,
            isPersonIdValid: false,
            isBlogIdValid: false,
            isModifiedByValid: false,
            isformValid: false,
            toBlogCommentList: false
        }
    }

    componentDidMount = () => {
        let editBlogCommentId = this.props.blogCommentId;
        if (editBlogCommentId) {
            this.setState({
                isEditBlogComment: true,
                editBlogCommentId: editBlogCommentId,
            });
        } else {
            this.setState({
                isCreateBlogComment: true
            });
        }

        this.selectBlogCommentById(editBlogCommentId);
    }
    
    insertBlogComment = () => {
        const blogCommentData = {
            Comment: this.state.comment,
            PersonId: this.state.personId,
            BlogId: this.state.blogId,
            ModifiedBy: this.state.modifiedBy
        }

        BlogCommentService.insert(
            blogCommentData,
            this.onInsertBlogCommentSuccess,
            this.onInsertBlogCommentError
        );
    }

    onInsertBlogCommentSuccess = response => {
        console.log(response);
        this.setState(
            {
                title: "",
                blogCommentContent: "",
                imageUrl: "",
                modifiedBy: "",
                toBlogCommentList: true
        }
        );
    }

    onInsertBlogCommentError = response => {
        console.log(response);
    }
    
    selectBlogCommentById = blogCommentId => {
        BlogCommentService.selectById(
            blogCommentId,
            this.onSelectBlogCommentByIdSuccess,
            this.onSelectBlogCommentByIdError
            );
    }
    
    onSelectBlogCommentByIdSuccess = successData => {
        let selectedBlogCommentData = successData.data.item;
        let comment = selectedBlogCommentData.comment;
        let blogId = selectedBlogCommentData.blogId;
        let personId = selectedBlogCommentData.personId;
        let modifiedBy = selectedBlogCommentData.modifiedBy;
        let approved = selectedBlogCommentData.approved;
        this.setState(
            {
                comment: comment,
                blogId: blogId,
                personId: personId,
                modifiedBy: modifiedBy,
                approved: approved,
                isCommentValid: true,
                isPersonIdValid: true,
                isBlogIdValid: true,
                isModifiedByValid: true,
            }
        )
    }

    onSelectBlogByIdError = response => {
        console.log(response)
    }

    updateBlogComment = () => {
        let blogCommentIdToEdit = this.state.editBlogCommentId;
        const updateData = {
            Id: blogCommentIdToEdit,
            Comment: this.state.comment,
            Approved: this.state.approved,
        };
        
        BlogCommentService.update(
            blogCommentIdToEdit,
            updateData,
            this.onUpdateBlogCommentSuccess,
            this.onUpdateBlogCommentError
        )
    }

    onUpdateBlogCommentSuccess = response => {
        this.props.modalToggle();
        this.props.filterBlogComments();
    }

    onUpdateBlogCommentError = response => {
        console.log(response)
    }

    handleChange = event => {
        const key = event.target.name;
        const value = event.target.value;
        this.setState(
          {
            [key]: value
          },
            this.validateField(key, value)
        );
    };

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let isCommentValid = this.state.isCommentValid;
        let isPersonIdValid = this.state.isPersonIdValid;
        let isBlogIdValid = this.state.isBlogIdValid;
        let isModifiedByValid = this.state.isModifiedByValid;

        switch (fieldName) {
            case "comment":
            isCommentValid = value.length >= 1 && value.length <= 255;
            fieldValidationErrors.comment = isCommentValid
                ? ""
                : "Comment is required";
            break;

            case "personId":
            isPersonIdValid = value >= 1;
            fieldValidationErrors.personId = isPersonIdValid
            ? ""
            : "PersonId must be a number greater than 0"
            break;
           
            case "blogId":
            isBlogIdValid =  value >= 1;
            fieldValidationErrors.blogId = isBlogIdValid
                ? ""
                : "BlogId must be a number greater than 0";
            break;

            case "modifiedBy":
            isModifiedByValid = value.length >= 1 && value.length <=128;
            fieldValidationErrors.modifiedBy = isModifiedByValid
                ? ""
                : "Modified By is required";
            break;
    
            default:
            break;
        }
        this.setState(
            {
              formErrors: fieldValidationErrors,
              isCommentValid: isCommentValid,
              isPersonIdValid: isPersonIdValid,
              isBlogIdValid: isBlogIdValid,
              isModifiedByValid: isModifiedByValid
            }, 
            this.validateForm
          );       
    }

    validateForm = () =>
    {
        let isFormValid = 
        this.state.isCommentValid &&
        this.state.isPersonIdValid &&
        this.state.isBlogIdValid &&
        this.state.isModifiedByValid
        if (isFormValid) {
            this.setState(
                {
                isformValid: true
            }
            );
        }
    }
    
    editBlogCommentButton = () =>
    {
        return (
            <React.Fragment>
            <button className="btn btn-primary" disabled={!this.state.isformValid} onClick={this.updateBlogComment}>Edit Blog Comment</button>
            </React.Fragment>
        );
    }

    createBlogCommentButton = () => 
    {
        return (
            <React.Fragment>
            <button disabled={!this.state.isformValid} onClick={this.insertBlogComment}>Create Blog Comment</button>
            </React.Fragment>
        );
    }

    createBlogCommentInputs = () => 
    {
        return (
            <div>
            <label className="form-label">PersonId:</label>
            <InputComponent 
                name="personId"
                type="number"
                value={this.state.personId}
                placeholder="Enter personId"
                onChange={this.handleChange}
            />
            <label className="form-label">Blog Id:</label>
            <InputComponent 
                name="blogId"
                type="number"
                value={this.state.blogId}
                placeholder="Enter blogId"
                onChange={this.handleChange}
             />
             </div>
        )
    }

    render() {
        if (this.state.toBlogCommentList === true) {
            return (
                <Redirect 
                    to="/blog-comment" 
                    push
                />
            )
        }

        let createBlogCommentInputs;
        if (this.state.isCreateBlogComment) {
            createBlogCommentInputs = <this.createBlogCommentInputs />
        }

        let editOrCreateButton;
        if(this.state.isEditBlogComment) {
            editOrCreateButton = <this.editBlogCommentButton />;
        } else {
            editOrCreateButton = <this.createBlogCommentButton />;
        }
        
        return(
        <div>
            <div className="card-body">
                <div className="form-group">
                    <InputComponent 
                        name="comment"
                        type="text"
                        value={this.state.comment}
                        placeholder="Enter Comment"
                        onChange={this.handleChange}
                    />
                </div>
                    {createBlogCommentInputs}
                    {editOrCreateButton}
                    <FormErrors formErrors={this.state.formErrors} />
                
            </div>
        </div>
        )
    }
}

export default CreateEditBlogComment