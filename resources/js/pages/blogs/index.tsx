import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type Blog, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blogs',
        href: '/blogs',
    },
];
interface BlogsProps {
    blogs: Blog[];
}
interface FlashMessages {
    success?: string;
    error?: string;
}
export default function Blogs({ blogs }: BlogsProps) {
    const { flash } = usePage<{ flash: FlashMessages }>().props;
    const [deleteBlogId, setDeleteBlogId] = useState<number | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = () => {
        if (deleteBlogId !== null) {
            router.delete(route('blogs.destroy', deleteBlogId));
            setDeleteBlogId(null);
            setIsDialogOpen(false);
        }
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blogs" />
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Blogs</h1>
                    <button className="rounded bg-gray-500 px-4 py-1 text-white hover:bg-gray-600">
                        <Link href="/blogs/create">Create</Link>
                    </button>
                </div>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this blog.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteBlogId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded-lg bg-white shadow border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border-b px-4 py-2 text-left">Name</th>
                                <th className="border-b px-4 py-2 text-left">Description</th>
                                <th className="border-b px-4 py-2 text-left">Image</th>
                                <th className="border-b px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr className="hover:bg-gray-50" key={blog.id}>
                                    <td className="border-b px-4 py-2">{blog.title}</td>
                                    <td className="border-b px-4 py-2">{blog.description}</td>
                                    <td className="border-b px-4 py-2">
                                        <img
                                            src={blog.image ? `/storage/${blog.image}` : '/placeholder.jpg'}
                                            alt={blog.title}
                                            className="h-20 w-20 rounded object-cover"
                                        />
                                    </td>

                                    <td className="border-b px-4 py-2">
                                        <button className="mr-2 rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600">
                                            <Link href={`/blogs/${blog.id}/edit`}>Edit</Link>
                                        </button>
                                        <button
                                            className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                                            onClick={() => {
                                                setDeleteBlogId(blog.id);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
