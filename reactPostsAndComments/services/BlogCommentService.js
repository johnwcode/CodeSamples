import axios from 'axios'

class BlogCommentService {
    static insert(data, onSuccess, onError) {
        axios
        .post("/api/blogcomment", data, {withCredentials:true})
        .then(onSuccess)
        .catch(onError)
    }

    static selectById(id, onSuccess, onError) {
        axios
        .get(`/api/blogcomment/${id}`, {withCredentials: true})
        .then(onSuccess)
        .catch(onError)
    }

    static selectAll(onSuccess, onError) {
        axios
        .get("/api/blogcomment", {withCredentials:true})
        .then(onSuccess)
        .catch(onError)
    }

    static update(id, data, onSuccess, onError) {
        axios
        .put(`/api/blogcomment/${id}`, data, {withCredentials:true})
        .then(onSuccess)
        .catch(onError)
    }

    static delete(id, onSuccess, onError) {
        axios
        .delete(`/api/blogcomment/${id}`, {withCredentials:true})
        .then(onSuccess)
        .catch(onError)
    }

    static search(data, onSuccess, onError) {
        axios
        .get(
            `/api/blogcomment/search?searchterm=${data.SearchTerm}&pagesize=${data.PageSize}&pagenumber=${data.PageNumber}&sortby=${data.SortBy}&sortorder=${data.SortOrder}`
            , data, {withCredentials:true}
            )
        .then(onSuccess)
        .catch(onError)
    }
}

export default BlogCommentService