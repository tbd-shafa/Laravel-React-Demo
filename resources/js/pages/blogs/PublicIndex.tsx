import { Ratings } from '@/components/Rating';
import { Blog } from '@/types/blog';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Link } from '@inertiajs/react';


interface Props extends InertiaPageProps {
    blogs: (Blog & { user: { name: string; average_rating: number | undefined } })[];
}

export default function PublicIndex({ blogs }: Props) {
    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">All Blog Posts</h1>

            {blogs.map((blog) => (
                <div key={blog.id} className="mb-6 flex items-start rounded-lg border bg-white p-4 shadow-sm">
                    {/* Left: Image */}
                    <div className="mr-4 w-1/4">
                        <img
                            src={blog.image ? `/storage/${blog.image}` : '/placeholder.jpg'}
                            alt={blog.title}
                            className="h-32 w-full rounded object-cover"
                        />
                    </div>

                    {/* Middle: Description */}
                    <div className="w-2/4">
                        <h2 className="mb-2 text-xl font-semibold">{blog.title}</h2>
                        <p className="mb-4 line-clamp-4 text-gray-700">{blog.description}</p>
                    </div>

                    {/* Right: Info */}
                    <div className="w-1/4 text-right">
                        <p className="font-semibold text-gray-800">Posted by: {blog.user.name}</p>
                        <p className="text-sm text-gray-500">
                            Last Updated:{' '}
                            {new Date(blog.updated_at).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}
                            ,{' '}
                            {new Date(blog.updated_at)
                                .toLocaleTimeString('en-GB', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                })
                                .toLowerCase()}
                        </p>

                        <p className="text-sm text-gray-500">Status: {blog.status === 1 ? 'Published' : 'Draft'}</p>
                        <p className="flex text-sm text-gray-500">
                            Rating: <Ratings rating={blog.average_rating ?? 0} variant="yellow" readOnly />({Math.round(blog.average_rating ?? 0)})
                        </p>
                        <Link
                            href={`/blogs/posts/${blog.id}`}
                            className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                            Live Preview
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
