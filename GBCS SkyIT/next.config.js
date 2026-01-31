// React PDF Config
module.exports = {
  output: 'standalone',
  images: {
    domains: [
      "localhost",
      "example.com",
      "upload.wikimedia.org",
      "en.wikipedia.org",
      "storage.googleapis.com",
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
      // my task page
      {
        source: "/my_task",
        destination: "/in-progress",
        permanent: true,
      },
      {
        source: "/my_task",
        destination: "/in-progress/[id]",
        permanent: true,
      },
      {
        source: "/my_task",
        destination: "/Awaiting-Final-Approval",
        permanent: true,
      },
      {
        source: "/my_task",
        destination: "/Awaiting-Final-Approval/[id]",
        permanent: true,
      },
      {
        source: "/my_task",
        destination: "/submittedProposals",
        permanent: true,
      },
      {
        source: "/my_task",
        destination: "/archivePage",
        permanent: true,
      },
      {
        source: "/my_task",
        destination: "/in-progress",
        permanent: true,
      },
      {
        source: "/",
        destination: "/new-proposal",
        permanent: true,
      },
      {
        source: "/",
        destination: "/SectionA-sidebar",
        permanent: true,
      },
      {
        source: "/",
        destination: "/Software_popup",
        permanent: true,
      },
    ];
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};
