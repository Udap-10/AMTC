/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3000",
          }, // Change if using a different domain
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,POST,PUT,DELETE",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Authorization, Content-Type",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
