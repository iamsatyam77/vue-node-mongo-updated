module.exports = {
    outputDir: '../server/dist',
    devServer: {
        proxy: {
            "/api/*": {
                target: "http://localhost:5000/",
                secure: false
            }
        }
    }
}