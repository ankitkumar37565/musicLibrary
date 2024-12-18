let response = {
    400: (res) => {
        return res.status(400).json({
            status: 400,
            data: null,
            message: "Bad Request",
            error: null,
        });
    },
    404: (res) => {
        return res.status(404).json(
            {
                "status": 404,
                "data": null,
                "message": "Resource Doesn't Exist.",
                "error": null
               }                       
        )
    }
};

module.exports= response;