import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blogs',
        href: '/blogs',
    },
];
type BlogFormData = {
    title: string;
    description: string;
    image: File | null;
};
export default function Blogs() {
    const { data, setData, errors, post, reset, processing } = useForm<BlogFormData>({
        title: '',
        description: '',
        image: null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('blogs.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blogs" />
            <div className="container mx-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Blog</h1>
                </div>

                <div className="mb-6 rounded-lg bg-white p-4 shadow">
                    <h2 className="mb-4 text-xl font-bold">Add New Blog</h2>
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="mb-1 block font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.currentTarget.value)}
                                placeholder="Blog Name"
                                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="mb-1 block font-medium text-gray-700">
                                description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.currentTarget.value)}
                                placeholder="Blog description"
                                rows={4}
                                className="w-full rounded border border-gray-300 px-3 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="mb-1 block font-medium text-gray-700">
                                Image
                            </label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                onChange={(e) => setData('image', e.target.files?.[0] ?? null)}
                                className="block"
                            />
                            
                        </div>
                        <button type="submit" disabled={processing} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                            {processing ? 'Saving...' : 'Save'}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
