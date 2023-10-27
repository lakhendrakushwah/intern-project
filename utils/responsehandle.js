
exports.throw=async(statusCode,msg,data,res)=>{
    let response = {
        status: statusCode,
        msg: msg,
        data: data
    }
    return res.status(statusCode).send(response);
    // return res.send(response);
}