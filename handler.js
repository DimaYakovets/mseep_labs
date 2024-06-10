export const handler = (callback) => async (req, res, next) => {
    try {
        const result = await callback(req, res, next);

        if (result) {
            res.status(200)
                .json(result);
        }
    } catch (error) {
        next(error);
    }
}
