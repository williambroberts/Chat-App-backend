//missing parameters, data or headers so the api cannot process the request
//eg no password or no email
class BadRequestError extends Error{

    statusCode:number
    cause:any;
    
    constructor(message?:string,cause?:any) {
        super(message);
        this.name="BadRequestError",
        this.statusCode=400
        this.cause=cause?? "request"
    }
}
//the client's request lacks valid authentication 
// credentials or the provided credentials are invalid
// eg wrong password 
class UnauthorizedError extends Error{

    statusCode:number
    cause:any;

    constructor(message?:string,cause?:any) {
        super(message);
        this.name="UnauthorizedError",
        this.statusCode=401
        this.cause=cause??"request"
    }
}
//403 indicates that even with valid authentication, 
//the client does not have sufficient
// permissions to access the requested resource.
//eg cant delete another users blog post    
class ForbiddenError extends Error{
    
    statusCode:number
    cause:any;

    constructor(message?:string,cause?:any) {
        super(message);
        this.name="ForbiddenError",
        this.statusCode=403
        this.cause=cause??"request"
    }
}
//It indicates that the server could not find the requested resource. 
class NotFoundError extends Error{

    statusCode:number
    cause:any;

    constructor(message?:string,cause?:any) {
        super(message);
        this.name="NotFoundError",
        this.statusCode=404
        this.cause=cause??"request"
    }
}
//eg email already in use
class ConflictError extends Error{

    statusCode:number
    cause:any;

    constructor(message?:string,cause?:any) {
        super(message);
        this.name="ConflictError",
        this.statusCode=409
        this.cause=cause??"request"
    }
}

class InternalServerError extends Error {
    statusCode:number
    cause:any;

    constructor(message?:string,cause?:any){
        super(message);
        this.name="InternalServerError",
        this.statusCode = 500
        this.cause=cause??"internal error"
    }
}
// module.exports  = {
//     BadRequestError,
//     UnauthorizedError,
//     NotFoundError,
//     ForbiddenError,
//     ConflictError
// }

export {
BadRequestError,
UnauthorizedError,
NotFoundError,
ForbiddenError,
ConflictError,
InternalServerError
}