import React from 'react';
import BlogCommentService from '../../services/BlogCommentService';
import Pagination from './Pagination'
import SearchForm from './SearchForm'
import { Redirect, Link } from 'react-router-dom';
import SweetAlert from 'react-bootstrap-sweetalert'
import Moment from 'moment'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CreateEditBlogComment from './CreateEditBlogComment';

class ListAllBlogComments extends React.Component {
    constructor(props) {
        
        super(props);
        
        this.state = {
            arrOfBlogComments: [],
            totalBlogComments: 0,
            searchTerm: "",
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'Approved',
            sortOrder: 'ASC',
            disable: true,
            toCreateBlogComment: false,
            toEditBlogComment: false,
            blogCommentIdToEdit: 0,
            sweetAlertCommentApprovalUpdated: false,
            showEditCommentModal: false,
        }
    }
    componentDidMount = () => {
        this.filterBlogComments();
    }

    onSelectAllSuccess = response => {
        let arrOfBlogComments = response.data.items;
        this.setState({
            arrOfBlogComments: arrOfBlogComments
        });
    }

    onSelectAllError = response => {
        console.log(response);
    }

    filterBlogComments = () => {
        const data = {
            "SearchTerm": this.state.searchTerm,
            "PageSize": this.state.pageSize,
            "PageNumber": this.state.pageNumber,
            "SortBy": this.state.sortBy,
            "SortOrder": this.state.sortOrder,
            }
        BlogCommentService.search(
            data,
            this.onFilterBlogCommentsSuccess,
            this.onFilterBlogCommentsError
        );
    }

    onFilterBlogCommentsSuccess = response => {
        window.scrollTo(0,0);
        let arrOfBlogComments = response.data.items;
        let totalBlogComments;
        if (arrOfBlogComments.length > 0) {
            totalBlogComments = arrOfBlogComments[0].totalComments;
        } else {
            totalBlogComments = 0;
        }
        this.setState({
            arrOfBlogComments: arrOfBlogComments,
            totalBlogComments: totalBlogComments,
        });
    }

    onFilterBlogCommentsError = response => {
        console.log(response);
    }

    deleteBlogComment = blogCommentId => {
        BlogCommentService.delete(
            blogCommentId,
            this.onDeleteSuccess,
            this.onDeleteError
            );
    }

    onDeleteSuccess = response => {
        this.componentDidMount();
    }

    onDeleteError = response => {
        console.log(response);
    }

    handleCreateBlogComment = () => {
        this.setState(
            {toCreateBlogComment: true}
        );
    }

    handleEditBlogComment = blogCommentId => {
        this.setState({
            blogCommentIdToEdit: blogCommentId,
            showEditCommentModal: true,
        }
            );
    }

    handleApproved = (id, comment, approved) => {
        const data = {
            "Id": id,
            "Comment": comment,
            "Approved": !approved
        };
        BlogCommentService.update(id, data, this.onUpdateSuccess, this.onUpdateError);
    }

    onUpdateSuccess = response => {
        this.componentDidMount();
        this.setState({
            sweetAlertCommentApprovalUpdated: true
        });
    }

    onUpdateError = response => {
        console.log(response);
    }

    sweetAlertHide = sweet => {
        this.setState({
            sweetAlertCommentApprovalUpdated: false,
        });
    }

    modalToggle = () => {
        this.setState({
          showEditCommentModal: false
        });
      }

    pageNext = event => {
        if (this.state.arrOfBlogComments.length === 0 || this.state.arrOfBlogComments.length < this.state.pageSize) {
            this.setState({
                disable: true
            });
        } else {
            if (this.state.searchTerm !== "") {
                this.setState({
                    pageNumber: this.state.pageNumber + 1
                }, () => this.filterBlogComments())
            } else {
                this.setState({
                    pageNumber: this.state.pageNumber + 1
                }, () => this.filterBlogComments())
            }
        }
    }

    pagePrevious = event => {
        if (this.state.pageNumber === 1) {
            this.setState({
                disable: true
            });
        } else {
            if (this.state.searchTerm !== "") {
                this.setState({
                    pageNumber: this.state.pageNumber - 1
                }, () => this.filterBlogComments());
            } else {
                this.setState({
                    disable: false,
                    pageNumber: this.state.pageNumber - 1
                }, () => this.filterBlogComments());
            }
        }
    }

    onChange = (event) => {
        let key = event.target.name
        let val = event.target.value
        console.log(key);
        console.log(val);
        this.setState({
            [key]: val,
            pageNumber: 1
        }, () => this.filterBlogComments());
    }

