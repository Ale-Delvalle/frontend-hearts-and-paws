import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    domains: [
      'placedog.net',
      'encrypted-tbn0.gstatic.com',
      'i0.wp.com',
      'smylepets.com',
      'via.placeholder.com', 
      'placekitten.com',
      'images.pexels.com',
      'res.cloudinary.com',
      'comunidad.retorn.com',
      'img.magnific.com',
      'img.freepik.com',
      'lh3.googleusercontent.com',
    ],
  },
}

export default nextConfig
