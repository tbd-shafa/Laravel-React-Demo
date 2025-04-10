import React from 'react';
import { PageProps as InertiaPageProps } from '@inertiajs/inertia';
import { Link } from '@inertiajs/react';
import { Blog } from '@/types/blog';

interface Props extends InertiaPageProps {
    blogs: (Blog & { user: { name: string } })[];
}

export default function PublicIndex({ blogs }: Props) {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">All Blog Posts</h1>

            {blogs.map((blog) => (
                <div key={blog.id} className="flex items-start border rounded-lg p-4 mb-6 shadow-sm bg-white">
                    {/* Left: Image */}
                    <div className="w-1/4 mr-4">
                        <img
                            src={blog.image ? `/storage/${blog.image}` : '/placeholder.jpg'}
                            alt={blog.title}
                            className="rounded w-full h-32 object-cover"
                        />
                    </div>

                    {/* Middle: Description */}
                    <div className="w-2/4">
                        <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                        <p className="text-gray-700 mb-4 line-clamp-4">{blog.description}</p>
                    </div>

                    {/* Right: Info */}
                    <div className="w-1/4 text-right">
                        <p className="font-semibold text-gray-800">Posted by: {blog.user.name}</p>
                        <p className="text-sm text-gray-500">Last updated: {new Date(blog.created_at).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Status: {blog.status === 1 ? 'Published' : 'Draft'}</p>
                        <Link href={`/blogs/${blog.id}`} className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded">
                            Live Preview
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