    onChangeSort = event => {
        if (this.state.sortOrder == 'DESC') {
            this.setState({
                [event.target.name]: event.target.value,
                pageNumber: 1,
                sortOrder: 'ASC'
            }, () => this.filterBlogComments());
        } else {
            this.setState({
                [event.target.name]: event.target.value,
                pageNumber: 1,
                sortOrder: 'DESC'
            }, () => this.filterBlogComments());
        }
    }

    render() {
        if (this.state.toCreateBlogComment === true) {
            return ( 
                <Redirect 
                    to="/create-blog-comment" 
                    push 
                />
            )
        }

        if (this.state.toEditBlogComment === true) {
            let blogCommentIdToEdit = this.state.blogCommentIdToEdit;
            let editUrl = `/edit-blog-comment/${blogCommentIdToEdit}`;
            return (
                <Redirect 
                    to={editUrl} 
                    push 
                />
            );
        }
        
        let totalPages;
        if (this.state.totalBlogComments > 0) {
            totalPages = Math.ceil(this.state.totalBlogComments / this.state.pageSize);
        }

        return (
            <div>
                <div className="container-fluid flex-grow-1 container-p-y">
                    <h4 className="font-weight-bold py-3 mb-4">
                    Manage Blog Comments
                    </h4>
                    <SearchForm
                        onChange={this.onChange}
                        pageSize={this.state.pageSize}
                        searchTerm={this.state.searchTerm}
                        searchDescription={"Search Comment Text"}
                    />
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped sortable">
                        <thead>
                            <tr>
                            <th className="text-nowrap">Comment <button className="btn-sm btn-default fas fa-sort" name="sortBy" value="Comment" onClick={this.onChangeSort}></button></th>
                            <th className="text-nowrap">Approved <button className="btn-sm btn-default fas fa-sort" name="sortBy" value="Approved" onClick={this.onChangeSort}></button></th>
                            <th className="text-nowrap">Commenter <button className="btn-sm btn-default fas fa-sort" name="sortBy" value="Commenter" onClick={this.onChangeSort}></button></th>
                            <th className="text-nowrap">Blog Post <button className="btn-sm btn-default fas fa-sort" name="sortBy" value="BlogTitle" onClick={this.onChangeSort}></button></th>
                            <th className="text-nowrap">Created <button className="btn-sm btn-default fas fa-sort" name="sortBy" value="CreatedDate" onClick={this.onChangeSort}></button></th>
                            <th colSpan="1"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.arrOfBlogComments.map((blogComment, i) => {
                                return(
                                    <tr key={i}>
                                        <td data-value={blogComment.comment}>{blogComment.comment}</td>
                                        <td className="text-center text-nowrap">
                                            <label className="form-check form-check-inline">
                                                <input className="form-check-input" type="checkbox" checked={blogComment.approved} onChange={this.handleApproved.bind(this, blogComment.id, blogComment.comment, blogComment.approved)} />
                                                <span className="form-check-label"></span>
                                            </label>
                                        </td>
                                        <td data-value={blogComment.personFirstName}>{`${blogComment.personFirstName} ${blogComment.personLastName}`}</td>
                                        <td data-value={blogComment.blogTitle}><Link
                                            to={`/blog/${blogComment.blogId}`}
                                        >{blogComment.blogTitle}</Link></td>
                                        <td data-value={blogComment.createdDate}>{Moment.utc(blogComment.createdDate).format('MM/DD/YYYY')}</td>
                                        <td class="text-nowrap">
                                            <button class="btn btn-default btn-xs icon-btn md-btn-flat article-tooltip" onClick={this.handleEditBlogComment.bind(this, blogComment.id)}>
                                                <i class="ion ion-md-create"></i>
                                            </button>
                                            <button class="btn btn-default btn-xs icon-btn md-btn-flat article-tooltip" onClick={() => this.deleteBlogComment(blogComment.id)}>
                                                <i class="ion ion-md-close"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                        <Pagination 
                            pageNext={this.pageNext}
                            pagePrevious={this.pagePrevious}
                            disabled={this.disable}
                            pageNumber={this.state.pageNumber}
                            totalPages = {totalPages}
                        />
                    </div>
                </div>
                <SweetAlert success title="Comment Approval Updated" show={this.state.sweetAlertCommentApprovalUpdated} onConfirm={this.sweetAlertHide}>
                    
                </SweetAlert>
                <Modal isOpen={this.state.showEditCommentModal} toggle={this.modalToggle}>
                    <ModalHeader toggle={this.modalToggle}>Edit Comment</ModalHeader>
                    <ModalBody>
                       <CreateEditBlogComment 
                            blogCommentId = {this.state.blogCommentIdToEdit}
                            modalToggle = {this.modalToggle}
                            filterBlogComments = {this.filterBlogComments}
                       />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.modalToggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ListAllBlogComments