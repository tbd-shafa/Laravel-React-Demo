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
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { BlogsData } from '@/types/blog';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blogs',
        href: '/blogs',
    },
];

interface FlashMessages {
    success?: string;
    error?: string;
}

interface BlogsProps {
    blogs: BlogsData;
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

    const truncateDescription = (description: string, maxWords: number = 5): string => {
        const words = description.split(' ');
        if (words.length <= maxWords) {
            return description;
        }
        return words.slice(0, maxWords).join(' ') + '...';
    };

    const { auth } = usePage<PageProps>().props;
    const isAdmin = auth.user?.role === 1;
    const [approveBlogId, setApproveBlogId] = useState<number | null>(null);
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [currentAction, setCurrentAction] = useState<'approve' | 'pending'>('approve');

    const handleApproveReject = () => {
        if (approveBlogId !== null) {
            router.patch(
                route('blogs.update-status', approveBlogId),
                {
                    status: currentAction === 'approve' ? 1 : 0,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setApproveBlogId(null);
                        setIsApproveDialogOpen(false);
                    },
                },
            );
        }
    };
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
                            <AlertDialogDescription>This action cannot be undone. This will permanently delete this blog.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteBlogId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                {currentAction === 'approve' ? 'This will Make the blog post Approved.' : 'This will Make the blog post pending.'}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleApproveReject}>{currentAction === 'approve' ? 'Approve' : 'Pending'}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <div className="overflow-x-auto">
                    <Table>
                        <TableCaption></TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Posted At</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Image</TableHead>
                                {!isAdmin && <TableHead>Status</TableHead>}
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogs.data.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell>
                                        {new Date(blog.created_at).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </TableCell>

                                    <TableCell>{blog.title}</TableCell>
                                    <TableCell>
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                <span className="cursor-pointer">{truncateDescription(blog.description)}</span>
                                            </HoverCardTrigger>
                                            <HoverCardContent>{blog.description}</HoverCardContent>
                                        </HoverCard>
                                    </TableCell>
                                    <TableCell>
                                        <img
                                            src={blog.image ? `/storage/${blog.image}` : '/placeholder.jpg'}
                                            alt={blog.title}
                                            className="h-20 w-20 rounded object-cover"
                                        />
                                    </TableCell>
                                    {!isAdmin && (
                                        <TableCell>
                                            <span
                                                className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                                                    blog.status === 1 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                                }`}
                                            >
                                                {blog.status === 1 ? 'Approved' : 'Pending'}
                                            </span>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <button className="mr-2 rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600 cursor-pointer">
                                            <Link href={`/blogs/${blog.id}/edit`}>Edit</Link>
                                        </button>

                                        <button
                                            className="mr-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 cursor-pointer"
                                            onClick={() => {
                                                setDeleteBlogId(blog.id);
                                                setIsDialogOpen(true);
                                            }}
                                        >
                                            Delete
                                        </button>

                                        {isAdmin && (
                                            <button
                                                className={`hover:bg-opacity-90 cursor-pointer rounded px-2 py-1 text-white ${
                                                    blog.status === 0 ? 'bg-blue-500' : 'bg-yellow-500'
                                                }`}
                                                onClick={() => {
                                                    setApproveBlogId(blog.id);
                                                    setCurrentAction(blog.status === 0 ? 'approve' : 'pending');
                                                    setIsApproveDialogOpen(true);
                                                }}
                                            >
                                                {blog.status === 0 ? 'Approve' : 'Pending'}
                                            </button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Pagination className="mt-4 flex justify-end">
                        {blogs.total > 5 && (
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href={blogs.prev_page_url || '#'}
                                        className={`${!blogs.prev_page_url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    />
                                </PaginationItem>

                                {/* Page Numbers */}
                                {[...Array(blogs.last_page)].map((_, index) => (
                                    <PaginationItem key={index + 1}>
                                        <PaginationLink href={`?page=${index + 1}`} className={blogs.current_page === index + 1 ? '' : ''}>
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href={blogs.next_page_url || '#'}
                                        className={`${!blogs.next_page_url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        )}
                    </Pagination>
                </div>
            </div>
        </AppLayout>
    );
}
