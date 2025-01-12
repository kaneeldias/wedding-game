import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "rasika-savidu-wedding-dev.s3.eu-west-1.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "rasika-savidu-wedding.s3.eu-west-1.amazonaws.com",
            }
        ]
    }
};

export default nextConfig;
