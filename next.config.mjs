/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    webpack: (config, { webpack }) => {
        config.plugins.push(
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__: JSON.stringify(false),
                __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
            })
        );
        return config;
    },
};

export default nextConfig;
